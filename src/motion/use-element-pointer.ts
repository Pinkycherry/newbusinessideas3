/**
 * Per-element pointer proximity.
 *
 * Attach the returned ref to any element that already exists — a card, a nav
 * row, a table row, a footer link — and it publishes, on that element only:
 *
 *   --el-ptr-x   cursor X relative to the element, -1 (left) -> 1 (right)
 *   --el-ptr-y   cursor Y relative to the element, -1 (top)  -> 1 (bottom)
 *   --el-ptr-d   0 at the element's centre -> 1 at its far edge
 *   --el-ptr-in  1 while the pointer is inside, 0 otherwise (eases out)
 *
 * No React state, no re-renders, no markup requirements. Everything downstream
 * is pure CSS, so one hook call gives a whole component pointer awareness.
 *
 * Two modes:
 *  - "hover"  (default) listens on the element itself; cheapest, use for rows
 *             and links where response is only wanted under the cursor.
 *  - "window" listens on the window, so the element keeps responding to a
 *             cursor that is near but not over it. Use sparingly — a handful
 *             of hero-scale elements, never a 100-card grid.
 */
import { useCallback, useEffect, useRef, type RefObject } from "react";

import { pointerMotionEnabled } from "./gsap";

export type ElementPointerOptions = {
  mode?: "hover" | "window";
  /** For "window" mode: radius in px beyond the element that still registers. */
  radius?: number;
  /** Lerp factor per frame, 0-1. Lower is smoother/laggier. Default 0.18. */
  ease?: number;
};

export function useElementPointer<T extends HTMLElement = HTMLElement>(
  options: ElementPointerOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { mode = "hover", radius = 240, ease = 0.18 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !pointerMotionEnabled()) return;

    let raf = 0;
    let running = false;
    let tx = 0;
    let ty = 0;
    let td = 1;
    let ti = 0;
    let x = 0;
    let y = 0;
    let d = 1;
    let i = 0;

    const write = () => {
      el.style.setProperty("--el-ptr-x", x.toFixed(4));
      el.style.setProperty("--el-ptr-y", y.toFixed(4));
      el.style.setProperty("--el-ptr-d", d.toFixed(4));
      el.style.setProperty("--el-ptr-in", i.toFixed(4));
    };

    const frame = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      d += (td - d) * ease;
      i += (ti - i) * ease;
      write();
      const settled =
        Math.abs(tx - x) < 0.001 &&
        Math.abs(ty - y) < 0.001 &&
        Math.abs(td - d) < 0.001 &&
        Math.abs(ti - i) < 0.001;
      if (settled) {
        x = tx;
        y = ty;
        d = td;
        i = ti;
        write();
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

    const measure = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const nx = ((clientX - r.left) / r.width) * 2 - 1;
      const ny = ((clientY - r.top) / r.height) * 2 - 1;
      const inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;

      if (mode === "window" && !inside) {
        // Distance from the element's edge, normalized against `radius`.
        const dx = Math.max(r.left - clientX, 0, clientX - r.right);
        const dy = Math.max(r.top - clientY, 0, clientY - r.bottom);
        const dist = Math.hypot(dx, dy);
        if (dist > radius) {
          tx = 0;
          ty = 0;
          td = 1;
          ti = 0;
          kick();
          return;
        }
        ti = 1 - dist / radius;
      } else {
        ti = inside ? 1 : 0;
      }

      tx = Math.max(-1.5, Math.min(1.5, nx));
      ty = Math.max(-1.5, Math.min(1.5, ny));
      td = Math.min(Math.hypot(tx, ty) / Math.SQRT2, 1);
      kick();
    };

    const onMove = (e: PointerEvent) => measure(e.clientX, e.clientY);
    const onLeave = () => {
      tx = 0;
      ty = 0;
      td = 1;
      ti = 0;
      kick();
    };

    const target: HTMLElement | Window = mode === "window" ? window : el;
    target.addEventListener("pointermove", onMove as EventListener, { passive: true });
    if (mode === "hover") el.addEventListener("pointerleave", onLeave);

    write();

    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("pointermove", onMove as EventListener);
      if (mode === "hover") el.removeEventListener("pointerleave", onLeave);
      for (const p of ["--el-ptr-x", "--el-ptr-y", "--el-ptr-d", "--el-ptr-in"]) {
        el.style.removeProperty(p);
      }
    };
  }, [mode, radius, ease]);

  return ref;
}

/**
 * Delegated variant: one listener for a whole container, publishing the same
 * four variables on whichever child matches `itemSelector` is under the
 * cursor. Use this for grids and long lists — 200 cards, one listener.
 */
export function useElementPointerGroup<T extends HTMLElement = HTMLElement>(
  itemSelector: string,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  const clear = useCallback((el: HTMLElement) => {
    for (const p of ["--el-ptr-x", "--el-ptr-y", "--el-ptr-d", "--el-ptr-in"]) {
      el.style.removeProperty(p);
    }
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || !pointerMotionEnabled()) return;

    let current: HTMLElement | null = null;
    let raf = 0;
    let pending: { el: HTMLElement; cx: number; cy: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const { el, cx, cy } = pending;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const nx = ((cx - r.left) / r.width) * 2 - 1;
      const ny = ((cy - r.top) / r.height) * 2 - 1;
      el.style.setProperty("--el-ptr-x", nx.toFixed(4));
      el.style.setProperty("--el-ptr-y", ny.toFixed(4));
      el.style.setProperty("--el-ptr-d", Math.min(Math.hypot(nx, ny) / Math.SQRT2, 1).toFixed(4));
      el.style.setProperty("--el-ptr-in", "1");
    };

    const onMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(itemSelector) ?? null;
      if (target !== current) {
        if (current) clear(current);
        current = target;
      }
      if (!target) return;
      pending = { el: target, cx: e.clientX, cy: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (current) clear(current);
      current = null;
      pending = null;
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      if (current) clear(current);
    };
  }, [itemSelector, clear]);

  return ref;
}
