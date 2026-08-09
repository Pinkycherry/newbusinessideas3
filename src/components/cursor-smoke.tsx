import { useEffect, useRef } from "react";
import type { gsap as GsapType } from "gsap";

import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Full-page ambient cursor trail — a soft blue "smoke" that follows the
 * pointer everywhere on the site, not scoped to one element. Three layered
 * blobs at increasing lag (via gsap.quickTo) create the trailing feel
 * instead of one dot snapping to the cursor. Mounted once in SiteShell so
 * it's present on every page.
 *
 * Uses pointermove (not mousemove) so a dragging finger on touch/tablet
 * also drives it — there is no true hover on touch, so this is the closest
 * honest equivalent; a static tap with no movement won't trigger it.
 * pointer-events: none throughout, so it never blocks clicks/taps.
 */
export function CursorSmoke() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let quicks: { x: (v: number) => void; y: (v: number) => void }[] = [];
    let visible = false;

    loadGsap().then((gsap: typeof GsapType) => {
      if (cancelled) return;
      quicks = layerRefs.current.map((el, i) =>
        el
          ? {
              x: gsap.quickTo(el, "x", { duration: 0.5 + i * 0.35, ease: "power3" }),
              y: gsap.quickTo(el, "y", { duration: 0.5 + i * 0.35, ease: "power3" }),
            }
          : { x: () => {}, y: () => {} },
      );
    });

    const show = () => {
      if (visible) return;
      visible = true;
      layerRefs.current.forEach((el) => el?.style.setProperty("opacity", "1"));
    };
    const hide = () => {
      visible = false;
      layerRefs.current.forEach((el) => el?.style.setProperty("opacity", "0"));
    };

    const onMove = (e: PointerEvent) => {
      show();
      quicks.forEach((q) => {
        q.x(e.clientX);
        q.y(e.clientY);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", hide);
    window.addEventListener("pointerdown", show, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", hide);
      window.removeEventListener("pointerdown", show);
    };
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="bbi-cursor-smoke-layer"
          style={{
            opacity: 0,
            width: `${320 - i * 60}px`,
            height: `${320 - i * 60}px`,
            marginLeft: `${-(320 - i * 60) / 2}px`,
            marginTop: `${-(320 - i * 60) / 2}px`,
            filter: `blur(${46 + i * 18}px)`,
          }}
        />
      ))}
    </div>
  );
}
