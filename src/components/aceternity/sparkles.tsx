import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Spark = { x: number; y: number; r: number; a: number; da: number };

/**
 * SparklesCore — Aceternity UI, ported to this stack.
 *
 * Upstream this pulls in tsparticles, roughly 100 kB of engine to draw dots.
 * This is the same effect on a bare 2D canvas in a few dozen lines, with no
 * dependency added — worth doing on a page whose whole argument is that it is
 * an instrument rather than a brochure.
 *
 * It draws nothing at all under `prefers-reduced-motion`, and it stops its own
 * loop when scrolled out of view so an idle tab is not burning a frame budget
 * on decoration.
 */
export default function SparklesCore({
  className,
  density = 60,
  minSize = 0.5,
  maxSize = 1.4,
  color = "#8886DB",
}: {
  className?: string;
  density?: number;
  minSize?: number;
  maxSize?: number;
  color?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    let sparks: Spark[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      const count = Math.round((rect.width * rect.height) / 9000) + density;
      sparks = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (minSize + Math.random() * (maxSize - minSize)) * dpr,
        a: Math.random(),
        da: (Math.random() * 0.02 + 0.004) * (Math.random() < 0.5 ? -1 : 1),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of sparks) {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da = -s.da;
        ctx.globalAlpha = Math.max(0, Math.min(1, s.a));
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (visible) raf = window.requestAnimationFrame(draw);
    };

    size();
    draw();

    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver((entries) => {
      const next = entries.some((e) => e.isIntersecting);
      if (next && !visible) {
        visible = true;
        raf = window.requestAnimationFrame(draw);
      } else if (!next) {
        visible = false;
        window.cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      visible = false;
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [color, density, maxSize, minSize]);

  return <canvas ref={ref} aria-hidden className={cn("block h-full w-full", className)} />;
}
