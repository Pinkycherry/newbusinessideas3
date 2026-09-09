/**
 * The Animate block — editor side.
 *
 * Written in plain JavaScript with wp.element.createElement rather than JSX,
 * deliberately. JSX needs a build step, and a WordPress theme that requires
 * `npm run build` before anyone can change a block is a theme that stops being
 * edited. This file is loaded exactly as it is written.
 *
 * The block stores its settings as attributes and the PHP render callback
 * turns them into data attributes; `motion.js` reads those at runtime. Nothing
 * here writes CSS, so a change in the sidebar and a change in the stylesheet
 * can never disagree about what the animation does.
 */
( function ( wp ) {
	'use strict';

	var el = wp.element.createElement;
	var __ = wp.i18n.__;

	var InspectorControls = wp.blockEditor.InspectorControls;
	var useBlockProps     = wp.blockEditor.useBlockProps;
	var InnerBlocks       = wp.blockEditor.InnerBlocks;

	var PanelBody     = wp.components.PanelBody;
	var SelectControl = wp.components.SelectControl;
	var RangeControl  = wp.components.RangeControl;
	var ToggleControl = wp.components.ToggleControl;

	wp.blocks.registerBlockType( 'bbi/animate', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;

			// The preview shows the RESTING state, not the animation. An
			// editor canvas that keeps replaying a reveal makes the text
			// underneath impossible to actually edit.
			var blockProps = useBlockProps( {
				className: 'bbi-anim-preview',
				'data-bbi-direction': a.direction,
			} );

			return el(
				wp.element.Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Animation', 'bbi' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Direction', 'bbi' ),
							value: a.direction,
							options: [
								{ label: __( 'Up (from below)', 'bbi' ), value: 'up' },
								{ label: __( 'Down (from above)', 'bbi' ), value: 'down' },
								{ label: __( 'In from the left', 'bbi' ), value: 'left' },
								{ label: __( 'In from the right', 'bbi' ), value: 'right' },
								{ label: __( 'Fade only, no movement', 'bbi' ), value: 'fade' },
								{ label: __( 'Scale', 'bbi' ), value: 'scale' },
								{ label: __( 'None', 'bbi' ), value: 'none' }
							],
							onChange: function ( v ) { set( { direction: v } ); }
						} ),
						a.direction !== 'fade' && a.direction !== 'none' && a.direction !== 'scale'
							? el( RangeControl, {
								label: __( 'Travel distance (px)', 'bbi' ),
								value: a.distance,
								min: 0,
								max: 160,
								step: 2,
								onChange: function ( v ) { set( { distance: v } ); }
							} )
							: null,
						a.direction === 'scale'
							? el( RangeControl, {
								label: __( 'Start scale (%)', 'bbi' ),
								value: a.scale,
								min: 70,
								max: 130,
								step: 1,
								onChange: function ( v ) { set( { scale: v } ); }
							} )
							: null,
						el( RangeControl, {
							label: __( 'Duration (ms)', 'bbi' ),
							value: a.duration,
							min: 100,
							max: 2000,
							step: 50,
							onChange: function ( v ) { set( { duration: v } ); }
						} ),
						el( RangeControl, {
							label: __( 'Delay (ms)', 'bbi' ),
							value: a.delay,
							min: 0,
							max: 1500,
							step: 25,
							onChange: function ( v ) { set( { delay: v } ); }
						} ),
						el( RangeControl, {
							label: __( 'Stagger children (ms)', 'bbi' ),
							help: __( 'Children arrive one after another instead of together. 0 turns it off.', 'bbi' ),
							value: a.stagger,
							min: 0,
							max: 300,
							step: 10,
							onChange: function ( v ) { set( { stagger: v } ); }
						} ),
						el( ToggleControl, {
							label: __( 'Replay on every scroll pass', 'bbi' ),
							help: a.replay
								? __( 'Plays again each time it comes back into view.', 'bbi' )
								: __( 'Plays once per page load. Most visitors will never see it.', 'bbi' ),
							checked: a.replay,
							onChange: function ( v ) { set( { replay: v } ); }
						} )
					)
				),
				el( 'div', blockProps, el( InnerBlocks, {
					templateLock: false,
					renderAppender: InnerBlocks.ButtonBlockAppender
				} ) )
			);
		},

		// Dynamic: PHP owns the markup, so changing how animations render
		// never invalidates already-saved blocks.
		save: function () {
			return el( InnerBlocks.Content );
		}
	} );
} )( window.wp );
