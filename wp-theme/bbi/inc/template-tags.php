<?php
/**
 * Template helpers.
 *
 * These carry across the parts of the original site that were TypeScript logic
 * rather than markup, so the templates stay readable. Each one mirrors a
 * specific function in the original.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Trim the trailing noun off a category name.
 *
 * Mirrors `subject()` in `src/routes/validate.$industrySlug.tsx`. Category names
 * in the data already end in "Ideas" or "Business Ideas", so dropping one
 * straight into a sentence produces "How to validate a Work From Home Business
 * Ideas business idea".
 *
 * @param string $name Category display name.
 * @return string
 */
function bbi_subject( $name ) {
	$out = preg_replace( '/\s*business\s+ideas\s*$/i', '', (string) $name );
	$out = preg_replace( '/\s*ideas\s*$/i', '', $out );
	$out = trim( $out );
	return '' === $out ? (string) $name : $out;
}

/**
 * The trend score for a post, or null.
 *
 * Returns null rather than 0 for a missing score. Zero is a real value that
 * would render a visible empty bar and read as "no demand"; absent means
 * "not scored" and the caller must drop the row instead.
 *
 * @param int $post_id Post ID.
 * @return int|null
 */
function bbi_trend_score( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$raw     = get_post_meta( $post_id, 'bbi_trend_score', true );
	if ( '' === $raw || null === $raw ) {
		return null;
	}
	return (int) $raw;
}

/**
 * Render a trend bar.
 *
 * Scaled against a FIXED 100, never against the highest score in the set.
 * Scaling to the maximum makes a field of 71-74 look like a landslide, and is
 * the most common honest-looking way to lie with a chart. `PENDING2.md` records
 * that an earlier version of this drew its bars from `Math.sin()` and presented
 * them as market data; it was deleted. Nothing here may drift back toward that.
 *
 * @param int $score Score out of 100.
 */
function bbi_trend_bar( $score ) {
	if ( null === $score ) {
		return;
	}
	$width = max( 2, min( 100, (int) $score ) );
	printf(
		'<div aria-hidden class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div class="h-full rounded-full bg-hl-teal" style="width:%d%%"></div></div>',
		absint( $width )
	);
}

/**
 * The first category term for a post.
 *
 * @param int $post_id Post ID.
 * @return WP_Term|null
 */
function bbi_category_term( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$terms   = get_the_terms( $post_id, 'bbi_category' );
	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		return null;
	}
	return $terms[0];
}

/**
 * Render an idea card.
 *
 * The single card used by every grid, mirroring `IdeaCard` in the original.
 * `.mo-card` is what the motion system observes, so the class is required for
 * the reveal to reach it.
 *
 * @param int $post_id Post ID.
 */
function bbi_idea_card( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$score   = bbi_trend_score( $post_id );
	$term    = bbi_category_term( $post_id );
	?>
	<a class="mo-card glass glass-hover bbi-shape-card-a block h-full rounded-2xl border border-border/60 p-4 sm:p-6"
		href="<?php echo esc_url( get_permalink( $post_id ) ); ?>">
		<?php if ( $term ) : ?>
			<p class="t-eyebrow"><?php echo esc_html( $term->name ); ?></p>
		<?php endif; ?>

		<h3 class="t-card mt-2"><?php echo esc_html( get_the_title( $post_id ) ); ?></h3>

		<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
			<?php echo esc_html( wp_trim_words( wp_strip_all_tags( get_post_field( 'post_content', $post_id ) ), 28 ) ); ?>
		</p>

		<?php if ( null !== $score ) : ?>
			<p class="t-meta mt-3 tabular-nums text-hl-teal">
				<?php echo absint( $score ); ?><span class="opacity-55">/100</span>
			</p>
			<?php bbi_trend_bar( $score ); ?>
		<?php endif; ?>
	</a>
	<?php
}

/**
 * Render a list of JSON-stored strings.
 *
 * Handles both shapes the data arrives in: a plain array of strings, and an
 * array of {q,a} objects for FAQs.
 *
 * @param int    $post_id Post ID.
 * @param string $key     Meta key.
 * @param string $class   Wrapper classes.
 */
function bbi_render_list( $post_id, $key, $class = 'mt-4 space-y-2' ) {
	$items = bbi_get_json( $post_id, $key );
	if ( empty( $items ) ) {
		return;
	}
	echo '<ul class="' . esc_attr( $class ) . '">';
	foreach ( $items as $item ) {
		if ( is_array( $item ) ) {
			// FAQ shape.
			$q = isset( $item['q'] ) ? $item['q'] : ( isset( $item['question'] ) ? $item['question'] : '' );
			$a = isset( $item['a'] ) ? $item['a'] : ( isset( $item['answer'] ) ? $item['answer'] : '' );
			if ( '' === $q ) {
				continue;
			}
			printf(
				'<li class="mo-card glass rounded-xl p-4"><h3 class="t-card">%s</h3><p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">%s</p></li>',
				esc_html( $q ),
				esc_html( $a )
			);
			continue;
		}
		printf( '<li class="text-sm leading-relaxed text-muted-foreground">%s</li>', esc_html( (string) $item ) );
	}
	echo '</ul>';
}

/**
 * Render one narrative section, if it has content.
 *
 * Renders nothing at all when the field is empty, rather than an empty frame
 * with a heading. A section header over blank space reads as broken.
 *
 * @param int    $post_id Post ID.
 * @param string $key     Meta key.
 * @param string $heading Section heading.
 * @param string $eyebrow Optional eyebrow.
 */
function bbi_section( $post_id, $key, $heading, $eyebrow = '' ) {
	$value = get_post_meta( $post_id, $key, true );
	if ( empty( trim( (string) $value ) ) ) {
		return;
	}
	echo '<section class="mt-12">';
	if ( $eyebrow ) {
		printf( '<p class="t-eyebrow">%s</p>', esc_html( $eyebrow ) );
	}
	printf( '<h2 class="mt-3">%s</h2>', esc_html( $heading ) );
	printf( '<p class="t-lead mt-4 max-w-3xl">%s</p>', esc_html( (string) $value ) );
	echo '</section>';
}

/**
 * Render one of the inline FAQ blocks.
 *
 * `<details>` rather than a JavaScript accordion, on purpose. It opens and
 * closes with no script, it is keyboard-operable and announced correctly by
 * screen readers for free, and — the reason that matters most here — the
 * answer text is in the DOM whether or not it is open, so it is readable by
 * search engines and by anyone using find-in-page.
 *
 * @param string $which   FAQ set key.
 * @param string $eyebrow Section eyebrow.
 */
function bbi_render_faq( $which, $eyebrow ) {
	$items = bbi_home_faq( $which );
	if ( empty( $items ) ) {
		return;
	}
	?>
	<div class="glass bbi-card-pad mt-10">
		<p class="t-eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
		<div class="mt-5 divide-y divide-border">
			<?php foreach ( $items as $item ) : ?>
				<details class="py-3">
					<summary class="cursor-pointer text-sm font-semibold text-foreground"><?php echo esc_html( $item['q'] ); ?></summary>
					<p class="mt-2 text-sm leading-relaxed text-muted-foreground"><?php echo esc_html( $item['a'] ); ?></p>
				</details>
			<?php endforeach; ?>
		</div>
	</div>
	<?php
}

/**
 * FAQPage structured data for the homepage.
 *
 * Emitted once, covering every question on the page. Google's guidance is that
 * FAQPage markup must correspond to visible content, so this is built from the
 * SAME arrays the templates render rather than from a separate list — a schema
 * block that has drifted from the page is worse than no schema block, because
 * it is a claim about content that is not there.
 */
function bbi_faq_schema() {
	if ( ! is_front_page() || is_paged() ) {
		return;
	}

	$questions = array();
	foreach ( array( 'using', 'pricing', 'searches', 'closing' ) as $set ) {
		foreach ( bbi_home_faq( $set ) as $item ) {
			$questions[] = array(
				'@type'          => 'Question',
				'name'           => wp_strip_all_tags( $item['q'] ),
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => wp_strip_all_tags( $item['a'] ),
				),
			);
		}
	}

	if ( empty( $questions ) ) {
		return;
	}

	$schema = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $questions,
	);

	printf(
		'<script type="application/ld+json">%s</script>',
		wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
	);
}
add_action( 'wp_footer', 'bbi_faq_schema' );
