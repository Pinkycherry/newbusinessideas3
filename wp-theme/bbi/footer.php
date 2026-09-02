<?php
/**
 * Site footer.
 *
 * Driven from Customizer → BBI Layout → Footer. The column count is a setting,
 * but an empty column is never drawn: a footer with three headings and two
 * boxes of nothing reads as a half-loaded page.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

$bbi_cols = (int) get_theme_mod( 'bbi_footer_columns', 3 );

$bbi_active = array();
for ( $bbi_i = 1; $bbi_i <= $bbi_cols; $bbi_i++ ) {
	if ( is_active_sidebar( 'bbi-footer-' . $bbi_i ) ) {
		$bbi_active[] = 'bbi-footer-' . $bbi_i;
	}
}

// Written as a lookup, not interpolated. Tailwind compiles utilities by
// scanning source text, so `sm:grid-cols-{$n}` appears in no file and would
// never be generated — the footer would silently stay one column wide.
$bbi_col_class = array(
	1 => '',
	2 => 'sm:grid-cols-2',
	3 => 'sm:grid-cols-2 lg:grid-cols-3',
	4 => 'sm:grid-cols-2 lg:grid-cols-4',
);
?>
</main>

<footer class="bbi-container mt-20 px-3 py-12 sm:px-4">
	<div class="glass rounded-3xl bbi-card-pad">

		<?php if ( ! empty( $bbi_active ) ) : ?>
			<div class="bbi-grid <?php echo esc_attr( isset( $bbi_col_class[ count( $bbi_active ) ] ) ? $bbi_col_class[ count( $bbi_active ) ] : 'sm:grid-cols-2 lg:grid-cols-3' ); ?> mb-8">
				<?php foreach ( $bbi_active as $bbi_id ) : ?>
					<div class="bbi-widget-area"><?php dynamic_sidebar( $bbi_id ); ?></div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php if ( get_theme_mod( 'bbi_footer_menu', true ) ) : ?>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'container'      => false,
					'menu_class'     => 'flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground',
					'depth'          => 1,
					'fallback_cb'    => false,
				)
			);
			?>
		<?php endif; ?>

		<div class="mt-6">
			<p class="text-muted-foreground">
				<?php
				printf(
					'&copy; %1$s %2$s',
					esc_html( gmdate( 'Y' ) ),
					esc_html( get_theme_mod( 'bbi_footer_copyright', 'Bro Business Ideas · businessidea.io' ) )
				);
				?>
			</p>

			<?php $bbi_tagline = trim( (string) get_theme_mod( 'bbi_footer_tagline', 'Made in India, for everyone starting from zero. We were there too.' ) ); ?>
			<?php if ( '' !== $bbi_tagline ) : ?>
				<p class="mt-1 text-muted-foreground/80"><?php echo esc_html( $bbi_tagline ); ?></p>
			<?php endif; ?>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
