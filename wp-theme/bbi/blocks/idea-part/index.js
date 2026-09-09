/**
 * The Idea Part block — editor side.
 *
 * One block with a `part` selector rather than eight separate blocks. Eight
 * blocks would mean eight block.json files, eight registrations and eight
 * entries cluttering the inserter, all sharing one render path — the selector
 * keeps them together and makes swapping one section for another a dropdown
 * instead of a delete-and-reinsert.
 *
 * Plain JS, no JSX — see blocks/animate/index.js.
 */
( function ( wp ) {
	'use strict';

	var el = wp.element.createElement;
	var __ = wp.i18n.__;

	var InspectorControls = wp.blockEditor.InspectorControls;
	var useBlockProps     = wp.blockEditor.useBlockProps;
	var PanelBody         = wp.components.PanelBody;
	var SelectControl     = wp.components.SelectControl;
	var TextControl       = wp.components.TextControl;
	var ServerSideRender  = wp.serverSideRender;

	var PARTS = [
		{ label: __( 'Breadcrumb', 'bbi' ),            value: 'breadcrumb' },
		{ label: __( 'Category label', 'bbi' ),        value: 'category' },
		{ label: __( 'Summary', 'bbi' ),               value: 'summary' },
		{ label: __( 'Trend score and bar', 'bbi' ),   value: 'trend' },
		{ label: __( 'The narrative sections', 'bbi' ), value: 'sections' },
		{ label: __( 'Pros and cons', 'bbi' ),         value: 'proscons' },
		{ label: __( 'Getting started steps', 'bbi' ), value: 'steps' },
		{ label: __( 'Tools needed', 'bbi' ),          value: 'tools' },
		{ label: __( 'Verdict', 'bbi' ),               value: 'verdict' },
		{ label: __( 'FAQ', 'bbi' ),                   value: 'faq' }
	];

	wp.blocks.registerBlockType( 'bbi/idea-part', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;
			var blockProps = useBlockProps();

			return el(
				wp.element.Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Which part', 'bbi' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Part', 'bbi' ),
							value: a.part,
							options: PARTS,
							onChange: function ( v ) { set( { part: v } ); }
						} ),
						el( TextControl, {
							label: __( 'Heading override', 'bbi' ),
							help: __( 'Leave empty to use the default heading for this part.', 'bbi' ),
							value: a.heading,
							onChange: function ( v ) { set( { heading: v } ); }
						} )
					)
				),
				el( 'div', blockProps, el( ServerSideRender, {
					block: 'bbi/idea-part',
					attributes: a
				} ) )
			);
		},

		save: function () { return null; }
	} );
} )( window.wp );
