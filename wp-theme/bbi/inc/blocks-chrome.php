<?php
/**
 * The three site-chrome blocks: icon band, marquee, scroll dock.
 *
 * All three were on the original site and lost in the first port. They are
 * blocks rather than hardcoded theme output so they can be placed, removed and
 * configured from the Site Editor — the dock in particular belongs in the
 * footer part, which every template already includes.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register all three.
 */
function bbi_register_chrome_blocks() {
	register_block_type( BBI_DIR . '/blocks/icon-band', array( 'render_callback' => 'bbi_render_icon_band' ) );
	register_block_type( BBI_DIR . '/blocks/marquee', array( 'render_callback' => 'bbi_render_marquee' ) );
	register_block_type( BBI_DIR . '/blocks/dock', array( 'render_callback' => 'bbi_render_dock' ) );
}
add_action( 'init', 'bbi_register_chrome_blocks' );

/**
 * The eighteen business-model icons.
 *
 * Transcribed from `src/components/business-icons.tsx`, not redrawn. Inline
 * SVG rather than an icon font, for the reason the original gives: a webfont
 * that fails to arrive renders its ligature names as literal text across the
 * page.
 *
 * @return array<int, array{label:string, d:string}>
 */
function bbi_business_icons() {
	return array(
		array( 'label' => 'idea', 'd' => 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.3.3.5.7.5 1.1h6c0-.4.2-.8.5-1.1A6 6 0 0 0 12 3Z' ),
		array( 'label' => 'research', 'd' => 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4' ),
		array( 'label' => 'blueprint', 'd' => 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5M9 13h6M9 17h4' ),
		array( 'label' => 'growth', 'd' => 'M3 17l5-5 4 3 8-8M20 7v5h-5' ),
		array( 'label' => 'money', 'd' => 'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' ),
		array( 'label' => 'home business', 'd' => 'M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5M10 20v-6h4v6' ),
		array( 'label' => 'delivery', 'd' => 'M2 6h14v10H2zM16 10h3l3 3v3h-6M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' ),
		array( 'label' => 'retail', 'd' => 'M4 7h16l-1.5 12.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5ZM9 7V5a3 3 0 0 1 6 0v2' ),
		array( 'label' => 'online', 'd' => 'M3 4h18v12H3zM2 20h20' ),
		array( 'label' => 'customer', 'd' => 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1' ),
		array( 'label' => 'low capital', 'd' => 'M4 10h16v11H4zM8 10V7a4 4 0 0 1 8 0v3' ),
		array( 'label' => 'verdict', 'd' => 'm4 12 5 5L20 6' ),
		array( 'label' => 'services', 'd' => 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z' ),
		array( 'label' => 'property', 'd' => 'M3 20V9l9-6 9 6v11M3 20h18M9 20v-6h6v6' ),
		array( 'label' => 'manufacturing', 'd' => 'M6 4h12l-1 7H7ZM7 11v9h10v-9M10 20v-4h4v4' ),
		array( 'label' => 'side hours', 'd' => 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2' ),
		array( 'label' => 'numbers', 'd' => 'M4 19V5M4 19h16M8 15V9M12 15V6M16 15v-4' ),
		array( 'label' => 'trust', 'd' => 'M12 3 4 7v6c0 5 3.4 7.6 8 8 4.6-.4 8-3 8-8V7Zm-3 9 2 2 4-4' ),
	);
}

/**
 * Render the icon band.
 *
 * The list is doubled so the band still fills a wide viewport, exactly as the
 * original does. It is `aria-hidden`: eighteen decorative glyphs announced one
 * after another is noise to a screen reader, and none of them carries meaning
 * the page does not state in words elsewhere.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function bbi_render_icon_band( $attributes ) {
	$a = wp_parse_args( is_array( $attributes ) ? $attributes : array(), array( 'animate' => true ) );

	$classes = 'bbi-icons';
	if ( empty( $a['animate'] ) ) {
		$classes .= ' bbi-icons-still';
	}

	$out  = '<div ' . get_block_wrapper_attributes( array( 'class' => $classes ) ) . ' aria-hidden="true">';
	$icons = bbi_business_icons();

	foreach ( array_merge( $icons, $icons ) as $icon ) {
		$out .= '<div class="bbi-icon"><svg viewBox="0 0 24 24"><path d="' . esc_attr( $icon['d'] ) . '"></path></svg></div>';
	}

	return $out . '</div>';
}

/**
 * Render the marquee.
 *
 * The track is duplicated and the animation travels exactly -50%, so the
 * second copy lands where the first began and the loop is seamless. Animating
 * to -100% of a single copy would leave visible empty space on every pass.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function bbi_render_marquee( $attributes ) {
	$a = wp_parse_args(
		is_array( $attributes ) ? $attributes : array(),
		array(
			'source'       => 'categories',
			'items'        => '',
			'direction'    => 'left',
			'speed'        => 70,
			'pauseOnHover' => true,
			'linkItems'    => true,
		)
	);

	$items = array();

	if ( 'custom' === $a['source'] ) {
		foreach ( preg_split( '/\r\n|\r|\n/', (string) $a['items'] ) as $line ) {
			$line = trim( $line );
			if ( '' !== $line ) {
				$items[] = array( 'label' => $line, 'url' => '' );
			}
		}
	} else {
		$catalog = bbi_get_catalog();
		foreach ( $catalog['categories'] as $category ) {
			$items[] = array(
				'label' => $category['name'],
				'url'   => empty( $a['linkItems'] ) ? '' : $category['url'],
			);
		}
	}

	if ( empty( $items ) ) {
		// An empty marquee is an empty strip of nothing that still costs an
		// animation. Render nothing at all.
		return '';
	}

	$speed     = max( 10, min( 400, (int) $a['speed'] ) );
	$direction = 'right' === $a['direction'] ? 'right' : 'left';

	$classes = 'bbi-marquee bbi-marquee-' . $direction;
	if ( ! empty( $a['pauseOnHover'] ) ) {
		$classes .= ' bbi-marquee-pause';
	}

	$out  = '<div ' . get_block_wrapper_attributes(
		array(
			'class' => $classes,
			'style' => '--bbi-marquee-time:' . $speed . 's',
		)
	) . ' aria-hidden="true">';

	$out .= '<div class="bbi-marquee-track">';

	// Twice, for the seamless wrap described above.
	for ( $pass = 0; $pass < 2; $pass++ ) {
		foreach ( $items as $item ) {
			if ( '' !== $item['url'] ) {
				$out .= '<a class="glass-pill bbi-marquee-item" href="' . esc_url( $item['url'] ) . '">' . esc_html( $item['label'] ) . '</a>';
			} else {
				$out .= '<span class="glass-pill bbi-marquee-item">' . esc_html( $item['label'] ) . '</span>';
			}
		}
	}

	return $out . '</div></div>';
}

/**
 * Render the scroll dock.
 *
 * Only the shell is rendered here; `dock.js` fills the section list at
 * runtime by reading every element on the page that has an id. Building the
 * list in PHP would mean guessing which blocks the page contains, and it would
 * be wrong the moment someone edited the template.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function bbi_render_dock( $attributes ) {
	$a = wp_parse_args(
		is_array( $attributes ) ? $attributes : array(),
		array( 'showTop' => true, 'showSections' => true, 'threshold' => 400 )
	);

	if ( empty( $a['showTop'] ) && empty( $a['showSections'] ) ) {
		return '';
	}

	$threshold = max( 0, min( 5000, (int) $a['threshold'] ) );

	ob_start();
	?>
	<div class="bbi-dock" data-bbi-threshold="<?php echo absint( $threshold ); ?>" hidden>
		<?php if ( ! empty( $a['showSections'] ) ) : ?>
			<nav class="bbi-dock-panel glass-nav" aria-label="<?php esc_attr_e( 'Page sections', 'bbi' ); ?>" hidden></nav>
			<button type="button" class="bbi-dock-btn glass-btn" data-bbi-dock-toggle
				aria-expanded="false"
				aria-label="<?php esc_attr_e( 'Page sections', 'bbi' ); ?>">&#9776;</button>
		<?php endif; ?>

		<?php if ( ! empty( $a['showTop'] ) ) : ?>
			<button type="button" class="bbi-dock-btn glass-btn" data-bbi-dock-top
				aria-label="<?php esc_attr_e( 'Back to top', 'bbi' ); ?>">&uarr;</button>
		<?php endif; ?>
	</div>
	<?php
	return (string) ob_get_clean();
}

/**
 * The dock's script, loaded only on pages that actually contain the block.
 *
 * `has_block` is checked rather than enqueuing site-wide, so a page without a
 * dock does not download and parse a script that will find nothing to do.
 */
function bbi_dock_assets() {
	if ( is_admin() || ! has_block( 'bbi/dock' ) ) {
		return;
	}
	wp_enqueue_script( 'bbi-dock', BBI_URI . '/assets/js/dock.js', array(), BBI_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'bbi_dock_assets' );

/**
 * Register and render the orbit diagram.
 */
function bbi_register_orbit_block() {
	register_block_type( BBI_DIR . '/blocks/orbit', array( 'render_callback' => 'bbi_render_orbit' ) );
}
add_action( 'init', 'bbi_register_orbit_block' );

/**
 * Render the orbit diagram.
 *
 * Markup matches `OrbitDiagram` in `src/routes/index.tsx` element for element,
 * because the CSS that animates it — 54 rules already compiled into the
 * stylesheet — selects on that exact structure. An approximation of the markup
 * is an orbit with no animation.
 *
 * Node positions are trigonometry over the node count, computed here rather
 * than stored, so adding a fifth node re-spaces all five.
 *
 * The React version adds `is-live` from an IntersectionObserver so the rings
 * only spin once seen. `motion.js` does the same job here, and the class is
 * applied unconditionally when JS is absent — a diagram that never becomes
 * live would otherwise sit invisible.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function bbi_render_orbit( $attributes ) {
	$a = wp_parse_args(
		is_array( $attributes ) ? $attributes : array(),
		array(
			'centerLabel' => 'BBI',
			'centerSub'   => 'Free library',
			'nodes'       => "Named buyer\nMoney mechanics\nReal risks\nFounder verdict",
		)
	);

	$nodes = array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $a['nodes'] ) ) ) );
	if ( empty( $nodes ) ) {
		return '';
	}

	$count = count( $nodes );
	$label = sprintf( '%s: %s', $a['centerLabel'], implode( ', ', $nodes ) );

	$out  = '<div ' . get_block_wrapper_attributes( array( 'class' => 'bbi-orbit-wrap' ) )
		. ' role="img" aria-label="' . esc_attr( $label ) . '">';
	$out .= '<div class="bbi-orbit-ring bbi-orbit-ring-outer"></div>';
	$out .= '<div class="bbi-orbit-ring bbi-orbit-ring-inner"></div>';
	$out .= '<div class="bbi-orbit-center">'
		. '<span class="bbi-orbit-center-label">' . esc_html( $a['centerLabel'] ) . '</span>'
		. '<span class="bbi-orbit-center-sub">' . esc_html( $a['centerSub'] ) . '</span>'
		. '</div>';
	$out .= '<div class="bbi-orbit-rotor">';

	foreach ( $nodes as $i => $node ) {
		// -90° so the first node sits at the top rather than at three o'clock,
		// and a radius of 40% so a label near the edge is not clipped.
		$angle = ( 360 / $count ) * $i - 90;
		$rad   = deg2rad( $angle );
		$x     = 50 + 40 * cos( $rad );
		$y     = 50 + 40 * sin( $rad );

		$out .= sprintf(
			'<div class="bbi-orbit-node" style="left:%1$s%%;top:%2$s%%;animation-delay:%3$dms">'
			. '<span class="bbi-orbit-node-bob" style="animation-delay:%4$dms">'
			. '<span class="bbi-orbit-node-inner">'
			. '<span class="bbi-orbit-dot" aria-hidden="true"></span>'
			. '<span class="bbi-orbit-node-label">%5$s</span>'
			. '</span></span></div>',
			esc_attr( round( $x, 3 ) ),
			esc_attr( round( $y, 3 ) ),
			$i * 110,
			$i * 240,
			esc_html( $node )
		);
	}

	return $out . '</div></div>';
}
