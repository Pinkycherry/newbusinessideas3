<?php
/**
 * Template Name: Full width, no sidebar
 * Template Post Type: page, post, bbi_idea
 *
 * The sidebar opt-out for a single page. `bbi_current_sidebar()` checks for
 * this template by name and returns null, so the page renders edge to edge
 * whatever the global sidebar setting is.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<div class="bbi-container px-3 py-10 sm:px-4 sm:py-14">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article>
			<h1><?php the_title(); ?></h1>

			<?php if ( has_excerpt() ) : ?>
				<p class="t-lead mt-4 bbi-prose-w"><?php echo esc_html( get_the_excerpt() ); ?></p>
			<?php endif; ?>

			<div class="wp-prose mt-8"><?php the_content(); ?></div>
		</article>
		<?php
	endwhile;
	?>
</div>

<?php
get_footer();
