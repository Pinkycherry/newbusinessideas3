<?php
/**
 * Fallback template — also serves the idea archive and taxonomy archives.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

get_header();

$bbi_term = is_tax() ? get_queried_object() : null;
?>

<div class="mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-14">

	<section>
		<?php if ( $bbi_term ) : ?>
			<p class="t-eyebrow"><?php esc_html_e( 'Category', 'bbi' ); ?></p>
			<h1 class="mt-3"><?php echo esc_html( $bbi_term->name ); ?></h1>
			<?php if ( $bbi_term->description ) : ?>
				<p class="t-lead mt-4 max-w-3xl"><?php echo esc_html( $bbi_term->description ); ?></p>
			<?php endif; ?>
			<p class="t-meta mt-3">
				<?php
				printf(
					/* translators: %d: number of researched blueprints. */
					esc_html( _n( '%d researched blueprint', '%d researched blueprints', (int) $bbi_term->count, 'bbi' ) ),
					absint( $bbi_term->count )
				);
				?>
			</p>
		<?php elseif ( is_search() ) : ?>
			<p class="t-eyebrow"><?php esc_html_e( 'Search', 'bbi' ); ?></p>
			<h1 class="mt-3"><?php printf( esc_html__( 'Results for %s', 'bbi' ), esc_html( get_search_query() ) ); ?></h1>
		<?php else : ?>
			<p class="t-eyebrow"><?php esc_html_e( 'The library', 'bbi' ); ?></p>
			<h1 class="mt-3"><?php esc_html_e( 'Every researched business idea.', 'bbi' ); ?></h1>
		<?php endif; ?>
	</section>

	<?php if ( have_posts() ) : ?>
		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<?php
			while ( have_posts() ) :
				the_post();
				bbi_idea_card( get_the_ID() );
			endwhile;
			?>
		</div>

		<div class="mt-10">
			<?php
			the_posts_pagination(
				array(
					'mid_size'  => 2,
					'prev_text' => esc_html__( 'Previous', 'bbi' ),
					'next_text' => esc_html__( 'Next', 'bbi' ),
				)
			);
			?>
		</div>
	<?php else : ?>
		<p class="t-lead mt-8">
			<?php esc_html_e( 'Nothing here yet. If you searched, try a shorter phrase — the library is indexed by what a business actually does, not by buzzwords.', 'bbi' ); ?>
		</p>
	<?php endif; ?>

</div>

<?php
get_footer();
