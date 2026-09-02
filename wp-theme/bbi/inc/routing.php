<?php
/**
 * Serving live Supabase content at the real URLs.
 *
 * Before the importer has run there are no `bbi_idea` posts, so `/idea/<slug>/`
 * and `/category/<slug>/` are both 404s as far as WordPress is concerned. This
 * catches those 404s and renders the row from Supabase instead, at the URL the
 * card already links to.
 *
 * It is deliberately narrow. It only ever runs when:
 *
 *   - WordPress has already decided the request is a 404, so it can never
 *     shadow a real post; and
 *   - the data source resolves to `live`, which in the default `fallback`
 *     mode is only true while WordPress holds no ideas at all.
 *
 * The moment the import runs, WordPress answers these URLs itself and none of
 * this executes again.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Read the requested path, without query string or install subdirectory.
 *
 * @return string Path with no leading or trailing slash.
 */
function bbi_request_path() {
	$request = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
	$path    = (string) wp_parse_url( $request, PHP_URL_PATH );

	// An install in a subdirectory has that directory on the front of every
	// path, and matching without stripping it silently never fires.
	$home = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	if ( '' !== $home && '/' !== $home && 0 === strpos( $path, $home ) ) {
		$path = substr( $path, strlen( $home ) );
	}

	return trim( $path, '/' );
}

/**
 * What, if anything, this request should be served live.
 *
 * @return array{kind:string, slug:string}|null
 */
function bbi_live_route() {
	if ( ! is_404() || 'live' !== bbi_source() ) {
		return null;
	}

	$path = bbi_request_path();
	if ( '' === $path ) {
		return null;
	}

	$parts = explode( '/', $path );
	if ( 2 !== count( $parts ) ) {
		return null;
	}

	$slug = sanitize_title( $parts[1] );
	if ( '' === $slug ) {
		return null;
	}

	if ( 'idea' === $parts[0] ) {
		return array( 'kind' => 'idea', 'slug' => $slug );
	}
	if ( 'category' === $parts[0] ) {
		return array( 'kind' => 'category', 'slug' => $slug );
	}

	return null;
}

/**
 * Swap in the live template, and correct the status header.
 *
 * WordPress has already sent 404 by the time `template_include` runs, so the
 * status is reset here. Leaving it at 404 would mean a page that renders
 * perfectly and is invisible to every crawler — the worst of both outcomes,
 * and completely silent.
 *
 * @param string $template Template path WordPress chose.
 * @return string
 */
function bbi_live_template( $template ) {
	$route = bbi_live_route();
	if ( ! $route ) {
		return $template;
	}

	// Confirm the row exists BEFORE claiming the URL. A slug that is not in
	// Supabase either must stay a genuine 404.
	if ( 'idea' === $route['kind'] ) {
		$idea = bbi_sb_idea( $route['slug'] );
		if ( empty( $idea['row'] ) ) {
			return $template;
		}
		$GLOBALS['bbi_live_row'] = $idea['row'];
	} else {
		// Paged, not capped. A flat 60 made a 90-idea category render 60 and
		// say nothing about the rest — a page that looks complete while hiding
		// a third of itself.
		$paged  = max( 1, (int) get_query_var( 'paged' ) ?: (int) get_query_var( 'page' ) );
		$per    = 24;
		$rows   = bbi_sb_category( $route['slug'], $per, ( $paged - 1 ) * $per );

		if ( empty( $rows['rows'] ) ) {
			return $template;
		}

		$GLOBALS['bbi_live_rows']  = $rows['rows'];
		$GLOBALS['bbi_live_total'] = isset( $rows['total'] ) ? (int) $rows['total'] : 0;
		$GLOBALS['bbi_live_paged'] = $paged;
		$GLOBALS['bbi_live_more']  = count( $rows['rows'] ) >= $per;
	}

	status_header( 200 );
	global $wp_query;
	$wp_query->is_404 = false;

	$found = locate_template( 'templates/live-' . $route['kind'] . '.php' );
	return $found ? $found : $template;
}
add_filter( 'template_include', 'bbi_live_template', 99 );
