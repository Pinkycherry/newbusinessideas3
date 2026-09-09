<?php
/**
 * A single idea blueprint.
 *
 * Section order mirrors the original `idea.$slug.tsx`: the promise first, then
 * who pays, then how the money moves, then what hurts, then the verdict. That
 * order is the product — it is the sequence the brief calls "the four honest
 * things", and reordering it changes what the page argues.
 *
 * Every section renders only when its field has content, so a partially
 * generated row degrades to a shorter page rather than a broken one. 74 of the
 * 290 rows have thin bodies; this is what keeps them presentable.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

get_header();

bbi_layout_open();

while ( have_posts() ) :
	the_post();

	$bbi_id    = get_the_ID();
	$bbi_score = bbi_trend_score( $bbi_id );
	$bbi_term  = bbi_category_term( $bbi_id );
	?>

	<article class="py-10 sm:py-14">

		<nav class="t-meta" aria-label="<?php esc_attr_e( 'Breadcrumb', 'bbi' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'bbi' ); ?></a>
			<?php if ( $bbi_term ) : ?>
				<span aria-hidden> / </span>
				<a href="<?php echo esc_url( get_term_link( $bbi_term ) ); ?>"><?php echo esc_html( $bbi_term->name ); ?></a>
			<?php endif; ?>
		</nav>

		<header class="mt-6">
			<?php if ( $bbi_term ) : ?>
				<p class="t-eyebrow"><?php echo esc_html( $bbi_term->name ); ?></p>
			<?php endif; ?>

			<h1 class="mt-3"><?php the_title(); ?></h1>

			<?php
			$bbi_summary = get_post_meta( $bbi_id, 'bbi_summary', true );
			if ( $bbi_summary ) :
				?>
				<p class="t-lead mt-5 max-w-3xl"><?php echo esc_html( $bbi_summary ); ?></p>
			<?php endif; ?>

			<?php if ( null !== $bbi_score ) : ?>
				<dl class="mt-7 grid gap-3 sm:grid-cols-3">
					<div class="glass rounded-2xl p-4">
						<dt class="t-meta"><?php esc_html_e( 'Demand signal', 'bbi' ); ?></dt>
						<dd class="mt-1 text-2xl font-semibold text-hl-teal">
							<?php echo absint( $bbi_score ); ?><span class="opacity-55">/100</span>
						</dd>
					</div>
					<div class="glass rounded-2xl p-4">
						<dt class="t-meta"><?php esc_html_e( 'Cost to read this', 'bbi' ); ?></dt>
						<dd class="mt-1 text-2xl font-semibold text-hl-green"><?php esc_html_e( 'Free', 'bbi' ); ?></dd>
					</div>
					<?php
					$bbi_ttfc = get_post_meta( $bbi_id, 'bbi_time_to_first_customer', true );
					if ( $bbi_ttfc ) :
						?>
						<div class="glass rounded-2xl p-4">
							<dt class="t-meta"><?php esc_html_e( 'First customer', 'bbi' ); ?></dt>
							<dd class="mt-1 text-sm leading-relaxed"><?php echo esc_html( wp_trim_words( $bbi_ttfc, 14 ) ); ?></dd>
						</div>
					<?php endif; ?>
				</dl>
			<?php endif; ?>
		</header>

		<?php
		bbi_section( $bbi_id, 'bbi_target_customer', __( 'Who actually pays for this.', 'bbi' ), __( 'The customer', 'bbi' ) );
		bbi_section( $bbi_id, 'bbi_how_you_make_money', __( 'How the money moves.', 'bbi' ), __( 'The money', 'bbi' ) );
		bbi_section( $bbi_id, 'bbi_startup_cost', __( 'What it costs to start.', 'bbi' ), __( 'Startup cost', 'bbi' ) );
		bbi_section( $bbi_id, 'bbi_income_potential', __( 'What you can realistically earn.', 'bbi' ), __( 'Income', 'bbi' ) );
		bbi_section( $bbi_id, 'bbi_market_opportunity', __( 'Why there is room for this.', 'bbi' ), __( 'The opening', 'bbi' ) );
		bbi_section( $bbi_id, 'bbi_competition_edge', __( 'What the obvious version gets wrong.', 'bbi' ), __( 'The edge', 'bbi' ) );
		?>

		<?php $bbi_steps = bbi_get_json( $bbi_id, 'bbi_getting_started_steps' ); ?>
		<?php if ( $bbi_steps ) : ?>
			<section class="mt-12">
				<p class="t-eyebrow"><?php esc_html_e( 'Start here', 'bbi' ); ?></p>
				<h2 class="mt-3"><?php esc_html_e( 'The first steps, in order.', 'bbi' ); ?></h2>
				<ol class="mt-6 space-y-3">
					<?php foreach ( $bbi_steps as $bbi_i => $bbi_step ) : ?>
						<li class="mo-card glass flex gap-4 rounded-2xl p-5">
							<span class="t-meta shrink-0 tabular-nums text-hl-gold">
								<?php echo esc_html( str_pad( (string) ( $bbi_i + 1 ), 2, '0', STR_PAD_LEFT ) ); ?>
							</span>
							<p class="text-sm leading-relaxed"><?php echo esc_html( (string) $bbi_step ); ?></p>
						</li>
					<?php endforeach; ?>
				</ol>
			</section>
		<?php endif; ?>

		<?php
		$bbi_pros = bbi_get_json( $bbi_id, 'bbi_pros_json' );
		$bbi_cons = bbi_get_json( $bbi_id, 'bbi_cons_json' );
		if ( $bbi_pros || $bbi_cons ) :
			?>
			<section class="mt-12">
				<p class="t-eyebrow"><?php esc_html_e( 'Both sides', 'bbi' ); ?></p>
				<h2 class="mt-3"><?php esc_html_e( 'What helps, and what hurts.', 'bbi' ); ?></h2>
				<div class="mt-6 grid gap-4 sm:grid-cols-2">
					<?php if ( $bbi_pros ) : ?>
						<div class="mo-card glass rounded-2xl border border-border/60 p-5 sm:p-7">
							<p class="t-eyebrow hl-green"><?php esc_html_e( 'What works for you', 'bbi' ); ?></p>
							<ul class="mt-4 divide-y divide-hl-green/25 text-sm leading-relaxed">
								<?php foreach ( $bbi_pros as $bbi_p ) : ?>
									<li class="py-3 first:pt-0 last:pb-0"><?php echo esc_html( (string) $bbi_p ); ?></li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endif; ?>
					<?php if ( $bbi_cons ) : ?>
						<div class="mo-card glass rounded-2xl border border-border/60 p-5 sm:p-7">
							<p class="t-eyebrow hl-coral"><?php esc_html_e( 'What will hurt', 'bbi' ); ?></p>
							<ul class="mt-4 divide-y divide-hl-coral/20 text-sm leading-relaxed text-muted-foreground">
								<?php foreach ( $bbi_cons as $bbi_c ) : ?>
									<li class="py-3 first:pt-0 last:pb-0"><?php echo esc_html( (string) $bbi_c ); ?></li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endif; ?>
				</div>
			</section>
		<?php endif; ?>

		<?php $bbi_tools = bbi_get_json( $bbi_id, 'bbi_tools_needed' ); ?>
		<?php if ( $bbi_tools ) : ?>
			<section class="mt-12">
				<p class="t-eyebrow"><?php esc_html_e( 'What you need', 'bbi' ); ?></p>
				<h2 class="mt-3"><?php esc_html_e( 'The kit.', 'bbi' ); ?></h2>
				<ul class="mt-6 flex flex-wrap gap-2">
					<?php foreach ( $bbi_tools as $bbi_t ) : ?>
						<li class="glass rounded-full px-3.5 py-1.5 text-sm text-muted-foreground">
							<?php echo esc_html( (string) $bbi_t ); ?>
						</li>
					<?php endforeach; ?>
				</ul>
			</section>
		<?php endif; ?>

		<?php $bbi_verdict = get_post_meta( $bbi_id, 'bbi_verdict', true ); ?>
		<?php if ( $bbi_verdict ) : ?>
			<section class="mt-12">
				<div class="glass bbi-shape-soft-deep p-5 sm:p-9">
					<p class="t-eyebrow hl-gold"><?php esc_html_e( 'The verdict', 'bbi' ); ?></p>
					<h2 class="mt-3"><?php esc_html_e( 'Build it, or walk away.', 'bbi' ); ?></h2>
					<p class="t-lead mt-4 max-w-3xl"><?php echo esc_html( $bbi_verdict ); ?></p>
				</div>
			</section>
		<?php endif; ?>

		<?php $bbi_faqs = bbi_get_json( $bbi_id, 'bbi_faq_json' ); ?>
		<?php if ( $bbi_faqs ) : ?>
			<section class="mt-12">
				<p class="t-eyebrow"><?php esc_html_e( 'Questions', 'bbi' ); ?></p>
				<h2 class="mt-3"><?php esc_html_e( 'What people ask before they start.', 'bbi' ); ?></h2>
				<?php bbi_render_list( $bbi_id, 'bbi_faq_json', 'mt-6 space-y-3' ); ?>
			</section>
		<?php endif; ?>

	</article>

	<?php
endwhile;

bbi_layout_close();

get_footer();
