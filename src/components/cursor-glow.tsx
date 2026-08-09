import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

const IDLE_MS = 1500;
const DRIFT_PERIOD_S = 22;
const DRIFT_AMP_X = 55;
const DRIFT_AMP_Y = 40;
const GLOW_LERP = 0.08;
const GLOW_LERP_FOOTER = 0.1;
const DOT_LERP = 0.3;

const INTERACTIVE_SELECTOR = "a, button, .glass-btn, .glass-pill";

/**
 * Site-wide cursor companion — a soft trailing glow plus a tight-following
 * core dot. One shared requestAnimationFrame loop drives three visual
 * layers: the global fixed glow+dot, and a footer-local accent glow that
 * reads the same lerped position translated into the footer's own
 * coordinate space (so it can sit behind footer text via the isolated
 * .bbi-footer-glow-host stacking trick already proven by .bbi-spotlight,
 * instead of fighting a page-wide z-index).
 *
 * Desktop-with-real-cursor only ((hover:hover) and (pointer:fine)) — never
 * touch. Fully absent under prefers-reduced-motion. Pauses the rAF loop
 * when the tab is hidden or the pointer leaves the window.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const footerGlowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const glowPos = { ...pointer };
    const dotPos = { ...pointer };
    let lastMoveAt = performance.now();
    let driftBase = { ...pointer };
    let hovering = false;
    let inFooter = false;
    let running = true;
    let rafId = 0;

    const footerEl = document.querySelector("footer");

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      lastMoveAt = performance.now();

      const target = e.target as Element | null;
      const nextHovering = !!target?.closest(INTERACTIVE_SELECTOR);
      if (nextHovering !== hovering) {
        hovering = nextHovering;
        dotRef.current?.style.setProperty("--cursor-dot-scale", hovering ? "2" : "1");
        dotRef.current?.style.setProperty("--cursor-dot-o", hovering ? "0.5" : "1");
        glowRef.current?.style.setProperty("--cursor-glow-hover", hovering ? "1" : "0");
      }

      const nextInFooter = !!target?.closest("footer");
      if (nextInFooter !== inFooter) {
        inFooter = nextInFooter;
        glowRef.current?.style.setProperty("--cursor-glow-o", inFooter ? "0.65" : "0.42");
      }
    };

    const pause = () => {
      running = false;
    };
    const resume = () => {
      if (!running) {
        running = true;
        lastMoveAt = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };
    const onVisibility = () => (document.hidden ? pause() : resume());

    function tick(now: number) {
      if (!running) return;

      const idleFor = now - lastMoveAt;
      let targetX: number;
      let targetY: number;

      if (idleFor > IDLE_MS) {
        if (idleFor - IDLE_MS < 16) driftBase = { x: glowPos.x, y: glowPos.y };
        const t = (now / 1000 / DRIFT_PERIOD_S) * Math.PI * 2;
        targetX = driftBase.x + Math.sin(t) * DRIFT_AMP_X;
        targetY = driftBase.y + Math.sin(t * 2) * DRIFT_AMP_Y;
      } else {
        targetX = pointer.x;
        targetY = pointer.y;
      }

      const glowLerp = inFooter ? GLOW_LERP_FOOTER : GLOW_LERP;
      glowPos.x += (targetX - glowPos.x) * glowLerp;
      glowPos.y += (targetY - glowPos.y) * glowLerp;
      dotPos.x += (targetX - dotPos.x) * DOT_LERP;
      dotPos.y += (targetY - dotPos.y) * DOT_LERP;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      }
      if (footerGlowRef.current && footerEl) {
        const r = footerEl.getBoundingClientRect();
        footerGlowRef.current.style.setProperty("--fx", `${glowPos.x - r.left}px`);
        footerGlowRef.current.style.setProperty("--fy", `${glowPos.y - r.top}px`);
        footerGlowRef.current.style.setProperty("--fo", inFooter ? "0.65" : "0");
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", pause);
    document.addEventListener("mouseenter", resume);
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", pause);
      document.removeEventListener("mouseenter", resume);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const footerEl = document.querySelector("footer");
    if (!footerEl) return;
    footerEl.classList.add("bbi-footer-glow-host");
    const el = document.createElement("div");
    el.className = "bbi-footer-glow-accent";
    footerEl.prepend(el);
    footerGlowRef.current = el;
    return () => {
      el.remove();
      footerGlowRef.current = null;
    };
  }, [enabled]);

  if (prefersReducedMotion() || !enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden>
      <div ref={glowRef} className="bbi-cursor-glow" />
      <div ref={dotRef} className="bbi-cursor-dot-pos">
        <div className="bbi-cursor-dot-visual" />
      </div>
    </div>
  );
}
