<?php
/**
 * The Customizer.
 *
 * Every control here is generated from `inc/tokens.php`, so adding a token
 * adds its control automatically and the two can never disagree about what
 * exists. Nothing in this file hard-codes a colour or a size.
 *
 * Transport is `postMessage` throughout, with `assets/js/customize-preview.js`
 * writing the variable straight onto the preview document. The alternative,
 * `refresh`, reloads the whole page on every drag of a slider, which makes a
 * type-scale control unusable — you cannot judge a scale you only see after it
 * has stopped moving.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Human labels for the token groups, in the order they should appear.
 *
 * @return array<string, string>
 */
function bbi_color_groups() {
	return array(
		'brand'     => __( 'Brand colours', 'bbi' ),
		'surface'   => __( 'Surfaces', 'bbi' ),
		'text'      => __( 'Text', 'bbi' ),
		'highlight' => __( 'Highlights', 'bbi' ),
		'line'      => __( 'Borders and focus', 'bbi' ),
	);
}

/**
 * Register everything.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_register( $wp_customize ) {

	// Live preview for the things WordPress already knows how to preview.
	$wp_customize->get_setting( 'blogname' )->transport        = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage';

	$wp_customize->add_panel(
		'bbi_design',
		array(
			'title'       => __( 'BBI — Design system', 'bbi' ),
			'priority'    => 10,
			'description' => __( 'Colours, type, shape and density. Everything here writes a CSS variable that the whole site reads, so a change lands on every page at once rather than on the one you are looking at.', 'bbi' ),
		)
	);

	$wp_customize->add_panel(
		'bbi_layout',
		array(
			'title'       => __( 'BBI — Layout', 'bbi' ),
			'priority'    => 11,
			'description' => __( 'Header, footer, sidebars and card grids.', 'bbi' ),
		)
	);

	bbi_customize_colors( $wp_customize );
	bbi_customize_typography( $wp_customize );
	bbi_customize_sizes( $wp_customize );
	bbi_customize_header( $wp_customize );
	bbi_customize_footer( $wp_customize );
	bbi_customize_sidebar( $wp_customize );
	bbi_customize_cards( $wp_customize );
}
add_action( 'customize_register', 'bbi_customize_register' );

/**
 * Colour controls, one section per group.
 *
 * `WP_Customize_Color_Control` cannot represent `rgba(...)`, and six of the
 * tokens are deliberately semi-transparent — the card surface in particular is
 * translucent so the hero field shows through it. Those get a plain text
 * control with the syntax spelled out, rather than a colour picker that would
 * silently drop their alpha the first time it was touched.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_colors( $wp_customize ) {
	$groups = bbi_color_groups();
	$order  = 0;

	foreach ( $groups as $group => $title ) {
		$wp_customize->add_section(
			'bbi_color_' . $group,
			array(
				'title' => $title,
				'panel' => 'bbi_design',
				'priority' => ++$order,
			)
		);
	}

	foreach ( bbi_color_tokens() as $key => $spec ) {
		$id          = bbi_opt_name( 'color', $key );
		$transparent = false !== strpos( $spec['default'], 'rgba' ) || false !== strpos( $spec['default'], 'hsla' );

		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $spec['default'],
				'transport'         => 'postMessage',
				'sanitize_callback' => 'bbi_sanitize_color_setting',
			)
		);

		$description = isset( $spec['note'] ) ? $spec['note'] : '';

		if ( $transparent ) {
			$description = trim( $description . ' ' . __( 'Accepts rgba() so the transparency survives — a colour picker would flatten it.', 'bbi' ) );
			$wp_customize->add_control(
				$id,
				array(
					'label'       => $spec['label'],
					'section'     => 'bbi_color_' . $spec['group'],
					'type'        => 'text',
					'description' => $description,
				)
			);
			continue;
		}

		$wp_customize->add_control(
			new WP_Customize_Color_Control(
				$wp_customize,
				$id,
				array(
					'label'       => $spec['label'],
					'section'     => 'bbi_color_' . $spec['group'],
					'description' => $description,
				)
			)
		);
	}
}

/**
 * Typography.
 *
 * Two layers: a curated picker that also decides what gets requested from
 * Google, and a free-text stack for a self-hosted face. The picker writes the
 * stack, so choosing from the list and typing a stack are the same setting
 * seen two ways — which is why picking from the list clears the custom field's
 * effect rather than fighting it.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_typography( $wp_customize ) {
	$wp_customize->add_section(
		'bbi_typography',
		array(
			'title'       => __( 'Typography', 'bbi' ),
			'panel'       => 'bbi_design',
			'priority'    => 20,
			'description' => __( 'The display face is used for large headlines; everything else uses the body face.', 'bbi' ),
		)
	);

	$choices = array( '' => __( '— Theme default —', 'bbi' ) );
	foreach ( bbi_font_choices() as $slug => $font ) {
		$choices[ $slug ] = $font['label'];
	}

	foreach ( bbi_font_tokens() as $key => $spec ) {
		$pick_id = bbi_opt_name( 'fontpick', $key );
		$wp_customize->add_setting(
			$pick_id,
			array(
				'default'           => '',
				'transport'         => 'refresh',
				'sanitize_callback' => 'bbi_sanitize_font_choice',
			)
		);
		$wp_customize->add_control(
			$pick_id,
			array(
				'label'       => $spec['label'],
				'section'     => 'bbi_typography',
				'type'        => 'select',
				'choices'     => $choices,
				'description' => __( 'Changing this changes which font file the site downloads, so the preview reloads rather than updating live.', 'bbi' ),
			)
		);

		$custom_id = bbi_opt_name( 'font', $key );
		$wp_customize->add_setting(
			$custom_id,
			array(
				'default'           => $spec['default'],
				'transport'         => 'postMessage',
				'sanitize_callback' => 'bbi_css_font_stack',
			)
		);
		$wp_customize->add_control(
			$custom_id,
			array(
				'label'       => $spec['label'] . ' ' . __( '(custom stack)', 'bbi' ),
				'section'     => 'bbi_typography',
				'type'        => 'text',
				'description' => __( 'For a self-hosted face. Always end with a generic family so text still renders if the file fails.', 'bbi' ),
			)
		);
	}

	bbi_add_range_control( $wp_customize, 'font-scale', 'bbi_typography' );
	bbi_add_range_control( $wp_customize, 'heading-tight', 'bbi_typography' );
}

/**
 * Shape, density and layout width sliders.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_sizes( $wp_customize ) {
	$sections = array(
		'shape'   => __( 'Shape', 'bbi' ),
		'density' => __( 'Card density', 'bbi' ),
		'layout'  => __( 'Widths', 'bbi' ),
		'effect'  => __( 'Effects', 'bbi' ),
	);

	$priority = 30;
	foreach ( $sections as $group => $title ) {
		$wp_customize->add_section(
			'bbi_size_' . $group,
			array(
				'title'    => $title,
				'panel'    => 'bbi_design',
				'priority' => $priority++,
			)
		);
	}

	foreach ( bbi_size_tokens() as $key => $spec ) {
		// The two type sliders live in the typography section instead.
		if ( 'type' === $spec['group'] ) {
			continue;
		}
		bbi_add_range_control( $wp_customize, $key, 'bbi_size_' . $spec['group'] );
	}
}

/**
 * Add one numeric slider from the token registry.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @param string               $key          Token key.
 * @param string               $section      Section id.
 */
function bbi_add_range_control( $wp_customize, $key, $section ) {
	$spec = bbi_size_tokens()[ $key ];
	$id   = bbi_opt_name( 'size', $key );

	$wp_customize->add_setting(
		$id,
		array(
			'default'           => $spec['default'],
			'transport'         => 'postMessage',
			'sanitize_callback' => 'bbi_sanitize_number_setting',
		)
	);

	$label = $spec['label'];
	if ( '' !== $spec['unit'] ) {
		$label .= ' (' . $spec['unit'] . ')';
	}

	$wp_customize->add_control(
		$id,
		array(
			'label'       => $label,
			'section'     => $section,
			'type'        => 'number',
			'description' => isset( $spec['note'] ) ? $spec['note'] : '',
			'input_attrs' => array(
				'min'  => $spec['min'],
				'max'  => $spec['max'],
				'step' => $spec['step'],
			),
		)
	);
}

/**
 * Header options.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_header( $wp_customize ) {
	$wp_customize->add_section(
		'bbi_header',
		array(
			'title'    => __( 'Header', 'bbi' ),
			'panel'    => 'bbi_layout',
			'priority' => 10,
		)
	);

	bbi_add_toggle( $wp_customize, 'header_sticky', 'bbi_header', __( 'Stick the header to the top', 'bbi' ), true );
	bbi_add_toggle( $wp_customize, 'header_rail', 'bbi_header', __( 'Show the reading-progress rail', 'bbi' ), true, __( 'The hairline above the nav that fills as the page scrolls.', 'bbi' ) );
	bbi_add_toggle( $wp_customize, 'header_search', 'bbi_header', __( 'Show the search box', 'bbi' ), true );
	bbi_add_toggle( $wp_customize, 'header_widgets', 'bbi_header', __( 'Show the header widget area', 'bbi' ), false, __( 'Appears at the right of the nav bar. Add widgets under Appearance → Widgets → Header.', 'bbi' ) );

	bbi_add_text( $wp_customize, 'header_cta_label', 'bbi_header', __( 'Call-to-action label', 'bbi' ), '' );
	bbi_add_text( $wp_customize, 'header_cta_url', 'bbi_header', __( 'Call-to-action link', 'bbi' ), '', 'esc_url_raw', __( 'Leave the label empty to hide the button entirely.', 'bbi' ) );

	bbi_add_select(
		$wp_customize,
		'header_align',
		'bbi_header',
		__( 'Navigation position', 'bbi' ),
		'left',
		array(
			'left'   => __( 'Beside the logo', 'bbi' ),
			'center' => __( 'Centred', 'bbi' ),
			'right'  => __( 'Pushed right', 'bbi' ),
		)
	);
}

/**
 * Footer options.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_footer( $wp_customize ) {
	$wp_customize->add_section(
		'bbi_footer',
		array(
			'title'    => __( 'Footer', 'bbi' ),
			'panel'    => 'bbi_layout',
			'priority' => 20,
		)
	);

	bbi_add_select(
		$wp_customize,
		'footer_columns',
		'bbi_footer',
		__( 'Footer widget columns', 'bbi' ),
		'3',
		array(
			'0' => __( 'None', 'bbi' ),
			'1' => __( 'One', 'bbi' ),
			'2' => __( 'Two', 'bbi' ),
			'3' => __( 'Three', 'bbi' ),
			'4' => __( 'Four', 'bbi' ),
		)
	);

	bbi_add_toggle( $wp_customize, 'footer_menu', 'bbi_footer', __( 'Show the footer menu', 'bbi' ), true );

	bbi_add_text(
		$wp_customize,
		'footer_copyright',
		'bbi_footer',
		__( 'Copyright line', 'bbi' ),
		'Bro Business Ideas · businessidea.io',
		'sanitize_text_field',
		__( 'The year is added automatically, so do not type one — a hard-coded year silently goes stale every January.', 'bbi' )
	);

	bbi_add_text(
		$wp_customize,
		'footer_tagline',
		'bbi_footer',
		__( 'Sign-off line', 'bbi' ),
		'Made in India, for everyone starting from zero. We were there too.',
		'sanitize_text_field'
	);
}

/**
 * Sidebar placement.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_sidebar( $wp_customize ) {
	$wp_customize->add_section(
		'bbi_sidebar',
		array(
			'title'       => __( 'Sidebars', 'bbi' ),
			'panel'       => 'bbi_layout',
			'priority'    => 30,
			'description' => __( 'A sidebar only appears when its widget area actually has widgets in it, whatever is chosen here. An empty column reads as a broken layout.', 'bbi' ),
		)
	);

	$positions = array(
		'none'  => __( 'No sidebar', 'bbi' ),
		'left'  => __( 'Left', 'bbi' ),
		'right' => __( 'Right', 'bbi' ),
	);

	bbi_add_select( $wp_customize, 'sidebar_archive', 'bbi_sidebar', __( 'On idea listings and archives', 'bbi' ), 'none', $positions );
	bbi_add_select( $wp_customize, 'sidebar_idea', 'bbi_sidebar', __( 'On a single idea', 'bbi' ), 'none', $positions );
	bbi_add_select( $wp_customize, 'sidebar_page', 'bbi_sidebar', __( 'On pages', 'bbi' ), 'none', $positions );

	bbi_add_toggle( $wp_customize, 'sidebar_sticky', 'bbi_sidebar', __( 'Stick the sidebar while scrolling', 'bbi' ), true );
}

/**
 * Card and grid options.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function bbi_customize_cards( $wp_customize ) {
	$wp_customize->add_section(
		'bbi_cards',
		array(
			'title'    => __( 'Idea cards', 'bbi' ),
			'panel'    => 'bbi_layout',
			'priority' => 40,
		)
	);

	bbi_add_select(
		$wp_customize,
		'cards_cols_desktop',
		'bbi_cards',
		__( 'Columns on desktop', 'bbi' ),
		'3',
		array( '1' => '1', '2' => '2', '3' => '3', '4' => '4' )
	);

	bbi_add_select(
		$wp_customize,
		'cards_cols_tablet',
		'bbi_cards',
		__( 'Columns on tablet', 'bbi' ),
		'2',
		array( '1' => '1', '2' => '2', '3' => '3' )
	);

	bbi_add_toggle( $wp_customize, 'cards_excerpt', 'bbi_cards', __( 'Show the summary', 'bbi' ), true );
	bbi_add_toggle( $wp_customize, 'cards_trend', 'bbi_cards', __( 'Show the trend score and bar', 'bbi' ), true );
	bbi_add_toggle( $wp_customize, 'cards_category', 'bbi_cards', __( 'Show the category label', 'bbi' ), true );

	bbi_add_number(
		$wp_customize,
		'cards_excerpt_words',
		'bbi_cards',
		__( 'Summary length, in words', 'bbi' ),
		28,
		8,
		80
	);
}

/* ------------------------------------------------------------------
   Small control helpers. These exist so the sections above read as a list
   of decisions rather than a wall of add_setting/add_control pairs.
   ------------------------------------------------------------------ */

/**
 * A checkbox.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @param string               $key          Setting key.
 * @param string               $section      Section id.
 * @param string               $label        Label.
 * @param bool                 $default_value Default.
 * @param string               $description  Description.
 */
function bbi_add_toggle( $wp_customize, $key, $section, $label, $default_value, $description = '' ) {
	$wp_customize->add_setting(
		'bbi_' . $key,
		array(
			'default'           => $default_value,
			'transport'         => 'refresh',
			'sanitize_callback' => 'bbi_sanitize_bool',
		)
	);
	$wp_customize->add_control(
		'bbi_' . $key,
		array(
			'label'       => $label,
			'section'     => $section,
			'type'        => 'checkbox',
			'description' => $description,
		)
	);
}

/**
 * A text field.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @param string               $key          Setting key.
 * @param string               $section      Section id.
 * @param string               $label        Label.
 * @param string               $default_value Default.
 * @param string               $sanitize     Sanitiser.
 * @param string               $description  Description.
 */
function bbi_add_text( $wp_customize, $key, $section, $label, $default_value, $sanitize = 'sanitize_text_field', $description = '' ) {
	$wp_customize->add_setting(
		'bbi_' . $key,
		array(
			'default'           => $default_value,
			'transport'         => 'refresh',
			'sanitize_callback' => $sanitize,
		)
	);
	$wp_customize->add_control(
		'bbi_' . $key,
		array(
			'label'       => $label,
			'section'     => $section,
			'type'        => 'text',
			'description' => $description,
		)
	);
}

/**
 * A select.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @param string               $key          Setting key.
 * @param string               $section      Section id.
 * @param string               $label        Label.
 * @param string               $default_value Default.
 * @param array                $choices      Choices.
 */
function bbi_add_select( $wp_customize, $key, $section, $label, $default_value, $choices ) {
	$wp_customize->add_setting(
		'bbi_' . $key,
		array(
			'default'           => $default_value,
			'transport'         => 'refresh',
			'sanitize_callback' => function ( $value ) use ( $choices, $default_value ) {
				return array_key_exists( $value, $choices ) ? $value : $default_value;
			},
		)
	);
	$wp_customize->add_control(
		'bbi_' . $key,
		array(
			'label'   => $label,
			'section' => $section,
			'type'    => 'select',
			'choices' => $choices,
		)
	);
}

/**
 * A bounded number field.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @param string               $key          Setting key.
 * @param string               $section      Section id.
 * @param string               $label        Label.
 * @param int                  $default_value Default.
 * @param int                  $min          Minimum.
 * @param int                  $max          Maximum.
 */
function bbi_add_number( $wp_customize, $key, $section, $label, $default_value, $min, $max ) {
	$wp_customize->add_setting(
		'bbi_' . $key,
		array(
			'default'           => $default_value,
			'transport'         => 'refresh',
			'sanitize_callback' => function ( $value ) use ( $min, $max, $default_value ) {
				$num = is_numeric( $value ) ? (int) $value : (int) $default_value;
				return max( (int) $min, min( (int) $max, $num ) );
			},
		)
	);
	$wp_customize->add_control(
		'bbi_' . $key,
		array(
			'label'       => $label,
			'section'     => $section,
			'type'        => 'number',
			'input_attrs' => array( 'min' => $min, 'max' => $max, 'step' => 1 ),
		)
	);
}

/* ------------------------------------------------------------------
   Sanitisers.
   ------------------------------------------------------------------ */

/**
 * Colour setting sanitiser.
 *
 * Falls back to an empty string rather than to a guess, because an empty
 * stored value makes `bbi_opt()` return the registered default — which is
 * exactly the right behaviour for an unparseable colour.
 *
 * @param string $value Raw value.
 * @return string
 */
function bbi_sanitize_color_setting( $value ) {
	return bbi_css_color( $value );
}

/**
 * Numeric setting sanitiser.
 *
 * @param mixed $value Raw value.
 * @return float
 */
function bbi_sanitize_number_setting( $value ) {
	return is_numeric( $value ) ? (float) $value : 0.0;
}

/**
 * Boolean setting sanitiser.
 *
 * @param mixed $value Raw value.
 * @return bool
 */
function bbi_sanitize_bool( $value ) {
	return (bool) $value;
}

/**
 * Font choice sanitiser.
 *
 * @param string $value Raw value.
 * @return string
 */
function bbi_sanitize_font_choice( $value ) {
	return array_key_exists( $value, bbi_font_choices() ) ? $value : '';
}

/**
 * Preview-side script.
 *
 * Only loaded inside the Customizer preview frame, never on the public site.
 */
function bbi_customize_preview_js() {
	wp_enqueue_script(
		'bbi-customize-preview',
		BBI_URI . '/assets/js/customize-preview.js',
		array( 'customize-preview' ),
		BBI_VERSION,
		true
	);

	// The preview script needs to know which CSS variable each setting writes,
	// and that mapping lives in the token registry rather than being repeated
	// in JavaScript where it would drift.
	$map = array();
	foreach ( bbi_color_tokens() as $key => $spec ) {
		$map[ bbi_opt_name( 'color', $key ) ] = array( 'var' => '--' . $key, 'unit' => '' );
	}
	foreach ( bbi_font_tokens() as $key => $spec ) {
		$map[ bbi_opt_name( 'font', $key ) ] = array( 'var' => '--' . $key, 'unit' => '' );
	}
	foreach ( bbi_size_tokens() as $key => $spec ) {
		$map[ bbi_opt_name( 'size', $key ) ] = array( 'var' => $spec['css'], 'unit' => $spec['unit'] );
	}

	wp_localize_script( 'bbi-customize-preview', 'BBI_TOKEN_MAP', $map );
}
add_action( 'customize_preview_init', 'bbi_customize_preview_js' );
