import { useEffect, useRef } from "react";

/**
 * The ambient particle field for the homepage void.
 *
 * The Dala reference calls for "small outlined triangles in various chromatic
 * colors scattered at low opacity across the background" — drifting, never
 * competing with the content on top of them. Two decisions worth recording:
 *
 * - **Canvas, not SVG.** A few hundred nodes animating every frame is where
 *   SVG stops being cheap; one canvas is a single composited layer. It is
 *   marked `aria-hidden` and sits behind everything at z-index -1, so it is
 *   decoration in the accessibility tree as well as in the design.
 * - **Outlined, never filled.** The reference is specific about 1–2px stroked
 *   triangles. Filled ones read as confetti.
 *
 * It refuses to run at all under `prefers-reduced-motion` — it renders one
 * static frame instead of nothing, so the texture survives while the movement
 * does not — and it stops the loop entirely when the tab is hidden.
 */

const HUES = [
  "#8052ff", // electric iris
  "#ffb829", // saffron spark
  "#15846e", // deep verdant
  "#a98bff",
  "#4fd1c5",
];

type Particle = {
  x: number;
  y: number;
  size: number;
  angle: number;
  spin: number;
  vy: number;
  vx: number;
  alpha: number;
  color: string;
};

export function VoidParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    // Density scales with area rather than being a fixed count, so a phone
    // does not get a desktop's worth of nodes to composite.
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(220, Math.round((width * height) / 9000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.006,
        vy: -0.04 - Math.random() * 0.12,
        vx: (Math.random() - 0.5) * 0.05,
        alpha: 0.18 + Math.random() * 0.45,
        color: HUES[Math.floor(Math.random() * HUES.length)] ?? "#8052ff",
      }));
    };

    const drawTriangle = (p: Particle) => {
      const r = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.866, r * 0.5);
      ctx.lineTo(-r * 0.866, r * 0.5);
      ctx.closePath();
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) drawTriangle(p);
    };

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.angle += p.spin;
        // Wrap rather than respawn — a respawn pops, a wrap is invisible.
        if (p.y < -12) p.y = height + 12;
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;
        drawTriangle(p);
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced) {
        paint();
        return;
      }
      running = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      build();
      if (reduced) paint();
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        start();
      }
    };

    build();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="bbi-void-particles" />;
}
