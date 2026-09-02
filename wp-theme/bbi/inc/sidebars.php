<?php
/**
 * Widget areas, and where they appear.
 *
 * Seven areas, because "add a sidebar" in practice means "put something in the
 * header, next to an idea, under the listings, and in four footer columns" and
 * a theme with one generic sidebar cannot do any of it.
 *
 * Every area is checked with `is_active_sidebar()` before its column is drawn.
 * A layout that reserves a third of the width for an empty box does not read
 * as "no widgets yet", it reads as broken.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the widget areas.
 */
function bbi_register_sidebars() {

	$common = array(
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	);

	register_sidebar(
		$common + array(
			'name'        => __( 'Sidebar — idea listings', 'bbi' ),
			'id'          => 'bbi-sidebar-archive',
			'description' => __( 'Shown beside category archives, browse and search results. Position is set in Customizer → BBI Layout → Sidebars.', 'bbi' ),
		)
	);

	register_sidebar(
		$common + array(
			'name'        => __( 'Sidebar — single idea', 'bbi' ),
			'id'          => 'bbi-sidebar-idea',
			'description' => __( 'Shown beside a single idea page.', 'bbi' ),
		)
	);

	register_sidebar(
		$common + array(
			'name'        => __( 'Sidebar — pages', 'bbi' ),
			'id'          => 'bbi-sidebar-page',
			'description' => __( 'Shown beside ordinary pages.', 'bbi' ),
		)
	);

	register_sidebar(
		$common + array(
			'name'        => __( 'Header', 'bbi' ),
			'id'          => 'bbi-header',
			'description' => __( 'A small area at the right of the navigation bar. Keep it to one compact widget — the header is a single row and anything tall will push the nav out of shape.', 'bbi' ),
		)
	);

	for ( $i = 1; $i <= 4; $i++ ) {
		register_sidebar(
			$common + array(
				/* translators: %d: footer column number. */
				'name'        => sprintf( __( 'Footer column %d', 'bbi' ), $i ),
				'id'          => 'bbi-footer-' . $i,
				'description' => __( 'How many columns are shown is set in Customizer → BBI Layout → Footer.', 'bbi' ),
			)
		);
	}
}
add_action( 'widgets_init', 'bbi_register_sidebars' );

/**
 * Which sidebar belongs to the page currently being rendered.
 *
 * Returns null when there is none — either because the template has no sidebar
 * or because the one it would use is empty.
 *
 * @return array{id:string, position:string}|null
 */
function bbi_current_sidebar() {
	if ( is_singular( 'bbi_idea' ) ) {
		$id  = 'bbi-sidebar-idea';
		$pos = get_theme_mod( 'bbi_sidebar_idea', 'none' );
	} elseif ( is_page() ) {
		$id  = 'bbi-sidebar-page';
		$pos = get_theme_mod( 'bbi_sidebar_page', 'none' );
	} elseif ( is_post_type_archive( 'bbi_idea' ) || is_tax( array( 'bbi_category', 'bbi_subcategory' ) ) || is_search() || is_archive() ) {
		$id  = 'bbi-sidebar-archive';
		$pos = get_theme_mod( 'bbi_sidebar_archive', 'none' );
	} else {
		return null;
	}

	if ( 'none' === $pos || ! is_active_sidebar( $id ) ) {
		return null;
	}

	// A page can opt out individually, which is what the "Full width" custom
	// template is for.
	if ( is_page_template( 'templates/full-width.php' ) ) {
		return null;
	}

	return array( 'id' => $id, 'position' => $pos );
}

/**
 * Open the row that holds the content column and, when there is one, a sidebar.
 *
 * The content column is ALWAYS first in the markup, in both sidebar
 * positions; a left-hand sidebar is moved there visually with `order: -1` in
 * build/custom.css. That keeps focus order matching reading order — a left
 * sidebar placed first in the DOM makes a keyboard user tab through every
 * widget before reaching the page they came for.
 */
function bbi_layout_open() {
	$sidebar = bbi_current_sidebar();

	if ( ! $sidebar ) {
		echo '<div class="bbi-container px-3 sm:px-4">';
		return;
	}

	// The column order is set by a class rather than by re-ordering the markup,
	// so the content stays first in the DOM in both cases. `.bbi-with-sidebar`
	// and its `-right` modifier are defined in build/custom.css.
	printf(
		'<div class="bbi-container bbi-with-sidebar bbi-with-sidebar-%s px-3 sm:px-4">',
		esc_attr( $sidebar['position'] )
	);

	// The sidebar itself is emitted by `bbi_layout_close()`, AFTER the content,
	// in both positions. See the note above.
	echo '<div class="min-w-0">';
}

/**
 * Close the content column and emit a right-hand sidebar.
 */
function bbi_layout_close() {
	$sidebar = bbi_current_sidebar();

	echo '</div>';

	if ( $sidebar ) {
		bbi_render_sidebar( $sidebar['id'] );
		echo '</div>';
	}
}

/**
 * Render one widget area.
 *
 * @param string $id Sidebar id.
 */
function bbi_render_sidebar( $id ) {
	$sticky = get_theme_mod( 'bbi_sidebar_sticky', true ) ? ' lg:sticky lg:top-24 lg:self-start' : '';
	printf( '<aside class="bbi-widget-area%s" role="complementary">', esc_attr( $sticky ) );
	dynamic_sidebar( $id );
	echo '</aside>';
}
