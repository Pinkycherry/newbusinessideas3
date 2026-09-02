<?php
/**
 * Single page.
 *
 * The static pages on the original site — about, contact, privacy, terms,
 * disclaimer — are prose in a single column. There is no reason for them to
 * carry the library's grid, so this template is deliberately plain: one
 * measure-limited column, the shared type roles, nothing else.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<div class="mx-auto max-w-3xl px-3 py-10 sm:px-4 sm:py-14">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article>
			<h1><?php the_title(); ?></h1>

			<?php if ( has_excerpt() ) : ?>
				<p class="t-lead mt-4"><?php echo esc_html( get_the_excerpt() ); ?></p>
			<?php endif; ?>

			<div class="wp-prose mt-8">
				<?php the_content(); ?>
			</div>
		</article>
		<?php
	endwhile;
	?>
</div>

<?php
get_footer();
