<?php
/**
 * Site footer.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;
?>
</main>

<footer class="mx-auto mt-20 max-w-6xl px-3 py-12 sm:px-4">
	<div class="glass rounded-3xl p-6 sm:p-9">
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
		<div class="mt-6">
			<p class="text-muted-foreground">
				&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Bro Business Ideas &middot; businessidea.io
			</p>
			<p class="mt-1 text-muted-foreground/80">
				<?php esc_html_e( 'Made in India, for everyone starting from zero. We were there too.', 'bbi' ); ?>
			</p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
