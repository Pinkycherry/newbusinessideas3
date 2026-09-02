<?php
/**
 * Supabase -> WordPress importer.
 *
 * Run once to bring the library across, and again whenever Supabase changes,
 * until the pipeline is repointed at WordPress and Supabase is retired.
 *
 *   wp bbi import --url=https://xxx.supabase.co --key=SERVICE_ROLE_KEY
 *   wp bbi import --url=... --key=... --dry-run
 *   wp bbi import --url=... --key=... --only=side-hustle-ideas
 *
 * Design notes, each of which is a bug this avoids:
 *
 * IDEMPOTENT. Rows are matched on `bbi_idea_id`, the Supabase primary key, not
 * on title or slug. Running it twice updates in place instead of creating 290
 * duplicates. Titles change; ids do not.
 *
 * PAGINATED. PostgREST caps a response at 1000 rows and DOES NOT ERROR when it
 * truncates. `getCatalog()` on the live site hit exactly this — it silently
 * under-reported the whole catalogue. This pages explicitly and stops only when
 * a page comes back short.
 *
 * COMPLETED ONLY. `status = completed` matches every frontend query on the live
 * site. Importing drafts would publish half-written rows.
 *
 * TAXONOMY, NOT META. `category_slug` and `subcategory_slug` become terms, so
 * archives, permalinks and admin filters work. See the note in post-types.php.
 *
 * NEVER TOUCHES SUPABASE. Read-only, always. `BUTTERFLY_EFFECT.md` is explicit
 * that the live rows are never mutated, and a one-way import keeps rollback as
 * simple as deleting the WordPress posts.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	return;
}

/**
 * BBI import commands.
 */
class BBI_Import_Command {

	/**
	 * Import ideas from Supabase.
	 *
	 * ## OPTIONS
	 *
	 * --url=<url>
	 * : Supabase project URL, e.g. https://xxxx.supabase.co
	 *
	 * --key=<key>
	 * : Service role key. Read-only is enough; this never writes.
	 *
	 * [--only=<category_slug>]
	 * : Import a single category first, to eyeball the output before committing
	 * : to all 290.
	 *
	 * [--dry-run]
	 * : Report what would happen and change nothing.
	 *
	 * @param array $args       Positional args.
	 * @param array $assoc_args Flags.
	 */
	public function import( $args, $assoc_args ) {
		$base    = untrailingslashit( $assoc_args['url'] );
		$key     = $assoc_args['key'];
		$only    = isset( $assoc_args['only'] ) ? $assoc_args['only'] : '';
		$dry_run = isset( $assoc_args['dry-run'] );

		if ( $dry_run ) {
			WP_CLI::log( 'DRY RUN — nothing will be written.' );
		}

		$rows = $this->fetch_all( $base, $key, $only );
		if ( is_wp_error( $rows ) ) {
			WP_CLI::error( $rows->get_error_message() );
		}

		$total = count( $rows );
		if ( 0 === $total ) {
			WP_CLI::warning( 'Supabase returned no completed ideas. Check the URL, the key and the status filter.' );
			return;
		}
		WP_CLI::log( sprintf( 'Fetched %d completed ideas.', $total ) );

		$created = 0;
		$updated = 0;
		$skipped = 0;
		$progress = \WP_CLI\Utils\make_progress_bar( 'Importing', $total );

		foreach ( $rows as $row ) {
			$result = $this->import_one( $row, $dry_run );
			if ( 'created' === $result ) {
				$created++;
			} elseif ( 'updated' === $result ) {
				$updated++;
			} else {
				$skipped++;
			}
			$progress->tick();
		}
		$progress->finish();

		WP_CLI::success( sprintf( '%d created, %d updated, %d skipped.', $created, $updated, $skipped ) );

		if ( ! $dry_run ) {
			// Term counts are cached; without this the category archives report
			// zero until something else happens to flush them.
			foreach ( array( 'bbi_category', 'bbi_subcategory' ) as $tax ) {
				$terms = get_terms( array( 'taxonomy' => $tax, 'hide_empty' => false, 'fields' => 'ids' ) );
				if ( ! is_wp_error( $terms ) && $terms ) {
					wp_update_term_count_now( $terms, $tax );
				}
			}
			WP_CLI::log( 'Term counts refreshed. Now visit Settings -> Permalinks once to flush rewrite rules.' );
		}
	}

	/**
	 * Fetch every completed idea, paging until a short page comes back.
	 *
	 * @param string $base Supabase URL.
	 * @param string $key  Service role key.
	 * @param string $only Optional category slug filter.
	 * @return array|WP_Error
	 */
	private function fetch_all( $base, $key, $only ) {
		$per_page = 500;
		$offset   = 0;
		$all      = array();

		do {
			$query = array(
				'select' => '*',
				'status' => 'eq.completed',
				'order'  => 'trend_score.desc.nullslast',
				'limit'  => $per_page,
				'offset' => $offset,
			);
			if ( $only ) {
				$query['category_slug'] = 'eq.' . $only;
			}

			$url = $base . '/rest/v1/ideas?' . http_build_query( $query );

			$response = wp_remote_get(
				$url,
				array(
					'timeout' => 60,
					'headers' => array(
						'apikey'        => $key,
						'Authorization' => 'Bearer ' . $key,
						'Accept'        => 'application/json',
					),
				)
			);

			if ( is_wp_error( $response ) ) {
				return $response;
			}
			$code = wp_remote_retrieve_response_code( $response );
			if ( 200 !== $code ) {
				return new WP_Error(
					'bbi_supabase_http',
					sprintf( 'Supabase returned HTTP %d: %s', $code, wp_remote_retrieve_body( $response ) )
				);
			}

			$page = json_decode( wp_remote_retrieve_body( $response ), true );
			if ( ! is_array( $page ) ) {
				return new WP_Error( 'bbi_supabase_json', 'Supabase response was not valid JSON.' );
			}

			$all     = array_merge( $all, $page );
			$fetched = count( $page );
			$offset += $per_page;

			// A full page means there is probably another. A short page is the
			// only reliable end signal PostgREST gives us.
		} while ( $fetched === $per_page );

		return $all;
	}

	/**
	 * Import or update one row.
	 *
	 * @param array $row     Supabase row.
	 * @param bool  $dry_run Whether to write.
	 * @return string created|updated|skipped
	 */
	private function import_one( $row, $dry_run ) {
		$idea_id = isset( $row['idea_id'] ) ? (string) $row['idea_id'] : '';
		if ( '' === $idea_id ) {
			WP_CLI::warning( 'Row with no idea_id skipped.' );
			return 'skipped';
		}

		$existing = get_posts(
			array(
				'post_type'      => 'bbi_idea',
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'meta_key'       => 'bbi_idea_id',
				'meta_value'     => $idea_id,
			)
		);
		$post_id = $existing ? (int) $existing[0] : 0;

		// `summary` goes into post_content and `business_description` into the
		// excerpt so WordPress core search can reach both — core searches title,
		// content and excerpt only, and the original site searched six columns.
		$postarr = array(
			'post_type'    => 'bbi_idea',
			'post_status'  => 'publish',
			'post_title'   => isset( $row['title'] ) ? (string) $row['title'] : '(untitled)',
			'post_name'    => isset( $row['slug'] ) ? sanitize_title( (string) $row['slug'] ) : '',
			'post_content' => isset( $row['summary'] ) ? (string) $row['summary'] : '',
			'post_excerpt' => isset( $row['business_description'] ) ? (string) $row['business_description'] : '',
		);
		if ( ! empty( $row['created_at'] ) ) {
			$stamp = strtotime( (string) $row['created_at'] );
			if ( $stamp ) {
				$postarr['post_date']     = gmdate( 'Y-m-d H:i:s', $stamp );
				$postarr['post_date_gmt'] = gmdate( 'Y-m-d H:i:s', $stamp );
			}
		}

		if ( $dry_run ) {
			return $post_id ? 'updated' : 'created';
		}

		if ( $post_id ) {
			$postarr['ID'] = $post_id;
			wp_update_post( $postarr );
			$result = 'updated';
		} else {
			$post_id = wp_insert_post( $postarr, true );
			if ( is_wp_error( $post_id ) ) {
				WP_CLI::warning( sprintf( '%s: %s', $idea_id, $post_id->get_error_message() ) );
				return 'skipped';
			}
			$result = 'created';
		}

		// Meta. Column name maps to meta key by prefixing `bbi_`, except where
		// the field map says otherwise.
		foreach ( bbi_idea_fields() as $meta_key => $spec ) {
			$column = preg_replace( '/^bbi_/', '', $meta_key );
			if ( ! array_key_exists( $column, $row ) ) {
				continue;
			}
			$value = $row[ $column ];
			if ( is_array( $value ) ) {
				$value = wp_json_encode( $value );
			}
			update_post_meta( $post_id, $meta_key, call_user_func( $spec['sanitize'], $value ) );
		}

		$this->assign_term( $post_id, 'bbi_category', $row, 'category_name', 'category_slug' );
		$this->assign_term( $post_id, 'bbi_subcategory', $row, 'subcategory_name', 'subcategory_slug' );

		return $result;
	}

	/**
	 * Assign one taxonomy term, creating it if it does not exist.
	 *
	 * Matches on SLUG rather than name. Two categories can share a display name
	 * after an edit; the slug is what the URL and every query key on.
	 *
	 * @param int    $post_id     Post ID.
	 * @param string $taxonomy    Taxonomy.
	 * @param array  $row         Supabase row.
	 * @param string $name_column Column holding the display name.
	 * @param string $slug_column Column holding the slug.
	 */
	private function assign_term( $post_id, $taxonomy, $row, $name_column, $slug_column ) {
		$name = isset( $row[ $name_column ] ) ? trim( (string) $row[ $name_column ] ) : '';
		$slug = isset( $row[ $slug_column ] ) ? trim( (string) $row[ $slug_column ] ) : '';
		if ( '' === $slug || '' === $name ) {
			return;
		}

		$term = get_term_by( 'slug', $slug, $taxonomy );
		if ( ! $term ) {
			$created = wp_insert_term( $name, $taxonomy, array( 'slug' => $slug ) );
			if ( is_wp_error( $created ) ) {
				WP_CLI::warning( sprintf( 'Could not create %s term "%s": %s', $taxonomy, $slug, $created->get_error_message() ) );
				return;
			}
			$term_id = (int) $created['term_id'];
		} else {
			$term_id = (int) $term->term_id;
		}

		wp_set_object_terms( $post_id, array( $term_id ), $taxonomy, false );
	}

	/**
	 * Import the FAQ pool from Supabase `category_faqs`.
	 *
	 * ## OPTIONS
	 *
	 * --url=<url>
	 * : Supabase project URL.
	 *
	 * --key=<key>
	 * : Service role key.
	 *
	 * @param array $args       Positional args.
	 * @param array $assoc_args Flags.
	 */
	public function import_faqs( $args, $assoc_args ) {
		$base = untrailingslashit( $assoc_args['url'] );
		$key  = $assoc_args['key'];

		$response = wp_remote_get(
			$base . '/rest/v1/category_faqs?select=*&is_active=eq.true',
			array(
				'timeout' => 60,
				'headers' => array(
					'apikey'        => $key,
					'Authorization' => 'Bearer ' . $key,
					'Accept'        => 'application/json',
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			WP_CLI::error( $response->get_error_message() );
		}

		$rows = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( ! is_array( $rows ) || 0 === count( $rows ) ) {
			WP_CLI::warning( 'No FAQs came back. All 14 pools were empty as of the last check, so this is expected until the pipeline has run.' );
			return;
		}

		$count = 0;
		foreach ( $rows as $row ) {
			$question = isset( $row['question'] ) ? (string) $row['question'] : '';
			$answer   = isset( $row['answer'] ) ? (string) $row['answer'] : '';
			$cat      = isset( $row['category_slug'] ) ? (string) $row['category_slug'] : '';
			if ( '' === $question || '' === $answer ) {
				continue;
			}

			$post_id = wp_insert_post(
				array(
					'post_type'    => 'bbi_faq',
					'post_status'  => 'publish',
					'post_title'   => $question,
					'post_content' => $answer,
				),
				true
			);
			if ( is_wp_error( $post_id ) ) {
				continue;
			}
			if ( $cat ) {
				$term = get_term_by( 'slug', $cat, 'bbi_category' );
				if ( $term ) {
					wp_set_object_terms( $post_id, array( (int) $term->term_id ), 'bbi_category', false );
				}
			}
			$count++;
		}
		WP_CLI::success( sprintf( '%d FAQs imported.', $count ) );
	}
}

WP_CLI::add_command( 'bbi', 'BBI_Import_Command' );
