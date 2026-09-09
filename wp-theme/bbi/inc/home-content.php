<?php
/**
 * Homepage copy.
 *
 * Every word on the homepage lives here rather than being embedded in markup,
 * for two reasons:
 *
 * 1. It can be changed without touching a template, and every array runs
 *    through `apply_filters()`, so a child theme or a one-file plugin can
 *    replace any section without forking `front-page.php`.
 * 2. It is a diffable record of the copy. The original lives in
 *    `src/routes/index.tsx`; when the two drift, this is the file to compare.
 *
 * The text is carried across verbatim from the running site. Typographic
 * characters — curly quotes, em dashes, the rupee sign — are kept as they are
 * written there, not normalised to ASCII.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * The two panels under the hero headline.
 *
 * @return array<int, array{label:string, body:string}>
 */
function bbi_home_hero_panels() {
	return apply_filters(
		'bbi_home_hero_panels',
		array(
			array(
				'label' => __( 'What you get', 'bbi' ),
				'body'  => __( 'Every idea here comes with four honest things: who will actually buy from you, how the money really works, the painful risks people find out too late, and a straight answer — build it, or walk away. This is not a list. This is the research you wish someone gave you before you spent your time or money.', 'bbi' ),
			),
			array(
				'label' => __( 'How it works', 'bbi' ),
				'body'  => __( 'Browse any category. Read the full blueprint. If it feels right, tap Validate — and get real research on your idea for free, using AI tools you already pay for. No extra charge. No monthly limit. Free to browse. Free to validate, again and again.', 'bbi' ),
			),
		)
	);
}

/**
 * The four scroll-stack panels.
 *
 * @return array<int, array{title:string, body:string}>
 */
function bbi_home_scroll_panels() {
	return apply_filters(
		'bbi_home_scroll_panels',
		array(
			array(
				'title' => __( 'Most small business ideas are guesses dressed as research.', 'bbi' ),
				'body'  => __( 'A trend chart and a list of niches is not a blueprint. This directory exists because the hard part of starting a business is never finding an idea — it is knowing if yours will actually pay.', 'bbi' ),
			),
			array(
				'title' => __( 'Every blueprint answers four questions.', 'bbi' ),
				'body'  => __( 'Who specifically pays for this. How the money actually moves. What will hurt in year one. And whether you, specifically, are the right person to build it.', 'bbi' ),
			),
			array(
				'title' => __( 'A library built to scale, not to sit still.', 'bbi' ),
				'body'  => __( 'Organized across categories from Tech and SaaS to Creator and Media, FinTech, E-Commerce and more. Every new category added to the database appears here automatically.', 'bbi' ),
			),
			array(
				'title' => __( 'Validation is free, and there is no limit on it.', 'bbi' ),
				'body'  => __( 'Every blueprint has a Validate button. Tap it, and get real research on your idea — market size, your ideal buyer, the money model, and the risks — free, using AI tools you already pay for. No extra cost. No limit.', 'bbi' ),
			),
		)
	);
}

/**
 * The four pillars of the research standard.
 *
 * @return array<int, array{num:string, title:string, desc:string}>
 */
function bbi_home_pillars() {
	return apply_filters(
		'bbi_home_pillars',
		array(
			array( 'num' => '01', 'title' => __( 'Named Buyer', 'bbi' ), 'desc' => __( 'Exactly who will pay you, and why they have money ready right now.', 'bbi' ) ),
			array( 'num' => '02', 'title' => __( 'Unit Economics', 'bbi' ), 'desc' => __( 'Simple numbers on price, cost, and when you actually start making profit.', 'bbi' ) ),
			array( 'num' => '03', 'title' => __( '1st-Year Risks', 'bbi' ), 'desc' => __( 'The hidden costs and traps that quietly kill new businesses.', 'bbi' ) ),
			array( 'num' => '04', 'title' => __( 'Founder-Fit Verdict', 'bbi' ), 'desc' => __( 'An honest answer: should you build this, or walk away?', 'bbi' ) ),
		)
	);
}

/**
 * What every entry has to contain — the sticky editorial aside.
 *
 * @return array<int, array{t:string, d:string}>
 */
function bbi_home_entry_rules() {
	return apply_filters(
		'bbi_home_entry_rules',
		array(
			array( 't' => __( 'A named buyer', 'bbi' ), 'd' => __( 'Not "small businesses." The real person, their budget, and why they need this now.', 'bbi' ) ),
			array( 't' => __( 'Working money mechanics', 'bbi' ), 'd' => __( 'What you charge, what it costs you, and the point where this stops being a side job and becomes a real business.', 'bbi' ) ),
			array( 't' => __( 'The unglamorous risks', 'bbi' ), 'd' => __( "The platform risks, slow seasons, and the competitor who's already halfway there.", 'bbi' ) ),
			array( 't' => __( 'A founder-fit verdict', 'bbi' ), 'd' => __( 'Who should build this — and who should walk away.', 'bbi' ) ),
		)
	);
}

/**
 * The three how-it-works steps.
 *
 * @return array<int, array{n:string, t:string, d:string}>
 */
function bbi_home_steps() {
	return apply_filters(
		'bbi_home_steps',
		array(
			array( 'n' => '01', 't' => __( 'Browse', 'bbi' ), 'd' => __( 'Search or filter researched business ideas — by industry, investment level, or who you are: student, retiree, stay-at-home parent, veteran, nurse, teenager, solo founder. All free to read.', 'bbi' ) ),
			array( 'n' => '02', 't' => __( 'Validate it, free', 'bbi' ), 'd' => __( 'Tap Validate on any idea and get real research on it — free, using AI tools you already pay for. No extra cost, every time.', 'bbi' ) ),
			array( 'n' => '03', 't' => __( '₹199 for 3 months, or ₹399 for life', 'bbi' ), 'd' => __( 'Sign in with Google to unlock full blueprints and the Validate button. ₹199 gets you 3 months, ₹399 gets you lifetime access — no subscription, no renewal.', 'bbi' ) ),
		)
	);
}

/**
 * The six search phrases in the "Built with you in mind" card.
 *
 * The phrases are real search queries and are kept word for word — that is the
 * whole reason they are on the page. What was wrong with them originally was
 * everything around them: a bare list, no sentences, nothing to click, sitting
 * next to a library with a page for every one.
 *
 * Each now links somewhere real and carries one human line underneath. The
 * destinations are category slugs read off the live table, not typed from
 * memory; two hand-typed slugs already shipped broken once in this project.
 *
 * @return array<int, array{phrase:string, line:string, path:string}>
 */
function bbi_home_built_for() {
	return apply_filters(
		'bbi_home_built_for',
		array(
			array(
				'phrase' => __( 'Any business idea without investment', 'bbi' ),
				'line'   => __( '"Save up first" is not advice when there is nothing to save.', 'bbi' ),
				'path'   => '/category/zero-investment-business-ideas/',
			),
			array(
				'phrase' => __( 'Work from home business opportunity', 'bbi' ),
				'line'   => __( 'Start from the room you are already paying rent for.', 'bbi' ),
				'path'   => '/category/work-from-home-business-ideas/',
			),
			array(
				'phrase' => __( 'Best business to start with little money', 'bbi' ),
				'line'   => __( 'Small capital is a constraint. It is not a verdict.', 'bbi' ),
				'path'   => '/category/low-investment-business-ideas/',
			),
			array(
				'phrase' => __( 'Side hustle and best side job ideas', 'bbi' ),
				'line'   => __( 'Keep the salary. Build the second thing quietly.', 'bbi' ),
				'path'   => '/category/side-hustle-ideas/',
			),
			array(
				'phrase' => __( 'Business ideas for teenagers', 'bbi' ),
				'line'   => __( 'Too young is something people say. It is not a rule.', 'bbi' ),
				'path'   => '?s=teen',
			),
			array(
				'phrase' => __( 'Stay-at-home-mom business ideas', 'bbi' ),
				'line'   => __( 'Work that fits around a day you do not get to control.', 'bbi' ),
				'path'   => '?s=mom',
			),
		)
	);
}

/**
 * The comparison table.
 *
 * Every entry is a full sentence rather than a fragment. The `$20` framing is
 * sourced from `PROJECT_BRIEF.md` §3 and is not a fabricated number; no
 * competitor is named anywhere, per §245.
 *
 * @return array{left_title:string, left:array<int,string>, right_title:string, right:array<int,string>}
 */
function bbi_home_comparison() {
	return apply_filters(
		'bbi_home_comparison',
		array(
			'left_title' => __( 'What most idea validation tools ask of you', 'bbi' ),
			'left'       => array(
				__( 'You pay every month, whether you use it that month or not.', 'bbi' ),
				__( 'Twenty dollars gets you a handful of checks, then it asks for more.', 'bbi' ),
				__( 'What comes back is the same generic paragraph anyone else would get.', 'bbi' ),
				__( 'You pay before you are allowed to see whether it was worth paying for.', 'bbi' ),
			),
			'right_title' => __( 'What BBI asks of you', 'bbi' ),
			'right'       => array(
				__( 'Read every researched idea in the library without paying anything.', 'bbi' ),
				__( 'If you want the full thing, you pay once. There is no second bill.', 'bbi' ),
				__( 'Validate as many ideas as you like. We do not ration it.', 'bbi' ),
				__( 'Change your mind, come back in a year, and it is all still yours.', 'bbi' ),
			),
		)
	);
}

/**
 * The keyword mosaic.
 *
 * These are search shortcuts, not a ranking, and the copy around them says so.
 * An earlier version claimed they were "pulled straight from the live library",
 * which was false — they are hand-written terms in this file, and a page
 * claiming data provenance for a hardcoded constant is a page telling a lie.
 *
 * @return array<int, array{heading:string, terms:array<int, string>}>
 */
function bbi_home_keyword_groups() {
	return apply_filters(
		'bbi_home_keyword_groups',
		array(
			array(
				'heading' => __( 'By industry', 'bbi' ),
				'terms'   => array( 'fintech' => 'fintech business ideas', 'healthcare' => 'healthcare business ideas', 'food and beverage' => 'food and beverage business ideas', 'fashion' => 'fashion business ideas', 'agriculture' => 'agriculture business ideas', 'SaaS' => 'SaaS business ideas' ),
			),
			array(
				'heading' => __( 'By who you are', 'bbi' ),
				'terms'   => array( 'retirees' => 'business ideas for retirees', 'veterans' => 'business ideas for veterans', 'teenagers' => 'business ideas for teenagers', 'stay at home mom' => 'stay at home mom business ideas', 'solo entrepreneur' => 'solo entrepreneur ideas', 'nurses' => 'business ideas for nurses', 'couples' => 'business ideas for couples', 'senior care' => 'senior care business ideas' ),
			),
			array(
				'heading' => __( 'By model', 'bbi' ),
				'terms'   => array( 'dropshipping' => 'dropshipping business ideas', 'subscription box' => 'subscription box business ideas', 'coaching' => 'coaching business ideas', 'passive income' => 'passive income ideas', 'high profit' => 'high profit business ideas', 'low overhead' => 'low overhead business ideas', 'recession proof' => 'recession proof business ideas' ),
			),
		)
	);
}

/**
 * The theme shortcuts.
 *
 * @return array<string, string> query => label
 */
function bbi_home_future_terms() {
	return apply_filters(
		'bbi_home_future_terms',
		array(
			'future proof'   => __( 'future proof business ideas', 'bbi' ),
			'recession proof' => __( 'recession proof businesses', 'bbi' ),
			'AI'             => __( 'AI startup ideas', 'bbi' ),
			'SaaS'           => __( 'profitable SaaS ideas', 'bbi' ),
			'high profit'    => __( 'high profit businesses', 'bbi' ),
			'million dollar' => __( 'million dollar company ideas', 'bbi' ),
		)
	);
}

/**
 * The three inline FAQ blocks and the closing one.
 *
 * @param string $which One of 'using', 'pricing', 'searches', 'closing'.
 * @return array<int, array{q:string, a:string}>
 */
function bbi_home_faq( $which ) {
	$sets = array(
		'using'    => array(
			array( 'q' => __( 'Are these real business ideas or generic AI output?', 'bbi' ), 'a' => __( 'Every entry is researched — a named buyer, real revenue mechanics, honest risks, and a founder-fit verdict, not a one-line suggestion.', 'bbi' ) ),
			array( 'q' => __( 'Do I have to pay to browse?', 'bbi' ), 'a' => __( 'No. Browsing the library is free. Lifetime access is a one-time optional unlock, not a requirement to see ideas.', 'bbi' ) ),
			array( 'q' => __( 'Is there a limit on how many ideas I can validate?', 'bbi' ), 'a' => __( 'No. Validation is free and unlimited — it costs you nothing extra, using AI tools you already pay for.', 'bbi' ) ),
			array( 'q' => __( 'How is this different from an AI idea generator?', 'bbi' ), 'a' => __( "BBI isn't generating random ideas on the fly. Every entry is pre-researched and published, so what you're reading has already been through a real process, not invented on the spot for you.", 'bbi' ) ),
		),
		'pricing'  => array(
			array( 'q' => __( 'Why is BBI so much cheaper than other platforms?', 'bbi' ), 'a' => __( "Because we're not charging per validation. We charge once, if at all, for lifetime access to research — not for AI output you could generate yourself elsewhere.", 'bbi' ) ),
			array( 'q' => __( 'Is there a monthly subscription?', 'bbi' ), 'a' => __( 'No. One fee, once, for life. No renewal, no expiring trial.', 'bbi' ) ),
			array( 'q' => __( 'What does lifetime access actually include?', 'bbi' ), 'a' => __( 'Every current idea, plus every idea added after you join, for as long as BBI exists.', 'bbi' ) ),
			array( 'q' => __( "Why don't you charge like everyone else does?", 'bbi' ), 'a' => __( "Because we built this after being the person who couldn't afford what everyone else was charging. That's not a tagline — that's why the pricing looks the way it does.", 'bbi' ) ),
		),
		'searches' => array(
			array( 'q' => __( 'How do I become an entrepreneur with no experience or capital?', 'bbi' ), 'a' => __( 'Start with research, not spending. Browse ideas that match zero-investment or low-investment models, and validate with a free or low-cost AI tool before committing any money.', 'bbi' ) ),
			array( 'q' => __( 'What businesses are considered recession-proof?', 'bbi' ), 'a' => __( 'Categories tied to essential needs — healthcare, senior and elder care, repair services, essential food and goods — tend to hold up better than discretionary spending categories during downturns.', 'bbi' ) ),
			array( 'q' => __( 'How do I validate a SaaS idea before building it?', 'bbi' ), 'a' => __( "Talk to potential users first, check if anyone's already solving the problem and how well, and use an AI tool to pressure-test your pricing and market size assumptions before writing code.", 'bbi' ) ),
			array( 'q' => __( 'What is TAM, SAM, and SOM?', 'bbi' ), 'a' => __( 'Total Addressable Market, Serviceable Available Market, and Serviceable Obtainable Market — three shrinking circles that estimate the whole possible market, the part you could realistically reach, and the part you could realistically capture.', 'bbi' ) ),
			array( 'q' => __( 'What are good home business ideas for working parents?', 'bbi' ), 'a' => __( 'Look for models with flexible hours and low daily time commitment — coaching, tutoring, subscription-box curation, or service businesses that can run around an existing job or childcare schedule.', 'bbi' ) ),
			array( 'q' => __( 'Why do most startups fail?', 'bbi' ), 'a' => __( 'Most commonly: building something nobody was asking for, running out of money before finding paying customers, or misjudging how much competition already exists in the space.', 'bbi' ) ),
		),
		'closing'  => array(
			array( 'q' => __( 'Are these real business ideas or just inspiration?', 'bbi' ), 'a' => __( 'Every entry is a researched blueprint, not a topic suggestion. Each one covers what the business actually does day to day, who the specific customer is, how money changes hands, what the realistic obstacles are, and a direct verdict on founder fit. You can evaluate any idea in under ten minutes.', 'bbi' ) ),
			array( 'q' => __( 'Is the whole library free?', 'bbi' ), 'a' => __( 'Yes. Every blueprint is free to read, start to finish. Validating an idea is free too — you use AI tools you already pay for, so it costs you nothing extra, ever.', 'bbi' ) ),
			array( 'q' => __( 'How are trend scores calculated?', 'bbi' ), 'a' => __( 'Each idea receives a trend score based on current market demand signals for that specific micro-niche, not the broader category. A high score indicates strong current momentum.', 'bbi' ) ),
			array( 'q' => __( 'Can I suggest a business idea to add to the library?', 'bbi' ), 'a' => __( 'Yes. Use the Contact page to submit a niche or sector you want covered. We review suggestions and prioritize based on search demand and founder interest.', 'bbi' ) ),
			array( 'q' => __( 'How often is the library updated?', 'bbi' ), 'a' => __( 'New blueprints are added regularly across all categories. Every new entry appears automatically in the browse page and category listings the moment it is published.', 'bbi' ) ),
			array( 'q' => __( 'Is this useful if I already have a business idea?', 'bbi' ), 'a' => __( "Yes. Find the closest matching idea and tap Validate. You'll get real research — market size, competitors, and a launch plan — shaped around your own version of the idea, at no extra cost.", 'bbi' ) ),
		),
	);

	$set = isset( $sets[ $which ] ) ? $sets[ $which ] : array();
	return apply_filters( 'bbi_home_faq', $set, $which );
}
