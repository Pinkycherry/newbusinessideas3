import { useEffect, useRef } from "react";

/**
 * Site-wide interactive particle background.
 *
 * A field of small outlined triangles in the brand palette that drifts
 * continuously and reacts to the pointer: nearby particles are pushed away,
 * brighten, and link to the cursor and to each other with hairlines.
 *
 * Strictly a background layer:
 *  - `position: fixed` + negative z-index, so it never participates in layout
 *  - `pointer-events: none`, so it can never intercept a click on a button,
 *    link, or form control
 *  - fully disabled (single static paint) under `prefers-reduced-motion`
 *
 * Only `transform`-free canvas painting is used, so nothing here triggers
 * layout or style recalculation on the rest of the page.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  spin: number;
  color: string;
  alpha: number;
};

/** Brand palette — readable on the light (#FCFBFE) canvas. */
const PALETTE = [
  "#4643BA", // primary indigo
  "#8886DB", // ember / violet-soft
  "#3A3697", // warm deep indigo
  "#B6B5E3", // pale violet
  "#5B57D6", // mid violet
];

const LINK_DIST = 132; // px — particle-to-particle link radius
const MOUSE_DIST = 190; // px — cursor influence radius

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;

    // Pointer lives outside the viewport until the user actually moves it, so
    // nothing is highlighted on first paint.
    const pointer = { x: -9999, y: -9999, active: false };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function build() {
      const count = width < 700 ? 46 : width < 1200 ? 78 : 104;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-0.16, 0.16),
        vy: rand(-0.16, 0.16),
        r: rand(3, 8),
        rot: rand(0, Math.PI * 2),
        spin: rand(-0.004, 0.004),
        color: PALETTE[(Math.random() * PALETTE.length) | 0]!,
        alpha: rand(0.32, 0.62),
      }));
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function triangle(p: Particle, alpha: number, lineWidth: number) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.beginPath();
      for (let i = 0; i < 3; i += 1) {
        const a = ((Math.PI * 2) / 3) * i - Math.PI / 2;
        const px = Math.cos(a) * p.r;
        const py = Math.sin(a) * p.r;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = p.color;
      ctx!.lineWidth = lineWidth;
      ctx!.stroke();
      ctx!.restore();
    }

    function frame() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.spin;

          // Wrap around the viewport edges for a seamless field.
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        let alpha = p.alpha;
        let lw = 1;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DIST) {
            const force = (1 - dist / MOUSE_DIST) ** 2;
            // Gentle repulsion away from the cursor.
            if (!reduce && dist > 0.5) {
              p.x += (dx / dist) * force * 1.9;
              p.y += (dy / dist) * force * 1.9;
            }
            alpha = Math.min(1, alpha + force * 0.55);
            lw = 1 + force * 0.9;

            // Hairline from the cursor to the particle.
            ctx!.globalAlpha = force * 0.38;
            ctx!.strokeStyle = p.color;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(pointer.x, pointer.y);
            ctx!.lineTo(p.x, p.y);
            ctx!.stroke();
          }
        }

        triangle(p, alpha, lw);
      }

      // Constellation links between neighbours.
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const d = Math.sqrt(d2);
          ctx!.globalAlpha = (1 - d / LINK_DIST) * 0.22;
          ctx!.strokeStyle = a.color;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      ctx!.globalAlpha = 1;
      if (!reduce) raf = window.requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }
    function onPointerLeave() {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    }

    resize();
    frame();

    window.addEventListener("resize", resize, { passive: true });
    // Listening on the window (not the canvas) keeps the canvas itself
    // pointer-transparent while still tracking the cursor everywhere.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      data-testid="interactive-background"
    />
  );
}
