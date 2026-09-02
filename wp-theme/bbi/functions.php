<?php
/**
 * BBI theme bootstrap.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

define( 'BBI_VERSION', '0.1.0' );
define( 'BBI_DIR', get_template_directory() );
define( 'BBI_URI', get_template_directory_uri() );

require_once BBI_DIR . '/inc/post-types.php';
require_once BBI_DIR . '/inc/meta.php';
require_once BBI_DIR . '/inc/template-tags.php';
require_once BBI_DIR . '/inc/import.php';

/**
 * Theme supports.
 */
function bbi_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'automatic-feed-links' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary navigation', 'bbi' ),
			'footer'  => __( 'Footer navigation', 'bbi' ),
		)
	);
}
add_action( 'after_setup_theme', 'bbi_setup' );

/**
 * Assets.
 *
 * The stylesheet is the compiled Tailwind build, shipped as a static file so
 * the theme needs no build step on the server. Regenerate it from the original
 * repo with:
 *
 *   npx @tailwindcss/cli --input src/styles.css --output wp-theme/bbi/assets/css/bbi.css --minify
 *
 * Fonts are loaded from Google exactly as the original site loads them —
 * Instrument Serif for display, Inter for everything else. `preconnect` first,
 * because without it the font request waits on a fresh TLS handshake.
 */
function bbi_assets() {
	wp_enqueue_style(
		'bbi-fonts',
		'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap',
		array(),
		null
	);

	wp_enqueue_style( 'bbi', BBI_URI . '/assets/css/bbi.css', array( 'bbi-fonts' ), BBI_VERSION );

	// Motion. Deferred: none of it is needed for first paint, and the reveal
	// system is explicitly written so that no JS means everything is simply
	// visible rather than stuck at opacity 0.
	wp_enqueue_script( 'bbi-motion', BBI_URI . '/assets/js/motion.js', array(), BBI_VERSION, true );

	if ( is_front_page() ) {
		wp_enqueue_script( 'bbi-hero-field', BBI_URI . '/assets/js/hero-field.js', array(), BBI_VERSION, true );
	}
}
add_action( 'wp_enqueue_scripts', 'bbi_assets' );

/**
 * Preconnect to the font CDN.
 *
 * @param array  $urls Existing URLs.
 * @param string $relation_type Relation.
 * @return array
 */
function bbi_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = array( 'href' => 'https://fonts.googleapis.com' );
		$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' => '' );
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'bbi_resource_hints', 10, 2 );

/**
 * The site runs light only.
 *
 * The original sets class="light" statically on <html> rather than toggling it,
 * because a theme toggle that runs after paint causes a flash of the wrong
 * palette. Same here: it is filtered onto `language_attributes()`, which
 * `header.php` prints, so the class is in the first byte of HTML the browser
 * sees rather than added by script afterwards.
 *
 * @param string $output The attribute string already built by WordPress.
 * @return string
 */
function bbi_html_class( $output ) {
	if ( false !== strpos( $output, 'class=' ) ) {
		return $output;
	}
	return $output . ' class="light"';
}
add_filter( 'language_attributes', 'bbi_html_class' );
