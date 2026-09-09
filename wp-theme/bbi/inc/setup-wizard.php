<?php
/**
 * One-click site setup.
 *
 * Creates the pages the site expects, builds the header and footer menus, and
 * assigns them to their theme locations.
 *
 * This exists because of a decision made earlier in the theme that was correct
 * but left a hole: `wp_nav_menu()` is called with `fallback_cb => false`, so an
 * unassigned menu location renders NOTHING rather than WordPress's default
 * dump of every published page. That is the right behaviour for a finished
 * site and a terrible first impression on a fresh one — the header and footer
 * simply look broken, with nothing on screen to explain why.
 *
 * Everything here is idempotent. Run it twice and it finds what it already
 * made and leaves it alone; it never creates a second copy of a page, and it
 * never overwrites content that has been edited.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * The pages this site expects, in menu order.
 *
 * The copy is a real first draft rather than lorem ipsum — a placeholder page
 * that says "Add content here" is a page nobody remembers to finish, and it is
 * publicly visible in the meantime.
 *
 * @return array<string, array{title:string, content:string, footer:bool, header:bool}>
 */
function bbi_setup_pages() {
	return array(
		'about'      => array(
			'title'   => __( 'About', 'bbi' ),
			'header'  => true,
			'footer'  => true,
			'content' => __( 'BBI is a free library of researched business ideas. Every blueprint answers four things: who specifically will pay you, how the money actually works, what will hurt in year one, and a straight verdict on whether you are the right person to build it — including "do not build this one" when that is the honest answer.', 'bbi' ),
		),
		'pricing'    => array(
			'title'   => __( 'Pricing', 'bbi' ),
			'header'  => true,
			'footer'  => true,
			'content' => __( 'One fee, once, for life. No monthly plan and no tier ladder. Browsing the library is free and stays free; paying once unlocks everything, including every idea added after the day you join.', 'bbi' ),
		),
		'contact'    => array(
			'title'   => __( 'Contact', 'bbi' ),
			'header'  => false,
			'footer'  => true,
			'content' => __( 'Suggest a niche you want covered, or tell us where a blueprint is wrong. We read everything.', 'bbi' ),
		),
		'privacy'    => array(
			'title'   => __( 'Privacy Policy', 'bbi' ),
			'header'  => false,
			'footer'  => true,
			'content' => __( 'This is a starting point, not legal advice. Replace it with a policy that describes what this site actually collects before you launch.', 'bbi' ),
		),
		'terms'      => array(
			'title'   => __( 'Terms of Service', 'bbi' ),
			'header'  => false,
			'footer'  => true,
			'content' => __( 'This is a starting point, not legal advice. Replace it before you launch.', 'bbi' ),
		),
		'disclaimer' => array(
			'title'   => __( 'Disclaimer', 'bbi' ),
			'header'  => false,
			'footer'  => true,
			'content' => __( 'The research here is a starting point for your own judgement, not financial or legal advice. No outcome is promised or implied.', 'bbi' ),
		),
	);
}

/**
 * Find a page by slug, or create it.
 *
 * Matched on slug rather than title, because a title can be edited and a slug
 * usually is not — matching on title would create a duplicate the first time
 * someone renamed "About" to "About BBI".
 *
 * @param string $slug Page slug.
 * @param array  $spec Page spec.
 * @return int|WP_Error Page ID.
 */
function bbi_setup_get_page( $slug, $spec ) {
	$existing = get_page_by_path( $slug );
	if ( $existing instanceof WP_Post ) {
		return $existing->ID;
	}

	return wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_title'   => $spec['title'],
			'post_content' => '<!-- wp:paragraph -->' . "\n" . '<p>' . esc_html( $spec['content'] ) . '</p>' . "\n" . '<!-- /wp:paragraph -->',
		),
		true
	);
}

/**
 * Find a menu by name, or create it.
 *
 * @param string $name Menu name.
 * @return int|WP_Error Term ID.
 */
function bbi_setup_get_menu( $name ) {
	$menu = wp_get_nav_menu_object( $name );
	if ( $menu ) {
		return (int) $menu->term_id;
	}
	return wp_create_nav_menu( $name );
}

/**
 * Add an item to a menu unless an equivalent one is already there.
 *
 * Without this check, running the wizard twice doubles every menu.
 *
 * @param int    $menu_id  Menu term ID.
 * @param array  $args     wp_update_nav_menu_item args.
 * @param string $identity A value that uniquely identifies this item.
 * @return void
 */
function bbi_setup_add_item( $menu_id, $args, $identity ) {
	$items = wp_get_nav_menu_items( $menu_id );
	if ( is_array( $items ) ) {
		foreach ( $items as $item ) {
			$existing = 'post_type' === $item->type ? (string) $item->object_id : $item->url;
			if ( $existing === $identity ) {
				return;
			}
		}
	}
	wp_update_nav_menu_item( $menu_id, 0, $args );
}

/**
 * Run the whole setup.
 *
 * @return array<int, string> Human-readable log of what happened.
 */
function bbi_run_setup() {
	$log = array();

	// 1. Pages.
	$pages = array();
	foreach ( bbi_setup_pages() as $slug => $spec ) {
		$before = get_page_by_path( $slug ) instanceof WP_Post;
		$id     = bbi_setup_get_page( $slug, $spec );

		if ( is_wp_error( $id ) ) {
			/* translators: 1: page title, 2: error message. */
			$log[] = sprintf( __( 'Could not create the %1$s page: %2$s', 'bbi' ), $spec['title'], $id->get_error_message() );
			continue;
		}

		$pages[ $slug ] = array( 'id' => (int) $id, 'spec' => $spec );
		$log[]          = $before
			/* translators: %s: page title. */
			? sprintf( __( '%s page already existed — left alone.', 'bbi' ), $spec['title'] )
			/* translators: %s: page title. */
			: sprintf( __( '%s page created.', 'bbi' ), $spec['title'] );
	}

	// 2. Header menu — Browse, the categories hub, then the flagged pages.
	$primary = bbi_setup_get_menu( 'BBI Primary' );
	if ( ! is_wp_error( $primary ) ) {
		$archive = get_post_type_archive_link( 'bbi_idea' );
		if ( $archive ) {
			bbi_setup_add_item(
				$primary,
				array(
					'menu-item-title'  => __( 'Browse', 'bbi' ),
					'menu-item-url'    => $archive,
					'menu-item-type'   => 'custom',
					'menu-item-status' => 'publish',
				),
				$archive
			);
		}

		foreach ( $pages as $page ) {
			if ( empty( $page['spec']['header'] ) ) {
				continue;
			}
			bbi_setup_add_item(
				$primary,
				array(
					'menu-item-title'     => $page['spec']['title'],
					'menu-item-object'    => 'page',
					'menu-item-object-id' => $page['id'],
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				),
				(string) $page['id']
			);
		}

		$log[] = __( 'Header menu built.', 'bbi' );
	}

	// 3. Footer menu.
	$footer = bbi_setup_get_menu( 'BBI Footer' );
	if ( ! is_wp_error( $footer ) ) {
		foreach ( $pages as $page ) {
			if ( empty( $page['spec']['footer'] ) ) {
				continue;
			}
			bbi_setup_add_item(
				$footer,
				array(
					'menu-item-title'     => $page['spec']['title'],
					'menu-item-object'    => 'page',
					'menu-item-object-id' => $page['id'],
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				),
				(string) $page['id']
			);
		}
		$log[] = __( 'Footer menu built.', 'bbi' );
	}

	// 4. Assign them to the theme's locations. This is the step that actually
	// makes the header and footer appear — a menu that exists but is not
	// assigned renders nothing, which is exactly the empty header people see.
	$locations = get_theme_mod( 'nav_menu_locations', array() );
	if ( ! is_array( $locations ) ) {
		$locations = array();
	}
	if ( ! is_wp_error( $primary ) ) {
		$locations['primary'] = (int) $primary;
	}
	if ( ! is_wp_error( $footer ) ) {
		$locations['footer'] = (int) $footer;
	}
	set_theme_mod( 'nav_menu_locations', $locations );
	$log[] = __( 'Menus assigned to the header and footer locations.', 'bbi' );

	// 5. Permalinks. The rewrite rules for the idea post type only exist after
	// a flush, and forgetting it is the single most common reason every idea
	// URL 404s on a freshly activated theme.
	flush_rewrite_rules( false );
	$log[] = __( 'Permalink rules flushed.', 'bbi' );

	update_option( 'bbi_setup_done', time(), false );

	return $log;
}

/**
 * Offer the wizard on the Data screen, and run it when asked.
 *
 * @return array<int, string>|null
 */
function bbi_setup_maybe_run() {
	if ( ! isset( $_POST['bbi_run_setup'] ) ) {
		return null;
	}
	if ( ! isset( $_POST['bbi_data_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bbi_data_nonce'] ) ), 'bbi_save_data' ) ) {
		return array( __( 'That form had expired. Nothing was changed — try again.', 'bbi' ) );
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		return array( __( 'You do not have permission to do that.', 'bbi' ) );
	}
	return bbi_run_setup();
}

/**
 * An admin notice on a site that has not been set up.
 */
function bbi_setup_notice() {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'bbi_setup_done' ) ) {
		return;
	}

	$screen = get_current_screen();
	if ( $screen && 'toplevel_page_bbi-data' === $screen->id ) {
		return;
	}

	echo '<div class="notice notice-warning"><p><strong>';
	esc_html_e( 'BBI: this site has not been set up yet.', 'bbi' );
	echo '</strong> ';
	esc_html_e( 'The header and footer will look empty until the pages and menus exist.', 'bbi' );
	printf(
		' <a href="%s">%s</a></p></div>',
		esc_url( admin_url( 'admin.php?page=bbi-data' ) ),
		esc_html__( 'Run setup', 'bbi' )
	);
}
add_action( 'admin_notices', 'bbi_setup_notice' );
