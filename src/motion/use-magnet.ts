/**
 * Magnet — the element drifts a bounded distance toward the cursor.
 *
 * Deliberately small: max travel is capped in px, not as a fraction of the
 * distance, so a fast flick across the screen cannot fling a button out of its
 * layout. Primary calls to action only — a page of magnetic elements is
 * unusable.
 *
 * Fine pointer only, and off entirely under reduced motion. Transform only.
 */
import { useEffect, useRef, type RefObject } from "react";

import { pointerMotionEnabled } from "./gsap";

export type MagnetOptions = {
  /** Fraction of the offset followed. 0.2 - 0.35 is the usable band. */
  strength?: number;
  /** Hard cap on displacement in px. Default 10. */
  max?: number;
  /** Radius in px around the element that activates it. Default 90. */
  radius?: number;
};

export function useMagnet<T extends HTMLElement = HTMLElement>(
  options: MagnetOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { strength = 0.28, max = 10, radius = 90 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !pointerMotionEnabled()) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let running = false;

    const clamp = (v: number) => Math.max(-max, Math.min(max, v));

    const frame = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05) {
        x = tx;
        y = ty;
        el.style.transform = tx === 0 && ty === 0 ? "" : `translate3d(${x}px, ${y}px, 0)`;
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const outside = Math.hypot(
        Math.max(r.left - e.clientX, 0, e.clientX - r.right),
        Math.max(r.top - e.clientY, 0, e.clientY - r.bottom),
      );
      if (outside > radius) {
        tx = 0;
        ty = 0;
      } else {
        tx = clamp(dx * strength);
        ty = clamp(dy * strength);
      }
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.style.removeProperty("transform");
    };
  }, [strength, max, radius]);

  return ref;
}
