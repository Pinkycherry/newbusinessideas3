/**
 * Marquee — editor side.
 *
 * Speed is expressed as SECONDS FOR ONE FULL PASS, not as a pixels-per-second
 * rate. A rate produces wildly different results depending on how many items
 * are in the row, so the same setting would feel fast on one page and crawl on
 * another. A duration is stable.
 */
( function ( wp ) {
	'use strict';
	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var C = wp.components;

	wp.blocks.registerBlockType( 'bbi/marquee', {
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
						{ title: __( 'Marquee', 'bbi' ), initialOpen: true },
						el( C.SelectControl, {
							label: __( 'What scrolls', 'bbi' ),
							value: a.source,
							options: [
								{ label: __( 'My idea categories', 'bbi' ), value: 'categories' },
								{ label: __( 'My own list', 'bbi' ), value: 'custom' }
							],
							onChange: function ( v ) { set( { source: v } ); }
						} ),
						a.source === 'custom'
							? el( C.TextareaControl, {
								label: __( 'Items, one per line', 'bbi' ),
								value: a.items,
								onChange: function ( v ) { set( { items: v } ); }
							} )
							: el( C.ToggleControl, {
								label: __( 'Link each pill to its category', 'bbi' ),
								checked: a.linkItems,
								onChange: function ( v ) { set( { linkItems: v } ); }
							} ),
						el( C.SelectControl, {
							label: __( 'Direction', 'bbi' ),
							value: a.direction,
							options: [
								{ label: __( 'Right to left', 'bbi' ), value: 'left' },
								{ label: __( 'Left to right', 'bbi' ), value: 'right' }
							],
							onChange: function ( v ) { set( { direction: v } ); }
						} ),
						el( C.RangeControl, {
							label: __( 'Seconds for one full pass', 'bbi' ),
							help: __( 'Higher is slower. This is a duration, not a speed, so it stays consistent however many items there are.', 'bbi' ),
							value: a.speed,
							min: 10,
							max: 200,
							step: 5,
							onChange: function ( v ) { set( { speed: v } ); }
						} ),
						el( C.ToggleControl, {
							label: __( 'Pause when hovered', 'bbi' ),
							checked: a.pauseOnHover,
							onChange: function ( v ) { set( { pauseOnHover: v } ); }
						} )
					)
				),
				el( 'div', wp.blockEditor.useBlockProps(), el( wp.serverSideRender, {
					block: 'bbi/marquee',
					attributes: a
				} ) )
			);
		},
		save: function () { return null; }
	} );
} )( window.wp );
