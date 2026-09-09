<?php
/**
 * Writes the Customizer's choices back out as CSS variables.
 *
 * Everything here is one <style> block printed immediately after the compiled
 * stylesheet. The selector is `:root, html.light` and it is deliberately
 * UNLAYERED — see the long note at the top of `inc/tokens.php` for why all
 * three of those properties are load-bearing rather than stylistic.
 *
 * Nothing in this file writes a value it has not sanitised. A colour control
 * in WordPress will happily store the string a user typed, and that string
 * ends up inside a `<style>` tag; `bbi_css_color()` is what stops that being
 * an injection point.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sanitise a value that is about to be printed inside a CSS declaration.
 *
 * Accepts hex, rgb/rgba, hsl/hsla, oklch and CSS colour keywords, and rejects
 * everything else by returning an empty string — which makes the caller skip
 * the declaration entirely and fall back to the compiled default.
 *
 * The characters that matter are `;`, `}`, `{`, `<`, `"`, `'` and `(` outside a
 * known function: any of them closes the declaration or the tag and lets the
 * rest of the string be read as something other than a colour.
 *
 * @param string $value Raw value.
 * @return string Safe value, or '' if it could not be trusted.
 */
function bbi_css_color( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	// Hex, 3/4/6/8 digit.
	if ( preg_match( '/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i', $value ) ) {
		return $value;
	}
	// Functional notation. The inner part is restricted to digits, separators
	// and percent signs, so nothing can smuggle a second declaration inside.
	if ( preg_match( '/^(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\(\s*[0-9a-z%.,\/\s+-]*\s*\)$/i', $value ) ) {
		return $value;
	}
	// Bare keywords.
	if ( preg_match( '/^[a-z]{3,20}$/i', $value ) ) {
		return $value;
	}
	return '';
}

/**
 * Sanitise a CSS font stack.
 *
 * The Customizer offers a free-text field for anyone with a self-hosted face,
 * so this has to survive arbitrary input. Only letters, digits, spaces,
 * quotes, commas and hyphens survive; a semicolon or brace cannot.
 *
 * @param string $value Raw stack.
 * @return string
 */
function bbi_css_font_stack( $value ) {
	$value = trim( (string) $value );
	$value = preg_replace( '/[^A-Za-z0-9 ,\'"_-]/', '', $value );
	return trim( (string) $value, ", \t\n" );
}

/**
 * Sanitise a number against its registered range.
 *
 * Clamping rather than rejecting is deliberate: a value outside the range is
 * almost always a slider pushed to an extreme, and silently doing nothing
 * reads as a broken control.
 *
 * @param mixed $value Raw value.
 * @param array $spec  Token spec with min/max.
 * @return float
 */
function bbi_css_number( $value, $spec ) {
	$num = is_numeric( $value ) ? (float) $value : (float) $spec['default'];
	return max( (float) $spec['min'], min( (float) $spec['max'], $num ) );
}

/**
 * Build the declaration list.
 *
 * Only tokens that DIFFER from their compiled default are written. Re-stating
 * a value the stylesheet already has adds bytes to every page for no effect,
 * and it makes the override block useless for debugging — the point of
 * reading it is to see what has been changed.
 *
 * @return string
 */
function bbi_build_dynamic_css() {
	$out = array();

	foreach ( bbi_color_tokens() as $key => $spec ) {
		$stored = bbi_opt( 'color', $key, $spec['default'] );
		if ( $stored === $spec['default'] ) {
			continue;
		}
		$safe = bbi_css_color( $stored );
		if ( '' === $safe ) {
			continue;
		}
		$out[] = '--' . $key . ':' . $safe;
	}

	foreach ( bbi_font_tokens() as $key => $spec ) {
		$stored = bbi_opt( 'font', $key, $spec['default'] );
		if ( $stored === $spec['default'] ) {
			continue;
		}
		$safe = bbi_css_font_stack( $stored );
		if ( '' === $safe ) {
			continue;
		}
		$out[] = '--' . $key . ':' . $safe;
	}

	foreach ( bbi_size_tokens() as $key => $spec ) {
		$stored = bbi_opt( 'size', $key, $spec['default'] );
		$num    = bbi_css_number( $stored, $spec );
		// A size token is always written, default or not, because several of
		// them are variables this theme introduces rather than ones the
		// compiled stylesheet already declares. Skipping the default would
		// leave `var(--bbi-card-pad)` resolving to nothing.
		$out[] = $spec['css'] . ':' . rtrim( rtrim( number_format( $num, 3, '.', '' ), '0' ), '.' ) . $spec['unit'];
	}

	$css = empty( $out ) ? '' : ':root,html.light{' . implode( ';', $out ) . '}';

	return $css . bbi_dynamic_css_exceptions();
}

/**
 * The rules a variable alone cannot reach.
 *
 * `.glass` and its siblings hard-code `backdrop-filter: blur(24px) …
 * !important` in the compiled stylesheet. A custom property cannot override a
 * literal, and `!important` cannot be beaten by ordinary source order, so the
 * blur control needs a real rule carrying `!important` of its own.
 *
 * It is emitted ONLY when the value differs from the default. Emitting it
 * always would flatten the three deliberately different blur strengths
 * (24px on panels, 18px on the nav, 10px on pills) into one, which is a
 * visible regression for anybody who never touched the control.
 *
 * @return string
 */
function bbi_dynamic_css_exceptions() {
	$spec = bbi_size_tokens()['glass-blur'];
	$blur = bbi_css_number( bbi_opt( 'size', 'glass-blur', $spec['default'] ), $spec );

	if ( abs( $blur - (float) $spec['default'] ) < 0.001 ) {
		return '';
	}

	// Zero blur is a real setting, not an off switch for the surface: the
	// panels keep their translucency and simply stop blurring what is behind
	// them. `backdrop-filter: none` is what a 0px blur means to a browser, and
	// spelling it out avoids a needless compositor layer.
	$filter = $blur <= 0 ? 'none' : sprintf( 'blur(%dpx) saturate(160%%)', (int) $blur );

	return sprintf(
		'.glass,.glass-nav,.glass-pill,.glass-hover{backdrop-filter:%1$s !important;-webkit-backdrop-filter:%1$s !important}',
		$filter
	);
}

/**
 * Print the override.
 *
 * Attached to the `bbi` stylesheet handle with `wp_add_inline_style`, which
 * guarantees it is printed AFTER that stylesheet. Order is the whole
 * mechanism: the values below have the same specificity as the ones they
 * replace, so an earlier position would lose silently.
 */
function bbi_print_dynamic_css() {
	$css = bbi_build_dynamic_css();
	if ( '' !== $css ) {
		wp_add_inline_style( 'bbi', $css );
	}
}
add_action( 'wp_enqueue_scripts', 'bbi_print_dynamic_css', 20 );

/**
 * The same override inside the block editor.
 *
 * Without this the editor renders the compiled defaults while the front end
 * renders the chosen palette, and a writer picking colours is looking at the
 * wrong page.
 */
function bbi_print_dynamic_css_editor() {
	$css = bbi_build_dynamic_css();
	if ( '' !== $css ) {
		wp_add_inline_style( 'bbi-editor', $css );
	}
}
add_action( 'enqueue_block_assets', 'bbi_print_dynamic_css_editor', 20 );

/**
 * The Google Fonts URL for the current selections.
 *
 * Built from what is actually chosen rather than requesting every family in
 * the list. Returns '' when both selections are system stacks, in which case
 * the theme makes no font request at all.
 *
 * @return string
 */
function bbi_google_fonts_url() {
	$families = array();
	$choices  = bbi_font_choices();

	foreach ( array( 'font-display', 'font-sans' ) as $token ) {
		$pick = get_theme_mod( bbi_opt_name( 'fontpick', $token ), '' );
		if ( '' === $pick || ! isset( $choices[ $pick ] ) ) {
			continue;
		}
		if ( '' === $choices[ $pick ]['google'] ) {
			continue;
		}
		$families[] = $choices[ $pick ]['google'];
	}

	// Nothing picked means the theme defaults are in force, and those are the
	// two families the stylesheet was designed against.
	if ( empty( $families ) ) {
		$families = array( 'Instrument+Serif:ital@0;1', 'Inter:wght@400;500;600;700;800' );
	}

	$families = array_unique( $families );

	return 'https://fonts.googleapis.com/css2?family=' . implode( '&family=', $families ) . '&display=swap';
}
