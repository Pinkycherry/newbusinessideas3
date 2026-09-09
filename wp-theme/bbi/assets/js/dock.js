/**
 * The scroll dock.
 *
 * Builds its section list at runtime from every element on the page that has
 * an id and a heading inside it. Building the list server-side would mean
 * guessing what blocks the page contains, and it would be wrong the moment
 * someone edited the template — which is the whole point of a block theme.
 *
 * The dock ships `hidden` and is only revealed once the page is scrolled past
 * the threshold. A back-to-top button visible at the top of the page is a
 * button that does nothing.
 */
( function () {
	'use strict';

	var dock = document.querySelector( '.bbi-dock' );
	if ( ! dock ) return;

	var threshold = parseInt( dock.getAttribute( 'data-bbi-threshold' ), 10 );
	if ( isNaN( threshold ) ) threshold = 400;

	var panel  = dock.querySelector( '.bbi-dock-panel' );
	var toggle = dock.querySelector( '[data-bbi-dock-toggle]' );
	var toTop  = dock.querySelector( '[data-bbi-dock-top]' );

	/* ----------------------------------------------------------
	   Show and hide, rAF-throttled.

	   A scroll listener that writes to the DOM on every event runs hundreds of
	   times a second on a trackpad. Coalescing to one write per frame costs
	   nothing and removes the jank entirely.
	   ---------------------------------------------------------- */
	var pending = 0;
	function apply() {
		pending = 0;
		var past = window.scrollY > threshold;
		// `hidden` rather than a class, so with no CSS at all the dock still
		// behaves correctly instead of sitting there permanently.
		if ( dock.hidden === past ) dock.hidden = ! past;
		if ( ! past && panel && ! panel.hidden ) closePanel();
	}
	function onScroll() {
		if ( pending ) return;
		pending = requestAnimationFrame( apply );
	}
	apply();
	window.addEventListener( 'scroll', onScroll, { passive: true } );

	/* ----------------------------------------------------------
	   The section list.
	   ---------------------------------------------------------- */
	function label( node ) {
		var heading = node.querySelector( 'h1, h2, h3' );
		var text = heading ? heading.textContent : node.getAttribute( 'aria-label' );
		text = ( text || '' ).trim().replace( /\s+/g, ' ' );
		// A 90-character heading in a 14rem panel is unreadable; the CSS
		// truncates, but trimming here keeps the accessible name sane too.
		return text.length > 42 ? text.slice( 0, 41 ) + '…' : text;
	}

	function buildPanel() {
		if ( ! panel ) return;

		var candidates = document.querySelectorAll( 'main [id], main section[id], [data-anchor]' );
		var seen = {};
		var found = [];

		for ( var i = 0; i < candidates.length; i++ ) {
			var node = candidates[ i ];
			var id = node.id || node.getAttribute( 'data-anchor' );
			if ( ! id || seen[ id ] ) continue;

			var text = node.getAttribute( 'data-anchor-label' ) || label( node );
			if ( ! text ) continue;

			seen[ id ] = true;
			found.push( { id: id, label: text } );
		}

		if ( ! found.length ) {
			// No sections means no list. A toggle that opens an empty panel is
			// worse than no toggle, so it is removed rather than disabled.
			if ( toggle ) toggle.remove();
			panel.remove();
			panel = null;
			return;
		}

		var html = '';
		for ( var k = 0; k < found.length; k++ ) {
			html += '<a class="bbi-dock-link" href="#' + found[ k ].id + '">' +
				found[ k ].label.replace( /[<>&]/g, '' ) + '</a>';
		}
		panel.innerHTML = html;
	}

	function closePanel() {
		if ( ! panel ) return;
		panel.hidden = true;
		if ( toggle ) toggle.setAttribute( 'aria-expanded', 'false' );
	}

	buildPanel();

	if ( toggle && panel ) {
		toggle.addEventListener( 'click', function () {
			var open = panel.hidden;
			panel.hidden = ! open;
			toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		} );

		// Escape closes it, and focus returns to the button that opened it —
		// otherwise focus is stranded inside a panel that is no longer visible.
		document.addEventListener( 'keydown', function ( e ) {
			if ( 'Escape' === e.key && ! panel.hidden ) {
				closePanel();
				toggle.focus();
			}
		} );

		document.addEventListener( 'click', function ( e ) {
			if ( ! dock.contains( e.target ) ) closePanel();
		} );

		panel.addEventListener( 'click', function ( e ) {
			if ( 'A' === e.target.tagName ) closePanel();
		} );
	}

	if ( toTop ) {
		toTop.addEventListener( 'click', function () {
			// `behavior: smooth` is ignored by browsers when the user has asked
			// for reduced motion, so no check is needed here — the platform
			// already respects it.
			window.scrollTo( { top: 0, behavior: 'smooth' } );
		} );
	}
} )();
