<?php
/**
 * Block editor integration.
 *
 * Three jobs:
 *
 * 1. Make the editor look like the site. Without `add_editor_style` the block
 *    editor renders WordPress's default typography, so what a writer composes
 *    is not what publishes.
 * 2. Keep the editor's colour palette equal to the Customizer's. theme.json is
 *    a static file and cannot know what someone chose this morning, so the
 *    palette is rewritten at runtime through `wp_theme_json_data_theme`.
 * 3. Ship block patterns and block styles, so the sections of the original site
 *    are things a writer can insert rather than things only a template can
 *    render.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Editor support.
 */
function bbi_editor_setup() {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'custom-line-height' );
	add_theme_support( 'custom-spacing' );
	add_theme_support( 'custom-units' );
	add_theme_support( 'appearance-tools' );
	add_theme_support( 'border' );
	add_theme_support( 'link-color' );

	add_editor_style( 'assets/css/bbi.css' );

	add_theme_support(
		'custom-logo',
		array(
			'height'      => 48,
			'width'       => 200,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	add_theme_support(
		'custom-background',
		array( 'default-color' => 'FCFBFE' )
	);
}
add_action( 'after_setup_theme', 'bbi_editor_setup', 11 );

/**
 * The compiled stylesheet inside the editor iframe.
 *
 * `add_editor_style` covers the classic path; a registered handle is what
 * `inc/dynamic-css.php` attaches the Customizer override to, so the editor
 * shows the chosen palette rather than the shipped defaults.
 */
function bbi_editor_assets() {
	wp_enqueue_style( 'bbi-editor', BBI_URI . '/assets/css/bbi.css', array(), BBI_VERSION );
}
add_action( 'enqueue_block_assets', 'bbi_editor_assets' );

/**
 * Rewrite theme.json's palette from the live Customizer values.
 *
 * theme.json ships the shipped defaults so the theme is correct before anyone
 * opens the Customizer. This replaces those values with whatever is currently
 * set, which is what keeps the swatches in the editor sidebar honest — a
 * swatch showing a colour the site no longer uses is worse than no swatch.
 *
 * Only tokens flagged `editor` in the registry appear. A palette of 28 entries
 * is not a palette, it is a list.
 *
 * @param WP_Theme_JSON_Data $theme_json Theme JSON data.
 * @return WP_Theme_JSON_Data
 */
function bbi_filter_theme_json( $theme_json ) {
	$palette = array();

	foreach ( bbi_color_tokens() as $key => $spec ) {
		if ( empty( $spec['editor'] ) ) {
			continue;
		}
		$value = bbi_opt( 'color', $key, $spec['default'] );
		$safe  = bbi_css_color( $value );
		$palette[] = array(
			'slug'  => $key,
			'name'  => $spec['label'],
			'color' => '' === $safe ? $spec['default'] : $safe,
		);
	}

	$palette[] = array( 'slug' => 'white', 'name' => __( 'White', 'bbi' ), 'color' => '#FFFFFF' );

	$fonts = array();
	foreach ( array( 'font-display' => 'display', 'font-sans' => 'body' ) as $token => $slug ) {
		$spec    = bbi_font_tokens()[ $token ];
		$stack   = bbi_css_font_stack( bbi_opt( 'font', $token, $spec['default'] ) );
		$fonts[] = array(
			'slug'       => $slug,
			'name'       => 'display' === $slug ? __( 'Display', 'bbi' ) : __( 'Body', 'bbi' ),
			'fontFamily' => '' === $stack ? $spec['default'] : $stack,
		);
	}
	$fonts[] = array( 'slug' => 'mono', 'name' => __( 'Monospace', 'bbi' ), 'fontFamily' => 'ui-monospace, SFMono-Regular, Menlo, monospace' );

	$sizes = bbi_size_tokens();
	$data  = array(
		'version'  => 3,
		'settings' => array(
			'color'      => array( 'palette' => $palette ),
			'typography' => array( 'fontFamilies' => $fonts ),
			'layout'     => array(
				'contentSize' => bbi_css_number( bbi_opt( 'size', 'prose-width', $sizes['prose-width']['default'] ), $sizes['prose-width'] ) . 'rem',
				'wideSize'    => bbi_css_number( bbi_opt( 'size', 'content-width', $sizes['content-width']['default'] ), $sizes['content-width'] ) . 'rem',
			),
		),
	);

	return $theme_json->update_with( $data );
}
add_filter( 'wp_theme_json_data_theme', 'bbi_filter_theme_json' );

/**
 * Block styles.
 *
 * These are the site's own surfaces made available to core blocks, so a page
 * built in the editor can use the same glass panel and eyebrow the templates
 * use rather than approximating them with a group and a background colour.
 */
function bbi_register_block_styles() {
	$styles = array(
		array( 'core/group', 'bbi-glass', __( 'Glass panel', 'bbi' ) ),
		array( 'core/group', 'bbi-glass-hover', __( 'Glass panel, responds to hover', 'bbi' ) ),
		array( 'core/columns', 'bbi-grid', __( 'BBI grid spacing', 'bbi' ) ),
		array( 'core/paragraph', 't-eyebrow', __( 'Eyebrow', 'bbi' ) ),
		array( 'core/paragraph', 't-lead', __( 'Lead paragraph', 'bbi' ) ),
		array( 'core/paragraph', 't-meta', __( 'Meta line', 'bbi' ) ),
		array( 'core/heading', 'bbi-display', __( 'Display face', 'bbi' ) ),
		array( 'core/list', 'bbi-checks', __( 'Checklist', 'bbi' ) ),
		array( 'core/image', 'mo-media', __( 'Media frame', 'bbi' ) ),
		array( 'core/button', 'glass-pill', __( 'Glass pill', 'bbi' ) ),
		array( 'core/separator', 'bbi-hairline', __( 'Hairline', 'bbi' ) ),
	);

	foreach ( $styles as $style ) {
		register_block_style(
			$style[0],
			array(
				'name'  => $style[1],
				'label' => $style[2],
			)
		);
	}
}
add_action( 'init', 'bbi_register_block_styles' );

/**
 * Pattern categories and patterns.
 *
 * Patterns are registered from PHP rather than from `/patterns` files so their
 * copy can be translated and so a pattern can interpolate a real value — the
 * category list in particular has to come from the taxonomy, never from a
 * hand-typed list that goes stale the moment a category is renamed.
 */
function bbi_register_patterns() {
	if ( ! function_exists( 'register_block_pattern_category' ) ) {
		return;
	}

	register_block_pattern_category( 'bbi', array( 'label' => __( 'BBI sections', 'bbi' ) ) );

	register_block_pattern(
		'bbi/hero',
		array(
			'title'      => __( 'Hero — headline, lead, two actions', 'bbi' ),
			'categories' => array( 'bbi' ),
			'content'    => '<!-- wp:group {"className":"is-style-bbi-glass bbi-card-pad","layout":{"type":"constrained"}} -->
<div class="wp-block-group is-style-bbi-glass bbi-card-pad"><!-- wp:paragraph {"className":"is-style-t-eyebrow"} -->
<p class="is-style-t-eyebrow">' . esc_html__( 'The truth about business ideas', 'bbi' ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"fontSize":"hero"} -->
<h1 class="wp-block-heading has-hero-font-size">' . esc_html__( 'Write the headline here.', 'bbi' ) . '</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"is-style-t-lead"} -->
<p class="is-style-t-lead">' . esc_html__( 'One paragraph that says what this page is for, in the same voice as the rest of the site.', 'bbi' ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">' . esc_html__( 'Browse ideas', 'bbi' ) . '</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->',
		)
	);

	register_block_pattern(
		'bbi/three-up',
		array(
			'title'      => __( 'Three glass cards', 'bbi' ),
			'categories' => array( 'bbi' ),
			'content'    => '<!-- wp:columns {"className":"is-style-bbi-grid"} -->
<div class="wp-block-columns is-style-bbi-grid">' . str_repeat(
				'<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"is-style-bbi-glass bbi-card-pad","layout":{"type":"constrained"}} -->
<div class="wp-block-group is-style-bbi-glass bbi-card-pad"><!-- wp:heading {"level":3,"fontSize":"card"} -->
<h3 class="wp-block-heading has-card-font-size">' . esc_html__( 'Card heading', 'bbi' ) . '</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"is-style-t-lead"} -->
<p class="is-style-t-lead">' . esc_html__( 'One sentence. Say the thing, then stop.', 'bbi' ) . '</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->',
				3
			) . '</div>
<!-- /wp:columns -->',
		)
	);

	register_block_pattern(
		'bbi/faq',
		array(
			'title'      => __( 'FAQ — question and answer pairs', 'bbi' ),
			'categories' => array( 'bbi' ),
			'content'    => '<!-- wp:heading {"fontSize":"section"} -->
<h2 class="wp-block-heading has-section-font-size">' . esc_html__( 'Questions people actually ask', 'bbi' ) . '</h2>
<!-- /wp:heading -->' . str_repeat(
				'<!-- wp:details -->
<details class="wp-block-details"><summary>' . esc_html__( 'The question, written the way someone would type it', 'bbi' ) . '</summary><!-- wp:paragraph -->
<p>' . esc_html__( 'The answer. Short, and honest about what we do not know.', 'bbi' ) . '</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->',
				3
			),
		)
	);

	register_block_pattern(
		'bbi/comparison',
		array(
			'title'      => __( 'Comparison — two columns, one muted', 'bbi' ),
			'categories' => array( 'bbi' ),
			'content'    => '<!-- wp:columns {"className":"is-style-bbi-grid"} -->
<div class="wp-block-columns is-style-bbi-grid"><!-- wp:column {"backgroundColor":"background-2"} -->
<div class="wp-block-column has-background-2-background-color has-background bbi-card-pad"><!-- wp:heading {"level":3,"fontSize":"card"} -->
<h3 class="wp-block-heading has-card-font-size">' . esc_html__( 'The usual way', 'bbi' ) . '</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>' . esc_html__( 'A full sentence, not a fragment.', 'bbi' ) . '</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column is-style-bbi-glass bbi-card-pad"><!-- wp:heading {"level":3,"fontSize":"card"} -->
<h3 class="wp-block-heading has-card-font-size">' . esc_html__( 'Our way', 'bbi' ) . '</h3>
<!-- /wp:heading -->

<!-- wp:list {"className":"is-style-bbi-checks"} -->
<ul class="wp-block-list is-style-bbi-checks"><!-- wp:list-item -->
<li>' . esc_html__( 'A full sentence here too.', 'bbi' ) . '</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->',
		)
	);
}
add_action( 'init', 'bbi_register_patterns' );
