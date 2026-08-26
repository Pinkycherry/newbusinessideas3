/**
 * Hero particle field — antigravity-style.
 *
 * A single lightweight canvas (no WebGL, no library) drawing a loose
 * constellation of soft points arranged on drifting arcs. The pointer applies
 * a smooth inverse-square repulsion; every particle springs back to its home
 * position with critically-damped physics, so motion feels weightless rather
 * than chaotic.
 *
 * - transform/opacity-free: everything is canvas paint, so no layout work.
 * - Disables itself entirely under prefers-reduced-motion.
 * - On touch (coarse pointer) the field still drifts, but has no cursor input.
 * - DPR capped at 2 and particle count scaled to viewport so low-end Android
 *   phones stay at 60fps.
 */
import { useEffect, useRef } from "react";

type P = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
  speed: number;
};

export function HeroParticles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let parts: P[] = [];
    let raf = 0;
    let px = -9999;
    let py = -9999;
    let running = true;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = w * h;
      const count = Math.round(Math.min(150, Math.max(46, area / 9000)));
      const rings = 3;
      parts = Array.from({ length: count }, (_, i) => {
        const ring = i % rings;
        const t = (i / count) * Math.PI * 2 * 1.7 + ring * 0.9;
        const rad = (Math.min(w, h) * (0.22 + ring * 0.15)) / 1.15;
        const jitter = (Math.random() - 0.5) * rad * 0.34;
        const hx = w * 0.5 + Math.cos(t) * (rad + jitter) * 1.35;
        const hy = h * 0.5 + Math.sin(t) * (rad + jitter) * 0.82;
        return {
          hx,
          hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          r: 0.7 + Math.random() * 1.7,
          a: 0.18 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.12 + Math.random() * 0.25,
        };
      });
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
    };

    const frame = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;

      for (const p of parts) {
        // Slow ambient drift around the home point — never static.
        const dxh = Math.cos(t * p.speed + p.phase) * 9;
        const dyh = Math.sin(t * p.speed * 0.8 + p.phase) * 7;
        const targetX = p.hx + dxh;
        const targetY = p.hy + dyh;

        // Spring back home (stiffness / damping tuned for soft inertia).
        p.vx += (targetX - p.x) * 0.012;
        p.vy += (targetY - p.y) * 0.012;

        // Pointer repulsion, smooth falloff.
        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        const R = 170;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) ** 2 * 3.4;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        const disp = Math.min(Math.hypot(p.x - targetX, p.y - targetY) / 90, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + disp * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(70, 67, 186, ${(p.a + disp * 0.28).toFixed(3)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    build();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
    }
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
