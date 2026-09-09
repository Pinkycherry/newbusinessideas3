import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  seed: number;
  depth: number;
  delay: number;
};

const hexToRgb = (hex: string) => {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};
const mixRgb = (
  from: { r: number; g: number; b: number },
  to: { r: number; g: number; b: number },
  amount: number,
) => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount),
});
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * ParticleText — React Bits, ported to this stack.
 *
 * A heading rendered as a cloud of particles that gathers into the letterforms
 * and scatters away from the pointer.
 *
 * The heading text is ALWAYS in the DOM as real text (`sr-only`), because a
 * headline painted into a canvas is invisible to a screen reader, to a
 * crawler, and to anyone with JavaScript off — and these are the H1 and H2 of
 * a page whose whole business is being found. The canvas is `aria-hidden`
 * decoration on top of a real heading.
 *
 * Under `prefers-reduced-motion` the particles are placed at their targets
 * immediately with no gather, no drift and no repulsion.
 *
 * KNOWN LIMIT — read before reusing this. It resolves into readable
 * letterforms at display size (roughly 56px and up, in a container tall
 * enough to hold the wrapped lines) and does NOT at section-heading size:
 * around 44px the sampled points stop closing up and the heading renders as a
 * horizontal smear of dots. It is applied to the page's H1 only for that
 * reason. Raising the particle budget and the sampling density did not fix
 * it, so the cause is in the sampling geometry rather than the count, and it
 * is unsolved.
 */
export default function ParticleText({
  text,
  className,
  particleSize = 2.4,
  density = 2,
  color = "#FFFFFF",
  highlightColor = "#B2B2B2",
  scatter = 160,
  gatherDuration = 1400,
  stagger = 380,
  pointerRepel = 42,
  repelRadius = 120,
  idleDrift = 0.6,
  fontSize = "clamp(2.2rem, 6vw, 4.2rem)",
  fontWeight = 700,
  fontFamily = "inherit",
  minWidth = 1024,
}: {
  text: string;
  className?: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  fontSize?: string | number;
  fontWeight?: number;
  fontFamily?: string;
  /** Below this viewport width the heading renders as ordinary text. */
  minWidth?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The particle field is a POINTER effect on a large display heading. On a
  // phone it is neither: the sampled points never close up at the width and
  // size a phone gives the heading, so the H1 rendered as a smear of dots that
  // could not be read at all — and every tap anywhere on the screen scattered
  // it again, because the listener is on the window. Below `minWidth`, or on a
  // device with no fine pointer, this renders the heading as ordinary text and
  // starts no canvas, no observer and no listener.
  const [asType, setAsType] = useState(true);
  useEffect(() => {
    const decide = () => {
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      setAsType(!fine || window.innerWidth < minWidth);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, [minWidth]);

  useEffect(() => {
    if (asType) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf: number | null = null;
    let resizeFrame: number | null = null;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let onScreen = true;
    let restFrames = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;

    const pointer = { active: false, x: 0, y: 0, smoothX: 0, smoothY: 0 };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;
      let complete = true;

      for (const particle of particles) {
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const local =
            (now - gatherStart - particle.delay) / Math.max(1, reduced ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reduced && idleDrift > 0) {
          const t = now * 0.001;
          baseX += Math.sin(t * 0.9 + particle.seed * 10) * idleDrift * particle.depth;
          baseY += Math.cos(t * 0.75 + particle.depth * 10) * idleDrift * particle.depth;
        }

        if (pointer.active && !reduced && pointerRepel > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < repelRadius) {
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
            baseX += (dx / distance) * force;
            baseY += (dy / distance) * force;
          }
        }

        const follow = reduced ? 1 : 0.22;
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;

        ctx.globalAlpha = clamp(0.4 + progress * 0.6, 0, 1);
        ctx.fillStyle = particle.color;
        if (particle.size <= 2.1) {
          ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size,
          );
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      if (gathering && complete) gathering = false;

      // Freeze once the cloud has settled. The idle drift is a sub-pixel
      // wobble, and paying for a full canvas repaint of several thousand
      // particles every frame, forever, to get it is what made the top of the
      // homepage stutter while scrolling. The loop restarts the moment the
      // pointer comes near, which is when the motion is actually visible.
      const busy = gathering || pointer.active;
      restFrames = busy ? 0 : restFrames + 1;
      if (!onScreen || restFrames > 45) {
        raf = null;
        return;
      }
      raf = window.requestAnimationFrame(render);
    };

    const wake = () => {
      restFrames = 0;
      if (raf === null && onScreen) raf = window.requestAnimationFrame(render);
    };

    const sample = async () => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const computed = window.getComputedStyle(container);
      const family = fontFamily === "inherit" ? computed.fontFamily || "sans-serif" : fontFamily;

      let size: number;
      if (typeof fontSize === "number") {
        size = fontSize;
      } else {
        const probe = document.createElement("span");
        probe.textContent = "M";
        probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;font-size:${fontSize};font-weight:${fontWeight};font-family:${family}`;
        container.appendChild(probe);
        size = parseFloat(window.getComputedStyle(probe).fontSize) || 64;
        probe.remove();
      }

      const font = `${fontWeight} ${size}px ${family}`;
      if ("fonts" in document) {
        try {
          await document.fonts.load(font);
        } catch {
          /* a font that will not load is not a reason to skip the heading */
        }
        await document.fonts.ready;
      }
      if (currentBuild !== buildId) return;

      const off = document.createElement("canvas");
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      const content = String(text || " ");
      const maxWidth = width * 0.96;
      offCtx.font = font;

      // Wrap. Sampling the whole headline as one string rendered it as a
      // single thin line at any viewport, which is not a headline.
      const words = content.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (offCtx.measureText(candidate).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line) lines.push(line);

      const lineHeight = size * 1.02;
      const pad = Math.max(10, Math.ceil(size * 0.1));
      const widest = Math.max(...lines.map((l) => offCtx.measureText(l).width), 1);
      off.width = Math.ceil(widest) + pad * 2;
      off.height = Math.ceil(lineHeight * lines.length) + pad * 2;
      offCtx.font = font;
      offCtx.textAlign = "left";
      offCtx.textBaseline = "alphabetic";
      offCtx.fillStyle = "#ffffff";
      lines.forEach((l, i) => {
        offCtx.fillText(l, pad, pad + size * 0.82 + i * lineHeight);
      });

      const image = offCtx.getImageData(0, 0, off.width, off.height);
      const targets: { x: number; y: number; alpha: number }[] = [];
      const step = Math.max(2, Math.floor(density));
      // Left-aligned to match the headings around it, not centred.
      const originX = 0;
      const originY = Math.max(0, height / 2 - off.height / 2);
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const alpha = image.data[(y * off.width + x) * 4 + 3] ?? 0;
          if (alpha > 40) targets.push({ x: originX + x, y: originY + y, alpha: alpha / 255 });
        }
      }

      // The first budget thinned a section heading to a scatter of unreadable
      // dots: at H2 size the sampled area is wide and the cap dropped most of
      // it. Sampled densely enough that the letterforms actually close up.
      const maxParticles = Math.max(2600, Math.min(11000, Math.floor((width * height) / 34)));
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      const baseRgb = hexToRgb(color);
      const hiRgb = hexToRgb(highlightColor);

      particles = targets
        .filter((_, index) => index % stride === 0)
        .map((target, index) => {
          const seed = ((index * 9301 + 49297) % 233280) / 233280;
          const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
          const blend = clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1);
          const rgb = baseRgb && hiRgb ? mixRgb(baseRgb, hiRgb, blend) : null;
          const angle = seed * Math.PI * 2;
          const distance = (reduced ? 0 : scatter) * (0.35 + depth * 0.75);
          const startX = target.x + Math.cos(angle) * distance;
          const startY = target.y + Math.sin(angle) * distance;
          return {
            x: reduced ? target.x : startX,
            y: reduced ? target.y : startY,
            startX,
            startY,
            targetX: target.x,
            targetY: target.y,
            size: Math.max(0.6, particleSize * (0.75 + target.alpha * 0.45)),
            color: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color,
            seed,
            depth,
            delay: reduced ? 0 : seed * stagger,
          };
        });

      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;

      if (!reduced) {
        gatherStart = performance.now();
        gathering = true;
      }
      restFrames = 0;
      if (raf === null) raf = window.requestAnimationFrame(render);
    };

    const queue = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => void sample());
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      // Only count the pointer as active when it is close enough to push a
      // particle. Before this, a cursor anywhere on the page ran the repulsion
      // maths for every particle on every frame of a heading it was nowhere
      // near.
      const margin = repelRadius + 80;
      const near =
        pointer.x > -margin &&
        pointer.y > -margin &&
        pointer.x < rect.width + margin &&
        pointer.y < rect.height + margin;
      pointer.active = near;
      if (near) wake();
    };
    const onLeave = () => {
      pointer.active = false;
    };

    // The pointer listener is on the WINDOW, not the canvas: the canvas is
    // pointer-events:none so it cannot swallow clicks on the content, and a
    // repulsion that only worked while the cursor was over the heading itself
    // would barely be noticeable.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver((entries) => {
      const next = entries.some((e) => e.isIntersecting);
      if (next && !onScreen) {
        onScreen = true;
        restFrames = 0;
        if (raf === null) raf = window.requestAnimationFrame(render);
      } else if (!next && onScreen) {
        onScreen = false;
        if (raf !== null) window.cancelAnimationFrame(raf);
        raf = null;
      }
    });
    io.observe(container);

    const ro = new ResizeObserver(queue);
    ro.observe(container);
    void sample();

    return () => {
      buildId += 1;
      onScreen = false;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (raf !== null) window.cancelAnimationFrame(raf);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    fontSize,
    fontWeight,
    fontFamily,
    asType,
  ]);

  // Plain type. `className` carries the canvas's reserved height, which a real
  // heading must not inherit, so it is dropped here.
  if (asType) return <span className="block w-full">{text}</span>;

  return (
    <span ref={containerRef} className={cn("relative block w-full", className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full"
        aria-hidden
      />
      {/* The real heading. Always present, never painted over. */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
