<?php
/**
 * Search form.
 *
 * WordPress renders its own markup for `get_search_form()` unless a theme
 * supplies this file, and core's markup carries none of the design system's
 * classes. Overriding it keeps every search box on the site looking the same.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

$bbi_id = 'bbi-search-' . wp_unique_id();
?>
<form class="flex gap-2" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="sr-only" for="<?php echo esc_attr( $bbi_id ); ?>"><?php esc_html_e( 'Search ideas', 'bbi' ); ?></label>
	<input class="glass w-full rounded-full px-4 py-2.5 text-sm" id="<?php echo esc_attr( $bbi_id ); ?>"
		type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>"
		placeholder="<?php esc_attr_e( 'Search ideas...', 'bbi' ); ?>" />
	<button class="glass-pill rounded-full px-5 py-2.5 text-sm font-semibold" type="submit">
		<?php esc_html_e( 'Search', 'bbi' ); ?>
	</button>
</form>
