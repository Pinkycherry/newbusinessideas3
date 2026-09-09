import { useEffect, useRef } from "react";

/**
 * The hero particle field.
 *
 * A canvas port of the reference hero from the Bram.us modern-CSS rework of
 * antigravity.google, using that file's own constants:
 *
 *   --particle-count: 80   --particle-rows: 25   -> a fine field, not a ring
 *   --particle-size: 2     --particle-color: navy (BBI's --primary here)
 *   --particle-min-alpha: .1 / max 1.0
 *   @keyframes ripple  --animation-tick 0 -> 1, 6s linear infinite
 *   --ring-x / --ring-y  follow the pointer
 *
 * Two deliberate departures from the reference:
 *   - No `--ring-radius` breathing keyframe. That 150 -> 250 pulse reads as a
 *     heartbeat and was rejected.
 *   - Density and alpha ramp in from the centre rather than starting at
 *     radius 100, so the middle is never an empty disc with a hard rim. The
 *     centre floor is 42%, not zero.
 *
 * The pointer response is BRIGHTNESS, not displacement. A strong push
 * evacuates a disc, which is just the same hole following the cursor; this
 * lights the field up under the pointer and parts it only slightly.
 *
 * Renders nothing until mounted, so it is inert during SSR. The parent must be
 * `position: relative` and clip its overflow.
 */

// Particle budget. The previous fixed 175 built ~4,600 particles and redrew
// every one each frame with per-particle distance maths — measured at 61fps in
// a HEADLESS DESKTOP browser, which says nothing about a phone. This scales the
// budget to the device and halves it on a small screen or a low-core CPU.
function particleBudget(w: number, h: number) {
  const cores =
    (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
  const small = Math.min(w, h) < 620;
  // Measured 1,392 fillRect calls per frame at 1440x900 on the first pass;
  // this brings it to roughly half that, which is still a dense field.
  let n = 74;
  if (small) n = 52;
  if (cores <= 4) n = Math.round(n * 0.72);
  return n;
}
const P_COUNT = 175;
const P_ROWS = 22;
const P_SIZE = 2;
const SEED = 200;
const R_IN = 26;
const R_SPAN = 830;
const A_MIN = 0.1;
const A_MAX = 1.0;
const RIPPLE_MS = 6000;
const FOLLOW_TAU = 0.2;
const CORE_IN = 8;
const CORE_SPAN = 190;
const CORE_FLOOR = 0.42;
const PUSH_R = 150;
const PUSH_K = 34;
const GLOW_R = 340;
const GLOW_K = 2.4;
// `--particle-color: navy`. The brand violet at full chroma read as coloured
// confetti; this is the site's deep navy-violet, which on white behaves like
// the reference's navy dust.
const PARTICLE = "rgba(43,40,113,";
const ALPHA_CAP = 0.62;

type Row = {
  t: number;
  rad: number;
  ang: Float32Array;
  jit: Float32Array;
  n: number;
  drift: number;
};

export function HeroField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Do NOT capture the canvas node. React can replace this subtree (a
    // hydration mismatch anywhere on the page regenerates the tree), and a
    // captured node is then detached — the field goes on drawing into an
    // element that is no longer in the document, which is exactly why mobile
    // showed a 300x150 default canvas and zero particles. Re-acquire instead,
    // and re-size whenever the node changes underneath us.
    let cv = ref.current;
    let ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;
    let host = cv.parentElement;
    if (!host) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let sc = 1;
    let rows: Row[] = [];
    let budget = P_COUNT;
    let mx = 0;
    let my = 0;
    let mrx = 0;
    let mry = 0;
    let cx = 0;
    let cy = 0;
    let hasPointer = false;
    let running = false;
    let last = 0;
    let raf = 0;

    let seedState = SEED;
    const rnd = () => {
      seedState = (seedState * 1664525 + 1013904223) % 4294967296;
      return seedState / 4294967296;
    };

    const build = () => {
      rows = [];
      for (let r = 0; r < P_ROWS; r++) {
        const t = r / (P_ROWS - 1);
        const rad = (R_IN + Math.pow(t, 0.86) * R_SPAN) * sc;
        // Count scales with radius so areal density stays constant. A fixed 80
        // per row piles the inner rows into a bright knot behind the headline.
        const n = Math.max(6, Math.round((budget * rad) / (430 * sc)));
        const ang = new Float32Array(n);
        const jit = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          ang[i] = (i / n) * 6.2832 + (rnd() - 0.5) * (6.2832 / n) * 1.9;
          jit[i] = (rnd() - 0.5) * ((R_SPAN / P_ROWS) * sc * 1.5);
        }
        rows.push({ t, rad, ang, jit, n, drift: (rnd() - 0.5) * 0.1 });
      }
    };

    const reacquire = () => {
      const live = ref.current;
      if (!live || live === cv) return false;
      cv = live;
      const c2 = live.getContext("2d", { alpha: true });
      if (!c2) return false;
      ctx = c2;
      host = live.parentElement ?? host;
      return true;
    };

    const sized = () => {
      if (!host) return;
      W = host.clientWidth;
      H = host.clientHeight;
      if (W === 0 || H === 0) return;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      sc = Math.max(0.62, Math.min(W, H) / 900);
      budget = particleBudget(W, H);
      build();
    };

    const litX: number[] = [];
    const litY: number[] = [];

    const draw = (now: number) => {
      const g = ctx;
      if (!g) return;
      g.clearRect(0, 0, W, H);
      const tick = (now % RIPPLE_MS) / RIPPLE_MS;
      // `--particle-size: 2`, literally. This was `P_SIZE * sc * 1.35`, which
      // at a 1440x1187 hero meant 3.6px, and up to 6.2px under the cursor
      // glow -- chunky squares instead of the reference's fine dust.
      const sz = P_SIZE;
      const pr2 = PUSH_R * PUSH_R * sc * sc;
      const gr2 = GLOW_R * GLOW_R * sc * sc;

      for (let r = 0; r < P_ROWS; r++) {
        const row = rows[r];
        if (!row) continue;
        // the ripple, travelling outward
        const wave = 0.5 + 0.5 * Math.cos((row.t * 2.2 - tick) * 6.2832);
        // soft opening: never zero, never an edge
        let u = (row.rad / sc - CORE_IN) / CORE_SPAN;
        u = u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
        const core = CORE_FLOOR + (1 - CORE_FLOOR) * u;
        const outer = 1 - Math.max(0, (row.t - 0.86) / 0.14);
        const a = (A_MIN + (A_MAX - A_MIN) * wave) * core * outer * ALPHA_CAP;
        if (a < 0.008) continue;

        const base = PARTICLE;
        g.fillStyle = base + a.toFixed(3) + ")";
        const spin = now * 0.00004 * (1 + row.drift * 6);

        for (let i = 0; i < row.n; i++) {
          const A = (row.ang[i] as number) + spin;
          const R = row.rad + (row.jit[i] as number);
          let x = cx + Math.cos(A) * R * 1.16;
          let y = cy + Math.sin(A) * R * 0.9;
          let lit = 0;

          if (hasPointer) {
            const dx = x - mx;
            const dy = y - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < pr2 && d2 > 1) {
              const f = 1 - d2 / pr2;
              const k = (f * f * PUSH_K * sc) / Math.sqrt(d2);
              x += dx * k;
              y += dy * k;
            }
            if (d2 < gr2) {
              const g2 = 1 - d2 / gr2;
              lit = g2 * g2;
            }
          }

          if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
          if (lit > 0.05) {
            // Deferred: setting fillStyle per particle forced a canvas state
            // change thousands of times a frame, which is what starved the
            // rAF budget and made the custom pointer lag.
            litX.push(x);
            litY.push(y);
          } else {
            g.fillRect(x, y, sz, sz);
          }
        }
      }

      // one state change for every lit particle on the frame, and NO size
      // growth -- a bigger square under the cursor is what made it look like
      // blocks rather than a field lighting up
      if (litX.length) {
        g.fillStyle = PARTICLE + Math.min(0.9, A_MAX * ALPHA_CAP * 1.35).toFixed(3) + ")";
        for (let i = 0; i < litX.length; i++) {
          g.fillRect(litX[i] as number, litY[i] as number, sz, sz);
        }
        litX.length = 0;
        litY.length = 0;
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // Size recovery has to happen BEFORE the visibility gate. If the hero
      // measures 0 at mount (it can under load) and this sat after the gate,
      // the canvas stayed at its 300x150 default forever and drew nothing —
      // which is the intermittent blank field on mobile. Reading clientWidth
      // forces layout, so only while genuinely unsized.
      if (reacquire()) sized();
      if (W === 0 || H === 0) sized();
      if (!running || W === 0 || H === 0) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt / FOLLOW_TAU);
      cx += (mrx - cx) * k;
      cy += (mry - cy) * k;
      mx += (mrx - mx) * 0.3;
      my += (mry - my) * 0.3;
      draw(now);
    };

    const point = (vx: number, vy: number) => {
      if (!host) return;
      const box = host.getBoundingClientRect();
      mrx = vx - box.left;
      mry = vy - box.top;
      hasPointer = true;
    };
    const rest = () => {
      hasPointer = false;
      mrx = W * 0.5;
      mry = H * 0.46;
    };

    const onMove = (e: PointerEvent) => point(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) point(t.clientX, t.clientY);
    };
    let restTimer = 0;
    const onTouchEnd = () => {
      window.clearTimeout(restTimer);
      restTimer = window.setTimeout(rest, 5000);
    };
    const onVis = () => {
      if (document.hidden) running = false;
      last = 0;
    };

    sized();
    cx = mx = mrx = W * 0.5;
    cy = my = mry = H * 0.46;

    // Nothing runs until the hero is actually on screen, and it stops again
    // when you scroll past — no frames burned during page load or further down.
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on && !running) last = 0;
        running = on;
      },
      { rootMargin: "120px" },
    );
    if (host) io.observe(host);

    const ro = new ResizeObserver(sized);
    if (host) ro.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", rest, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(restTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", rest);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
