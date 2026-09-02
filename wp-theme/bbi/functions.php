<?php
/**
 * BBI theme bootstrap.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

define( 'BBI_VERSION', '0.8.0' );
define( 'BBI_DIR', get_template_directory() );
define( 'BBI_URI', get_template_directory_uri() );

// Order matters in two places: `tokens.php` is the registry every other file
// reads, and `dynamic-css.php` defines the sanitisers `customizer.php` names as
// callbacks. Everything else is independent.
require_once BBI_DIR . '/inc/tokens.php';
require_once BBI_DIR . '/inc/dynamic-css.php';
require_once BBI_DIR . '/inc/customizer.php';
require_once BBI_DIR . '/inc/gutenberg.php';
require_once BBI_DIR . '/inc/blocks.php';
require_once BBI_DIR . '/inc/blocks-idea.php';
require_once BBI_DIR . '/inc/blocks-chrome.php';
require_once BBI_DIR . '/inc/sidebars.php';
require_once BBI_DIR . '/inc/post-types.php';
require_once BBI_DIR . '/inc/meta.php';
require_once BBI_DIR . '/inc/supabase.php';
require_once BBI_DIR . '/inc/settings.php';
require_once BBI_DIR . '/inc/setup-wizard.php';
require_once BBI_DIR . '/inc/updater.php';
require_once BBI_DIR . '/inc/n8n.php';
require_once BBI_DIR . '/inc/assistant.php';
require_once BBI_DIR . '/inc/data.php';
require_once BBI_DIR . '/inc/routing.php';
require_once BBI_DIR . '/inc/seo.php';
require_once BBI_DIR . '/inc/home-content.php';
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
 * the theme needs no build step on the server. Regenerate it from the
 * repository root with:
 *
 *   npx @tailwindcss/cli -i wp-theme/bbi/build/theme.css \
 *     -o wp-theme/bbi/assets/css/bbi.css --minify
 *
 * Compile from `build/theme.css`, never from `src/styles.css` directly — see
 * the note at the top of that file for the two things it fixes.
 *
 * The font request is built from the Customizer's selections, so choosing a
 * system stack for both faces means the site downloads no font at all rather
 * than downloading two it does not use.
 */
function bbi_assets() {
	$fonts = bbi_google_fonts_url();

	if ( '' !== $fonts ) {
		wp_enqueue_style( 'bbi-fonts', $fonts, array(), null );
	}

	wp_enqueue_style( 'bbi', BBI_URI . '/assets/css/bbi.css', '' !== $fonts ? array( 'bbi-fonts' ) : array(), BBI_VERSION );

	// Motion. Deferred: none of it is needed for first paint, and the reveal
	// system is explicitly written so that no JS means everything is simply
	// visible rather than stuck at opacity 0.
	wp_enqueue_script( 'bbi-motion', BBI_URI . '/assets/js/motion.js', array(), BBI_VERSION, true );

	if ( is_front_page() ) {
		wp_enqueue_script( 'bbi-hero-field', BBI_URI . '/assets/js/hero-field.js', array(), BBI_VERSION, true );
	}

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
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
	// A preconnect to a host nothing will be requested from is a wasted
	// handshake, so this follows the same decision the enqueue makes.
	if ( 'preconnect' === $relation_type && '' !== bbi_google_fonts_url() ) {
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

/**
 * Body classes that templates and CSS key off.
 *
 * @param string[] $classes Existing classes.
 * @return string[]
 */
function bbi_body_class( $classes ) {
	$sidebar = bbi_current_sidebar();

	$classes[] = $sidebar ? 'bbi-sidebar-' . $sidebar['position'] : 'bbi-no-sidebar';

	if ( ! get_theme_mod( 'bbi_header_sticky', true ) ) {
		$classes[] = 'bbi-header-static';
	}

	$classes[] = 'bbi-source-' . bbi_source();

	return $classes;
}
add_filter( 'body_class', 'bbi_body_class' );

/**
 * Excerpt length and ellipsis, matching the card setting.
 *
 * @param int $length Default length.
 * @return int
 */
function bbi_excerpt_length( $length ) {
	return max( 8, (int) get_theme_mod( 'bbi_cards_excerpt_words', 28 ) );
}
add_filter( 'excerpt_length', 'bbi_excerpt_length' );

/**
 * A readable ellipsis rather than WordPress's bracketed one.
 *
 * @return string
 */
function bbi_excerpt_more() {
	return '…';
}
add_filter( 'excerpt_more', 'bbi_excerpt_more' );

/**
 * Content width, which WordPress uses to size embeds and wide images.
 */
function bbi_content_width() {
	if ( ! isset( $GLOBALS['content_width'] ) ) {
		// 48rem at a 16px root. Expressed in px because this global is a pixel
		// count by definition and anything else silently becomes zero.
		$GLOBALS['content_width'] = 768;
	}
}
add_action( 'after_setup_theme', 'bbi_content_width', 0 );
