<?php
/**
 * Idea meta fields — the 38 Supabase columns, mapped.
 *
 * Every field is registered with `show_in_rest` so the block editor and the
 * REST API can both see it, and every one gets an explicit sanitiser. A meta
 * field registered without a sanitiser accepts whatever is posted to it.
 *
 * The `bbi_` prefix on every key is deliberate. Unprefixed meta keys collide
 * with plugins — `title`, `status` and `tags` in particular are common enough
 * that a collision is close to guaranteed.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * The field map: meta key => [ type, label, sanitiser ].
 *
 * `text` fields hold prose. `json` fields hold arrays that arrived as jsonb
 * from Postgres and are stored here as JSON strings, because WordPress meta has
 * no array type that survives a round trip through the REST API intact.
 *
 * @return array<string, array{type:string, label:string, sanitize:string}>
 */
function bbi_idea_fields() {
	return array(
		// Identity and provenance. Kept so a row can always be traced back to
		// the Supabase record it came from, and so a re-import updates rather
		// than duplicates.
		'bbi_idea_id'              => array( 'type' => 'string', 'label' => 'Supabase idea_id', 'sanitize' => 'sanitize_text_field' ),
		'bbi_collection_id'        => array( 'type' => 'string', 'label' => 'Collection ID', 'sanitize' => 'sanitize_text_field' ),
		'bbi_status'               => array( 'type' => 'string', 'label' => 'Pipeline status', 'sanitize' => 'sanitize_text_field' ),

		// SEO. These map onto Rank Math / Yoast in `inc/seo.php`; the port exists
		// so these become editable, so they are first-class fields, not an
		// afterthought.
		'bbi_seo_title'            => array( 'type' => 'string', 'label' => 'SEO title', 'sanitize' => 'sanitize_text_field' ),
		'bbi_meta_description'     => array( 'type' => 'string', 'label' => 'Meta description', 'sanitize' => 'sanitize_textarea_field' ),
		'bbi_focus_keyword'        => array( 'type' => 'string', 'label' => 'Focus keyword', 'sanitize' => 'sanitize_text_field' ),
		'bbi_additional_keyword_1' => array( 'type' => 'string', 'label' => 'Additional keyword 1', 'sanitize' => 'sanitize_text_field' ),
		'bbi_additional_keyword_2' => array( 'type' => 'string', 'label' => 'Additional keyword 2', 'sanitize' => 'sanitize_text_field' ),

		// The narrative. These are the nine fields the Gemini pipeline writes
		// and the ones the idea page actually renders.
		'bbi_summary'              => array( 'type' => 'string', 'label' => 'Summary', 'sanitize' => 'wp_kses_post' ),
		'bbi_business_description' => array( 'type' => 'string', 'label' => 'Business description (seed)', 'sanitize' => 'sanitize_textarea_field' ),
		'bbi_market_opportunity'   => array( 'type' => 'string', 'label' => 'Market opportunity', 'sanitize' => 'wp_kses_post' ),
		'bbi_target_customer'      => array( 'type' => 'string', 'label' => 'Target customer', 'sanitize' => 'wp_kses_post' ),
		'bbi_how_you_make_money'   => array( 'type' => 'string', 'label' => 'How you make money', 'sanitize' => 'wp_kses_post' ),
		'bbi_startup_cost'         => array( 'type' => 'string', 'label' => 'Startup cost', 'sanitize' => 'wp_kses_post' ),
		'bbi_income_potential'     => array( 'type' => 'string', 'label' => 'Income potential', 'sanitize' => 'wp_kses_post' ),
		'bbi_competition_edge'     => array( 'type' => 'string', 'label' => 'Competition edge', 'sanitize' => 'wp_kses_post' ),
		'bbi_time_to_first_customer' => array( 'type' => 'string', 'label' => 'Time to first customer', 'sanitize' => 'wp_kses_post' ),
		'bbi_verdict'              => array( 'type' => 'string', 'label' => 'Verdict', 'sanitize' => 'wp_kses_post' ),

		// Scored fields.
		'bbi_trend_score'          => array( 'type' => 'integer', 'label' => 'Trend score (0-100)', 'sanitize' => 'absint' ),
		'bbi_tier'                 => array( 'type' => 'string', 'label' => 'Tier (free/premium)', 'sanitize' => 'sanitize_text_field' ),

		// Lists, stored as JSON strings.
		'bbi_tags'                 => array( 'type' => 'string', 'label' => 'Tags (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_pros_json'            => array( 'type' => 'string', 'label' => 'Pros (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_cons_json'            => array( 'type' => 'string', 'label' => 'Cons (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_getting_started_steps' => array( 'type' => 'string', 'label' => 'Getting started steps (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_tools_needed'         => array( 'type' => 'string', 'label' => 'Tools needed (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_faq_json'             => array( 'type' => 'string', 'label' => 'FAQs (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_external_links'       => array( 'type' => 'string', 'label' => 'External links (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_internal_link_anchors' => array( 'type' => 'string', 'label' => 'Internal link anchors (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
		'bbi_research_facts'       => array( 'type' => 'string', 'label' => 'Research facts (JSON)', 'sanitize' => 'bbi_sanitize_json' ),
	);
}

/**
 * Sanitise a JSON string.
 *
 * Rejects anything that will not parse, rather than storing a broken string
 * that blows up in a template later. An unparseable value becomes an empty
 * array, which every template already handles.
 *
 * @param mixed $value Raw value.
 * @return string A JSON string that is guaranteed to parse.
 */
function bbi_sanitize_json( $value ) {
	if ( is_array( $value ) ) {
		return wp_json_encode( $value );
	}
	$value = (string) $value;
	if ( '' === trim( $value ) ) {
		return '[]';
	}
	$decoded = json_decode( $value, true );
	if ( null === $decoded && JSON_ERROR_NONE !== json_last_error() ) {
		return '[]';
	}
	return wp_json_encode( $decoded );
}

/**
 * Read a JSON meta field back as a PHP array.
 *
 * Supabase stores some of these double-encoded — `research_facts` is a jsonb
 * holding a JSON *string* rather than a JSON object. Decoding twice when the
 * first pass yields a string handles both shapes without the caller caring.
 *
 * @param int    $post_id Post ID.
 * @param string $key     Meta key.
 * @return array
 */
function bbi_get_json( $post_id, $key ) {
	$raw = get_post_meta( $post_id, $key, true );
	if ( empty( $raw ) ) {
		return array();
	}
	$decoded = is_array( $raw ) ? $raw : json_decode( (string) $raw, true );
	if ( is_string( $decoded ) ) {
		$decoded = json_decode( $decoded, true );
	}
	return is_array( $decoded ) ? $decoded : array();
}

/**
 * Register every idea field with WordPress.
 */
function bbi_register_meta() {
	foreach ( bbi_idea_fields() as $key => $spec ) {
		register_post_meta(
			'bbi_idea',
			$key,
			array(
				'type'              => $spec['type'],
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => $spec['sanitize'],
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	// FAQ pool entries. The question is the post title and the answer is the
	// post content, so only the ordering weight needs a field of its own.
	register_post_meta(
		'bbi_faq',
		'bbi_faq_weight',
		array(
			'type'              => 'integer',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'absint',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'bbi_register_meta' );

/**
 * The edit screen.
 *
 * A single meta box holding every field, grouped the way the idea page reads
 * them. `custom-fields` support is also enabled on the post type, so anything
 * added later is still reachable even before it gets a control here.
 */
function bbi_add_meta_boxes() {
	add_meta_box(
		'bbi_idea_fields',
		__( 'Idea blueprint', 'bbi' ),
		'bbi_render_meta_box',
		'bbi_idea',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'bbi_add_meta_boxes' );

/**
 * Render the meta box.
 *
 * @param WP_Post $post Current post.
 */
function bbi_render_meta_box( $post ) {
	wp_nonce_field( 'bbi_save_idea', 'bbi_idea_nonce' );
	echo '<style>.bbi-f{margin:0 0 18px}.bbi-f label{display:block;font-weight:600;margin:0 0 4px}.bbi-f input[type=text],.bbi-f textarea{width:100%}.bbi-f textarea{min-height:84px}.bbi-f .description{color:#646970;font-size:12px}</style>';

	foreach ( bbi_idea_fields() as $key => $spec ) {
		$value    = get_post_meta( $post->ID, $key, true );
		$is_json  = 'bbi_sanitize_json' === $spec['sanitize'];
		$is_long  = $is_json || in_array(
			$key,
			array(
				'bbi_summary', 'bbi_market_opportunity', 'bbi_target_customer',
				'bbi_how_you_make_money', 'bbi_startup_cost', 'bbi_income_potential',
				'bbi_competition_edge', 'bbi_verdict', 'bbi_meta_description',
				'bbi_business_description', 'bbi_time_to_first_customer',
			),
			true
		);

		echo '<div class="bbi-f">';
		printf( '<label for="%1$s">%2$s</label>', esc_attr( $key ), esc_html( $spec['label'] ) );

		if ( $is_long ) {
			printf(
				'<textarea id="%1$s" name="%1$s" rows="%2$d">%3$s</textarea>',
				esc_attr( $key ),
				$is_json ? 5 : 4,
				esc_textarea( is_array( $value ) ? wp_json_encode( $value ) : (string) $value )
			);
			if ( $is_json ) {
				echo '<p class="description">' . esc_html__( 'JSON. Invalid JSON is rejected on save and stored as an empty list rather than breaking the page.', 'bbi' ) . '</p>';
			}
		} else {
			printf(
				'<input type="text" id="%1$s" name="%1$s" value="%2$s" />',
				esc_attr( $key ),
				esc_attr( (string) $value )
			);
		}
		echo '</div>';
	}
}

/**
 * Save the meta box.
 *
 * @param int $post_id Post ID.
 */
function bbi_save_meta_box( $post_id ) {
	if ( ! isset( $_POST['bbi_idea_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bbi_idea_nonce'] ) ), 'bbi_save_idea' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	foreach ( bbi_idea_fields() as $key => $spec ) {
		if ( ! isset( $_POST[ $key ] ) ) {
			continue;
		}
		$raw   = wp_unslash( $_POST[ $key ] );
		$clean = call_user_func( $spec['sanitize'], $raw );
		update_post_meta( $post_id, $key, $clean );
	}
}
add_action( 'save_post_bbi_idea', 'bbi_save_meta_box' );
