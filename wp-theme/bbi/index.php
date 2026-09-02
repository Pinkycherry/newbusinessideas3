<?php
/**
 * Fallback template — also serves the idea archive, taxonomy archives and
 * search results.
 *
 * When WordPress has no ideas yet and the data source allows it, the listing
 * is drawn from live Supabase instead of from the loop. That is the whole
 * point of the fallback source: a freshly activated theme shows the real
 * library rather than "Nothing here yet".
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

get_header();

$bbi_term = is_tax() ? get_queried_object() : null;
$bbi_live = ( 'live' === bbi_source() ) && ! is_search();
?>

<?php bbi_layout_open(); ?>

<div class="py-10 sm:py-14">

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
			<h1 class="mt-3">
				<?php
				/* translators: %s: the search term. */
				printf( esc_html__( 'Results for %s', 'bbi' ), esc_html( get_search_query() ) );
				?>
			</h1>
		<?php else : ?>
			<p class="t-eyebrow"><?php esc_html_e( 'The library', 'bbi' ); ?></p>
			<h1 class="mt-3"><?php esc_html_e( 'Every researched business idea.', 'bbi' ); ?></h1>
		<?php endif; ?>
	</section>

	<?php
	// The live path. Only reached when the site has no imported ideas, so it
	// can never hide content that exists in WordPress.
	if ( $bbi_live ) :
		$bbi_cards = $bbi_term
			? array_map( 'bbi_card_from_row', bbi_sb_category( $bbi_term->slug, 60 )['rows'] )
			: bbi_get_trending( 60 );
		?>
		<?php if ( ! empty( $bbi_cards ) ) : ?>
			<div class="mt-8 <?php echo esc_attr( bbi_grid_classes() ); ?>">
				<?php foreach ( $bbi_cards as $bbi_card ) : ?>
					<?php bbi_render_card( $bbi_card ); ?>
				<?php endforeach; ?>
			</div>
			<p class="t-meta mt-8">
				<?php esc_html_e( 'Read live from Supabase. Run the importer to edit these in WordPress.', 'bbi' ); ?>
			</p>
		<?php else : ?>
			<p class="t-lead mt-8">
				<?php esc_html_e( 'Supabase returned nothing for this listing. Check the connection under Settings → BBI Data.', 'bbi' ); ?>
			</p>
		<?php endif; ?>

	<?php elseif ( have_posts() ) : ?>
		<div class="mt-8 <?php echo esc_attr( bbi_grid_classes() ); ?>">
			<?php
			while ( have_posts() ) :
				the_post();
				bbi_render_card( bbi_card_from_post( get_the_ID() ) );
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

<?php bbi_layout_close(); ?>

<?php
get_footer();
