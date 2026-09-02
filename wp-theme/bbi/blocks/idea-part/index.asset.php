<?php
/**
 * Script dependencies for the Idea Part block's editor script.
 *
 * See ../animate/index.asset.php. `wp-server-side-render` is required — the
 * preview is a ServerSideRender component, and without the dependency
 * `wp.serverSideRender` is undefined, the edit function throws on first
 * render, and the block vanishes from the inserter with nothing in the PHP log.
 *
 * @package BBI
 */

return array(
	'dependencies' => array(
		'wp-blocks',
		'wp-element',
		'wp-block-editor',
		'wp-components',
		'wp-i18n',
		'wp-server-side-render',
	),
	'version'      => '0.6.0',
);
