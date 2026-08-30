import { useEffect } from "react";

/**
 * Custom pointer.
 *
 * A dot that tracks the cursor exactly (so precision is never lost) and a ring
 * that lags behind it on a spring. The dot is what makes it feel fast; the ring
 * is what makes it feel smooth. Both are driven from one rAF loop and written
 * as transforms, so nothing here triggers layout.
 *
 * Desktop only. It mounts on `(pointer: fine)` and refuses to run on touch,
 * where a lagging ring under a finger is noise. The native cursor is hidden
 * only while this is live, and only outside text inputs — see `.has-ptr` in
 * styles.css.
 */
export function PointerCursor() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "bbi-ptr-dot";
    ring.className = "bbi-ptr-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);
    document.documentElement.classList.add("has-ptr");

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let dx = tx;
    let dy = ty;
    let rx = tx;
    let ry = ty;
    let rs = 1;
    let rsT = 1;
    let vis = 0;
    let visT = 0;
    let last = 0;
    let raf = 0;

    const HOT = 'a, button, [role="button"], input, textarea, select, summary, label[for]';

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      visT = 1;
      const el = e.target as Element | null;
      rsT = el && el.closest && el.closest(HOT) ? 1.85 : 1;
    };
    const onLeave = () => {
      visT = 0;
    };
    const onDown = () => {
      rsT = 0.75;
    };
    const onUp = (e: PointerEvent) => {
      const el = e.target as Element | null;
      rsT = el && el.closest && el.closest(HOT) ? 1.85 : 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      // Exponential smoothing keeps both frame-rate independent.
      // The dot is effectively instant and the ring trails just enough to read
      // as a follow. Both were slower before, which on top of a starved frame
      // budget made the pointer feel like it was dragging behind the mouse.
      const kd = 1 - Math.exp(-dt / 0.006);
      const kr = 1 - Math.exp(-dt / 0.045);
      dx += (tx - dx) * kd;
      dy += (ty - dy) * kd;
      rx += (tx - rx) * kr;
      ry += (ty - ry) * kr;
      rs += (rsT - rs) * (1 - Math.exp(-dt / 0.06));
      vis += (visT - vis) * (1 - Math.exp(-dt / 0.12));

      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      dot.style.opacity = String(vis);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${rs.toFixed(3)})`;
      ring.style.opacity = String(vis * 0.9);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("has-ptr");
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
