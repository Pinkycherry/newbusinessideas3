/**
 * Business Icon Band — editor side.
 *
 * ServerSideRender, so the editor shows the real band. The eighteen icon paths
 * live in PHP; duplicating them here would be a second copy of the artwork
 * that silently drifts from the front end.
 */
( function ( wp ) {
	'use strict';
	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	wp.blocks.registerBlockType( 'bbi/icon-band', {
		edit: function ( props ) {
			return el(
				wp.element.Fragment,
				null,
				el(
					wp.blockEditor.InspectorControls,
					null,
					el(
						wp.components.PanelBody,
						{ title: __( 'Icon band', 'bbi' ), initialOpen: true },
						el( wp.components.ToggleControl, {
							label: __( 'Bob the icons', 'bbi' ),
							help: __( 'Turn off for a still row.', 'bbi' ),
							checked: props.attributes.animate,
							onChange: function ( v ) { props.setAttributes( { animate: v } ); }
						} )
					)
				),
				el( 'div', wp.blockEditor.useBlockProps(), el( wp.serverSideRender, {
					block: 'bbi/icon-band',
					attributes: props.attributes
				} ) )
			);
		},
		save: function () { return null; }
	} );
} )( window.wp );
