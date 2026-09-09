<?php
/**
 * SEO.
 *
 * The pipeline writes four researched SEO fields onto every idea —
 * `bbi_seo_title`, `bbi_meta_description`, `bbi_focus_keyword` and two
 * additional keywords. Registering them made them editable; this is what makes
 * them do something.
 *
 * ------------------------------------------------------------------
 * THE RULE THIS FILE IS BUILT AROUND
 * ------------------------------------------------------------------
 *
 * NEVER OUTPUT A TAG AN SEO PLUGIN IS ALSO OUTPUTTING.
 *
 * Two `<meta name="description">` tags, or two canonicals, is worse than none:
 * search engines pick one and it is not necessarily yours, and the problem is
 * invisible in a browser. So the theme detects Rank Math, Yoast, SEOPress and
 * All in One SEO, and when one is present it stops emitting tags entirely and
 * instead FEEDS them the researched values through their own filters. The
 * plugin stays in charge of the markup; the data comes from here.
 *
 * With no plugin active the theme emits a minimal, correct set itself, so a
 * plain install is not left with nothing.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Is an SEO plugin handling the head?
 *
 * @return string Plugin slug, or '' when none is active.
 */
function bbi_seo_plugin() {
	if ( class_exists( 'RankMath' ) ) {
		return 'rankmath';
	}
	if ( defined( 'WPSEO_VERSION' ) ) {
		return 'yoast';
	}
	if ( defined( 'SEOPRESS_VERSION' ) ) {
		return 'seopress';
	}
	if ( defined( 'AIOSEO_VERSION' ) ) {
		return 'aioseo';
	}
	return '';
}

/**
 * The researched title for a post, or ''.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function bbi_seo_title( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	return trim( (string) get_post_meta( $post_id, 'bbi_seo_title', true ) );
}

/**
 * The researched description for a post.
 *
 * Falls back the same way the live site does: the meta description if the
 * pipeline wrote one, then the seed business description trimmed to 155
 * characters, then the excerpt. Never the full body — a description built from
 * an unbounded field is a truncated sentence in a search result.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function bbi_seo_description( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();

	$description = trim( (string) get_post_meta( $post_id, 'bbi_meta_description', true ) );
	if ( '' !== $description ) {
		return $description;
	}

	$seed = trim( (string) get_post_meta( $post_id, 'bbi_business_description', true ) );
	if ( '' !== $seed ) {
		// Cut on a word boundary. `substr` at 155 leaves a half-word, which is
		// what makes an auto-generated description look auto-generated.
		return rtrim( wp_html_excerpt( $seed, 155, '' ), " \t\n\r,.;:" ) . '…';
	}

	$excerpt = trim( (string) get_the_excerpt( $post_id ) );
	if ( '' !== $excerpt ) {
		return $excerpt;
	}

	return '';
}

/**
 * The focus keyword, plus the two additional ones.
 *
 * @param int $post_id Post ID.
 * @return string[] 
 */
function bbi_seo_keywords( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$out     = array();
	foreach ( array( 'bbi_focus_keyword', 'bbi_additional_keyword_1', 'bbi_additional_keyword_2' ) as $key ) {
		$value = trim( (string) get_post_meta( $post_id, $key, true ) );
		if ( '' !== $value ) {
			$out[] = $value;
		}
	}
	return $out;
}

/* ==================================================================
   FEEDING THE PLUGINS.

   Each of these hooks fires only when its plugin is installed, so they are
   registered unconditionally and simply never run otherwise.
   ================================================================== */

/**
 * Rank Math title.
 *
 * @param string $title Existing title.
 * @return string
 */
function bbi_rankmath_title( $title ) {
	if ( ! is_singular( 'bbi_idea' ) ) {
		return $title;
	}
	$ours = bbi_seo_title();
	return '' !== $ours ? $ours : $title;
}
add_filter( 'rank_math/frontend/title', 'bbi_rankmath_title' );

/**
 * Rank Math description.
 *
 * @param string $description Existing description.
 * @return string
 */
function bbi_rankmath_description( $description ) {
	if ( ! is_singular( 'bbi_idea' ) ) {
		return $description;
	}
	$ours = bbi_seo_description();
	return '' !== $ours ? $ours : $description;
}
add_filter( 'rank_math/frontend/description', 'bbi_rankmath_description' );

/**
 * Yoast title.
 *
 * @param string $title Existing title.
 * @return string
 */
function bbi_yoast_title( $title ) {
	if ( ! is_singular( 'bbi_idea' ) ) {
		return $title;
	}
	$ours = bbi_seo_title();
	return '' !== $ours ? $ours : $title;
}
add_filter( 'wpseo_title', 'bbi_yoast_title' );

/**
 * Yoast description.
 *
 * @param string $description Existing description.
 * @return string
 */
function bbi_yoast_description( $description ) {
	if ( ! is_singular( 'bbi_idea' ) ) {
		return $description;
	}
	$ours = bbi_seo_description();
	return '' !== $ours ? $ours : $description;
}
add_filter( 'wpseo_metadesc', 'bbi_yoast_description' );

/**
 * Copy the researched values into Rank Math's own meta on save.
 *
 * Without this the values only appear on the front end and Rank Math's editor
 * sidebar shows an empty description, so anyone checking their work sees a
 * blank field and reasonably assumes nothing was written. This makes the
 * plugin's UI agree with the page.
 *
 * It only ever FILLS AN EMPTY field. A description written by hand in Rank
 * Math is a deliberate override and must survive a re-import.
 *
 * @param int $post_id Post ID.
 */
function bbi_sync_seo_meta( $post_id ) {
	if ( 'bbi_idea' !== get_post_type( $post_id ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	$pairs = array();

	switch ( bbi_seo_plugin() ) {
		case 'rankmath':
			$pairs = array( 'rank_math_title' => bbi_seo_title( $post_id ), 'rank_math_description' => bbi_seo_description( $post_id ), 'rank_math_focus_keyword' => implode( ', ', bbi_seo_keywords( $post_id ) ) );
			break;
		case 'yoast':
			$pairs = array( '_yoast_wpseo_title' => bbi_seo_title( $post_id ), '_yoast_wpseo_metadesc' => bbi_seo_description( $post_id ), '_yoast_wpseo_focuskw' => (string) get_post_meta( $post_id, 'bbi_focus_keyword', true ) );
			break;
		default:
			return;
	}

	foreach ( $pairs as $key => $value ) {
		if ( '' === trim( (string) $value ) ) {
			continue;
		}
		if ( '' !== trim( (string) get_post_meta( $post_id, $key, true ) ) ) {
			continue;
		}
		update_post_meta( $post_id, $key, $value );
	}
}
add_action( 'save_post_bbi_idea', 'bbi_sync_seo_meta', 20 );

/* ==================================================================
   EMITTING TAGS OURSELVES — only with no SEO plugin present.
   ================================================================== */

/**
 * The document title, when nothing else owns it.
 *
 * @param array $parts Title parts.
 * @return array
 */
function bbi_document_title( $parts ) {
	if ( '' !== bbi_seo_plugin() || ! is_singular( 'bbi_idea' ) ) {
		return $parts;
	}
	$ours = bbi_seo_title();
	if ( '' !== $ours ) {
		// The researched title is a complete title, already written to fit a
		// search result. Appending the site name to it pushes it past the
		// point where it gets cut off.
		$parts['title'] = $ours;
		unset( $parts['site'], $parts['tagline'] );
	}
	return $parts;
}
add_filter( 'document_title_parts', 'bbi_document_title' );

/**
 * Description, canonical, Open Graph and Twitter tags.
 */
function bbi_head_meta() {
	if ( '' !== bbi_seo_plugin() ) {
		// A plugin is emitting all of this. Adding ours alongside would give
		// the page two descriptions and two canonicals.
		return;
	}

	$title       = '';
	$description = '';
	$canonical   = '';
	$type        = 'website';

	if ( is_singular( 'bbi_idea' ) ) {
		$title       = bbi_seo_title();
		$description = bbi_seo_description();
		$canonical   = get_permalink();
		$type        = 'article';
	} elseif ( is_singular() ) {
		$description = trim( (string) get_the_excerpt() );
		$canonical   = get_permalink();
		$type        = 'article';
	} elseif ( is_tax( array( 'bbi_category', 'bbi_subcategory' ) ) ) {
		$term        = get_queried_object();
		$description = $term && ! empty( $term->description ) ? $term->description : '';
		$link        = get_term_link( $term );
		$canonical   = is_wp_error( $link ) ? '' : $link;
	} elseif ( is_front_page() ) {
		$description = get_bloginfo( 'description' );
		$canonical   = home_url( '/' );
	}

	if ( '' === $title ) {
		$title = wp_get_document_title();
	}

	if ( '' !== $description ) {
		printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $description ) );
	}

	// Deliberately NOT emitted on paginated or filtered views. A canonical
	// pointing every page of an archive at page one tells search engines the
	// later pages do not exist, which is how a paginated library loses most of
	// itself from the index.
	if ( '' !== $canonical && ! is_paged() && ! is_search() ) {
		printf( '<link rel="canonical" href="%s" />' . "\n", esc_url( $canonical ) );
	}

	printf( '<meta property="og:type" content="%s" />' . "\n", esc_attr( $type ) );
	printf( '<meta property="og:title" content="%s" />' . "\n", esc_attr( $title ) );
	if ( '' !== $description ) {
		printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $description ) );
	}
	if ( '' !== $canonical ) {
		printf( '<meta property="og:url" content="%s" />' . "\n", esc_url( $canonical ) );
	}
	printf( '<meta property="og:site_name" content="%s" />' . "\n", esc_attr( get_bloginfo( 'name' ) ) );

	$image = '';
	if ( is_singular() && has_post_thumbnail() ) {
		$image = (string) get_the_post_thumbnail_url( null, 'large' );
	}

	// `summary_large_image` on a page with no image renders as a bare link on
	// every platform that reads it, so the card type follows the image.
	printf( '<meta name="twitter:card" content="%s" />' . "\n", '' !== $image ? 'summary_large_image' : 'summary' );
	if ( '' !== $image ) {
		printf( '<meta property="og:image" content="%s" />' . "\n", esc_url( $image ) );
	}
}
add_action( 'wp_head', 'bbi_head_meta', 5 );

/**
 * Article and BreadcrumbList structured data for an idea.
 *
 * Mirrors `articleSchema()` and `breadcrumbSchema()` on the live site. Emitted
 * even when an SEO plugin is present: plugins output WebPage and Organization
 * graphs, and an Article node describing this specific post is additive rather
 * than a duplicate of anything they emit.
 */
function bbi_idea_schema() {
	if ( ! is_singular( 'bbi_idea' ) ) {
		return;
	}

	$post_id = get_the_ID();
	$term    = bbi_category_term( $post_id );
	$url     = get_permalink( $post_id );

	$crumbs = array(
		array( 'name' => __( 'Home', 'bbi' ), 'item' => home_url( '/' ) ),
	);
	if ( $term ) {
		$link = get_term_link( $term );
		if ( ! is_wp_error( $link ) ) {
			$crumbs[] = array( 'name' => $term->name, 'item' => $link );
		}
	}
	$crumbs[] = array( 'name' => get_the_title( $post_id ), 'item' => $url );

	$breadcrumb_items = array();
	foreach ( $crumbs as $i => $crumb ) {
		$breadcrumb_items[] = array(
			'@type'    => 'ListItem',
			'position' => $i + 1,
			'name'     => $crumb['name'],
			'item'     => $crumb['item'],
		);
	}

	$description = bbi_seo_description( $post_id );

	$article = array(
		'@context'         => 'https://schema.org',
		'@type'            => 'Article',
		'headline'         => get_the_title( $post_id ),
		'mainEntityOfPage' => $url,
		'datePublished'    => get_the_date( 'c', $post_id ),
		'dateModified'     => get_the_modified_date( 'c', $post_id ),
	);
	if ( '' !== $description ) {
		$article['description'] = $description;
	}
	if ( $term ) {
		$article['about'] = $term->name;
	}

	$graph = array(
		$article,
		array(
			'@context'        => 'https://schema.org',
			'@type'           => 'BreadcrumbList',
			'itemListElement' => $breadcrumb_items,
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>',
		wp_json_encode( $graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
	);
}
add_action( 'wp_footer', 'bbi_idea_schema' );

/**
 * Show the researched SEO fields as a column on the ideas list.
 *
 * A library of 290 pages needs a way to see at a glance which ones have a
 * description and which do not. Opening each post to find out does not scale,
 * and "we will check later" means never.
 *
 * @param array $columns Existing columns.
 * @return array
 */
function bbi_idea_columns( $columns ) {
	$out = array();
	foreach ( $columns as $key => $label ) {
		$out[ $key ] = $label;
		if ( 'title' === $key ) {
			$out['bbi_seo']   = __( 'SEO', 'bbi' );
			$out['bbi_trend'] = __( 'Trend', 'bbi' );
		}
	}
	return $out;
}
add_filter( 'manage_bbi_idea_posts_columns', 'bbi_idea_columns' );

/**
 * Render those columns.
 *
 * @param string $column  Column key.
 * @param int    $post_id Post ID.
 */
function bbi_idea_column_content( $column, $post_id ) {
	if ( 'bbi_seo' === $column ) {
		$has_title = '' !== bbi_seo_title( $post_id );
		$has_desc  = '' !== trim( (string) get_post_meta( $post_id, 'bbi_meta_description', true ) );
		$bits      = array();
		$bits[]    = $has_title ? '✓ ' . __( 'title', 'bbi' ) : '— ' . __( 'no title', 'bbi' );
		$bits[]    = $has_desc ? '✓ ' . __( 'description', 'bbi' ) : '— ' . __( 'no description', 'bbi' );
		echo esc_html( implode( ' · ', $bits ) );
		return;
	}

	if ( 'bbi_trend' === $column ) {
		$score = bbi_trend_score( $post_id );
		// An unscored idea prints an em dash, not 0. Zero is a real score and
		// showing it for a missing one makes the column lie.
		echo null === $score ? '—' : esc_html( (string) $score );
	}
}
add_action( 'manage_bbi_idea_posts_custom_column', 'bbi_idea_column_content', 10, 2 );

/**
 * Let the trend column sort.
 *
 * @param array $columns Sortable columns.
 * @return array
 */
function bbi_idea_sortable_columns( $columns ) {
	$columns['bbi_trend'] = 'bbi_trend';
	return $columns;
}
add_filter( 'manage_edit-bbi_idea_sortable_columns', 'bbi_idea_sortable_columns' );

/**
 * Apply that sort.
 *
 * @param WP_Query $query The admin query.
 */
function bbi_idea_admin_sort( $query ) {
	if ( ! is_admin() || ! $query->is_main_query() ) {
		return;
	}
	if ( 'bbi_trend' !== $query->get( 'orderby' ) ) {
		return;
	}
	$query->set( 'meta_key', 'bbi_trend_score' );
	$query->set( 'orderby', 'meta_value_num' );
}
add_action( 'pre_get_posts', 'bbi_idea_admin_sort' );
