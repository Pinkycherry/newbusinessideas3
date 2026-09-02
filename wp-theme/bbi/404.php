<?php
/**
 * 404.
 *
 * A dead end on a library of 290 pages should hand back a route, not an
 * apology. This offers the two things that actually recover the visit: the
 * search box, and the categories. Nothing is invented here — the terms come
 * from the taxonomy, so the list can never name a category that does not exist.
 * Two hand-typed slugs already shipped broken once in this project.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

get_header();

$bbi_terms = get_terms(
	array(
		'taxonomy'   => 'bbi_category',
		'hide_empty' => true,
		'number'     => 12,
		'orderby'    => 'count',
		'order'      => 'DESC',
	)
);
?>

<div class="mx-auto max-w-3xl px-3 py-16 sm:px-4 sm:py-24">
	<p class="t-eyebrow"><?php esc_html_e( 'Page not found', 'bbi' ); ?></p>
	<h1 class="mt-3"><?php esc_html_e( 'That page has moved or never existed.', 'bbi' ); ?></h1>
	<p class="t-lead mt-4">
		<?php esc_html_e( 'The library is still here. Search it, or start from a category below.', 'bbi' ); ?>
	</p>

	<form class="mt-8 flex gap-2" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
		<label class="sr-only" for="bbi-404-s"><?php esc_html_e( 'Search ideas', 'bbi' ); ?></label>
		<input class="glass w-full rounded-full px-4 py-2.5 text-sm" id="bbi-404-s" type="search" name="s"
			placeholder="<?php esc_attr_e( 'Search ideas...', 'bbi' ); ?>" />
		<button class="glass-pill rounded-full px-5 py-2.5 text-sm font-semibold" type="submit">
			<?php esc_html_e( 'Search', 'bbi' ); ?>
		</button>
	</form>

	<?php if ( ! is_wp_error( $bbi_terms ) && ! empty( $bbi_terms ) ) : ?>
		<ul class="mt-10 flex flex-wrap gap-2">
			<?php foreach ( $bbi_terms as $bbi_term ) : ?>
				<li>
					<a class="mo-card glass glass-hover inline-block rounded-full px-4 py-2 text-sm"
						href="<?php echo esc_url( get_term_link( $bbi_term ) ); ?>">
						<?php echo esc_html( $bbi_term->name ); ?>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>

<?php
get_footer();
