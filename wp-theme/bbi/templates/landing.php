<?php
/**
 * Template Name: Landing page, no header or footer chrome
 * Template Post Type: page
 *
 * Nothing but the content, for a page that supplies its own navigation — a
 * campaign page, a standalone signup.
 *
 * The skip link and `wp_head()` / `wp_footer()` stay. Dropping `wp_footer()`
 * to make a page "clean" silently breaks every plugin that enqueues a script,
 * and the failure appears somewhere else entirely.
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
<body <?php body_class( 'bbi-landing' ); ?>>
<?php wp_body_open(); ?>

<main id="content" class="bbi-container px-3 py-10 sm:px-4 sm:py-14">
	<?php
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
	?>
</main>

<?php wp_footer(); ?>
</body>
</html>
