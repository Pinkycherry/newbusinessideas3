/* ============================================================
   TITANIUM — particle constellation
   Thousands of tiny outlined triangles in a vivid spectrum,
   forming an organic shape on pure black. Plus a low-density
   ambient field drifting across the page background.
   ============================================================ */
(function () {
  "use strict";
  var REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var PALETTE = [
    "#8052ff", // electric iris
    "#ffb829", // saffron spark
    "#15846e", // deep verdant
    "#b98cff", // light violet
    "#5b7cff", // blue
    "#ff5cc8", // magenta
    "#3fd8c0", // teal bright
    "#ffffff"  // bone white sparks
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  /* Draw a small outlined triangle. */
  function tri(ctx, x, y, r, rot, color, alpha, lw) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (var i = 0; i < 3; i++) {
      var a = (Math.PI * 2 / 3) * i - Math.PI / 2;
      var px = Math.cos(a) * r, py = Math.sin(a) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.restore();
  }

  /* ---------------------------------------------------------
     Organic "power core" field — two overlapping lobes with a
     denser spine, giving a brain/molecular silhouette.
     Returns a normalised point or null (rejection sampling).
     --------------------------------------------------------- */
  function samplePoint() {
    var x = rand(-1, 1), y = rand(-1, 1);
    // two lobes
    var lobeL = Math.pow((x + 0.30) / 0.62, 2) + Math.pow(y / 0.78, 2);
    var lobeR = Math.pow((x - 0.30) / 0.62, 2) + Math.pow(y / 0.78, 2);
    var core  = Math.pow(x / 0.90, 2) + Math.pow(y / 0.58, 2);
    var inside = Math.min(lobeL, lobeR, core);
    if (inside > 1) return null;
    // a visible central fissure between the two lobes, like a brain
    var fissure = Math.abs(x) < 0.035 && Math.abs(y) < 0.62;
    if (fissure && Math.random() > 0.12) return null;
    // fairly even fill with a modest edge emphasis so the silhouette reads
    var keep = 0.55 + 0.45 * Math.pow(inside, 0.55);
    if (Math.random() > keep) return null;
    // gentle vertical squash + organic wobble
    var wob = Math.sin(x * 5.5) * 0.05 + Math.cos(y * 4.2) * 0.04;
    return { x: x + wob * 0.4, y: y * 0.92 + wob * 0.3, d: inside };
  }

  function buildConstellation(canvas) {
    var ctx = canvas.getContext("2d");
    var pts = [], DPR = Math.min(devicePixelRatio || 1, 2);
    var COUNT = innerWidth < 700 ? 1400 : 3400;

    while (pts.length < COUNT) {
      var p = samplePoint();
      if (!p) continue;
      pts.push({
        x: p.x, y: p.y, d: p.d,
        r: rand(2.0, 5.6),
        rot: rand(0, Math.PI * 2),
        spin: rand(-0.0022, 0.0022),
        color: pick(PALETTE),
        a: rand(0.55, 1),
        ph: rand(0, Math.PI * 2),
        sp: rand(0.4, 1.5)
      });
    }

    function size() {
      var r = canvas.getBoundingClientRect();
      canvas.width = r.width * DPR;
      canvas.height = r.height * DPR;
    }
    size();
    addEventListener("resize", size, { passive: true });

    var t = 0;
    function frame() {
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2;
      var scale = Math.min(w, h) * 0.5;
      t += 0.006;

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        // slow orbital breathing outward/inward
        var breathe = 1 + Math.sin(t * p.sp + p.ph) * 0.018;
        var x = cx + p.x * scale * breathe;
        var y = cy + p.y * scale * breathe;
        var twinkle = 0.72 + Math.sin(t * 2.1 * p.sp + p.ph) * 0.28;
        if (!REDUCE) p.rot += p.spin;
        tri(ctx, x, y, p.r * DPR, p.rot, p.color, p.a * twinkle, 1.25 * DPR);
      }
      if (!REDUCE) requestAnimationFrame(frame);
    }
    frame();
  }

  function buildAmbient(canvas) {
    var ctx = canvas.getContext("2d");
    var DPR = Math.min(devicePixelRatio || 1, 2);
    var parts = [];
    var COUNT = innerWidth < 700 ? 40 : 90;

    function size() {
      canvas.width = innerWidth * DPR;
      canvas.height = innerHeight * DPR;
    }
    size();
    addEventListener("resize", size, { passive: true });

    for (var i = 0; i < COUNT; i++) {
      parts.push({
        x: Math.random(), y: Math.random(),
        r: rand(1.4, 3.6), rot: rand(0, Math.PI * 2),
        spin: rand(-0.0018, 0.0018),
        vy: rand(-0.00012, -0.00035),
        vx: rand(-0.00010, 0.00010),
        color: pick(PALETTE), a: rand(0.10, 0.34)
      });
    }

    function frame() {
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (!REDUCE) {
          p.y += p.vy; p.x += p.vx; p.rot += p.spin;
          if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;
        }
        tri(ctx, p.x * w, p.y * h, p.r * DPR, p.rot, p.color, p.a, 1 * DPR);
      }
      if (!REDUCE) requestAnimationFrame(frame);
    }
    frame();
  }

  function init() {
    var c = document.getElementById("constellation");
    if (c) buildConstellation(c);
    var a = document.getElementById("ambient");
    if (a) buildAmbient(a);

    /* reveals + assay bars */
    var els = document.querySelectorAll(".rv");
    function fill(scope) {
      scope.querySelectorAll(".fill").forEach(function (f, i) {
        setTimeout(function () { f.style.width = f.dataset.w + "%"; }, i * 130);
      });
    }
    if (REDUCE || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      fill(document);
      return;
    }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        fill(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
