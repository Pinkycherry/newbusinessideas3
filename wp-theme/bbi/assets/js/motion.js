/**
 * BBI motion — vanilla port of the React reveal system.
 *
 * The original used GSAP ScrollTrigger through React hooks. Neither survives a
 * port, so this rebuilds the behaviour that actually mattered with an
 * IntersectionObserver and CSS transitions. No dependencies.
 *
 * Two properties are carried over deliberately, because both were bugs that
 * took real work to find in the original:
 *
 * 1. TWO-WAY, EVERY PASS. The class is toggled off when an element leaves the
 *    viewport, so scrolling back over it plays the reveal again. The original
 *    had TEN separate `once: true` / `unobserve` latches, which is why the
 *    whole site read as static. A reveal that fires once per page load is
 *    invisible to anyone who scrolls the way people actually scroll.
 *
 * 2. NO JS MEANS VISIBLE. The hidden state is gated behind `html.bbi-motion`,
 *    a class only this file sets. Before that gate existed, a failed script
 *    left every heading on the site at opacity 0 permanently. If this file
 *    never loads, the page is simply visible, which is the correct failure.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ----------------------------------------------------------
     Reading position.

     `.mo-page-rail` in motion.css is `transform: scaleX(var(--page-p, 0))`,
     so without a writer for that property the rail in header.php is a
     permanently empty 1px line — worse than not shipping it.

     This runs even under reduced motion, on purpose. A progress rail reports
     where you are in the document; motion.css draws the same distinction in
     its own reduced-motion block, keeping colour and focus responses because
     "those are information, not decoration". Position is information too.
     ---------------------------------------------------------- */
  var railPending = 0;
  function writeProgress() {
    railPending = 0;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    // A page shorter than the viewport has no progress to report. Guarding
    // this also avoids a divide-by-zero that renders as NaN and silently
    // drops the transform.
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    doc.style.setProperty('--page-p', String(p));
  }
  function queueProgress() {
    if (railPending) return;
    railPending = requestAnimationFrame(writeProgress);
  }
  writeProgress();
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress, { passive: true });

  // Everything below is decoration and stops here when motion is reduced.
  if (reduce.matches) return;

  root.classList.add('bbi-motion');

  var SEL = 'h1, h2, h3, [data-wave], [data-reveal], .mo-card';
  var seen = new WeakSet();

  var io = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        // A section taller than the viewport can never reach a 15% ratio, so it
        // would never reveal at all. Anything that tall counts as revealed the
        // moment it intersects.
        var tall = e.boundingClientRect.height > window.innerHeight * 0.8;
        var on = e.isIntersecting && (tall || e.intersectionRatio >= 0.15);
        e.target.classList.toggle('revealed', on);
      }
    },
    { threshold: [0, 0.15], rootMargin: '0px 0px -5% 0px' }
  );

  function scan() {
    var nodes = document.querySelectorAll(SEL);
    for (var i = 0; i < nodes.length; i++) {
      if (seen.has(nodes[i])) continue;
      seen.add(nodes[i]);
      io.observe(nodes[i]);
    }
  }
  scan();

  /* ----------------------------------------------------------
     The Animate block.

     Each block carries its own settings as data attributes, so one observer
     drives every animated section on the page regardless of how they are
     configured. Read here rather than baked into CSS, because the settings
     come from the block sidebar and can differ per placement.
     ---------------------------------------------------------- */
  var animSeen = new WeakSet();

  var animIo = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        var replay = e.target.getAttribute('data-bbi-replay') !== '0';

        if (e.isIntersecting) {
          e.target.classList.add('bbi-in');
          // A one-shot section is unobserved once it has played, so it never
          // costs another callback for the life of the page.
          if (!replay) animIo.unobserve(e.target);
        } else if (replay) {
          e.target.classList.remove('bbi-in');
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  function scanAnim() {
    var nodes = document.querySelectorAll('.bbi-anim');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (animSeen.has(node)) continue;
      animSeen.add(node);

      // Stagger is written per child as a custom property. Expressing it in
      // CSS with :nth-child() would cap at however many rules were written;
      // this has no ceiling and costs one style write per child, once.
      var step = parseInt(node.style.getPropertyValue('--bbi-anim-stagger'), 10);
      if (node.classList.contains('bbi-anim-stagger') && step > 0) {
        var kids = node.children;
        for (var k = 0; k < kids.length; k++) {
          kids[k].style.setProperty('--bbi-child-delay', k * step + 'ms');
        }
      }

      animIo.observe(node);
    }
  }
  scanAnim();

  /* ----------------------------------------------------------
     Orbit diagrams.

     The CSS spins the rings only once the wrapper carries `is-live`, so the
     animation does not run for a diagram nobody has scrolled to yet. Once
     live it stays live — an orbit that restarts every time it re-enters the
     viewport reads as a glitch rather than as motion.
     ---------------------------------------------------------- */
  var orbitIo = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-live');
          orbitIo.unobserve(entries[i].target);
        }
      }
    },
    { threshold: 0.25 }
  );

  function scanOrbits() {
    var nodes = document.querySelectorAll('.bbi-orbit-wrap:not(.is-live)');
    for (var i = 0; i < nodes.length; i++) orbitIo.observe(nodes[i]);
  }
  scanOrbits();

  // Anything inserted later — a lazy-loaded grid, a plugin — is picked up too.
  // In the original, cards arrived from React Query after the observer had run
  // and were therefore never observed at all, which is why cards specifically
  // stayed static while headings animated.
  var pending = 0;
  var mo = new MutationObserver(function () {
    if (pending) return;
    pending = requestAnimationFrame(function () {
      pending = 0;
      scan();
      scanAnim();

  /* ----------------------------------------------------------
     Orbit diagrams.

     The CSS spins the rings only once the wrapper carries `is-live`, so the
     animation does not run for a diagram nobody has scrolled to yet. Once
     live it stays live — an orbit that restarts every time it re-enters the
     viewport reads as a glitch rather than as motion.
     ---------------------------------------------------------- */
  var orbitIo = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-live');
          orbitIo.unobserve(entries[i].target);
        }
      }
    },
    { threshold: 0.25 }
  );

  function scanOrbits() {
    var nodes = document.querySelectorAll('.bbi-orbit-wrap:not(.is-live)');
    for (var i = 0; i < nodes.length; i++) orbitIo.observe(nodes[i]);
  }
  scanOrbits();
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
