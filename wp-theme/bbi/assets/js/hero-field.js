/**
 * The hero particle field — vanilla port.
 *
 * A canvas port of the reference hero, using that file's own constants:
 *   --particle-size: 2      --particle-color: navy
 *   --particle-rows: 22     ripple 0 -> 1 over 6s, linear, infinite
 *
 * Mount it by putting `<canvas class="bbi-field"></canvas>` inside a
 * position:relative, overflow:hidden container carrying `bbi-field-host`.
 *
 * Notes carried from the original, each one a defect that was measured rather
 * than guessed:
 *
 * SIZE IS LITERALLY 2. An earlier version computed `size * scale * 1.35`, which
 * at a 1440x1187 hero meant 3.6px and grew to 6.2px under the cursor. That read
 * as a grid of blocks rather than a field of dust.
 *
 * LIT PARTICLES ARE BATCHED. Setting fillStyle per particle forced thousands of
 * canvas state changes a frame, which starved the frame budget. Lit particles
 * are collected and drawn in one pass with a single fillStyle.
 *
 * THE POINTER RESPONSE IS BRIGHTNESS, NOT DISPLACEMENT. A strong push just
 * evacuates a disc, which is the same hole following the cursor around.
 */
(function () {
  'use strict';

  var canvas = document.querySelector('canvas.bbi-field');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  var host = canvas.parentElement;
  if (!host) return;

  var PARTICLE = 'rgba(43,40,113,';
  var ALPHA_CAP = 0.62;
  var P_ROWS = 22, P_SIZE = 2, SEED = 200;
  var R_IN = 26, R_SPAN = 830;
  var A_MIN = 0.1, A_MAX = 1.0;
  var RIPPLE_MS = 6000, FOLLOW_TAU = 0.2;
  var CORE_IN = 8, CORE_SPAN = 190, CORE_FLOOR = 0.42;
  var PUSH_R = 150, PUSH_K = 34, GLOW_R = 340;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, sc = 1, rows = [], budget = 74;
  var mx = 0, my = 0, mrx = 0, mry = 0, cx = 0, cy = 0;
  var hasPointer = false, running = false, last = 0, raf = 0;

  var seedState = SEED;
  function rnd() {
    seedState = (seedState * 1664525 + 1013904223) % 4294967296;
    return seedState / 4294967296;
  }

  // Scale the particle count to the device. A fixed count built ~4,600
  // particles and redrew every one each frame, which says nothing good about a
  // phone.
  function particleBudget(w, h) {
    var cores = navigator.hardwareConcurrency || 4;
    var small = Math.min(w, h) < 620;
    var n = small ? 52 : 74;
    if (cores <= 4) n = Math.round(n * 0.72);
    return n;
  }

  function build() {
    rows = [];
    for (var r = 0; r < P_ROWS; r++) {
      var t = r / (P_ROWS - 1);
      var rad = (R_IN + Math.pow(t, 0.86) * R_SPAN) * sc;
      // Count scales with radius so areal density stays constant; a fixed count
      // per row piles the inner rows into a bright knot behind the headline.
      var n = Math.max(6, Math.round((budget * rad) / (430 * sc)));
      var ang = new Float32Array(n);
      var jit = new Float32Array(n);
      for (var i = 0; i < n; i++) {
        ang[i] = (i / n) * 6.2832 + (rnd() - 0.5) * (6.2832 / n) * 1.9;
        jit[i] = (rnd() - 0.5) * ((R_SPAN / P_ROWS) * sc * 1.5);
      }
      rows.push({ t: t, rad: rad, ang: ang, jit: jit, n: n, drift: (rnd() - 0.5) * 0.1 });
    }
  }

  function sized() {
    W = host.clientWidth;
    H = host.clientHeight;
    if (!W || !H) return;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sc = Math.max(0.62, Math.min(W, H) / 900);
    budget = particleBudget(W, H);
    build();
  }

  var litX = [], litY = [];

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    var tick = (now % RIPPLE_MS) / RIPPLE_MS;
    var sz = P_SIZE;
    var pr2 = PUSH_R * PUSH_R * sc * sc;
    var gr2 = GLOW_R * GLOW_R * sc * sc;

    for (var r = 0; r < P_ROWS; r++) {
      var row = rows[r];
      if (!row) continue;
      var wave = 0.5 + 0.5 * Math.cos((row.t * 2.2 - tick) * 6.2832);
      var u = (row.rad / sc - CORE_IN) / CORE_SPAN;
      u = u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
      var core = CORE_FLOOR + (1 - CORE_FLOOR) * u;
      var outer = 1 - Math.max(0, (row.t - 0.86) / 0.14);
      var a = (A_MIN + (A_MAX - A_MIN) * wave) * core * outer * ALPHA_CAP;
      if (a < 0.008) continue;

      ctx.fillStyle = PARTICLE + a.toFixed(3) + ')';
      var spin = now * 0.00004 * (1 + row.drift * 6);

      for (var i = 0; i < row.n; i++) {
        var A = row.ang[i] + spin;
        var R = row.rad + row.jit[i];
        var x = cx + Math.cos(A) * R * 1.16;
        var y = cy + Math.sin(A) * R * 0.9;
        var lit = 0;

        if (hasPointer) {
          var dx = x - mx, dy = y - my;
          var d2 = dx * dx + dy * dy;
          if (d2 < pr2 && d2 > 1) {
            var f = 1 - d2 / pr2;
            var k = (f * f * PUSH_K * sc) / Math.sqrt(d2);
            x += dx * k;
            y += dy * k;
          }
          if (d2 < gr2) {
            var g2 = 1 - d2 / gr2;
            lit = g2 * g2;
          }
        }

        if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
        if (lit > 0.05) {
          litX.push(x);
          litY.push(y);
        } else {
          ctx.fillRect(x, y, sz, sz);
        }
      }
    }

    // One state change for every lit particle on the frame, and no size growth.
    if (litX.length) {
      ctx.fillStyle = PARTICLE + Math.min(0.9, A_MAX * ALPHA_CAP * 1.35).toFixed(3) + ')';
      for (var j = 0; j < litX.length; j++) ctx.fillRect(litX[j], litY[j], sz, sz);
      litX.length = 0;
      litY.length = 0;
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    // Size recovery runs BEFORE the visibility gate. If the hero measures 0 at
    // mount, which it can under load, a gate-first order leaves the canvas at
    // its 300x150 default forever and it draws nothing.
    if (!W || !H) sized();
    if (!running || !W || !H) return;
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;
    var k = 1 - Math.exp(-dt / FOLLOW_TAU);
    cx += (mrx - cx) * k;
    cy += (mry - cy) * k;
    mx += (mrx - mx) * 0.3;
    my += (mry - my) * 0.3;
    draw(now);
  }

  function point(vx, vy) {
    var box = host.getBoundingClientRect();
    mrx = vx - box.left;
    mry = vy - box.top;
    hasPointer = true;
  }
  function rest() {
    hasPointer = false;
    mrx = W * 0.5;
    mry = H * 0.46;
  }

  sized();
  cx = mx = mrx = W * 0.5;
  cy = my = mry = H * 0.46;

  // Nothing runs until the hero is on screen, and it stops again when you
  // scroll past — no frames burned during page load or further down.
  new IntersectionObserver(
    function (entries) {
      var on = entries.some(function (e) { return e.isIntersecting; });
      if (on && !running) last = 0;
      running = on;
    },
    { rootMargin: '120px' }
  ).observe(host);

  new ResizeObserver(sized).observe(host);
  window.addEventListener('pointermove', function (e) { point(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('pointerleave', rest, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (e.touches[0]) point(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) running = false;
    last = 0;
  });

  raf = requestAnimationFrame(frame);
})();
