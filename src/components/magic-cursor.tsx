import { useEffect, useRef, useState } from "react";
import type { gsap as GsapType } from "gsap";

import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide "magic cursor" — a small dot glued to the pointer plus a larger
 * hollow ring that trails it with easing, scaling up over anything
 * clickable. Replaces the earlier 20-circle mascot entirely: that version
 * had a real z-index conflict with buttons (its fixed container outranked
 * unstyled `.glass-pill` elements) and its 96px opaque face was large
 * enough to fully cover a pill button on its own. A hollow ring can't
 * reproduce either bug — there's nothing solid to occlude content with.
 *
 * Movement uses gsap.quickTo on transform (x/y), the same technique
 * src/components/spotlight.tsx already uses for cursor-follow — compositor-
 * only, no per-element left/top writes. Hover state is a single class
 * toggle driven by delegated mouseover/mouseout, not polling.
 *
 * Desktop-with-real-cursor only, absent under reduced motion, lazy-loaded.
 */
const INTERACTIVE_SELECTOR = "a, button, .glass-btn, .glass-pill";

export function MagicCursor() {
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

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
    let cancelled = false;
    let gsapRef: typeof GsapType | null = null;
    let dot: { x: (v: number) => void; y: (v: number) => void } | null = null;
    let ring: { x: (v: number) => void; y: (v: number) => void } | null = null;

    loadGsap().then((gsap: typeof GsapType) => {
      if (cancelled || !dotRef.current || !ringRef.current) return;
      gsapRef = gsap;
      // xPercent/yPercent center each element on its own x/y point once;
      // GSAP composes that with the quickTo-driven pixel translation below
      // into a single transform, so it never fights the plain CSS fallback
      // transform set before gsap finished loading.
      gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50 });
      dot = {
        x: gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" }),
        y: gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" }),
      };
      ring = {
        x: gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3" }),
        y: gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3" }),
      };
    });

    const onMove = (e: MouseEvent) => {
      if (!started.current) {
        started.current = true;
        containerRef.current?.style.setProperty("opacity", "1");
      }
      if (dot && ring) {
        dot.x(e.clientX);
        dot.y(e.clientY);
        ring.x(e.clientX);
        ring.y(e.clientY);
      } else {
        // gsap hasn't loaded yet — set the base position directly (with the
        // same -50%/-50% self-centering gsap.set() applies once it's ready)
        // so the ring doesn't jump once quickTo takes over.
        const t = `translate(-50%, -50%) translate(${e.clientX}px, ${e.clientY}px)`;
        dotRef.current?.style.setProperty("transform", t);
        ringRef.current?.style.setProperty("transform", t);
      }
    };

    // Scale is animated via gsap (composes cleanly with the x/y quickTo
    // transform already owned by gsap on this element) rather than a CSS
    // width/height transition — animating width/height forces layout on
    // every frame instead of being compositor-only, the exact mistake
    // already caught and fixed once this session on the heading glow.
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest(INTERACTIVE_SELECTOR) || !ringRef.current) return;
      ringRef.current.classList.add("is-hover");
      gsapRef?.to(ringRef.current, { scale: 1.55, duration: 0.25, ease: "back.out(2)" });
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest(INTERACTIVE_SELECTOR) || !ringRef.current) return;
      ringRef.current.classList.remove("is-hover");
      gsapRef?.to(ringRef.current, { scale: 1, duration: 0.25, ease: "power2.out" });
    };

    const onVisibility = () => {
      if (document.hidden) containerRef.current?.style.setProperty("opacity", "0");
      else if (started.current) containerRef.current?.style.setProperty("opacity", "1");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (prefersReducedMotion() || !enabled) return null;

  return (
    <div ref={containerRef} className="bbi-cursor" aria-hidden>
      <div ref={dotRef} className="bbi-cursor-dot" />
      <div ref={ringRef} className="bbi-cursor-ring" />
    </div>
  );
}
