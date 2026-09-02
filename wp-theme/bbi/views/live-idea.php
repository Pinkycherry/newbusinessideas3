<?php
/**
 * One idea, rendered straight from Supabase.
 *
 * Reached only through `inc/routing.php`, which has already confirmed the row
 * exists. The section order matches `single-bbi_idea.php` exactly — the order
 * is the product, and two templates telling the same story in different orders
 * would be a real inconsistency rather than a cosmetic one.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

$bbi_row = isset( $GLOBALS['bbi_live_row'] ) ? $GLOBALS['bbi_live_row'] : array();

/**
 * A field, trimmed, or ''.
 *
 * @param array  $row Row.
 * @param string $key Column.
 * @return string
 */
function bbi_live_field( $row, $key ) {
	return isset( $row[ $key ] ) ? trim( (string) $row[ $key ] ) : '';
}

/**
 * A jsonb column as a PHP array.
 *
 * Decodes twice when the first pass yields a string: `research_facts` is a
 * jsonb holding a JSON *string* rather than a JSON object, and a single decode
 * returns that string rather than the list inside it.
 *
 * @param array  $row Row.
 * @param string $key Column.
 * @return array
 */
function bbi_live_list( $row, $key ) {
	if ( ! isset( $row[ $key ] ) ) {
		return array();
	}
	$value = $row[ $key ];
	if ( is_string( $value ) ) {
		$value = json_decode( $value, true );
	}
	if ( is_string( $value ) ) {
		$value = json_decode( $value, true );
	}
	return is_array( $value ) ? $value : array();
}

$bbi_score = ( isset( $bbi_row['trend_score'] ) && '' !== $bbi_row['trend_score'] && null !== $bbi_row['trend_score'] )
	? (int) $bbi_row['trend_score']
	: null;

get_header();
bbi_layout_open();
?>

<article class="py-10 sm:py-14">

	<nav class="t-meta" aria-label="<?php esc_attr_e( 'Breadcrumb', 'bbi' ); ?>">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'bbi' ); ?></a>
		<?php if ( '' !== bbi_live_field( $bbi_row, 'category_slug' ) ) : ?>
			<span aria-hidden> / </span>
			<a href="<?php echo esc_url( home_url( '/category/' . sanitize_title( $bbi_row['category_slug'] ) . '/' ) ); ?>">
				<?php echo esc_html( bbi_live_field( $bbi_row, 'category_name' ) ); ?>
			</a>
		<?php endif; ?>
	</nav>

	<header class="mt-6">
		<?php if ( '' !== bbi_live_field( $bbi_row, 'category_name' ) ) : ?>
			<p class="t-eyebrow"><?php echo esc_html( $bbi_row['category_name'] ); ?></p>
		<?php endif; ?>

		<h1 class="mt-3"><?php echo esc_html( bbi_live_field( $bbi_row, 'title' ) ); ?></h1>

		<?php if ( '' !== bbi_live_field( $bbi_row, 'summary' ) ) : ?>
			<p class="t-lead mt-5 max-w-3xl"><?php echo esc_html( $bbi_row['summary'] ); ?></p>
		<?php endif; ?>

		<?php if ( null !== $bbi_score ) : ?>
			<div class="mt-6 max-w-xs">
				<p class="t-meta tabular-nums text-hl-teal">
					<?php esc_html_e( 'Trend score', 'bbi' ); ?>
					<?php echo absint( $bbi_score ); ?><span class="opacity-55">/100</span>
				</p>
				<?php bbi_trend_bar( $bbi_score ); ?>
			</div>
		<?php endif; ?>
	</header>

	<?php
	// Same order as the imported template: the promise, who pays, how the
	// money moves, what hurts, then the verdict.
	$bbi_sections = array(
		'market_opportunity'    => __( 'The opportunity', 'bbi' ),
		'target_customer'       => __( 'Who actually pays', 'bbi' ),
		'how_you_make_money'    => __( 'How the money works', 'bbi' ),
		'startup_cost'          => __( 'What it costs to start', 'bbi' ),
		'income_potential'      => __( 'What it can earn', 'bbi' ),
		'time_to_first_customer' => __( 'Time to the first customer', 'bbi' ),
		'competition_edge'      => __( 'Where the edge is', 'bbi' ),
	);

	foreach ( $bbi_sections as $bbi_key => $bbi_heading ) :
		$bbi_value = bbi_live_field( $bbi_row, $bbi_key );
		if ( '' === $bbi_value ) {
			// A heading over blank space reads as broken, so the whole section
			// is skipped rather than rendered empty.
			continue;
		}
		?>
		<section class="mt-12">
			<h2><?php echo esc_html( $bbi_heading ); ?></h2>
			<p class="t-lead mt-4 max-w-3xl"><?php echo esc_html( $bbi_value ); ?></p>
		</section>
	<?php endforeach; ?>

	<?php
	$bbi_pros = bbi_live_list( $bbi_row, 'pros_json' );
	$bbi_cons = bbi_live_list( $bbi_row, 'cons_json' );
	if ( ! empty( $bbi_pros ) || ! empty( $bbi_cons ) ) :
		?>
		<section class="mt-12 bbi-grid sm:grid-cols-2">
			<?php if ( ! empty( $bbi_pros ) ) : ?>
				<div class="mo-card glass bbi-card-pad rounded-2xl">
					<h2 class="t-card"><?php esc_html_e( 'What works', 'bbi' ); ?></h2>
					<ul class="mt-3 space-y-2">
						<?php foreach ( $bbi_pros as $bbi_item ) : ?>
							<li class="text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( (string) $bbi_item ); ?></li>
						<?php endforeach; ?>
					</ul>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $bbi_cons ) ) : ?>
				<div class="mo-card glass bbi-card-pad rounded-2xl">
					<h2 class="t-card"><?php esc_html_e( 'What will hurt', 'bbi' ); ?></h2>
					<ul class="mt-3 space-y-2">
						<?php foreach ( $bbi_cons as $bbi_item ) : ?>
							<li class="text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( (string) $bbi_item ); ?></li>
						<?php endforeach; ?>
					</ul>
				</div>
			<?php endif; ?>
		</section>
	<?php endif; ?>

	<?php if ( '' !== bbi_live_field( $bbi_row, 'verdict' ) ) : ?>
		<section class="mt-12">
			<p class="t-eyebrow"><?php esc_html_e( 'Straight answer', 'bbi' ); ?></p>
			<h2 class="mt-3"><?php esc_html_e( 'Build it, or walk away', 'bbi' ); ?></h2>
			<p class="t-lead mt-4 max-w-3xl"><?php echo esc_html( $bbi_row['verdict'] ); ?></p>
		</section>
	<?php endif; ?>

	<p class="t-meta mt-14">
		<?php esc_html_e( 'Read live from Supabase. Run the importer to edit this page in WordPress.', 'bbi' ); ?>
	</p>
</article>

<?php
bbi_layout_close();
get_footer();
