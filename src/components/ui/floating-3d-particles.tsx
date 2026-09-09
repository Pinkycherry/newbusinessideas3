import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Floating 3D Particles — a depth field with real perspective.
 *
 * Written to the Magic UI component of the same name; `magicui.design` is
 * blocked by this sandbox's egress proxy, so the registry file could not be
 * fetched. `count`, `className` and `speed` match upstream.
 *
 * Contained to one section rather than the whole page: the void already runs
 * a flat triangle field behind everything, and two full-page particle systems
 * is clutter, not depth. Here each particle carries a z, and z drives both its
 * size and its opacity, so the field reads as volume instead of scatter.
 *
 * Canvas rather than DOM nodes with `translate3d`: a few hundred elements each
 * getting a style write per frame is where this pattern becomes a jank
 * generator, and it is invisible in a screenshot.
 */
export function Floating3DParticles({
  className,
  count = 90,
  speed = 0.28,
}: {
  className?: string;
  count?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const HUES = ["#8052ff", "#ffb829", "#4fd1c5", "#a98bff"];
    type P = { x: number; y: number; z: number; c: string };
    let w = 0;
    let h = 0;
    let ps: P[] = [];
    let raf = 0;
    let alive = true;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        c: HUES[Math.floor(Math.random() * HUES.length)] ?? "#8052ff",
      }));
    };

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      // Far particles first, so nearer ones genuinely sit in front.
      for (const p of [...ps].sort((a, b) => a.z - b.z)) {
        const scale = 0.35 + p.z * 1.65;
        ctx.globalAlpha = 0.12 + p.z * 0.5;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      if (!alive) return;
      for (const p of ps) {
        // Nearer particles travel faster: that parallax IS the depth cue.
        p.y -= speed * (0.25 + p.z);
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
          p.z = Math.random();
        }
      }
      paint();
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      build();
      paint();
    };

    build();
    if (reduced) paint();
    else raf = requestAnimationFrame(frame);

    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count, speed]);

  return <canvas ref={ref} aria-hidden className={cn("bbi-p3d", className)} />;
}
