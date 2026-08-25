/**
 * Tilt — a small 3D rotation toward the cursor.
 *
 * Bounded to single-digit degrees. Anything larger reads as a toy and, on a
 * card with text, destroys legibility at the far corner. Fine pointer only,
 * off under reduced motion, transform only.
 *
 * Works standalone; if the element also runs `useElementPointer`, prefer
 * driving the tilt in CSS from `--el-ptr-x/y` instead of adding this hook, so
 * only one thing writes `transform`.
 */
import { useEffect, useRef, type RefObject } from "react";

import { pointerMotionEnabled } from "./gsap";

export type TiltOptions = {
  /** Maximum rotation in degrees on each axis. Default 6. Keep under 9. */
  degrees?: number;
  /** Perspective in px. Default 900. */
  perspective?: number;
  /** Slight lift in px while hovered. Default 0 (none). */
  lift?: number;
};

export function useTilt<T extends HTMLElement = HTMLElement>(
  options: TiltOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { degrees = 6, perspective = 900, lift = 0 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !pointerMotionEnabled()) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(${perspective}px) ` +
          `rotateX(${(-py * degrees).toFixed(2)}deg) ` +
          `rotateY(${(px * degrees).toFixed(2)}deg)` +
          (lift ? ` translate3d(0, ${-lift}px, 0)` : "");
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.removeProperty("transform");
    };
  }, [degrees, perspective, lift]);

  return ref;
}
