<?php
/**
 * Site header.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;
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

<header class="sticky top-0 z-40 px-3 pt-2 sm:px-4 sm:pt-5">
	<?php /* Reading position for the whole document. One composited transform
	         per frame, driven from --page-p by motion.js — no layout, no repaint. */ ?>
	<div aria-hidden class="mx-auto h-px max-w-6xl overflow-hidden rounded-full bg-border">
		<div class="mo-page-rail h-full w-full bg-accent"></div>
	</div>

	<div class="glass-nav mx-auto mt-4 flex max-w-6xl items-center gap-4 rounded-full px-4 py-2 sm:px-6">
		<a class="glass-pill rounded-full px-3 py-1.5 text-sm font-extrabold tracking-[0.14em]"
			href="<?php echo esc_url( home_url( '/' ) ); ?>">BBI</a>

		<nav class="hidden flex-1 items-center gap-5 sm:flex" aria-label="<?php esc_attr_e( 'Primary', 'bbi' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.18em]',
					'depth'          => 2,
					'fallback_cb'    => false,
				)
			);
			?>
		</nav>

		<form class="ml-auto hidden sm:block" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
			<label class="sr-only" for="bbi-s"><?php esc_html_e( 'Search ideas', 'bbi' ); ?></label>
			<input class="glass rounded-full px-4 py-2 text-sm" id="bbi-s" type="search" name="s"
				placeholder="<?php esc_attr_e( 'Search ideas...', 'bbi' ); ?>"
				value="<?php echo esc_attr( get_search_query() ); ?>" />
		</form>
	</div>
</header>

<main id="content">
