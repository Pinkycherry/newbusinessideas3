<?php
/**
 * Script dependencies for the Idea Grid block's editor script.
 *
 * See the note in ../animate/index.asset.php for why this file exists.
 *
 * `wp-server-side-render` is the one that matters most here: the editor
 * preview is a ServerSideRender component, so without that dependency
 * `wp.serverSideRender` is undefined, the edit function throws on its first
 * render, and the block disappears from the inserter entirely.
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
	'version'      => '0.4.0',
);
