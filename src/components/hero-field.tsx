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

const P_COUNT = 175;
const P_ROWS = 28;
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
    const cv = ref.current;
    const host = cv?.parentElement;
    if (!cv || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let sc = 1;
    let rows: Row[] = [];
    let mx = 0;
    let my = 0;
    let mrx = 0;
    let mry = 0;
    let cx = 0;
    let cy = 0;
    let hasPointer = false;
    let running = true;
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
        const n = Math.max(8, Math.round((P_COUNT * rad) / (430 * sc)));
        const ang = new Float32Array(n);
        const jit = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          ang[i] = (i / n) * 6.2832 + (rnd() - 0.5) * (6.2832 / n) * 1.9;
          jit[i] = (rnd() - 0.5) * ((R_SPAN / P_ROWS) * sc * 1.5);
        }
        rows.push({ t, rad, ang, jit, n, drift: (rnd() - 0.5) * 0.1 });
      }
    };

    const sized = () => {
      W = host.clientWidth;
      H = host.clientHeight;
      if (W === 0 || H === 0) return;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sc = Math.max(0.62, Math.min(W, H) / 900);
      build();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const tick = (now % RIPPLE_MS) / RIPPLE_MS;
      const sz = Math.max(1.8, P_SIZE * sc * 1.35);
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
        const a = (A_MIN + (A_MAX - A_MIN) * wave) * core * outer * 0.95;
        if (a < 0.008) continue;

        const base = "rgba(70,67,186,";
        ctx.fillStyle = base + a.toFixed(3) + ")";
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
          if (lit > 0.02) {
            ctx.fillStyle = base + Math.min(0.95, a * (1 + lit * GLOW_K)).toFixed(3) + ")";
            ctx.fillRect(x, y, sz * (1 + lit * 0.75), sz * (1 + lit * 0.75));
            ctx.fillStyle = base + a.toFixed(3) + ")";
          } else {
            ctx.fillRect(x, y, sz, sz);
          }
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
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
      running = !document.hidden;
      last = 0;
    };

    sized();
    cx = mx = mrx = W * 0.5;
    cy = my = mry = H * 0.46;

    const ro = new ResizeObserver(sized);
    ro.observe(host);
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
