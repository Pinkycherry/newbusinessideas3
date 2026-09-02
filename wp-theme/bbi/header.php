<?php
/**
 * Site header.
 *
 * Everything optional here is driven from Customizer → BBI Layout → Header.
 * The defaults reproduce the original site exactly, so an untouched install
 * looks like businessidea.io and every control moves away from that rather
 * than toward it.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

$bbi_sticky = get_theme_mod( 'bbi_header_sticky', true );
$bbi_align  = get_theme_mod( 'bbi_header_align', 'left' );
$bbi_cta    = trim( (string) get_theme_mod( 'bbi_header_cta_label', '' ) );
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="sr-only focus:not-sr-only" href="#content"><?php esc_html_e( 'Skip to content', 'bbi' ); ?></a>

<header class="<?php echo esc_attr( $bbi_sticky ? 'sticky top-0 z-40' : 'relative' ); ?> px-3 pt-2 sm:px-4 sm:pt-5">

	<?php if ( get_theme_mod( 'bbi_header_rail', true ) ) : ?>
		<?php
		/*
		 * Reading position for the whole document. One composited transform per
		 * frame, driven from --page-p, which motion.js writes — including under
		 * reduced motion, because where you are in a document is information
		 * rather than decoration.
		 */
		?>
		<div aria-hidden class="bbi-container h-px overflow-hidden rounded-full bg-border">
			<div class="mo-page-rail h-full w-full bg-accent"></div>
		</div>
	<?php endif; ?>

	<div class="glass-nav bbi-container mt-4 flex items-center gap-4 rounded-full px-4 py-2 sm:px-6">

		<?php if ( has_custom_logo() ) : ?>
			<span class="flex items-center"><?php the_custom_logo(); ?></span>
		<?php else : ?>
			<a class="glass-pill bbi-site-title rounded-full px-3 py-1.5 text-sm font-extrabold tracking-[0.14em]"
				href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
		<?php endif; ?>

		<nav class="<?php echo esc_attr( 'center' === $bbi_align ? 'hidden flex-1 items-center justify-center gap-5 sm:flex' : ( 'right' === $bbi_align ? 'hidden flex-1 items-center justify-end gap-5 sm:flex' : 'hidden flex-1 items-center gap-5 sm:flex' ) ); ?>"
			aria-label="<?php esc_attr_e( 'Primary', 'bbi' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.18em]',
					'depth'          => 2,
					// No fallback. An unassigned menu location renders nothing;
					// WordPress's default would dump every published page into
					// the navigation bar.
					'fallback_cb'    => false,
				)
			);
			?>
		</nav>

		<div class="ml-auto flex items-center gap-3">

			<?php if ( get_theme_mod( 'bbi_header_widgets', false ) && is_active_sidebar( 'bbi-header' ) ) : ?>
				<div class="bbi-widget-area hidden lg:block"><?php dynamic_sidebar( 'bbi-header' ); ?></div>
			<?php endif; ?>

			<?php if ( get_theme_mod( 'bbi_header_search', true ) ) : ?>
				<form class="hidden sm:block" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
					<label class="sr-only" for="bbi-s"><?php esc_html_e( 'Search ideas', 'bbi' ); ?></label>
					<input class="glass rounded-full px-4 py-2 text-sm" id="bbi-s" type="search" name="s"
						placeholder="<?php esc_attr_e( 'Search ideas...', 'bbi' ); ?>"
						value="<?php echo esc_attr( get_search_query() ); ?>" />
				</form>
			<?php endif; ?>

			<?php if ( '' !== $bbi_cta ) : ?>
				<a class="glass-pill rounded-full px-4 py-2 text-sm font-semibold"
					href="<?php echo esc_url( get_theme_mod( 'bbi_header_cta_url', home_url( '/' ) ) ); ?>">
					<?php echo esc_html( $bbi_cta ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</header>

<main id="content">
