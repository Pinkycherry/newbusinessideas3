import { useEffect, useRef } from "react";

import { approach, clamp01, onFrame, onScroll, onVisible } from "./engine";
import { prefersReducedMotion, pointerMotionEnabled } from "./gsap";

export type DepthSceneOptions = {
  /** How hard the scene leans toward the cursor. 1 is the house default. */
  strength?: number;
  /** Inertia. Larger is heavier and slower to settle. */
  weight?: number;
  /** Publish scroll progress for the scene as well as pointer depth. */
  scroll?: boolean;
};

/**
 * A depth scene: one section that knows where the cursor is and where it sits
 * in the scroll, and publishes both as CSS variables its children read.
 *
 * Published on the scene element:
 *
 *   --dx --dy   cursor offset from the scene centre, -1..1, inertial
 *   --dv        pointer speed, 0..1, smoothed — drives motion blur/glow
 *   --din       1 while the cursor is over the scene, else 0
 *   --sc-p      the scene's own scroll progress, 0..1 (with `scroll`)
 *
 * Children opt into the field with `.cx-layer` and a `--z` depth. Because the
 * work is one listener and one shared frame callback per SCENE — not per
 * child — a scene with two hundred animated layers costs the same as one with
 * three. Off-screen scenes are unsubscribed entirely by the shared observer.
 */
export function useDepthScene<T extends HTMLElement>(opts: DepthSceneOptions = {}) {
  const { strength = 1, weight = 0.11, scroll = true } = opts;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const pointer = pointerMotionEnabled();
    let visible = false;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let v = 0;
    let tv = 0;
    let inside = 0;
    let tin = 0;
    let stopFrame: (() => void) | null = null;

    const style = el.style;

    const startFrame = () => {
      if (stopFrame) return;
      stopFrame = onFrame((dt) => {
        x = approach(x, tx, dt, weight);
        y = approach(y, ty, dt, weight);
        v = approach(v, tv, dt, 0.14);
        inside = approach(inside, tin, dt, 0.12);
        tv *= 0.9;
        style.setProperty("--dx", (x * strength).toFixed(4));
        style.setProperty("--dy", (y * strength).toFixed(4));
        style.setProperty("--dv", v.toFixed(4));
        style.setProperty("--din", inside.toFixed(4));
        const settled =
          Math.abs(x - tx) < 0.0008 &&
          Math.abs(y - ty) < 0.0008 &&
          v < 0.002 &&
          Math.abs(inside - tin) < 0.002;
        if (settled) {
          stopFrame?.();
          stopFrame = null;
        }
      });
    };

    let lastPx = 0;
    let lastPy = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      const dx = e.clientX - lastPx;
      const dy = e.clientY - lastPy;
      lastPx = e.clientX;
      lastPy = e.clientY;
      tv = Math.min(1, Math.hypot(dx, dy) / 40);
      tin = 1;
      startFrame();
    };

    const onPointerLeave = () => {
      tx = 0;
      ty = 0;
      tv = 0;
      tin = 0;
      startFrame();
    };

    let stopScroll: (() => void) | null = null;

    const measure = () => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = clamp01((vh - r.top) / (vh + r.height));
      style.setProperty("--sc-p", p.toFixed(4));
    };

    const stopVis = onVisible(el, (isVisible) => {
      visible = isVisible;
      if (isVisible) {
        if (pointer) {
          el.addEventListener("pointermove", onPointerMove, { passive: true });
          el.addEventListener("pointerleave", onPointerLeave, { passive: true });
        }
        // Touch has no cursor, so a coarse-pointer scene ALWAYS publishes
        // --sc-p: that is what drives the depth field on a phone (motion.css,
        // coarse-pointer block). Mobile is the main case, not the fallback.
        if ((scroll || !pointer) && !stopScroll) stopScroll = onScroll(measure);
      } else {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
        stopScroll?.();
        stopScroll = null;
        onPointerLeave();
      }
    });

    return () => {
      stopVis();
      stopScroll?.();
      stopFrame?.();
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [strength, weight, scroll]);

  return ref;
}
