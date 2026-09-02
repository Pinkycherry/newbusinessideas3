<?php
/**
 * A category listing, rendered straight from Supabase.
 *
 * Reached only through `inc/routing.php`, which has already confirmed the
 * category returns rows.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

$bbi_rows  = isset( $GLOBALS['bbi_live_rows'] ) ? $GLOBALS['bbi_live_rows'] : array();
$bbi_cards = array_map( 'bbi_card_from_row', $bbi_rows );
$bbi_name  = ! empty( $bbi_rows[0]['category_name'] ) ? $bbi_rows[0]['category_name'] : '';
$bbi_total = isset( $GLOBALS['bbi_live_total'] ) ? (int) $GLOBALS['bbi_live_total'] : 0;
$bbi_paged = isset( $GLOBALS['bbi_live_paged'] ) ? (int) $GLOBALS['bbi_live_paged'] : 1;
$bbi_more  = ! empty( $GLOBALS['bbi_live_more'] );

get_header();
bbi_layout_open();
?>

<div class="py-10 sm:py-14">
	<section>
		<p class="t-eyebrow"><?php esc_html_e( 'Category', 'bbi' ); ?></p>
		<h1 class="mt-3"><?php echo esc_html( $bbi_name ); ?></h1>
		<p class="t-meta mt-3">
			<?php
			// The count for the CATEGORY, not for this page. Printing the page
			// size here told a visitor a 90-idea category held 24.
			$bbi_shown = $bbi_total > 0 ? $bbi_total : count( $bbi_cards );
			printf(
				/* translators: %d: number of researched blueprints. */
				esc_html( _n( '%d researched blueprint', '%d researched blueprints', $bbi_shown, 'bbi' ) ),
				absint( $bbi_shown )
			);
			?>
		</p>
	</section>

	<div class="mt-8 <?php echo esc_attr( bbi_grid_classes() ); ?>">
		<?php foreach ( $bbi_cards as $bbi_card ) : ?>
			<?php bbi_render_card( $bbi_card ); ?>
		<?php endforeach; ?>
	</div>

	<?php if ( $bbi_paged > 1 || $bbi_more ) : ?>
		<nav class="mt-10 flex items-center gap-3" aria-label="<?php esc_attr_e( 'Pagination', 'bbi' ); ?>">
			<?php if ( $bbi_paged > 1 ) : ?>
				<a class="glass-pill rounded-full px-4 py-2 text-sm" href="<?php echo esc_url( bbi_live_page_url( $bbi_paged - 1 ) ); ?>"><?php esc_html_e( 'Previous', 'bbi' ); ?></a>
			<?php endif; ?>
			<?php if ( $bbi_more ) : ?>
				<a class="glass-pill rounded-full px-4 py-2 text-sm" href="<?php echo esc_url( bbi_live_page_url( $bbi_paged + 1 ) ); ?>"><?php esc_html_e( 'Next', 'bbi' ); ?></a>
			<?php endif; ?>
			<span class="t-meta"><?php printf( esc_html__( 'Page %d', 'bbi' ), absint( $bbi_paged ) ); ?></span>
		</nav>
	<?php endif; ?>

	<p class="t-meta mt-8">
		<?php esc_html_e( 'Read live from Supabase. Run the importer to edit these in WordPress.', 'bbi' ); ?>
	</p>
</div>

<?php
bbi_layout_close();
get_footer();
