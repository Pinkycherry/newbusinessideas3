/**
 * The Idea Grid block — editor side.
 *
 * Uses ServerSideRender so the editor shows the REAL cards, with the real
 * ideas, from whichever source the site is currently reading. A hand-drawn
 * editor preview would be a second implementation of the card that drifts from
 * the front end, and the drift is invisible until someone publishes.
 *
 * Plain JS, no JSX — see the note in blocks/animate/index.js.
 */
( function ( wp ) {
	'use strict';

	var el = wp.element.createElement;
	var __ = wp.i18n.__;

	var InspectorControls = wp.blockEditor.InspectorControls;
	var useBlockProps     = wp.blockEditor.useBlockProps;

	var PanelBody      = wp.components.PanelBody;
	var RangeControl   = wp.components.RangeControl;
	var SelectControl  = wp.components.SelectControl;
	var ToggleControl  = wp.components.ToggleControl;
	var TextControl    = wp.components.TextControl;
	var ServerSideRender = wp.serverSideRender;

	// Categories are fetched from the site rather than typed in. A hand-typed
	// slug that does not exist renders an empty grid with no error, and two
	// hand-typed slugs have already shipped broken once on this project.
	function categoryOptions() {
		var options = [ { label: __( 'Every category', 'bbi' ), value: '' } ];
		var terms = ( window.BBI_BLOCK_DATA && window.BBI_BLOCK_DATA.categories ) || [];
		terms.forEach( function ( t ) {
			options.push( { label: t.name + ' (' + t.count + ')', value: t.slug } );
		} );
		return options;
	}

	wp.blocks.registerBlockType( 'bbi/idea-grid', {
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
						{ title: __( 'Which ideas', 'bbi' ), initialOpen: true },
						el( TextControl, {
							label: __( 'Heading (optional)', 'bbi' ),
							value: a.heading,
							onChange: function ( v ) { set( { heading: v } ); }
						} ),
						el( SelectControl, {
							label: __( 'Category', 'bbi' ),
							value: a.category,
							options: categoryOptions(),
							onChange: function ( v ) { set( { category: v } ); }
						} ),
						el( SelectControl, {
							label: __( 'Order by', 'bbi' ),
							value: a.order,
							options: [
								{ label: __( 'Trend score, highest first', 'bbi' ), value: 'trend' },
								{ label: __( 'Newest first', 'bbi' ), value: 'date' },
								{ label: __( 'Title, A to Z', 'bbi' ), value: 'title' }
							],
							onChange: function ( v ) { set( { order: v } ); }
						} ),
						el( RangeControl, {
							label: __( 'How many', 'bbi' ),
							value: a.count,
							min: 1,
							max: 48,
							onChange: function ( v ) { set( { count: v } ); }
						} )
					),
					el(
						PanelBody,
						{ title: __( 'Layout', 'bbi' ), initialOpen: false },
						el( RangeControl, {
							label: __( 'Columns on desktop', 'bbi' ),
							value: a.columns,
							min: 1,
							max: 4,
							onChange: function ( v ) { set( { columns: v } ); }
						} )
					),
					el(
						PanelBody,
						{ title: __( 'What each card shows', 'bbi' ), initialOpen: false },
						el( ToggleControl, {
							label: __( 'Category label', 'bbi' ),
							checked: a.showCategory,
							onChange: function ( v ) { set( { showCategory: v } ); }
						} ),
						el( ToggleControl, {
							label: __( 'Summary', 'bbi' ),
							checked: a.showSummary,
							onChange: function ( v ) { set( { showSummary: v } ); }
						} ),
						a.showSummary
							? el( RangeControl, {
								label: __( 'Summary length (words)', 'bbi' ),
								value: a.summaryWords,
								min: 8,
								max: 80,
								onChange: function ( v ) { set( { summaryWords: v } ); }
							} )
							: null,
						el( ToggleControl, {
							label: __( 'Trend score and bar', 'bbi' ),
							checked: a.showTrend,
							onChange: function ( v ) { set( { showTrend: v } ); }
						} )
					)
				),
				el(
					'div',
					blockProps,
					el( ServerSideRender, {
						block: 'bbi/idea-grid',
						attributes: a
					} )
				)
			);
		},

		// Fully dynamic — nothing is saved into post content, so the grid is
		// never stale and never needs a block recovery after a template change.
		save: function () { return null; }
	} );
} )( window.wp );
