<?php
/**
 * Script dependencies for the Animate block's editor script.
 *
 * `register_block_type` reads this file (same basename as the script, with
 * `.asset.php`) to learn what the script needs. Without it WordPress registers
 * the script with NO dependencies, `wp.blockEditor` and `wp.components` are
 * undefined when it runs, and the block never appears in the inserter — with
 * nothing in the PHP error log to explain why, because the failure is in the
 * browser.
 *
 * Normally @wordpress/scripts generates this at build time. This theme has no
 * build step on purpose, so it is written by hand and must be kept in step
 * with what index.js actually uses.
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
	),
	'version'      => '0.5.0',
);
