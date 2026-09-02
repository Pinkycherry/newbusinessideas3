/**
 * Orbit Diagram — editor side.
 *
 * The node positions are trigonometry over the node count, so they are
 * computed in PHP at render time rather than stored. Typing a fifth node
 * re-spaces all five; nothing has to be repositioned by hand.
 */
( function ( wp ) {
	'use strict';
	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var C = wp.components;

	wp.blocks.registerBlockType( 'bbi/orbit', {
		edit: function ( props ) {
			var a = props.attributes, set = props.setAttributes;
			return el(
				wp.element.Fragment, null,
				el( wp.blockEditor.InspectorControls, null,
					el( C.PanelBody, { title: __( 'Orbit', 'bbi' ), initialOpen: true },
						el( C.TextControl, {
							label: __( 'Centre label', 'bbi' ),
							value: a.centerLabel,
							onChange: function ( v ) { set( { centerLabel: v } ); }
						} ),
						el( C.TextControl, {
							label: __( 'Centre subtitle', 'bbi' ),
							value: a.centerSub,
							onChange: function ( v ) { set( { centerSub: v } ); }
						} ),
						el( C.TextareaControl, {
							label: __( 'Nodes, one per line', 'bbi' ),
							help: __( 'They space themselves evenly around the ring, however many there are.', 'bbi' ),
							value: a.nodes,
							onChange: function ( v ) { set( { nodes: v } ); }
						} )
					)
				),
				el( 'div', wp.blockEditor.useBlockProps(),
					el( wp.serverSideRender, { block: 'bbi/orbit', attributes: a } ) )
			);
		},
		save: function () { return null; }
	} );
} )( window.wp );
