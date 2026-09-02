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

/*
 * Live mode now covers SEARCH too. It did not, and the consequence was not
 * "search is limited" but "search returns nothing at all": excluding it sent
 * the request to the WordPress loop, which on a site that has not run the
 * importer holds zero ideas. Searching a library of 290 returned an empty page
 * every single time.
 */
$bbi_live   = ( 'live' === bbi_source() );
$bbi_search = get_search_query();

/*
 * Paging on the live path. There is no WP_Query here to carry `paged`, so it
 * is read from the request and passed to Supabase as an offset.
 */
$bbi_paged   = max( 1, (int) get_query_var( 'paged' ) ?: (int) get_query_var( 'page' ) );
$bbi_per     = 24;
$bbi_offset  = ( $bbi_paged - 1 ) * $bbi_per;
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
		/*
		 * One page at a time, not a hard cap. The previous code asked for 60
		 * rows and stopped, so a 290-idea library presented itself as a
		 * 60-idea library with no indication anything was missing — which is
		 * the worst kind of bug, because the page looks complete.
		 */
		if ( '' !== $bbi_search ) {
			$bbi_result = bbi_sb_search( $bbi_search, $bbi_per, $bbi_offset );
		} elseif ( $bbi_term ) {
			$bbi_result = bbi_sb_category( $bbi_term->slug, $bbi_per, $bbi_offset );
		} else {
			$bbi_result = bbi_sb_page( $bbi_per, $bbi_offset );
		}

		$bbi_cards = array_map( 'bbi_card_from_row', $bbi_result['rows'] );
		$bbi_total = isset( $bbi_result['total'] ) ? (int) $bbi_result['total'] : 0;
		$bbi_more  = count( $bbi_cards ) >= $bbi_per;
		?>
		<?php if ( ! empty( $bbi_cards ) ) : ?>
			<div class="mt-8 <?php echo esc_attr( bbi_grid_classes() ); ?>">
				<?php foreach ( $bbi_cards as $bbi_card ) : ?>
					<?php bbi_render_card( $bbi_card ); ?>
				<?php endforeach; ?>
			</div>
			<?php
			/*
			 * Prev/next rather than a numbered pager. A numbered pager needs a
			 * reliable total, and PostgREST only returns one when the count
			 * preference is enabled — printing "page 3 of 1" because the count
			 * came back null is worse than not printing it.
			 */
			if ( $bbi_paged > 1 || $bbi_more ) :
				?>
				<nav class="mt-10 flex items-center gap-3" aria-label="<?php esc_attr_e( 'Pagination', 'bbi' ); ?>">
					<?php if ( $bbi_paged > 1 ) : ?>
						<a class="glass-pill rounded-full px-4 py-2 text-sm" href="<?php echo esc_url( bbi_live_page_url( $bbi_paged - 1 ) ); ?>">
							<?php esc_html_e( 'Previous', 'bbi' ); ?>
						</a>
					<?php endif; ?>
					<?php if ( $bbi_more ) : ?>
						<a class="glass-pill rounded-full px-4 py-2 text-sm" href="<?php echo esc_url( bbi_live_page_url( $bbi_paged + 1 ) ); ?>">
							<?php esc_html_e( 'Next', 'bbi' ); ?>
						</a>
					<?php endif; ?>
					<span class="t-meta">
						<?php
						if ( $bbi_total > 0 ) {
							printf(
								/* translators: 1: current page, 2: total ideas. */
								esc_html__( 'Page %1$d of %2$d ideas', 'bbi' ),
								absint( $bbi_paged ),
								absint( $bbi_total )
							);
						} else {
							/* translators: %d: current page number. */
							printf( esc_html__( 'Page %d', 'bbi' ), absint( $bbi_paged ) );
						}
						?>
					</span>
				</nav>
			<?php endif; ?>

			<p class="t-meta mt-8">
				<?php esc_html_e( 'Read live from Supabase. Run the importer to edit these in WordPress.', 'bbi' ); ?>
			</p>
		<?php else : ?>
			<p class="t-lead mt-8">
				<?php
				if ( '' !== $bbi_search ) {
					esc_html_e( 'Nothing matched that. Try a shorter phrase — the library is indexed by what a business actually does, not by buzzwords.', 'bbi' );
				} else {
					esc_html_e( 'Supabase returned nothing for this listing. Check the connection under BBI → Data.', 'bbi' );
				}
				?>
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
