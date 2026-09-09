<?php
/**
 * The Idea Part block's render callback.
 *
 * Every branch reads from the CURRENT post in the loop, so the same block
 * works inside the single-idea template, inside a query loop, and inside the
 * editor preview without any of them passing it an ID.
 *
 * Each part renders nothing at all when its field is empty, rather than a
 * heading over blank space. A section header with nothing under it reads as
 * broken, and on a library where 74 of 290 rows have thin bodies that is not a
 * rare edge case.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register it.
 */
function bbi_register_idea_part() {
	register_block_type(
		BBI_DIR . '/blocks/idea-part',
		array( 'render_callback' => 'bbi_render_idea_part' )
	);
}
add_action( 'init', 'bbi_register_idea_part' );

/**
 * The narrative sections, in the order that IS the product.
 *
 * The brief calls this "the four honest things": the promise, then who pays,
 * then how the money moves, then what hurts, then the verdict. Reordering it
 * changes what the page argues, so the order lives in one place rather than
 * being re-typed per template.
 *
 * @return array<string, string>
 */
function bbi_idea_sections() {
	return array(
		'bbi_market_opportunity'     => __( 'The opportunity', 'bbi' ),
		'bbi_target_customer'        => __( 'Who actually pays', 'bbi' ),
		'bbi_how_you_make_money'     => __( 'How the money works', 'bbi' ),
		'bbi_startup_cost'           => __( 'What it costs to start', 'bbi' ),
		'bbi_income_potential'       => __( 'What it can earn', 'bbi' ),
		'bbi_time_to_first_customer' => __( 'Time to the first customer', 'bbi' ),
		'bbi_competition_edge'       => __( 'Where the edge is', 'bbi' ),
	);
}

/**
 * Render one part of an idea.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function bbi_render_idea_part( $attributes ) {
	$a = wp_parse_args(
		is_array( $attributes ) ? $attributes : array(),
		array( 'part' => 'summary', 'heading' => '' )
	);

	$post_id = get_the_ID();
	if ( ! $post_id ) {
		return '';
	}

	$heading = trim( (string) $a['heading'] );
	$wrapper = get_block_wrapper_attributes();

	ob_start();

	switch ( $a['part'] ) {

		case 'breadcrumb':
			$term = bbi_category_term( $post_id );
			?>
			<nav <?php echo wp_kses_data( $wrapper ); ?> class="t-meta" aria-label="<?php esc_attr_e( 'Breadcrumb', 'bbi' ); ?>">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'bbi' ); ?></a>
				<?php if ( $term ) : ?>
					<span aria-hidden> / </span>
					<a href="<?php echo esc_url( get_term_link( $term ) ); ?>"><?php echo esc_html( $term->name ); ?></a>
				<?php endif; ?>
			</nav>
			<?php
			break;

		case 'category':
			$term = bbi_category_term( $post_id );
			if ( $term ) {
				printf( '<p %s class="t-eyebrow">%s</p>', wp_kses_data( $wrapper ), esc_html( $term->name ) );
			}
			break;

		case 'summary':
			$summary = trim( (string) get_post_meta( $post_id, 'bbi_summary', true ) );
			if ( '' === $summary ) {
				// The importer writes the summary into post_content, so a row
				// imported before the meta field existed still has one.
				$summary = trim( wp_strip_all_tags( (string) get_post_field( 'post_content', $post_id ) ) );
			}
			if ( '' !== $summary ) {
				printf( '<p %s class="t-lead max-w-3xl">%s</p>', wp_kses_data( $wrapper ), esc_html( $summary ) );
			}
			break;

		case 'trend':
			$score = bbi_trend_score( $post_id );
			// null, not 0. Zero is a real score; absent means unscored, and
			// drawing an empty bar for it reads as "no demand".
			if ( null !== $score ) {
				?>
				<div <?php echo wp_kses_data( $wrapper ); ?> class="max-w-xs">
					<p class="t-meta tabular-nums text-hl-teal">
						<?php echo esc_html( '' !== $heading ? $heading : __( 'Trend score', 'bbi' ) ); ?>
						<?php echo absint( $score ); ?><span class="opacity-55">/100</span>
					</p>
					<?php bbi_trend_bar( $score ); ?>
				</div>
				<?php
			}
			break;

		case 'sections':
			echo '<div ' . wp_kses_data( $wrapper ) . '>';
			foreach ( bbi_idea_sections() as $key => $label ) {
				$value = trim( (string) get_post_meta( $post_id, $key, true ) );
				if ( '' === $value ) {
					continue;
				}
				printf(
					'<section class="mt-12"><h2>%s</h2><p class="t-lead mt-4 max-w-3xl">%s</p></section>',
					esc_html( $label ),
					esc_html( $value )
				);
			}
			echo '</div>';
			break;

		case 'proscons':
			$pros = bbi_get_json( $post_id, 'bbi_pros_json' );
			$cons = bbi_get_json( $post_id, 'bbi_cons_json' );
			if ( empty( $pros ) && empty( $cons ) ) {
				break;
			}
			?>
			<div <?php echo wp_kses_data( $wrapper ); ?> class="bbi-grid sm:grid-cols-2">
				<?php if ( ! empty( $pros ) ) : ?>
					<div class="mo-card glass bbi-card-pad rounded-2xl">
						<h2 class="t-card"><?php esc_html_e( 'What works', 'bbi' ); ?></h2>
						<ul class="mt-3 space-y-2">
							<?php foreach ( $pros as $item ) : ?>
								<li class="text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( (string) $item ); ?></li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endif; ?>
				<?php if ( ! empty( $cons ) ) : ?>
					<div class="mo-card glass bbi-card-pad rounded-2xl">
						<h2 class="t-card"><?php esc_html_e( 'What will hurt', 'bbi' ); ?></h2>
						<ul class="mt-3 space-y-2">
							<?php foreach ( $cons as $item ) : ?>
								<li class="text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( (string) $item ); ?></li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endif; ?>
			</div>
			<?php
			break;

		case 'steps':
		case 'tools':
			$key   = 'steps' === $a['part'] ? 'bbi_getting_started_steps' : 'bbi_tools_needed';
			$title = 'steps' === $a['part'] ? __( 'Getting started', 'bbi' ) : __( 'What you need', 'bbi' );
			$items = bbi_get_json( $post_id, $key );
			if ( empty( $items ) ) {
				break;
			}
			echo '<section ' . wp_kses_data( $wrapper ) . ' class="mt-12">';
			printf( '<h2>%s</h2>', esc_html( '' !== $heading ? $heading : $title ) );
			bbi_render_list( $post_id, $key, 'mt-4 space-y-2' );
			echo '</section>';
			break;

		case 'verdict':
			$verdict = trim( (string) get_post_meta( $post_id, 'bbi_verdict', true ) );
			if ( '' === $verdict ) {
				break;
			}
			?>
			<section <?php echo wp_kses_data( $wrapper ); ?> class="mt-12">
				<p class="t-eyebrow"><?php esc_html_e( 'Straight answer', 'bbi' ); ?></p>
				<h2 class="mt-3"><?php echo esc_html( '' !== $heading ? $heading : __( 'Build it, or walk away', 'bbi' ) ); ?></h2>
				<p class="t-lead mt-4 max-w-3xl"><?php echo esc_html( $verdict ); ?></p>
			</section>
			<?php
			break;

		case 'faq':
			$faqs = bbi_get_json( $post_id, 'bbi_faq_json' );
			if ( empty( $faqs ) ) {
				break;
			}
			echo '<section ' . wp_kses_data( $wrapper ) . ' class="mt-12">';
			printf( '<h2>%s</h2>', esc_html( '' !== $heading ? $heading : __( 'Questions people ask', 'bbi' ) ) );
			bbi_render_list( $post_id, 'bbi_faq_json', 'mt-6 space-y-3' );
			echo '</section>';
			break;
	}

	$out = (string) ob_get_clean();

	// In the editor an empty part is confusing — the block looks broken rather
	// than correctly hiding an empty field. On the front end it stays silent.
	if ( '' === trim( $out ) && defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return '<p class="t-meta">' . sprintf(
			/* translators: %s: the part name. */
			esc_html__( 'Nothing to show for "%s" on this idea — the field is empty, so it renders nothing on the live page.', 'bbi' ),
			esc_html( $a['part'] )
		) . '</p>';
	}

	return $out;
}
