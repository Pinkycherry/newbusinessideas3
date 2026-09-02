<?php
/**
 * Live Supabase reads.
 *
 * The theme can render from two places, chosen in Settings → BBI Data:
 *
 *   wp        WordPress posts only. Nothing leaves the server.
 *   live      Supabase on every request, cached in a transient.
 *   fallback  WordPress first; Supabase only when WordPress has no ideas yet.
 *
 * `fallback` is the default and the one to use right after installing: the
 * site renders real data on day one, and quietly switches to the imported
 * posts the moment the import runs, with no setting to remember to change.
 *
 * ------------------------------------------------------------------
 * WHY THE ANON KEY, AND NOT THE SERVICE ROLE KEY
 * ------------------------------------------------------------------
 *
 * The live site authenticates with `IDEAVAULT_DB_ANON_KEY`, and that is what
 * belongs here too.
 *
 * A service role key BYPASSES row-level security entirely. Stored in
 * `wp_options` it sits in the database, in every backup, in any migration
 * export, and is readable by any plugin running on the site — and it grants
 * full read AND WRITE access to every table in the project. The anon key
 * grants exactly what the public website already grants, which is what this
 * integration needs and nothing more.
 *
 * `bbi_supabase_key()` therefore refuses to use a key that decodes as
 * `service_role` rather than silently accepting it.
 *
 * ------------------------------------------------------------------
 * PAGINATION
 * ------------------------------------------------------------------
 *
 * PostgREST caps a response at 1000 rows and returns the truncated page with
 * a 200. It does not error. `getCatalog()` on the live site hit exactly this
 * and under-reported the catalogue for weeks. Every list request here sends an
 * explicit `Range` header and stops only on a short page.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

const BBI_SUPABASE_OPT   = 'bbi_supabase';
const BBI_CACHE_PREFIX   = 'bbi_sb_';
const BBI_PAGE_SIZE      = 500;
const BBI_REQUEST_TIMEOUT = 8;

/**
 * Stored settings, with defaults.
 *
 * @return array{url:string, key:string, source:string, ttl:int, enabled:bool}
 */
function bbi_supabase_settings() {
	$stored = get_option( BBI_SUPABASE_OPT, array() );
	if ( ! is_array( $stored ) ) {
		$stored = array();
	}
	return wp_parse_args(
		$stored,
		array(
			'url'     => '',
			'key'     => '',
			'source'  => 'fallback',
			'ttl'     => 300,
			'enabled' => false,
		)
	);
}

/**
 * The project URL, normalised without a trailing slash.
 *
 * @return string
 */
function bbi_supabase_url() {
	$url = bbi_supabase_settings()['url'];
	return $url ? untrailingslashit( esc_url_raw( $url ) ) : '';
}

/**
 * The API key, refusing a service role key.
 *
 * A Supabase key is an unsigned-to-us JWT whose payload names its role. This
 * decodes the payload — it does NOT verify the signature, and does not need
 * to: the check is "did the person paste the wrong key", not "is this key
 * genuine". Supabase itself does the verifying.
 *
 * @return string Empty when unset or refused.
 */
function bbi_supabase_key() {
	$key = trim( bbi_supabase_settings()['key'] );
	if ( '' === $key ) {
		return '';
	}
	if ( 'service_role' === bbi_supabase_key_role( $key ) ) {
		return '';
	}
	return $key;
}

/**
 * Read the `role` claim out of a Supabase key.
 *
 * @param string $key Raw key.
 * @return string Role name, or '' when it cannot be read.
 */
function bbi_supabase_key_role( $key ) {
	$parts = explode( '.', (string) $key );
	if ( 3 !== count( $parts ) ) {
		// Newer publishable keys (sb_publishable_…) are not JWTs at all. They
		// are also not service role keys, which is all this needs to decide.
		return '';
	}
	$payload = base64_decode( strtr( $parts[1], '-_', '+/' ), true );
	if ( false === $payload ) {
		return '';
	}
	$claims = json_decode( $payload, true );
	return is_array( $claims ) && isset( $claims['role'] ) ? (string) $claims['role'] : '';
}

/**
 * Is a live read possible and wanted?
 *
 * @return bool
 */
function bbi_supabase_ready() {
	$s = bbi_supabase_settings();
	return $s['enabled'] && '' !== bbi_supabase_url() && '' !== bbi_supabase_key();
}

/**
 * One GET against PostgREST.
 *
 * @param string $path  Table or RPC path, e.g. 'ideas'.
 * @param array  $query Query arguments.
 * @param int    $offset Row offset for the Range header.
 * @param int    $limit  Rows to request.
 * @return array{rows:array, error:string}
 */
function bbi_supabase_get( $path, $query = array(), $offset = 0, $limit = BBI_PAGE_SIZE ) {
	$url = bbi_supabase_url();
	$key = bbi_supabase_key();

	if ( '' === $url || '' === $key ) {
		return array( 'rows' => array(), 'error' => __( 'Supabase is not configured.', 'bbi' ) );
	}

	$endpoint = $url . '/rest/v1/' . ltrim( $path, '/' );
	if ( ! empty( $query ) ) {
		// Built by hand rather than with `add_query_arg`, which encodes the
		// values it is given. Passing pre-encoded values to it double-encodes
		// them, and PostgREST filters are full of characters that matter:
		// `in.(IDEA-00022,IDEA-00012)` becomes `in.%2528…%2529` and matches
		// nothing, with a 200 and an empty array rather than an error.
		$pairs = array();
		foreach ( $query as $arg => $value ) {
			$pairs[] = rawurlencode( $arg ) . '=' . rawurlencode( $value );
		}
		$endpoint .= '?' . implode( '&', $pairs );
	}

	$response = wp_remote_get(
		$endpoint,
		array(
			'timeout' => BBI_REQUEST_TIMEOUT,
			'headers' => array(
				'apikey'        => $key,
				'Authorization' => 'Bearer ' . $key,
				'Accept'        => 'application/json',
				// Explicit paging. Without this PostgREST silently truncates at
				// 1000 and returns 200, and the caller has no way to tell a
				// complete answer from a clipped one.
				'Range-Unit'    => 'items',
				'Range'         => $offset . '-' . ( $offset + $limit - 1 ),
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return array( 'rows' => array(), 'error' => $response->get_error_message() );
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	$body = wp_remote_retrieve_body( $response );

	// 206 Partial Content is the SUCCESS case for a ranged request, not an
	// error. Treating it as one is an easy way to break paging on the first
	// page of a large table.
	if ( 200 !== $code && 206 !== $code ) {
		$detail = json_decode( $body, true );
		$msg    = is_array( $detail ) && isset( $detail['message'] ) ? $detail['message'] : substr( (string) $body, 0, 200 );
		/* translators: 1: HTTP status code, 2: error text from Supabase. */
		return array( 'rows' => array(), 'error' => sprintf( __( 'Supabase returned %1$d: %2$s', 'bbi' ), $code, $msg ) );
	}

	$rows = json_decode( $body, true );
	if ( ! is_array( $rows ) ) {
		return array( 'rows' => array(), 'error' => __( 'Supabase returned a body that is not JSON.', 'bbi' ) );
	}

	return array( 'rows' => $rows, 'error' => '' );
}

/**
 * Every matching row, paged until a short page comes back.
 *
 * @param string $path  Table path.
 * @param array  $query Query arguments.
 * @param int    $max   Hard ceiling, so a misconfigured filter cannot walk a
 *                      whole table into memory on a shared host.
 * @return array{rows:array, error:string}
 */
function bbi_supabase_all( $path, $query = array(), $max = 5000 ) {
	$rows   = array();
	$offset = 0;

	while ( count( $rows ) < $max ) {
		$page = bbi_supabase_get( $path, $query, $offset, BBI_PAGE_SIZE );
		if ( '' !== $page['error'] ) {
			// A partial result is still worth returning: half a catalogue
			// renders, an empty one does not.
			return array( 'rows' => $rows, 'error' => $page['error'] );
		}
		$rows  = array_merge( $rows, $page['rows'] );
		$count = count( $page['rows'] );
		if ( $count < BBI_PAGE_SIZE ) {
			break;
		}
		$offset += BBI_PAGE_SIZE;
	}

	return array( 'rows' => array_slice( $rows, 0, $max ), 'error' => '' );
}

/**
 * A cached read.
 *
 * The cache is a transient rather than an object-cache group so it survives on
 * hosts with no persistent object cache, which is most shared hosting. The TTL
 * is a setting because "real time" and "do not hammer the free tier" are the
 * same dial viewed from opposite ends.
 *
 * @param string   $key      Cache key suffix.
 * @param callable $callback Producer, returning array{rows:array, error:string}.
 * @return array{rows:array, error:string, cached:bool}
 */
function bbi_supabase_cached( $key, $callback ) {
	$ttl       = max( 0, (int) bbi_supabase_settings()['ttl'] );
	$cache_key = BBI_CACHE_PREFIX . md5( $key . '|' . bbi_supabase_url() );

	if ( $ttl > 0 ) {
		$hit = get_transient( $cache_key );
		if ( is_array( $hit ) ) {
			$hit['cached'] = true;
			return $hit;
		}
	}

	$result           = call_user_func( $callback );
	$result['cached'] = false;

	// Only a clean result is cached. Caching an error means one blip during a
	// deploy keeps the site empty for the whole TTL.
	if ( $ttl > 0 && '' === $result['error'] ) {
		set_transient( $cache_key, array( 'rows' => $result['rows'], 'error' => '' ), $ttl );
	}

	return $result;
}

/**
 * Drop every cached Supabase response.
 *
 * Transients are deleted directly rather than through a stored index, because
 * an index is one more thing that can disagree with reality.
 *
 * @return int Number of cached entries removed.
 */
function bbi_supabase_flush_cache() {
	global $wpdb;

	$like = $wpdb->esc_like( '_transient_' . BBI_CACHE_PREFIX ) . '%';

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- transients have no bulk API.
	$names = $wpdb->get_col( $wpdb->prepare( "SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s", $like ) );

	$removed = 0;
	foreach ( (array) $names as $name ) {
		$transient = substr( $name, strlen( '_transient_' ) );
		if ( delete_transient( $transient ) ) {
			$removed++;
		}
	}
	return $removed;
}

/* ==================================================================
   The queries. Each one mirrors a server function on the live site.
   ================================================================== */

/**
 * The columns an idea card needs.
 *
 * Selecting explicitly rather than `*` keeps the payload small; an idea row
 * carries nine long prose fields that a card never shows.
 */
const BBI_CARD_COLUMNS = 'idea_id,title,slug,summary,trend_score,category_name,category_slug,subcategory_name,subcategory_slug,tier';

/**
 * Trending ideas, highest trend score first.
 *
 * Mirrors `getTrendingIdeas()`.
 *
 * @param int $limit How many.
 * @return array{rows:array, error:string, cached:bool}
 */
function bbi_sb_trending( $limit = 6 ) {
	$limit = max( 1, min( 48, (int) $limit ) );
	return bbi_supabase_cached(
		'trending:' . $limit,
		function () use ( $limit ) {
			return bbi_supabase_get(
				'ideas',
				array(
					'select' => BBI_CARD_COLUMNS,
					'status' => 'eq.completed',
					'order'  => 'trend_score.desc.nullslast',
				),
				0,
				$limit
			);
		}
	);
}

/**
 * Named ideas, in the order asked for.
 *
 * Mirrors `getFeaturedIdeas()`. PostgREST returns `in.(…)` results in table
 * order, not in the order of the list, so the caller's order is restored here
 * — otherwise "featured" silently means "whatever order the database felt
 * like".
 *
 * @param string[] $ids Supabase idea ids.
 * @return array{rows:array, error:string, cached:bool}
 */
function bbi_sb_by_ids( $ids ) {
	$ids = array_values( array_filter( array_map( 'sanitize_text_field', (array) $ids ) ) );
	if ( empty( $ids ) ) {
		return array( 'rows' => array(), 'error' => '', 'cached' => false );
	}

	$result = bbi_supabase_cached(
		'ids:' . implode( ',', $ids ),
		function () use ( $ids ) {
			return bbi_supabase_get(
				'ideas',
				array(
					'select'  => BBI_CARD_COLUMNS,
					'status'  => 'eq.completed',
					'idea_id' => 'in.(' . implode( ',', $ids ) . ')',
				),
				0,
				count( $ids )
			);
		}
	);

	$by_id = array();
	foreach ( $result['rows'] as $row ) {
		if ( isset( $row['idea_id'] ) ) {
			$by_id[ $row['idea_id'] ] = $row;
		}
	}

	$ordered = array();
	foreach ( $ids as $id ) {
		// An id that does not exist, or is not completed, is skipped rather
		// than filled in. The strip never renders a placeholder.
		if ( isset( $by_id[ $id ] ) ) {
			$ordered[] = $by_id[ $id ];
		}
	}

	$result['rows'] = $ordered;
	return $result;
}

/**
 * The category catalogue with counts.
 *
 * Mirrors `getCatalog()`. The live site calls a Postgres RPC that does the
 * grouping in the database; that RPC is read-only and can be called the same
 * way from here, with a client-side group-by as the fallback for a project
 * where it has not been created.
 *
 * @return array{categories:array, total:int, error:string}
 */
function bbi_sb_catalog() {
	$rpc = bbi_supabase_cached(
		'catalog:rpc',
		function () {
			return bbi_supabase_get( 'rpc/get_category_summary', array(), 0, 200 );
		}
	);

	if ( '' === $rpc['error'] && ! empty( $rpc['rows'] ) ) {
		$categories = array();
		$total      = 0;
		foreach ( $rpc['rows'] as $row ) {
			$count        = isset( $row['idea_count'] ) ? (int) $row['idea_count'] : 0;
			$total       += $count;
			$categories[] = array(
				'name'  => isset( $row['category_name'] ) ? $row['category_name'] : '',
				'slug'  => isset( $row['category_slug'] ) ? $row['category_slug'] : '',
				'count' => $count,
			);
		}
		return array( 'categories' => $categories, 'total' => $total, 'error' => '' );
	}

	// Fallback: read the two columns for every completed row and group here.
	$all = bbi_supabase_cached(
		'catalog:rows',
		function () {
			return bbi_supabase_all(
				'ideas',
				array( 'select' => 'category_name,category_slug', 'status' => 'eq.completed' )
			);
		}
	);

	$counts = array();
	foreach ( $all['rows'] as $row ) {
		$slug = isset( $row['category_slug'] ) ? $row['category_slug'] : '';
		if ( '' === $slug ) {
			continue;
		}
		if ( ! isset( $counts[ $slug ] ) ) {
			$counts[ $slug ] = array( 'name' => isset( $row['category_name'] ) ? $row['category_name'] : $slug, 'slug' => $slug, 'count' => 0 );
		}
		$counts[ $slug ]['count']++;
	}

	uasort(
		$counts,
		function ( $a, $b ) {
			return $b['count'] <=> $a['count'];
		}
	);

	return array(
		'categories' => array_values( $counts ),
		'total'      => count( $all['rows'] ),
		'error'      => $all['error'],
	);
}

/**
 * Ideas in one category.
 *
 * @param string $slug  Category slug.
 * @param int    $limit Ceiling.
 * @return array{rows:array, error:string, cached:bool}
 */
function bbi_sb_category( $slug, $limit = 100 ) {
	$slug = sanitize_title( $slug );
	return bbi_supabase_cached(
		'cat:' . $slug . ':' . (int) $limit,
		function () use ( $slug, $limit ) {
			return bbi_supabase_get(
				'ideas',
				array(
					'select'        => BBI_CARD_COLUMNS,
					'status'        => 'eq.completed',
					'category_slug' => 'eq.' . $slug,
					'order'         => 'trend_score.desc.nullslast',
				),
				0,
				max( 1, min( BBI_PAGE_SIZE, (int) $limit ) )
			);
		}
	);
}

/**
 * A single idea, every column.
 *
 * @param string $slug Idea slug.
 * @return array{row:array|null, error:string}
 */
function bbi_sb_idea( $slug ) {
	$slug   = sanitize_title( $slug );
	$result = bbi_supabase_cached(
		'idea:' . $slug,
		function () use ( $slug ) {
			return bbi_supabase_get(
				'ideas',
				array( 'select' => '*', 'status' => 'eq.completed', 'slug' => 'eq.' . $slug ),
				0,
				1
			);
		}
	);

	return array(
		'row'   => empty( $result['rows'] ) ? null : $result['rows'][0],
		'error' => $result['error'],
	);
}

/**
 * How many completed ideas exist.
 *
 * Uses PostgREST's `count` preference, so the database counts them rather than
 * this fetching every row to call `count()` on it.
 *
 * @return int|null Null when the count could not be read.
 */
function bbi_sb_total() {
	$cached = get_transient( BBI_CACHE_PREFIX . 'total' );
	if ( false !== $cached ) {
		return (int) $cached;
	}

	$url = bbi_supabase_url();
	$key = bbi_supabase_key();
	if ( '' === $url || '' === $key ) {
		return null;
	}

	$response = wp_remote_get(
		$url . '/rest/v1/ideas?select=idea_id&status=eq.completed',
		array(
			'timeout' => BBI_REQUEST_TIMEOUT,
			'headers' => array(
				'apikey'        => $key,
				'Authorization' => 'Bearer ' . $key,
				'Prefer'        => 'count=exact',
				'Range-Unit'    => 'items',
				'Range'         => '0-0',
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return null;
	}

	// Content-Range comes back as "0-0/290"; the part after the slash is the
	// full count regardless of how few rows were returned.
	$range = wp_remote_retrieve_header( $response, 'content-range' );
	if ( ! $range || false === strpos( $range, '/' ) ) {
		return null;
	}

	$total = trim( substr( $range, strpos( $range, '/' ) + 1 ) );
	if ( '*' === $total || ! is_numeric( $total ) ) {
		return null;
	}

	set_transient( BBI_CACHE_PREFIX . 'total', (int) $total, max( 60, (int) bbi_supabase_settings()['ttl'] ) );
	return (int) $total;
}

/**
 * Connection test, for the settings screen.
 *
 * @return array{ok:bool, message:string}
 */
function bbi_supabase_test() {
	$url = bbi_supabase_url();
	$key = trim( bbi_supabase_settings()['key'] );

	if ( '' === $url ) {
		return array( 'ok' => false, 'message' => __( 'No project URL set.', 'bbi' ) );
	}
	if ( '' === $key ) {
		return array( 'ok' => false, 'message' => __( 'No API key set.', 'bbi' ) );
	}
	if ( 'service_role' === bbi_supabase_key_role( $key ) ) {
		return array(
			'ok'      => false,
			'message' => __( 'That is a service role key. It bypasses row-level security and grants write access to every table, and it would sit in the database and in every backup. Use the anon (publishable) key — it is what the public site uses and it is all this needs. Revoke the key you just pasted.', 'bbi' ),
		);
	}

	$result = bbi_supabase_get( 'ideas', array( 'select' => 'idea_id', 'status' => 'eq.completed' ), 0, 1 );

	if ( '' !== $result['error'] ) {
		return array( 'ok' => false, 'message' => $result['error'] );
	}

	$total = bbi_sb_total();

	if ( null === $total ) {
		return array( 'ok' => true, 'message' => __( 'Connected. The row count could not be read, which usually means the count preference is disabled on the project — everything else works.', 'bbi' ) );
	}

	return array(
		'ok'      => true,
		/* translators: %d: number of completed ideas. */
		'message' => sprintf( _n( 'Connected. %d completed idea found.', 'Connected. %d completed ideas found.', $total, 'bbi' ), $total ),
	);
}
