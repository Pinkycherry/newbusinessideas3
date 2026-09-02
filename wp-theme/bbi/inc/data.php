<?php
/**
 * The one accessor the templates use.
 *
 * Templates must not know whether a card came from a WordPress post or from a
 * live Supabase row. Every function here returns the SAME normalised shape:
 *
 *   array{
 *     title:string, url:string, summary:string,
 *     category:string, category_url:string,
 *     score:int|null, source:string
 *   }
 *
 * `score` is null rather than 0 for an unscored idea. Zero is a real value
 * that renders as a visible empty bar and reads as "no demand"; absent means
 * "not scored" and the caller drops the bar instead. That distinction is the
 * single most repeated rule in this codebase and it is repeated because it has
 * been got wrong more than once.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Which source to read from, for this request.
 *
 * @return string 'wp' or 'live'.
 */
function bbi_source() {
	$settings = bbi_supabase_settings();

	if ( 'wp' === $settings['source'] || ! bbi_supabase_ready() ) {
		return 'wp';
	}

	if ( 'live' === $settings['source'] ) {
		return 'live';
	}

	// fallback: WordPress when it has content, Supabase when it does not.
	// Cached for the request; `wp_count_posts` is itself cached by WordPress,
	// so this is not a per-card query.
	static $has_posts = null;
	if ( null === $has_posts ) {
		$has_posts = ( (int) wp_count_posts( 'bbi_idea' )->publish ) > 0;
	}

	return $has_posts ? 'wp' : 'live';
}

/**
 * Normalise a WordPress post into a card.
 *
 * @param int $post_id Post ID.
 * @return array
 */
function bbi_card_from_post( $post_id ) {
	$term = bbi_category_term( $post_id );

	return array(
		'title'        => get_the_title( $post_id ),
		'url'          => get_permalink( $post_id ),
		'summary'      => wp_strip_all_tags( get_post_field( 'post_content', $post_id ) ),
		'category'     => $term ? $term->name : '',
		'category_url' => $term ? get_term_link( $term ) : '',
		'score'        => bbi_trend_score( $post_id ),
		'source'       => 'wp',
	);
}

/**
 * Normalise a Supabase row into a card.
 *
 * The URL points at the WordPress permalink structure — `/idea/<slug>` — not
 * back at the live site. A visitor clicking a card on this install must stay
 * on this install; a link that jumps to another domain mid-browse is a bug,
 * not a shortcut.
 *
 * @param array $row Supabase row.
 * @return array
 */
function bbi_card_from_row( $row ) {
	$slug  = isset( $row['slug'] ) ? sanitize_title( $row['slug'] ) : '';
	$score = null;
	if ( isset( $row['trend_score'] ) && '' !== $row['trend_score'] && null !== $row['trend_score'] ) {
		$score = (int) $row['trend_score'];
	}

	$cat_slug = isset( $row['category_slug'] ) ? sanitize_title( $row['category_slug'] ) : '';

	return array(
		'title'        => isset( $row['title'] ) ? (string) $row['title'] : '',
		'url'          => $slug ? home_url( '/idea/' . $slug . '/' ) : '',
		'summary'      => isset( $row['summary'] ) ? wp_strip_all_tags( (string) $row['summary'] ) : '',
		'category'     => isset( $row['category_name'] ) ? (string) $row['category_name'] : '',
		'category_url' => $cat_slug ? home_url( '/category/' . $cat_slug . '/' ) : '',
		'score'        => $score,
		'source'       => 'live',
	);
}

/**
 * The highest-scoring ideas.
 *
 * @param int $limit How many.
 * @return array<int, array>
 */
function bbi_get_trending( $limit = 6 ) {
	if ( 'live' === bbi_source() ) {
		$result = bbi_sb_trending( $limit );
		return array_map( 'bbi_card_from_row', $result['rows'] );
	}

	$query = new WP_Query(
		array(
			'post_type'      => 'bbi_idea',
			'posts_per_page' => (int) $limit,
			'meta_key'       => 'bbi_trend_score',
			'orderby'        => 'meta_value_num',
			'order'          => 'DESC',
			'no_found_rows'  => true,
			// An inner join on the meta key would drop unscored ideas
			// entirely. They belong at the bottom of the list, not missing
			// from it.
			'meta_query'     => array(
				'relation' => 'OR',
				array( 'key' => 'bbi_trend_score', 'compare' => 'EXISTS' ),
				array( 'key' => 'bbi_trend_score', 'compare' => 'NOT EXISTS' ),
			),
		)
	);

	return array_map( 'bbi_card_from_post', wp_list_pluck( $query->posts, 'ID' ) );
}

/**
 * Specific ideas, in the order given.
 *
 * @param string[] $ids Supabase idea ids.
 * @return array<int, array>
 */
function bbi_get_by_ids( $ids ) {
	$ids = array_values( array_filter( (array) $ids ) );
	if ( empty( $ids ) ) {
		return array();
	}

	if ( 'live' === bbi_source() ) {
		$result = bbi_sb_by_ids( $ids );
		return array_map( 'bbi_card_from_row', $result['rows'] );
	}

	$query = new WP_Query(
		array(
			'post_type'      => 'bbi_idea',
			'posts_per_page' => count( $ids ),
			'no_found_rows'  => true,
			'meta_query'     => array(
				array(
					'key'     => 'bbi_idea_id',
					'value'   => $ids,
					'compare' => 'IN',
				),
			),
		)
	);

	// WP_Query returns these in date order, not in the order asked for, so the
	// requested order is restored here. Otherwise "featured" quietly means
	// "whatever order they happened to be imported in".
	$by_id = array();
	foreach ( $query->posts as $post ) {
		$key = get_post_meta( $post->ID, 'bbi_idea_id', true );
		if ( $key ) {
			$by_id[ $key ] = $post->ID;
		}
	}

	$out = array();
	foreach ( $ids as $id ) {
		if ( isset( $by_id[ $id ] ) ) {
			$out[] = bbi_card_from_post( $by_id[ $id ] );
		}
	}
	return $out;
}

/**
 * The category catalogue.
 *
 * @return array{categories:array<int, array{name:string, slug:string, url:string, count:int}>, total:int}
 */
function bbi_get_catalog() {
	if ( 'live' === bbi_source() ) {
		$catalog = bbi_sb_catalog();
		$out     = array();
		foreach ( $catalog['categories'] as $row ) {
			$out[] = array(
				'name'  => $row['name'],
				'slug'  => $row['slug'],
				'url'   => home_url( '/category/' . $row['slug'] . '/' ),
				'count' => $row['count'],
			);
		}
		return array( 'categories' => $out, 'total' => $catalog['total'] );
	}

	$terms = get_terms(
		array(
			'taxonomy'   => 'bbi_category',
			'hide_empty' => true,
			'orderby'    => 'count',
			'order'      => 'DESC',
		)
	);

	if ( is_wp_error( $terms ) ) {
		return array( 'categories' => array(), 'total' => 0 );
	}

	$out   = array();
	$total = 0;
	foreach ( $terms as $term ) {
		$total += (int) $term->count;
		$out[]  = array(
			'name'  => $term->name,
			'slug'  => $term->slug,
			'url'   => get_term_link( $term ),
			'count' => (int) $term->count,
		);
	}

	return array( 'categories' => $out, 'total' => $total );
}

/**
 * How many ideas the site knows about.
 *
 * @return int
 */
function bbi_get_total() {
	if ( 'live' === bbi_source() ) {
		$total = bbi_sb_total();
		if ( null !== $total ) {
			return $total;
		}
		return bbi_get_catalog()['total'];
	}
	return (int) wp_count_posts( 'bbi_idea' )->publish;
}

/**
 * Render a card from the normalised shape.
 *
 * Honours the Customizer's card options, so turning the trend bar off turns it
 * off everywhere at once rather than in the one template someone remembered.
 *
 * @param array $card Normalised card.
 */
function bbi_render_card( $card ) {
	if ( empty( $card['title'] ) || empty( $card['url'] ) ) {
		return;
	}

	$show_cat     = (bool) get_theme_mod( 'bbi_cards_category', true );
	$show_excerpt = (bool) get_theme_mod( 'bbi_cards_excerpt', true );
	$show_trend   = (bool) get_theme_mod( 'bbi_cards_trend', true );
	$words        = (int) get_theme_mod( 'bbi_cards_excerpt_words', 28 );
	?>
	<a class="mo-card glass glass-hover bbi-shape-card-a bbi-card-pad block h-full rounded-2xl border border-border/60"
		href="<?php echo esc_url( $card['url'] ); ?>">

		<?php if ( $show_cat && '' !== $card['category'] ) : ?>
			<p class="t-eyebrow"><?php echo esc_html( $card['category'] ); ?></p>
		<?php endif; ?>

		<h3 class="t-card mt-2"><?php echo esc_html( $card['title'] ); ?></h3>

		<?php if ( $show_excerpt && '' !== $card['summary'] ) : ?>
			<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
				<?php echo esc_html( wp_trim_words( $card['summary'], max( 8, $words ) ) ); ?>
			</p>
		<?php endif; ?>

		<?php if ( $show_trend && null !== $card['score'] ) : ?>
			<p class="t-meta mt-3 tabular-nums text-hl-teal">
				<?php echo absint( $card['score'] ); ?><span class="opacity-55">/100</span>
			</p>
			<?php bbi_trend_bar( $card['score'] ); ?>
		<?php endif; ?>
	</a>
	<?php
}

/**
 * The grid classes for a card list, from the Customizer's column settings.
 *
 * @return string
 */
function bbi_grid_classes() {
	$desktop = (int) get_theme_mod( 'bbi_cards_cols_desktop', 3 );
	$tablet  = (int) get_theme_mod( 'bbi_cards_cols_tablet', 2 );

	// Written as a lookup rather than as string interpolation because Tailwind
	// generates utilities by scanning source text. `lg:grid-cols-$n` appears in
	// no file, so the class would never be compiled and the grid would silently
	// stay at one column.
	$tablet_class = array( 1 => 'sm:grid-cols-1', 2 => 'sm:grid-cols-2', 3 => 'sm:grid-cols-3' );
	$desk_class   = array( 1 => 'lg:grid-cols-1', 2 => 'lg:grid-cols-2', 3 => 'lg:grid-cols-3', 4 => 'lg:grid-cols-4' );

	return trim(
		'bbi-grid ' .
		( isset( $tablet_class[ $tablet ] ) ? $tablet_class[ $tablet ] : 'sm:grid-cols-2' ) . ' ' .
		( isset( $desk_class[ $desktop ] ) ? $desk_class[ $desktop ] : 'lg:grid-cols-3' )
	);
}
