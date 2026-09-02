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

get_header();
bbi_layout_open();
?>

<div class="py-10 sm:py-14">
	<section>
		<p class="t-eyebrow"><?php esc_html_e( 'Category', 'bbi' ); ?></p>
		<h1 class="mt-3"><?php echo esc_html( $bbi_name ); ?></h1>
		<p class="t-meta mt-3">
			<?php
			printf(
				/* translators: %d: number of researched blueprints. */
				esc_html( _n( '%d researched blueprint', '%d researched blueprints', count( $bbi_cards ), 'bbi' ) ),
				absint( count( $bbi_cards ) )
			);
			?>
		</p>
	</section>

	<div class="mt-8 <?php echo esc_attr( bbi_grid_classes() ); ?>">
		<?php foreach ( $bbi_cards as $bbi_card ) : ?>
			<?php bbi_render_card( $bbi_card ); ?>
		<?php endforeach; ?>
	</div>

	<p class="t-meta mt-8">
		<?php esc_html_e( 'Read live from Supabase. Run the importer to edit these in WordPress.', 'bbi' ); ?>
	</p>
</div>

<?php
bbi_layout_close();
get_footer();
