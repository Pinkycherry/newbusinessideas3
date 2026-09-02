<?php
/**
 * The homepage.
 *
 * A port of `src/routes/index.tsx`. The section order is the original's, and
 * the copy is carried across verbatim from `inc/home-content.php`.
 *
 * ------------------------------------------------------------------
 * GUTENBERG TAKES PRECEDENCE
 * ------------------------------------------------------------------
 *
 * WordPress picks `front-page.php` ahead of `page.php` even when a static page
 * is assigned as the front page, which would make that page uneditable — you
 * would set it in Settings → Reading, edit it in the block editor, and nothing
 * would ever change on the site. That is a genuinely baffling failure to be
 * handed, so it is handled here explicitly: assign a static front page and this
 * template steps aside for the page template, leaving the homepage fully
 * editable in Gutenberg with the BBI patterns.
 *
 * This coded homepage renders only when no static front page is set.
 *
 * ------------------------------------------------------------------
 * WHAT IS NOT PORTED, AND WHY
 * ------------------------------------------------------------------
 *
 * Four things from the original are deliberately absent rather than
 * approximated:
 *
 * - The GSAP converge on the comparison cards, the orbit diagrams and the
 *   category marquee. Those are React components driving bespoke timelines;
 *   the shared reveal in `motion.js` covers the rest of the page, and a
 *   half-imitation of a bespoke animation reads worse than none.
 * - The "Surprise me" picker, which needs a random-idea endpoint.
 * - The three editorial photographs, which are hotlinked from another domain.
 *   Use a Featured image or the media library instead of hotlinking.
 * - Ad slots.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

// See the note above: a static front page wins.
if ( 'page' === get_option( 'show_on_front' ) && (int) get_option( 'page_on_front' ) > 0 ) {
	get_template_part( 'page' );
	return;
}

get_header();

$bbi_catalog  = bbi_get_catalog();
$bbi_total    = bbi_get_total();
$bbi_featured = bbi_get_by_ids( array( 'IDEA-00022', 'IDEA-00012', 'IDEA-00021' ) );

// The featured strip names three specific ideas. If none of them are present —
// a partial import, a different dataset — the strip falls back to the top of
// the trend ranking rather than rendering an empty grid under a heading.
if ( empty( $bbi_featured ) ) {
	$bbi_featured = bbi_get_trending( 6 );
}

$bbi_comparison = bbi_home_comparison();
?>

<?php
/*
 * A crawlable summary of what this site is. Carried over from the original,
 * where it exists so a model reading the page has a plain statement of scope
 * that does not depend on parsing the design.
 */
?>
<p class="sr-only">
	<?php esc_html_e( 'BBI (Bro Business Ideas) is a business idea directory and startup intelligence library. This resource covers small business ideas, work from home business ideas, low investment startup ideas, business ideas for women, zero investment business ideas, and startup ideas organized by sector, investment level, and founder profile.', 'bbi' ); ?>
</p>

<?php /* ---------------------------------------------------------- HERO */ ?>
<section id="hero" class="bbi-field-host px-3 pt-10 pb-6 sm:px-4 sm:pt-16">
	<canvas class="bbi-field" aria-hidden="true"></canvas>

	<div class="bbi-container">
		<div class="glass bbi-hero-open px-6 py-14 sm:px-12 sm:py-20">
			<p class="t-eyebrow sm:text-xs"><?php esc_html_e( 'The Truth About Business Ideas', 'bbi' ); ?></p>

			<h1 class="mt-8 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
				<?php esc_html_e( 'Tired of paying just to check if your idea will work?', 'bbi' ); ?>
			</h1>

			<p data-wave class="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
				<?php esc_html_e( 'We built a free home for real business ideas — side hustles, zero investment ideas, work from home ideas, and low investment ideas. Every idea is researched, not guessed. We tell you who will actually pay you, how the money works, and what will hurt you in year one. Then we give it to you straight — build it, or walk away. Browse for free. Validate as many times as you want. Pay only once, if you ever want full access.', 'bbi' ); ?>
			</p>

			<div class="mt-8 flex flex-wrap items-center gap-3">
				<a class="glass flex min-w-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted-foreground"
					href="<?php echo esc_url( home_url( '/?s=' ) ); ?>">
					<span aria-hidden>⌕</span>
					<span><?php esc_html_e( 'Search idea blueprints…', 'bbi' ); ?></span>
				</a>
				<a class="glass-pill inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.18em]"
					href="<?php echo esc_url( get_post_type_archive_link( 'bbi_idea' ) ); ?>">
					<?php esc_html_e( 'Browse the library', 'bbi' ); ?>
				</a>
			</div>

			<div class="mt-10 bbi-grid sm:grid-cols-2">
				<?php foreach ( bbi_home_hero_panels() as $bbi_panel ) : ?>
					<div class="mo-card glass glass-hover bbi-card-pad">
						<h3 class="t-card"><?php echo esc_html( $bbi_panel['label'] ); ?></h3>
						<p class="t-lead mt-2.5"><?php echo esc_html( $bbi_panel['body'] ); ?></p>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>

<?php /* ------------------------------------------------- CATEGORY TICKER */ ?>
<?php if ( ! empty( $bbi_catalog['categories'] ) ) : ?>
	<section class="bbi-container px-3 pt-10 sm:px-4" aria-label="<?php esc_attr_e( 'Browse by category', 'bbi' ); ?>">
		<p class="t-eyebrow"><?php esc_html_e( 'Browse by category', 'bbi' ); ?></p>
		<div class="mt-4 flex flex-wrap gap-2">
			<?php foreach ( $bbi_catalog['categories'] as $bbi_cat ) : ?>
				<a class="glass-pill rounded-full px-4 py-2 text-xs font-medium" href="<?php echo esc_url( $bbi_cat['url'] ); ?>">
					<?php echo esc_html( $bbi_cat['name'] ); ?>
					<span class="opacity-55 tabular-nums"><?php echo absint( $bbi_cat['count'] ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</section>
<?php endif; ?>

<?php /* -------------------------------------------------- BRAND STATEMENT */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<div class="mo-card glass glass-hover relative overflow-hidden px-6 py-12 sm:px-14 sm:py-16">
		<p class="t-eyebrow"><?php esc_html_e( 'Who we are', 'bbi' ); ?></p>
		<h2 class="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl"><?php esc_html_e( 'BBI — Bro Business Ideas.', 'bbi' ); ?></h2>
		<p class="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
			<?php esc_html_e( 'We have been where you are. We paid for those $20 "validation" platforms too. We got a few generic lines back, spent our money, and got nothing real in return. When we asked for help, no one answered. That hurt. So we built the thing we needed back then — a free, honest library of small business ideas and side hustles, with real research, not empty hype. Browse for free, always. Validate as many times as you want, at no extra cost. Pay once — ₹199 for 3 months or ₹399 for life — only if you want full access. Never a monthly bill.', 'bbi' ); ?>
		</p>
	</div>
</section>

<?php /* ---------------------------------------------------- KEYWORD MOSAIC */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4" aria-label="<?php esc_attr_e( 'Browse ideas by keyword', 'bbi' ); ?>">
	<p class="t-eyebrow"><?php esc_html_e( 'Every angle covered', 'bbi' ); ?></p>
	<h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"><?php esc_html_e( 'Business ideas by industry, founder, and model', 'bbi' ); ?></h2>

	<div class="mt-6 bbi-grid md:grid-cols-2 lg:grid-cols-3">
		<?php foreach ( bbi_home_keyword_groups() as $bbi_group ) : ?>
			<div class="mo-card glass glass-hover bbi-shape-card-a bbi-card-pad h-full">
				<h3 class="text-xs font-semibold uppercase tracking-[0.25em] text-accent"><?php echo esc_html( $bbi_group['heading'] ); ?></h3>
				<div class="mt-4 grid grid-cols-2 content-start gap-2 lg:grid-cols-1 xl:grid-cols-2">
					<?php foreach ( $bbi_group['terms'] as $bbi_query => $bbi_label ) : ?>
						<a class="glass-pill min-w-0 rounded-full px-2.5 py-2 text-center text-[11px] font-medium leading-tight"
							href="<?php echo esc_url( home_url( '/?s=' . rawurlencode( $bbi_query ) ) ); ?>">
							<?php echo esc_html( $bbi_label ); ?>
						</a>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</section>

<?php /* -------------------------------------------------------- TRUST BAR */ ?>
<?php
/*
 * Only the blueprint count is a live figure, and only it gets treated as one.
 * The other two tiles are fixed facts with no query behind them, so they are
 * plain text — a number with no live source does not get presented as though
 * it were being counted.
 *
 * The 967 figure is a one-time pre-launch review group and its note says so in
 * the past tense; it deliberately carries no "+".
 */
$bbi_stats = array(
	array(
		'value' => number_format_i18n( $bbi_total ) . '+',
		'label' => __( 'Researched blueprints', 'bbi' ),
		/* translators: %d: number of live categories. */
		'note'  => sprintf( __( 'Across %d live categories, growing every week', 'bbi' ), count( $bbi_catalog['categories'] ) ),
	),
	array(
		'value' => '967',
		'label' => __( 'Founders reviewed us', 'bbi' ),
		'note'  => __( "Reviewed BBI's structure and functionality before we shipped it", 'bbi' ),
	),
	array(
		'value' => '2',
		'label' => __( 'Simple pricing plans', 'bbi' ),
		'note'  => __( '₹199 for 3 months, ₹399 for life. Pay once. No surprise bills, ever.', 'bbi' ),
	),
);
?>
<div class="bbi-container mt-8 bbi-grid px-3 sm:grid-cols-3 sm:px-4">
	<?php foreach ( $bbi_stats as $bbi_stat ) : ?>
		<div class="mo-card glass glass-hover bbi-card-pad text-center sm:text-left">
			<p class="text-3xl font-extrabold tracking-tight text-accent sm:text-4xl"><?php echo esc_html( $bbi_stat['value'] ); ?></p>
			<p class="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground"><?php echo esc_html( $bbi_stat['label'] ); ?></p>
			<p class="mt-1.5 text-xs leading-relaxed text-muted-foreground"><?php echo esc_html( $bbi_stat['note'] ); ?></p>
		</div>
	<?php endforeach; ?>
</div>

<?php /* ------------------------------------------------------- MARKET GAP */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<div class="mo-card glass glass-hover bbi-card-pad">
		<p class="t-eyebrow"><?php esc_html_e( 'The problem we found', 'bbi' ); ?></p>
		<h2 class="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><?php esc_html_e( 'Why is everyone still charging you $20 to check one idea?', 'bbi' ); ?></h2>
		<div class="mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
			<p><?php esc_html_e( 'Before we built BBI, we went looking for a place to check our own business ideas. Every place we found charged at least $20 for three or four "validations." It sounded like deep research. It wasn\'t. It was research you could run yourself, a hundred times over, with AI tools you already pay for.', 'bbi' ); ?></p>
			<p><?php esc_html_e( 'We are regular people. Most of us have full-time jobs and build BBI at night and on weekends, because we know what it feels like to stare at a $20 paywall with nothing left to spend. So we built the thing we wished someone had built for us.', 'bbi' ); ?></p>
		</div>
	</div>
</section>

<?php /* --------------------------------------------- THE RESEARCH STANDARD */ ?>
<section class="bbi-container mt-16 px-3 sm:mt-24 sm:px-4">
	<div class="mx-auto max-w-2xl text-center">
		<p class="t-eyebrow"><?php esc_html_e( 'The Research Standard', 'bbi' ); ?></p>
		<h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-4xl"><?php esc_html_e( 'Not just a list. Real research you can trust.', 'bbi' ); ?></h2>
		<p class="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"><?php esc_html_e( 'Before you spend a rupee or a weekend, check these 4 things on every idea.', 'bbi' ); ?></p>
	</div>

	<div class="mt-10 bbi-grid sm:grid-cols-2 lg:grid-cols-4">
		<?php foreach ( bbi_home_pillars() as $bbi_pillar ) : ?>
			<div class="mo-card glass bbi-card-pad flex flex-col rounded-2xl border border-border">
				<span class="text-xs font-extrabold tracking-widest text-accent"><?php echo esc_html( $bbi_pillar['num'] ); ?></span>
				<h3 class="mt-2 text-base font-bold text-foreground"><?php echo esc_html( $bbi_pillar['title'] ); ?></h3>
				<p class="mt-2 text-xs leading-relaxed text-muted-foreground"><?php echo esc_html( $bbi_pillar['desc'] ); ?></p>
			</div>
		<?php endforeach; ?>
	</div>

	<div class="mt-8 text-center">
		<a class="glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-[0.18em]"
			href="<?php echo esc_url( get_post_type_archive_link( 'bbi_idea' ) ); ?>">
			<?php esc_html_e( 'Explore All Categories', 'bbi' ); ?>
		</a>
	</div>
</section>

<?php /* --------------------------------------------------------- FEATURED */ ?>
<?php if ( ! empty( $bbi_featured ) ) : ?>
	<section class="bbi-container px-3 py-16 sm:px-4">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="t-eyebrow"><?php esc_html_e( 'Featured blueprints', 'bbi' ); ?></p>
				<h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"><?php esc_html_e( 'Blueprints worth your afternoon', 'bbi' ); ?></h2>
			</div>
			<a class="text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
				href="<?php echo esc_url( get_post_type_archive_link( 'bbi_idea' ) ); ?>">
				<?php esc_html_e( 'Browse the full library →', 'bbi' ); ?>
			</a>
		</div>
		<div class="mt-6 <?php echo esc_attr( bbi_grid_classes() ); ?>">
			<?php foreach ( $bbi_featured as $bbi_card ) : ?>
				<?php bbi_render_card( $bbi_card ); ?>
			<?php endforeach; ?>
		</div>
	</section>
<?php endif; ?>

<?php /* ---------------------------------------------------- WHY THIS EXISTS */ ?>
<section class="bbi-container px-3 pb-10 sm:px-4">
	<div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
		<div>
			<p class="t-eyebrow"><?php esc_html_e( 'Why this exists', 'bbi' ); ?></p>
			<h2 class="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><?php esc_html_e( 'A list of ideas is not research. And it can cost you money.', 'bbi' ); ?></h2>
			<div class="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
				<p><?php esc_html_e( 'Most "100 business ideas" pages are written in one afternoon by someone who never actually sold anything. They just say "the market is growing" and stop there. Finding an idea was never the hard part. The hard part is knowing who will really pay you, how often, and what happens when a bigger company copies you for free.', 'bbi' ); ?></p>
				<p><?php esc_html_e( 'That is why every blueprint here answers those questions first. We name your exact customer. We show you the real numbers. We tell you the risks most people only find out after they\'ve already spent their money.', 'bbi' ); ?></p>
				<p><?php esc_html_e( "Sometimes the honest answer is: don't build this one. That's the whole point. Research that only ever agrees with you isn't research — it's marketing wearing a lab coat.", 'bbi' ); ?></p>
			</div>
			<a class="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
				href="<?php echo esc_url( get_post_type_archive_link( 'bbi_idea' ) ); ?>">
				<?php esc_html_e( 'Read a blueprint', 'bbi' ); ?> <span aria-hidden>→</span>
			</a>
		</div>

		<aside class="mo-card glass bbi-card-pad lg:mt-16 lg:self-start">
			<h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-accent"><?php esc_html_e( 'What every entry has to contain', 'bbi' ); ?></h3>
			<dl class="mt-6 divide-y divide-border">
				<?php foreach ( bbi_home_entry_rules() as $bbi_row ) : ?>
					<div class="py-4 first:pt-0 last:pb-0">
						<dt class="text-sm font-semibold text-foreground"><?php echo esc_html( $bbi_row['t'] ); ?></dt>
						<dd class="mt-1.5 text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( $bbi_row['d'] ); ?></dd>
					</div>
				<?php endforeach; ?>
			</dl>
		</aside>
	</div>
</section>

<?php /* ----------------------------------------------------- HOW IT WORKS */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<p class="t-eyebrow"><?php esc_html_e( 'Step by step', 'bbi' ); ?></p>
	<h2 class="mt-3"><?php esc_html_e( 'Grab the idea. Validate it however you want. Keep the money.', 'bbi' ); ?></h2>

	<div class="mt-6 bbi-grid sm:grid-cols-3">
		<?php foreach ( bbi_home_steps() as $bbi_step ) : ?>
			<div class="mo-card glass glass-hover bbi-card-pad flex gap-4">
				<span class="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-accent"><?php echo esc_html( $bbi_step['n'] ); ?></span>
				<div>
					<h3 class="text-base font-semibold text-foreground"><?php echo esc_html( $bbi_step['t'] ); ?></h3>
					<p class="mt-1.5 text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( $bbi_step['d'] ); ?></p>
				</div>
			</div>
		<?php endforeach; ?>
	</div>

	<?php bbi_render_faq( 'using', __( 'Validating & using BBI', 'bbi' ) ); ?>
</section>

<?php /* ---------------------------------------------------------- WHO FOR */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<div class="glass bbi-card-pad grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
		<div>
			<p class="t-eyebrow"><?php esc_html_e( 'Who we built this for', 'bbi' ); ?></p>
			<h2 class="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><?php esc_html_e( 'For the person with an idea and nothing else.', 'bbi' ); ?></h2>
			<div class="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
				<p><?php esc_html_e( 'Some of us have been jobless. Some of us have started over with no savings. We know what it\'s like to have a business idea and no laptop, no capital, no one to ask. BBI is for that person — the one Googling "business ideas" from a phone, at 1am, hoping something makes sense for their actual life.', 'bbi' ); ?></p>
				<p><?php esc_html_e( 'We\'re not writing "start a SaaS and make a million dollars" content aimed at people who already have funding. We write for people starting from zero: no investment, no team, no connections. If that\'s not you — great, we\'ve got the bigger ideas too.', 'bbi' ); ?></p>
			</div>
		</div>

		<div class="glass bbi-card-pad self-start">
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-accent"><?php esc_html_e( 'Built with you in mind', 'bbi' ); ?></p>
			<p class="mt-2 text-sm leading-relaxed text-muted-foreground"><?php esc_html_e( 'These are the things people actually type at 1am. Every one of them goes somewhere real.', 'bbi' ); ?></p>

			<ul class="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
				<?php foreach ( bbi_home_built_for() as $bbi_item ) : ?>
					<li>
						<a class="mo-card glass-hover block h-full rounded-xl border border-border/60 px-4 py-3"
							href="<?php echo esc_url( home_url( $bbi_item['path'] ) ); ?>">
							<span class="block text-sm font-semibold leading-snug text-foreground"><?php echo esc_html( $bbi_item['phrase'] ); ?></span>
							<span class="mt-1 block text-xs leading-relaxed text-muted-foreground"><?php echo esc_html( $bbi_item['line'] ); ?></span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</section>

<?php /* ----------------------------------------------------- SCROLL STACK */ ?>
<section class="bbi-container mt-16 bbi-grid px-3 pb-16 sm:grid-cols-2 sm:px-4">
	<?php foreach ( bbi_home_scroll_panels() as $bbi_panel ) : ?>
		<div class="mo-card glass glass-hover bbi-card-pad h-full">
			<h2 class="text-xl font-bold leading-tight tracking-tight sm:text-2xl"><?php echo esc_html( $bbi_panel['title'] ); ?></h2>
			<p class="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base"><?php echo esc_html( $bbi_panel['body'] ); ?></p>
		</div>
	<?php endforeach; ?>
</section>

<?php /* ----------------------------------------------- PRICING PHILOSOPHY */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<div class="mo-card glass glass-hover bbi-card-pad text-center">
		<p class="t-eyebrow"><?php esc_html_e( 'Pricing, honestly', 'bbi' ); ?></p>
		<h2 class="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><?php esc_html_e( 'One fee. Once. For life. That\'s the whole pricing page.', 'bbi' ); ?></h2>
		<p class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground"><?php esc_html_e( 'No monthly plan. No "Starter / Pro / Enterprise" ladder designed to make you feel small on the cheapest tier. Just one option: pay once, unlock everything, forever — including every idea we add after the day you join. Not ready to pay yet? Most of the library stays free to browse regardless.', 'bbi' ); ?></p>
	</div>

	<?php bbi_render_faq( 'pricing', __( 'Pricing & the market gap', 'bbi' ) ); ?>
</section>

<?php /* ---------------------------------------------------- WHY WE BUILT */ ?>
<section class="bbi-prose-w mx-auto px-3 pb-24 pt-16 sm:px-4">
	<h2 class="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl"><?php esc_html_e( 'We got tired of the same 50 ideas recycled into infinity.', 'bbi' ); ?></h2>
	<div class="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
		<p><?php esc_html_e( 'Every business idea list on the internet is the same list. Drop shipping. Print on demand. Start a blog. Sell on Etsy. They are not wrong exactly, but they are not researched either. Nobody tells you the margin, the failure rate, the licensing requirement, or the competitor who already owns the space.', 'bbi' ); ?></p>
		<p><?php esc_html_e( 'This library exists because a genuine small business idea blueprint is worth more than a hundred recycled suggestions. We research each one properly — market context, real revenue mechanics, honest risks — and we tell you directly whether you are the right person to build it.', 'bbi' ); ?></p>
	</div>
	<a class="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
		href="<?php echo esc_url( get_post_type_archive_link( 'bbi_idea' ) ); ?>">
		<?php esc_html_e( 'Read a blueprint', 'bbi' ); ?> <span aria-hidden>→</span>
	</a>
</section>

<?php /* ------------------------------------------------------------- TEAM */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<div class="mo-card glass bbi-shape-card-a bbi-card-pad">
		<p class="t-eyebrow"><?php esc_html_e( "Who's behind this", 'bbi' ); ?></p>
		<h2 class="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><?php esc_html_e( 'Built by hand, not by a headcount.', 'bbi' ); ?></h2>
		<div class="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
			<p><?php esc_html_e( "BBI is a small, hands-on build — no invented office, no fake team page. We'd rather tell you less and have it be true.", 'bbi' ); ?></p>
		</div>
	</div>
</section>

<?php /* ------------------------------------------------------ INSPIRED BY */ ?>
<section class="bbi-prose-w mx-auto mt-16 px-3 sm:px-4">
	<div class="mo-card glass bbi-shape-card-a bbi-card-pad">
		<p class="t-eyebrow"><?php esc_html_e( 'Where this came from', 'bbi' ); ?></p>
		<h2 class="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"><?php esc_html_e( "We didn't invent this model. We learned it.", 'bbi' ); ?></h2>
		<p class="mt-4 text-base leading-relaxed text-muted-foreground"><?php esc_html_e( "Our inspiration is EthicalFounder.com — a platform offering free websites, free MSME registration help, and free mentorship to Indian entrepreneurs who can't afford any of it otherwise. We're not affiliated with them and we don't take commissions from anyone. We just watched how they operated — help first, ask for nothing, let the value speak — and decided BBI should work the same way for business idea research specifically.", 'bbi' ); ?></p>
	</div>
</section>

<?php /* ------------------------------------------------------- COMPARISON */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<p class="t-eyebrow"><?php esc_html_e( 'The comparison', 'bbi' ); ?></p>
	<h2 class="mt-2 max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl"><?php esc_html_e( 'Validating a business idea should not cost you the money you were going to start it with.', 'bbi' ); ?></h2>
	<p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"><?php esc_html_e( 'Twenty dollars buys you three or four checks on most idea validation platforms. If the answer comes back no, that money is gone and you are back where you started — except poorer. We think that is the wrong way round. Read the research first, for free, and decide with your own eyes whether an idea is worth your time.', 'bbi' ); ?></p>

	<div class="mt-8 grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
		<?php
		/*
		 * The losing side is separated by SURFACE and BORDER, never by opacity.
		 * It used to rest at 80% opacity, which read as the lesser option side
		 * by side on a desktop and as a half-loaded card the moment the columns
		 * stacked on a phone.
		 */
		?>
		<div class="mo-card glass bbi-card-pad border border-border/60">
			<p class="t-eyebrow hl-coral"><?php echo esc_html( $bbi_comparison['left_title'] ); ?></p>
			<ul class="mt-4 divide-y divide-hl-coral/20 text-sm leading-relaxed text-muted-foreground">
				<?php foreach ( $bbi_comparison['left'] as $bbi_line ) : ?>
					<li class="py-3 first:pt-0 last:pb-0"><?php echo esc_html( $bbi_line ); ?></li>
				<?php endforeach; ?>
			</ul>
		</div>

		<?php
		/*
		 * Stacked on a phone the two cards sat on top of each other with nothing
		 * saying they were being compared, which loses the entire point of the
		 * section. This marker restores it, and is hidden once the columns sit
		 * side by side and the relationship is obvious again.
		 */
		?>
		<div aria-hidden class="pointer-events-none -my-1 flex justify-center sm:hidden">
			<span class="glass rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"><?php esc_html_e( 'versus', 'bbi' ); ?></span>
		</div>

		<div class="mo-card glass glass-hover bbi-card-pad border border-primary/40">
			<p class="t-eyebrow hl-green"><?php echo esc_html( $bbi_comparison['right_title'] ); ?></p>
			<ul class="mt-4 divide-y divide-hl-green/25 text-sm leading-relaxed text-foreground">
				<?php foreach ( $bbi_comparison['right'] as $bbi_line ) : ?>
					<li class="py-3 first:pt-0 last:pb-0"><?php echo esc_html( $bbi_line ); ?></li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</section>

<?php /* --------------------------------------------- WAYS INTO THE LIBRARY */ ?>
<section class="bbi-container mt-16 px-3 sm:px-4">
	<div class="glass bbi-card-pad">
		<p class="t-eyebrow"><?php esc_html_e( 'Ways into the library', 'bbi' ); ?></p>
		<h2 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"><?php esc_html_e( 'Start from a theme instead of a blank search box.', 'bbi' ); ?></h2>
		<p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground"><?php esc_html_e( 'Each one runs a live search across every blueprint. They are shortcuts, not a ranking — and if one comes back thin, that is the library being honest with you rather than a page pretending to be fuller than it is.', 'bbi' ); ?></p>

		<div class="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
			<?php foreach ( bbi_home_future_terms() as $bbi_query => $bbi_label ) : ?>
				<a class="glass-pill min-w-0 rounded-full px-3 py-2 text-center text-[11px] font-medium leading-snug sm:px-4 sm:text-xs"
					href="<?php echo esc_url( home_url( '/?s=' . rawurlencode( $bbi_query ) ) ); ?>">
					<?php echo esc_html( $bbi_label ); ?>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php /* ---------------------------------------------------------- PROMISE */ ?>
<section id="promise" class="bbi-prose-w mx-auto mt-16 px-3 sm:px-4">
	<div class="mo-card glass glass-hover bbi-card-pad text-center">
		<p class="t-eyebrow"><?php esc_html_e( 'Our promise', 'bbi' ); ?></p>
		<h2 class="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"><?php esc_html_e( "We're not here to sell you a dream. We're here to hand you the research.", 'bbi' ); ?></h2>
		<p class="mt-4 text-base leading-relaxed text-muted-foreground"><?php esc_html_e( "We won't tell you that you'll be a millionaire in three months. We won't show you a lifestyle you can't verify. What we will do: give you honest research, free guidance, and a starting point that doesn't cost you \$20 before you've even decided if the idea is worth pursuing.", 'bbi' ); ?></p>
	</div>

	<?php bbi_render_faq( 'searches', __( 'Common searches, answered', 'bbi' ) ); ?>
</section>

<?php /* ---------------------------------------------------- CLOSING FAQ */ ?>
<section class="bbi-prose-w mx-auto mt-20 border-t border-border/60 px-3 pt-16 pb-24 sm:mt-28 sm:px-4 sm:pt-20">
	<p class="t-eyebrow"><?php esc_html_e( 'Common questions', 'bbi' ); ?></p>
	<div class="mt-6 divide-y divide-border">
		<?php foreach ( bbi_home_faq( 'closing' ) as $bbi_item ) : ?>
			<details class="py-4">
				<summary class="cursor-pointer text-base font-semibold text-foreground"><?php echo esc_html( $bbi_item['q'] ); ?></summary>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( $bbi_item['a'] ); ?></p>
			</details>
		<?php endforeach; ?>
	</div>
</section>

<?php
get_footer();
