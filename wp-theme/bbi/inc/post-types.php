<?php
/**
 * Custom post types and taxonomies.
 *
 * The shape here mirrors the Supabase `ideas` table exactly, because the whole
 * point of the WordPress port is that the founder edits this content in wp-admin
 * rather than through a Google Sheet and a pipeline. If the shapes drift, the
 * importer silently drops fields and the edit screen stops matching the data.
 *
 * Two decisions worth stating, because both are easy to get wrong later:
 *
 * 1. Category and subcategory are TAXONOMIES, not meta fields. In Supabase they
 *    are denormalised text columns on every row (`category_name`,
 *    `category_slug`, `subcategory_name`, `subcategory_slug`). That is correct
 *    for a flat table read by an API, and wrong for WordPress, where a taxonomy
 *    gives archive pages, permalinks and admin filtering for free. The importer
 *    converts columns to terms.
 *
 * 2. `subcategory_name` is byte-identical to `title` in the live database — the
 *    "290 subcategories" figure in PENDING2.md was the idea count relabelled.
 *    The subcategory taxonomy is registered anyway because the data has the
 *    column and future rows may use it properly, but nothing in the templates
 *    should print it next to the title. It reads as a duplicate.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the idea post type and its taxonomies.
 */
function bbi_register_post_types() {

	register_post_type(
		'bbi_idea',
		array(
			'labels'             => array(
				'name'               => __( 'Ideas', 'bbi' ),
				'singular_name'      => __( 'Idea', 'bbi' ),
				'add_new_item'       => __( 'Add New Idea', 'bbi' ),
				'edit_item'          => __( 'Edit Idea', 'bbi' ),
				'search_items'       => __( 'Search Ideas', 'bbi' ),
				'not_found'          => __( 'No ideas found.', 'bbi' ),
				'all_items'          => __( 'All Ideas', 'bbi' ),
			),
			'public'             => true,
			'has_archive'        => 'browse',
			'menu_icon'          => 'dashicons-lightbulb',
			'menu_position'      => 5,
			// `idea` matches the live site's /idea/[slug] URLs exactly, so
			// existing links and anything already indexed keep working.
			'rewrite'            => array( 'slug' => 'idea', 'with_front' => false ),
			'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ),
			'show_in_rest'       => true,
			'taxonomies'         => array( 'bbi_category', 'bbi_subcategory' ),
		)
	);

	register_taxonomy(
		'bbi_category',
		array( 'bbi_idea' ),
		array(
			'labels'            => array(
				'name'          => __( 'Idea Categories', 'bbi' ),
				'singular_name' => __( 'Idea Category', 'bbi' ),
				'edit_item'     => __( 'Edit Category', 'bbi' ),
				'add_new_item'  => __( 'Add New Category', 'bbi' ),
			),
			'public'            => true,
			'hierarchical'      => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'rewrite'           => array( 'slug' => 'category', 'with_front' => false ),
		)
	);

	register_taxonomy(
		'bbi_subcategory',
		array( 'bbi_idea' ),
		array(
			'labels'            => array(
				'name'          => __( 'Idea Subcategories', 'bbi' ),
				'singular_name' => __( 'Idea Subcategory', 'bbi' ),
			),
			'public'            => true,
			'hierarchical'      => true,
			'show_admin_column' => false,
			'show_in_rest'      => true,
			'rewrite'           => array( 'slug' => 'subcategory', 'with_front' => false ),
		)
	);

	// The FAQ pool. In Supabase this is `category_faqs`, keyed by category_slug
	// and drawn at random onto category hubs and idea pages. All 14 pools are
	// currently empty; the type exists so the importer has somewhere to land
	// and so they can be written by hand in wp-admin, which is the whole reason
	// for this port.
	register_post_type(
		'bbi_faq',
		array(
			'labels'        => array(
				'name'          => __( 'FAQs', 'bbi' ),
				'singular_name' => __( 'FAQ', 'bbi' ),
				'add_new_item'  => __( 'Add New FAQ', 'bbi' ),
			),
			'public'        => false,
			'show_ui'       => true,
			'menu_icon'     => 'dashicons-editor-help',
			'menu_position' => 6,
			'supports'      => array( 'title', 'editor', 'revisions' ),
			'show_in_rest'  => true,
			'taxonomies'    => array( 'bbi_category' ),
		)
	);
}
add_action( 'init', 'bbi_register_post_types' );

/**
 * Order idea archives by trend score, highest first.
 *
 * This matches `getCategoryPage` and `getTrendingIdeas` in the original site,
 * both of which order by `trend_score` descending with nulls last. WordPress
 * sorts by date unless told otherwise, which would put the newest import first
 * and make every listing look arbitrary.
 *
 * `meta_value_num` is used rather than `meta_value` on purpose: as a string,
 * "9" sorts above "85".
 *
 * @param WP_Query $query The query being run.
 */
function bbi_order_archives_by_trend( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}
	if ( ! ( $query->is_post_type_archive( 'bbi_idea' ) || $query->is_tax( array( 'bbi_category', 'bbi_subcategory' ) ) ) ) {
		return;
	}
	$query->set( 'meta_key', 'bbi_trend_score' );
	$query->set( 'orderby', array( 'meta_value_num' => 'DESC', 'date' => 'DESC' ) );
	// Ideas with no score must still appear, just last. An inner join on the
	// meta key would silently hide them, which is how a listing quietly loses
	// rows nobody notices are missing.
	$query->set(
		'meta_query',
		array(
			'relation' => 'OR',
			array( 'key' => 'bbi_trend_score', 'compare' => 'EXISTS' ),
			array( 'key' => 'bbi_trend_score', 'compare' => 'NOT EXISTS' ),
		)
	);
}
add_action( 'pre_get_posts', 'bbi_order_archives_by_trend' );

/**
 * Include ideas in the site search.
 *
 * WordPress searches only `post` by default, so without this the search page
 * returns nothing for a library of 290 ideas.
 *
 * Note on parity: the original site searched six columns with `ILIKE`
 * (title, summary, business_description, focus_keyword, subcategory_name,
 * category_name). WordPress core searches post_title, post_excerpt and
 * post_content only. The importer therefore writes summary into post_content
 * and business_description into post_excerpt, which recovers most of that
 * reach. Focus keyword and the taxonomy names are not searched by core; see
 * `bbi_search_meta_join` below.
 *
 * @param WP_Query $query The query being run.
 */
function bbi_include_ideas_in_search( $query ) {
	if ( is_admin() || ! $query->is_main_query() || ! $query->is_search() ) {
		return;
	}
	$query->set( 'post_type', array( 'bbi_idea', 'post', 'page' ) );
}
add_action( 'pre_get_posts', 'bbi_include_ideas_in_search' );
