<?php
/**
 * The design token registry.
 *
 * ONE source of truth for every colour, font, radius and density value the
 * theme exposes. Three separate systems read this file:
 *
 *   inc/customizer.php   builds a control for every token listed here
 *   inc/dynamic-css.php  writes the chosen values back out as CSS variables
 *   inc/gutenberg.php    pushes the colours into the block editor palette
 *
 * Keeping them driven from one array is not tidiness. A palette declared
 * separately in theme.json drifts from the Customizer the first time a colour
 * changes, and the editor then shows swatches the front end does not have.
 *
 * ------------------------------------------------------------------
 * HOW THE OVERRIDE ACTUALLY WINS THE CASCADE
 * ------------------------------------------------------------------
 *
 * The compiled stylesheet declares tokens in SEVEN separate `:root` blocks,
 * every one of them UNLAYERED, and then re-declares the light palette under
 * `html.light` — specificity (0,1,1).
 *
 * So an override only lands if it is:
 *
 *   1. UNLAYERED. An `@layer` block loses to unlayered rules no matter how
 *      specific it is. This project has already shipped that bug twice.
 *   2. At least (0,1,1). A bare `:root` is (0,1,0) and loses to `html.light`.
 *   3. PRINTED AFTER the stylesheet. Equal specificity is decided by order.
 *
 * `bbi_build_dynamic_css()` satisfies all three: it emits
 * `:root, html.light { … }`, and `bbi_print_dynamic_css()` attaches it with
 * `wp_add_inline_style()`, which prints it after the stylesheet by definition.
 *
 * ------------------------------------------------------------------
 * WHICH VARIABLE NAME TO WRITE
 * ------------------------------------------------------------------
 *
 * `src/styles.css` uses Tailwind v4's `@theme inline`, which aliases every
 * utility token to a base variable — `--color-primary: var(--primary)`. So the
 * name to override is the BASE one (`--primary`), never the alias
 * (`--color-primary`). Writing the alias sets a value nothing reads, and the
 * change appears to do nothing at all.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Every colour token, with the value the design system actually ships.
 *
 * Defaults are read from the `html.light` block of `src/styles.css`, not
 * invented. Anyone changing a default here should change it there too, or the
 * two stop matching.
 *
 * `editor` marks the tokens worth offering as block-editor colour swatches. A
 * palette of 28 entries is unusable; these nine are the ones a writer picks.
 *
 * @return array<string, array{label:string, group:string, default:string, editor?:bool, note?:string}>
 */
function bbi_color_tokens() {
	return array(
		// Surfaces.
		'background'           => array( 'label' => 'Page background', 'group' => 'surface', 'default' => '#FCFBFE', 'editor' => true ),
		'background-2'         => array( 'label' => 'Page background, alternate', 'group' => 'surface', 'default' => '#EEECF8' ),
		'card'                 => array( 'label' => 'Card surface', 'group' => 'surface', 'default' => 'rgba(255, 255, 255, 0.72)', 'note' => 'Semi-transparent on purpose — the glass panels sit over the hero field and a solid colour flattens them.' ),
		'popover'              => array( 'label' => 'Popover surface', 'group' => 'surface', 'default' => '#FFFFFF' ),
		'secondary'            => array( 'label' => 'Secondary surface', 'group' => 'surface', 'default' => '#EEECF8' ),
		'muted'                => array( 'label' => 'Muted surface', 'group' => 'surface', 'default' => 'rgba(43, 40, 113, 0.06)' ),

		// Text.
		'foreground'           => array( 'label' => 'Body text', 'group' => 'text', 'default' => '#0C0C25', 'editor' => true ),
		'foreground-hover'     => array( 'label' => 'Text on hover fill', 'group' => 'text', 'default' => '#FCFBFE' ),
		'muted-foreground'     => array( 'label' => 'Secondary text', 'group' => 'text', 'default' => '#3A3697', 'editor' => true ),
		'card-foreground'      => array( 'label' => 'Text on cards', 'group' => 'text', 'default' => '#0C0C25' ),
		'popover-foreground'   => array( 'label' => 'Text in popovers', 'group' => 'text', 'default' => '#0C0C25' ),
		'secondary-foreground' => array( 'label' => 'Text on secondary', 'group' => 'text', 'default' => '#0C0C25' ),

		// Brand.
		'primary'              => array( 'label' => 'Brand primary', 'group' => 'brand', 'default' => '#4643BA', 'editor' => true ),
		'primary-foreground'   => array( 'label' => 'Text on brand primary', 'group' => 'brand', 'default' => '#FFFFFF' ),
		'accent'               => array( 'label' => 'Accent', 'group' => 'brand', 'default' => '#4643BA', 'editor' => true ),
		'accent-foreground'    => array( 'label' => 'Text on accent', 'group' => 'brand', 'default' => '#FFFFFF' ),
		'violet'               => array( 'label' => 'Violet', 'group' => 'brand', 'default' => '#4643BA' ),
		'violet-soft'          => array( 'label' => 'Violet, soft', 'group' => 'brand', 'default' => '#8886DB' ),
		'ember'                => array( 'label' => 'Ember', 'group' => 'brand', 'default' => '#8886DB' ),
		'warm'                 => array( 'label' => 'Warm', 'group' => 'brand', 'default' => '#3A3697' ),

		// Highlights. Every one of these was picked by computing its contrast
		// ratio against both the page background and the card surface; all four
		// clear WCAG AA on both. Changing one without re-checking its ratio is
		// how a palette quietly becomes unreadable.
		'hl-gold'              => array( 'label' => 'Highlight — gold', 'group' => 'highlight', 'default' => '#8A5D00', 'editor' => true, 'note' => 'Measured 5.59:1 on the page, 5.76:1 on a card.' ),
		'hl-green'             => array( 'label' => 'Highlight — green', 'group' => 'highlight', 'default' => '#0F6E44', 'editor' => true, 'note' => 'Measured 6.11:1 on the page, 6.30:1 on a card.' ),
		'hl-coral'             => array( 'label' => 'Highlight — coral', 'group' => 'highlight', 'default' => '#B0442C', 'editor' => true, 'note' => 'Measured 5.49:1 on the page, 5.66:1 on a card.' ),
		'hl-teal'              => array( 'label' => 'Highlight — teal', 'group' => 'highlight', 'default' => '#10627A', 'editor' => true, 'note' => 'Measured 6.68:1 on the page, 6.88:1 on a card.' ),

		// Lines.
		'border'               => array( 'label' => 'Border', 'group' => 'line', 'default' => 'rgba(43, 40, 113, 0.18)' ),
		'input'                => array( 'label' => 'Input border', 'group' => 'line', 'default' => 'rgba(43, 40, 113, 0.14)' ),
		'ring'                 => array( 'label' => 'Focus ring', 'group' => 'line', 'default' => '#4643BA', 'note' => 'This is the visible keyboard-focus indicator. A low-contrast value here is an accessibility regression, not a style choice.' ),
		'glass-border'         => array( 'label' => 'Glass panel edge', 'group' => 'line', 'default' => 'rgba(43, 40, 113, 0.22)' ),
	);
}

/**
 * Typography tokens.
 *
 * `--font-display` and `--font-sans` are full CSS font stacks, not single
 * names, so a chosen webfont still has a fallback when it fails to load. The
 * Customizer offers a curated list plus a free-text field, and the free-text
 * field is why every stored value is passed through a sanitiser that strips
 * anything that could close the declaration.
 *
 * @return array<string, array{label:string, default:string, kind:string}>
 */
function bbi_font_tokens() {
	return array(
		'font-display' => array(
			'label'   => 'Display font stack',
			'kind'    => 'stack',
			'default' => '"Instrument Serif", ui-serif, Georgia, serif',
		),
		'font-sans'    => array(
			'label'   => 'Body font stack',
			'kind'    => 'stack',
			'default' => '"Inter", ui-sans-serif, system-ui, sans-serif',
		),
	);
}

/**
 * The Google Fonts the Customizer can request.
 *
 * A curated list rather than the whole Google catalogue, because every extra
 * family is another render-blocking request. The `stack` is what gets written
 * to the CSS variable; the `google` string is the family part of the CSS2 URL.
 *
 * @return array<string, array{label:string, stack:string, google:string}>
 */
function bbi_font_choices() {
	return array(
		'instrument-serif' => array( 'label' => 'Instrument Serif (theme default, display)', 'stack' => '"Instrument Serif", ui-serif, Georgia, serif', 'google' => 'Instrument+Serif:ital@0;1' ),
		'inter'            => array( 'label' => 'Inter (theme default, body)', 'stack' => '"Inter", ui-sans-serif, system-ui, sans-serif', 'google' => 'Inter:wght@400;500;600;700;800' ),
		'plus-jakarta'     => array( 'label' => 'Plus Jakarta Sans', 'stack' => '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif', 'google' => 'Plus+Jakarta+Sans:wght@400;500;600;700;800' ),
		'space-grotesk'    => array( 'label' => 'Space Grotesk', 'stack' => '"Space Grotesk", ui-sans-serif, system-ui, sans-serif', 'google' => 'Space+Grotesk:wght@400;500;600;700' ),
		'dm-serif'         => array( 'label' => 'DM Serif Display', 'stack' => '"DM Serif Display", ui-serif, Georgia, serif', 'google' => 'DM+Serif+Display:ital@0;1' ),
		'fraunces'         => array( 'label' => 'Fraunces', 'stack' => '"Fraunces", ui-serif, Georgia, serif', 'google' => 'Fraunces:ital,opsz,wght@0,9..144,400..800' ),
		'general-sans'     => array( 'label' => 'Manrope', 'stack' => '"Manrope", ui-sans-serif, system-ui, sans-serif', 'google' => 'Manrope:wght@400;500;600;700;800' ),
		'system'           => array( 'label' => 'System UI (loads nothing)', 'stack' => 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', 'google' => '' ),
	);
}

/**
 * Numeric tokens — sizing, density, radius.
 *
 * Each carries its own min/max, because these are the values that break a
 * layout when pushed too far. A card radius of 400px is not a preference, it
 * is a bug the user typed in themselves, so the range is clamped rather than
 * trusted.
 *
 * @return array<string, array{label:string, group:string, default:float, min:float, max:float, step:float, unit:string, css:string, note?:string}>
 */
function bbi_size_tokens() {
	return array(
		'radius'          => array(
			'label' => 'Corner radius', 'group' => 'shape', 'default' => 1.25, 'min' => 0, 'max' => 2.5, 'step' => 0.05, 'unit' => 'rem', 'css' => '--radius',
			'note'  => 'The whole radius scale is derived from this one value, so every card, pill and panel moves together.',
		),
		'card-pad'        => array(
			'label' => 'Card padding', 'group' => 'density', 'default' => 1.5, 'min' => 0.5, 'max' => 3, 'step' => 0.125, 'unit' => 'rem', 'css' => '--bbi-card-pad',
		),
		'card-pad-sm'     => array(
			'label' => 'Card padding on phones', 'group' => 'density', 'default' => 1, 'min' => 0.25, 'max' => 2, 'step' => 0.125, 'unit' => 'rem', 'css' => '--bbi-card-pad-sm',
		),
		'card-gap'        => array(
			'label' => 'Gap between cards', 'group' => 'density', 'default' => 1, 'min' => 0.25, 'max' => 3, 'step' => 0.125, 'unit' => 'rem', 'css' => '--bbi-card-gap',
		),
		'section-gap'     => array(
			'label' => 'Gap between sections', 'group' => 'density', 'default' => 5, 'min' => 1, 'max' => 10, 'step' => 0.25, 'unit' => 'rem', 'css' => '--bbi-section-gap',
		),
		'content-width'   => array(
			'label' => 'Content width', 'group' => 'layout', 'default' => 72, 'min' => 48, 'max' => 110, 'step' => 1, 'unit' => 'rem', 'css' => '--bbi-content-w',
			'note'  => 'The wide container. 72rem matches the original max-w-6xl.',
		),
		'prose-width'     => array(
			'label' => 'Reading width', 'group' => 'layout', 'default' => 48, 'min' => 32, 'max' => 72, 'step' => 1, 'unit' => 'rem', 'css' => '--bbi-prose-w',
			'note'  => 'Body copy only. Beyond roughly 75 characters a line is measurably harder to track back from.',
		),
		'font-scale'      => array(
			'label' => 'Type scale', 'group' => 'type', 'default' => 1, 'min' => 0.85, 'max' => 1.3, 'step' => 0.01, 'unit' => '', 'css' => '--bbi-font-scale',
			'note'  => 'Multiplies the root font size. Everything sized in rem moves with it; anything sized in px does not.',
		),
		'heading-tight'   => array(
			'label' => 'Heading letter-spacing', 'group' => 'type', 'default' => -0.02, 'min' => -0.06, 'max' => 0.06, 'step' => 0.005, 'unit' => 'em', 'css' => '--bbi-heading-tracking',
		),
		'glass-blur'      => array(
			'label' => 'Glass blur', 'group' => 'effect', 'default' => 14, 'min' => 0, 'max' => 40, 'step' => 1, 'unit' => 'px', 'css' => '--bbi-glass-blur',
			'note'  => 'Set to 0 to turn the frosted panels into flat surfaces. Backdrop blur is the single most expensive effect on the page on a low-end phone.',
		),
		'card-min-height' => array(
			'label' => 'Minimum card height', 'group' => 'density', 'default' => 0, 'min' => 0, 'max' => 24, 'step' => 0.5, 'unit' => 'rem', 'css' => '--bbi-card-min-h',
			'note'  => 'Zero means cards size to their content. Set a value to force a even grid at the cost of white space in the shorter ones.',
		),
	);
}

/**
 * Option name for a token.
 *
 * @param string $group Token group prefix.
 * @param string $key   Token key.
 * @return string
 */
function bbi_opt_name( $group, $key ) {
	return 'bbi_' . $group . '_' . str_replace( '-', '_', $key );
}

/**
 * The stored value for a token, falling back to its registered default.
 *
 * @param string $group Token group prefix.
 * @param string $key   Token key.
 * @param mixed  $default_value Registered default.
 * @return mixed
 */
function bbi_opt( $group, $key, $default_value ) {
	$value = get_theme_mod( bbi_opt_name( $group, $key ), null );
	if ( null === $value || '' === $value ) {
		return $default_value;
	}
	return $value;
}
