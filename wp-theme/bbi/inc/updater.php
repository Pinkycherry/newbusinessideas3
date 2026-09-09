<?php
/**
 * Self-update from GitHub.
 *
 * WordPress only offers update notices for themes it can find on wordpress.org.
 * This makes a private, self-hosted theme behave the same way: a version bump
 * pushed to the repo shows up as a normal "Update available" notice under
 * Appearance → Themes, and one click installs it.
 *
 * That removes the download-a-zip-and-re-upload cycle entirely, which is the
 * only thing that made iterating on this theme unscalable.
 *
 * ------------------------------------------------------------------
 * HOW IT DECIDES THERE IS AN UPDATE
 * ------------------------------------------------------------------
 *
 * It fetches a small JSON manifest from the repo and compares its `version`
 * against the `Version:` header in this theme's own style.css, using
 * `version_compare()` rather than a string comparison — as strings, "0.10.0"
 * sorts BELOW "0.9.0", so a tenth release would silently never offer itself.
 *
 * The package it downloads is `bbi-theme.zip`, committed at the repo root,
 * whose archive root is a single `bbi/` folder. WordPress requires that shape;
 * an archive whose root holds the theme's own files installs as a broken theme.
 *
 * ------------------------------------------------------------------
 * WHY A MANIFEST AND NOT THE GITHUB RELEASES API
 * ------------------------------------------------------------------
 *
 * Releases would work, but they add a step to every publish and the API is
 * rate-limited to 60 unauthenticated requests per hour per IP — on shared
 * hosting that limit is shared with every other site on the box. A raw file
 * has no such limit and needs no token.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Where updates come from.
 *
 * Defined as constants so a fork, or the eventual move to `main`, is a
 * one-line change rather than a search through the file.
 */
if ( ! defined( 'BBI_UPDATE_REPO' ) ) {
	define( 'BBI_UPDATE_REPO', 'Pinkycherry/newbusinessideas3' );
}
if ( ! defined( 'BBI_UPDATE_BRANCH' ) ) {
	// Change to 'main' once the pull request is merged.
	define( 'BBI_UPDATE_BRANCH', 'claude/bbi-continuation-sj6nbr' );
}

const BBI_UPDATE_TRANSIENT = 'bbi_update_manifest';
const BBI_UPDATE_TTL       = 6 * HOUR_IN_SECONDS;

/**
 * The raw-file base for the configured repo and branch.
 *
 * @return string
 */
function bbi_update_base() {
	return 'https://raw.githubusercontent.com/' . BBI_UPDATE_REPO . '/' . BBI_UPDATE_BRANCH . '/';
}

/**
 * Fetch and cache the update manifest.
 *
 * @param bool $force Skip the cache.
 * @return array{version:string, download:string, tested:string, requires:string, requires_php:string, changelog:string}|null
 */
function bbi_update_manifest( $force = false ) {
	if ( ! $force ) {
		$cached = get_transient( BBI_UPDATE_TRANSIENT );
		if ( is_array( $cached ) ) {
			return $cached;
		}
	}

	$response = wp_remote_get(
		bbi_update_base() . 'wp-theme/bbi-update.json',
		array( 'timeout' => 10, 'headers' => array( 'Accept' => 'application/json' ) )
	);

	if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
		// Cache the failure briefly. Without this a site with no outbound
		// network re-requests on every admin page load, and every one of those
		// blocks the page for the full timeout.
		set_transient( BBI_UPDATE_TRANSIENT, array(), 15 * MINUTE_IN_SECONDS );
		return null;
	}

	$data = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( ! is_array( $data ) || empty( $data['version'] ) ) {
		set_transient( BBI_UPDATE_TRANSIENT, array(), 15 * MINUTE_IN_SECONDS );
		return null;
	}

	$manifest = wp_parse_args(
		$data,
		array(
			'version'      => '0.0.0',
			'download'     => bbi_update_base() . 'bbi-theme.zip',
			'tested'       => '',
			'requires'     => '6.4',
			'requires_php' => '8.0',
			'changelog'    => '',
		)
	);

	set_transient( BBI_UPDATE_TRANSIENT, $manifest, BBI_UPDATE_TTL );
	return $manifest;
}

/**
 * Tell WordPress an update exists.
 *
 * @param object $transient The update_themes transient.
 * @return object
 */
function bbi_check_for_update( $transient ) {
	if ( ! is_object( $transient ) ) {
		return $transient;
	}

	$manifest = bbi_update_manifest();
	if ( ! $manifest || empty( $manifest['version'] ) ) {
		return $transient;
	}

	$theme = wp_get_theme( 'bbi' );
	$here  = $theme->exists() ? $theme->get( 'Version' ) : BBI_VERSION;

	// version_compare, never a string comparison: as strings "0.10.0" sorts
	// below "0.9.0" and the tenth release would never offer itself.
	if ( ! version_compare( $manifest['version'], $here, '>' ) ) {
		return $transient;
	}

	if ( ! isset( $transient->response ) || ! is_array( $transient->response ) ) {
		$transient->response = array();
	}

	$transient->response['bbi'] = array(
		'theme'        => 'bbi',
		'new_version'  => $manifest['version'],
		'url'          => 'https://github.com/' . BBI_UPDATE_REPO,
		'package'      => $manifest['download'],
		'requires'     => $manifest['requires'],
		'requires_php' => $manifest['requires_php'],
	);

	return $transient;
}
add_filter( 'pre_set_site_transient_update_themes', 'bbi_check_for_update' );

/**
 * Make sure the extracted folder is named `bbi`.
 *
 * WordPress installs a theme into a directory named after whatever the archive
 * happened to contain. Our archive is already `bbi/`, but a zip downloaded from
 * a branch tarball would be `newbusinessideas3-<branch>/`, and the theme would
 * install alongside itself under a new name instead of updating in place —
 * leaving two copies and the old one still active. This guards against that.
 *
 * @param string      $source        Extracted directory.
 * @param string      $remote_source Parent directory.
 * @param WP_Upgrader $upgrader      Upgrader instance.
 * @param array       $args          Hook args.
 * @return string|WP_Error
 */
function bbi_fix_update_source( $source, $remote_source, $upgrader, $args = array() ) {
	if ( ! isset( $args['theme'] ) || 'bbi' !== $args['theme'] ) {
		return $source;
	}

	if ( 'bbi' === basename( untrailingslashit( $source ) ) ) {
		return $source;
	}

	global $wp_filesystem;
	$corrected = trailingslashit( $remote_source ) . 'bbi';

	if ( $wp_filesystem && $wp_filesystem->move( $source, $corrected, true ) ) {
		return trailingslashit( $corrected );
	}

	return $source;
}
add_filter( 'upgrader_source_selection', 'bbi_fix_update_source', 10, 4 );

/**
 * Clear the cached manifest after an update, and after a manual check.
 */
function bbi_clear_update_cache() {
	delete_transient( BBI_UPDATE_TRANSIENT );
}
add_action( 'upgrader_process_complete', 'bbi_clear_update_cache' );

/**
 * A "check now" button, because WordPress only polls twice a day.
 *
 * Waiting twelve hours to see a fix you were told was pushed is the kind of
 * thing that makes people give up on an update mechanism and go back to
 * uploading zips.
 */
function bbi_update_check_now() {
	if ( ! current_user_can( 'update_themes' ) ) {
		return;
	}
	if ( ! isset( $_GET['bbi_check_update'] ) ) {
		return;
	}
	check_admin_referer( 'bbi_check_update' );

	bbi_clear_update_cache();
	delete_site_transient( 'update_themes' );
	wp_update_themes();

	wp_safe_redirect( admin_url( 'themes.php?bbi_checked=1' ) );
	exit;
}
add_action( 'admin_init', 'bbi_update_check_now' );

/**
 * Show the current and available versions on the Themes screen.
 */
function bbi_update_notice() {
	$screen = get_current_screen();
	if ( ! $screen || 'themes' !== $screen->id || ! current_user_can( 'update_themes' ) ) {
		return;
	}

	$manifest = bbi_update_manifest();
	$link     = wp_nonce_url( admin_url( 'themes.php?bbi_check_update=1' ), 'bbi_check_update' );

	echo '<div class="notice notice-info"><p>';

	printf(
		/* translators: %s: installed theme version. */
		esc_html__( 'BBI theme %s installed.', 'bbi' ),
		esc_html( BBI_VERSION )
	);

	if ( $manifest && ! empty( $manifest['version'] ) ) {
		if ( version_compare( $manifest['version'], BBI_VERSION, '>' ) ) {
			echo ' <strong>';
			printf(
				/* translators: %s: available version. */
				esc_html__( 'Version %s is available — use the update link on the theme card above.', 'bbi' ),
				esc_html( $manifest['version'] )
			);
			echo '</strong>';
			if ( ! empty( $manifest['changelog'] ) ) {
				echo ' ' . esc_html( $manifest['changelog'] );
			}
		} else {
			echo ' ' . esc_html__( 'This is the latest version.', 'bbi' );
		}
	} else {
		echo ' ' . esc_html__( 'Could not reach GitHub to check for updates.', 'bbi' );
	}

	printf( ' <a href="%s">%s</a>', esc_url( $link ), esc_html__( 'Check again now', 'bbi' ) );
	echo '</p></div>';
}
add_action( 'admin_notices', 'bbi_update_notice' );
