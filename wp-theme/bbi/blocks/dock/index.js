/**
 * Scroll Dock — editor side.
 *
 * The dock is `position: fixed`, so a live preview inside the editor canvas
 * would float over the editing surface and sit in the way of the very content
 * it is meant to accompany. A static placeholder is shown instead — this is
 * the one block where ServerSideRender is the wrong choice.
 */
( function ( wp ) {
	'use strict';
	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var C = wp.components;

	wp.blocks.registerBlockType( 'bbi/dock', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;

			return el(
				wp.element.Fragment,
				null,
				el(
					wp.blockEditor.InspectorControls,
					null,
					el(
						C.PanelBody,
						{ title: __( 'Scroll dock', 'bbi' ), initialOpen: true },
						el( C.ToggleControl, {
							label: __( 'Back-to-top button', 'bbi' ),
							checked: a.showTop,
							onChange: function ( v ) { set( { showTop: v } ); }
						} ),
						el( C.ToggleControl, {
							label: __( 'Section jump list', 'bbi' ),
							help: __( 'Lists any block on the page given an HTML anchor.', 'bbi' ),
							checked: a.showSections,
							onChange: function ( v ) { set( { showSections: v } ); }
						} ),
						el( C.RangeControl, {
							label: __( 'Appear after scrolling (px)', 'bbi' ),
							value: a.threshold,
							min: 0,
							max: 2000,
							step: 50,
							onChange: function ( v ) { set( { threshold: v } ); }
						} )
					)
				),
				el(
					'div',
					wp.blockEditor.useBlockProps( { className: 'bbi-dock-placeholder' } ),
					el( C.Placeholder, {
						icon: 'arrow-up-alt',
						label: __( 'Scroll Dock', 'bbi' ),
						instructions: __( 'Fixed to the bottom-right on the live page. Not previewed here, because a fixed element would float over the editor and cover what you are editing.', 'bbi' )
					} )
				)
			);
		},
		save: function () { return null; }
	} );
} )( window.wp );
