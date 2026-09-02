<?php
/**
 * Custom blocks.
 *
 * Two blocks, both dynamic — PHP owns the markup, nothing is saved into post
 * content but the attributes. That matters more than it sounds: a static block
 * bakes its HTML into every post, so changing how a card looks means every
 * existing page keeps the old markup and shows "This block contains unexpected
 * or invalid content". Dynamic blocks re-render, so a change here lands
 * everywhere at once.
 *
 * `bbi/animate` is the answer to "every animation must be under my control" —
 * direction, distance, duration, delay, stagger and replay, all from the block
 * sidebar. It writes data attributes; `motion.js` reads them. No CSS is
 * generated per block, so a hundred animated sections cost one stylesheet.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register both blocks from their block.json.
 *
 * `register_block_type` with a directory reads block.json, which is what makes
 * the editor script, the attributes and the render callback agree with each
 * other. Registering by hand in PHP means the attribute list exists twice.
 */
function bbi_register_blocks() {
	register_block_type(
		BBI_DIR . '/blocks/animate',
		array( 'render_callback' => 'bbi_render_animate' )
	);

	register_block_type(
		BBI_DIR . '/blocks/idea-grid',
		array( 'render_callback' => 'bbi_render_idea_grid' )
	);
}
add_action( 'init', 'bbi_register_blocks' );

/**
 * Hand the editor the real category list.
 *
 * The Idea Grid's category dropdown is built from this. Typing a slug by hand
 * renders an empty grid with no error to explain it, and two hand-typed slugs
 * have already shipped broken once on this project.
 */
function bbi_block_editor_data() {
	$catalog = function_exists( 'bbi_get_catalog' ) ? bbi_get_catalog() : array( 'categories' => array() );

	$terms = array();
	foreach ( $catalog['categories'] as $category ) {
		$terms[] = array(
			'name'  => $category['name'],
			'slug'  => $category['slug'],
			'count' => (int) $category['count'],
		);
	}

	wp_add_inline_script(
		'bbi-idea-grid-editor-script',
		'window.BBI_BLOCK_DATA = ' . wp_json_encode( array( 'categories' => $terms ) ) . ';',
		'before'
	);
}
add_action( 'enqueue_block_editor_assets', 'bbi_block_editor_data' );

/**
 * Render the Animate wrapper.
 *
 * The settings become data attributes and two custom properties. They are NOT
 * turned into a per-block <style> tag: a page with forty animated sections
 * would then carry forty style tags, and every one of them is a separate
 * stylesheet the browser has to parse before it can paint.
 *
 * `direction: none` renders the wrapper with no animation classes at all
 * rather than an animation of zero distance — an element that is still
 * "animating" pays for a compositor layer to do nothing.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Inner blocks.
 * @return string
 */
function bbi_render_animate( $attributes, $content ) {
	$defaults = array(
		'direction' => 'up',
		'distance'  => 24,
		'duration'  => 600,
		'delay'     => 0,
		'scale'     => 100,
		'replay'    => true,
		'stagger'   => 0,
	);
	$a = wp_parse_args( is_array( $attributes ) ? $attributes : array(), $defaults );

	$allowed   = array( 'up', 'down', 'left', 'right', 'fade', 'scale', 'none' );
	$direction = in_array( $a['direction'], $allowed, true ) ? $a['direction'] : 'up';

	if ( 'none' === $direction ) {
		return sprintf( '<div %s>%s</div>', get_block_wrapper_attributes(), $content );
	}

	// Clamped, not trusted. These come from a saved attribute, which survives
	// a theme change and can hold anything a previous version allowed.
	$distance = max( 0, min( 400, (int) $a['distance'] ) );
	$duration = max( 50, min( 5000, (int) $a['duration'] ) );
	$delay    = max( 0, min( 5000, (int) $a['delay'] ) );
	$stagger  = max( 0, min( 1000, (int) $a['stagger'] ) );
	$scale    = max( 10, min( 300, (int) $a['scale'] ) ) / 100;

	$classes = 'bbi-anim bbi-anim-' . $direction;
	if ( $stagger > 0 ) {
		$classes .= ' bbi-anim-stagger';
	}

	$style = sprintf(
		'--bbi-anim-d:%dpx;--bbi-anim-t:%dms;--bbi-anim-delay:%dms;--bbi-anim-stagger:%dms;--bbi-anim-scale:%s',
		$distance,
		$duration,
		$delay,
		$stagger,
		rtrim( rtrim( number_format( $scale, 3, '.', '' ), '0' ), '.' )
	);

	$wrapper = get_block_wrapper_attributes(
		array(
			'class'          => $classes,
			'style'          => $style,
			'data-bbi-anim'  => $direction,
			// A string, because an HTML attribute has no boolean type and
			// `false` would render as the empty string, which reads as true.
			'data-bbi-replay' => $a['replay'] ? '1' : '0',
		)
	);

	return sprintf( '<div %s>%s</div>', $wrapper, $content );
}

/**
 * Render the Idea Grid.
 *
 * Reads through `bbi_get_*`, so it works identically whether the site is on
 * imported WordPress posts or live Supabase — the block does not know or care
 * which, and neither does whoever placed it.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function bbi_render_idea_grid( $attributes ) {
	$defaults = array(
		'count'        => 6,
		'columns'      => 3,
		'category'     => '',
		'order'        => 'trend',
		'showCategory' => true,
		'showSummary'  => true,
		'showTrend'    => true,
		'summaryWords' => 28,
		'heading'      => '',
	);
	$a = wp_parse_args( is_array( $attributes ) ? $attributes : array(), $defaults );

	$count    = max( 1, min( 48, (int) $a['count'] ) );
	$columns  = max( 1, min( 4, (int) $a['columns'] ) );
	$category = sanitize_title( (string) $a['category'] );

	$cards = bbi_block_query_ideas( $category, $count, (string) $a['order'] );

	if ( empty( $cards ) ) {
		// An empty grid under a heading reads as broken. In the editor it is
		// worth explaining why; on the front end it renders nothing at all.
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return '<p class="t-meta">' . esc_html__( 'No ideas matched. Import the library, or check the connection under BBI → Data.', 'bbi' ) . '</p>';
		}
		return '';
	}

	// A lookup, not interpolation: Tailwind compiles utilities by scanning
	// source text, so `lg:grid-cols-$n` appears in no file and would never be
	// generated. The grid would silently stay one column wide.
	$column_class = array(
		1 => 'lg:grid-cols-1',
		2 => 'lg:grid-cols-2',
		3 => 'lg:grid-cols-3',
		4 => 'lg:grid-cols-4',
	);

	ob_start();
	?>
	<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'bbi-idea-grid' ) ) ); ?>>
		<?php if ( '' !== trim( (string) $a['heading'] ) ) : ?>
			<h2 class="mb-6"><?php echo esc_html( $a['heading'] ); ?></h2>
		<?php endif; ?>

		<div class="bbi-grid sm:grid-cols-2 <?php echo esc_attr( $column_class[ $columns ] ); ?>">
			<?php
			foreach ( $cards as $card ) {
				bbi_render_card_with(
					$card,
					array(
						'category' => (bool) $a['showCategory'],
						'summary'  => (bool) $a['showSummary'],
						'trend'    => (bool) $a['showTrend'],
						'words'    => max( 8, min( 80, (int) $a['summaryWords'] ) ),
					)
				);
			}
			?>
		</div>
	</div>
	<?php
	return (string) ob_get_clean();
}

/**
 * Fetch cards for the grid, from whichever source is active.
 *
 * @param string $category Category slug, or '' for all.
 * @param int    $count    How many.
 * @param string $order    'trend', 'date' or 'title'.
 * @return array<int, array>
 */
function bbi_block_query_ideas( $category, $count, $order ) {
	if ( 'live' === bbi_source() ) {
		// Supabase orders by trend; date and title are applied after fetching,
		// which is honest for a page-sized set and wrong for a whole table —
		// hence the 48-item ceiling on the block.
		$result = '' !== $category
			? bbi_sb_category( $category, $count, 0 )
			: bbi_sb_page( $count, 0 );

		$cards = array_map( 'bbi_card_from_row', $result['rows'] );

		if ( 'title' === $order ) {
			usort(
				$cards,
				function ( $x, $y ) {
					return strcasecmp( $x['title'], $y['title'] );
				}
			);
		}

		return $cards;
	}

	$args = array(
		'post_type'      => 'bbi_idea',
		'posts_per_page' => $count,
		'no_found_rows'  => true,
	);

	if ( '' !== $category ) {
		$args['tax_query'] = array(
			array( 'taxonomy' => 'bbi_category', 'field' => 'slug', 'terms' => $category ),
		);
	}

	if ( 'trend' === $order ) {
		$args['meta_key'] = 'bbi_trend_score';
		$args['orderby']  = 'meta_value_num';
		$args['order']    = 'DESC';
		// An inner join on the meta key would drop unscored ideas entirely.
		// They belong at the bottom, not missing.
		$args['meta_query'] = array(
			'relation' => 'OR',
			array( 'key' => 'bbi_trend_score', 'compare' => 'EXISTS' ),
			array( 'key' => 'bbi_trend_score', 'compare' => 'NOT EXISTS' ),
		);
	} elseif ( 'title' === $order ) {
		$args['orderby'] = 'title';
		$args['order']   = 'ASC';
	} else {
		$args['orderby'] = 'date';
		$args['order']   = 'DESC';
	}

	$query = new WP_Query( $args );
	return array_map( 'bbi_card_from_post', wp_list_pluck( $query->posts, 'ID' ) );
}
