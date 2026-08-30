import { useEffect } from "react";

/**
 * Custom pointer.
 *
 * A dot that is written straight from the pointer event, and a ring that
 * trails it on a spring from the rAF loop.
 *
 * Three things were making the old one feel slow, and all three were real:
 *
 *  1. The dot waited for the next animation frame before it moved. That is a
 *     guaranteed extra frame of latency -- 16ms at 60Hz, more when the frame
 *     budget is under load, which is exactly when you notice it. The dot is
 *     now written inside the pointermove handler itself, so it lands on the
 *     same pixel as the OS cursor with nothing in between.
 *  2. Every single pointermove ran `closest()` with an eight-part selector,
 *     walking up the DOM tree. A 1000Hz mouse means a thousand tree walks a
 *     second, on the same thread the ring is trying to animate on. Hit
 *     testing now happens on `pointerover` only, which fires when you cross
 *     an element boundary -- a few times a second, not a thousand.
 *  3. `.bbi-ptr-ring` carried `backdrop-filter: blur(1px)`. A backdrop filter
 *     on a fixed element that moves every frame forces the compositor to
 *     re-sample the page behind it every frame. It was both the muddy look
 *     and a large slice of the cost. Gone.
 *
 * Desktop only. It mounts on `(pointer: fine)` and refuses to run on touch,
 * where a lagging ring under a finger is noise. The native cursor is hidden
 * only while this is live, and only outside text inputs -- see `.has-ptr` in
 * styles.css.
 */

/** Anything you can click. Evaluated on boundary crossing, never on move. */
const HOT =
  'a, button, [role="button"], input, textarea, select, summary, label[for], [tabindex]:not([tabindex="-1"])';

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

    const ds = dot.style;
    const rs_ = ring.style;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    // ring scale: `s` is the live value, `sT` the target
    let s = 1;
    let sT = 1;
    let vis = 0;
    let visT = 0;
    let down = false;
    let last = 0;
    let raf = 0;
    // last written values, so we never touch style for an unchanged number
    let wVis = -1;

    const setTarget = (el: Element | null) => {
      const hot = !!(el && el.closest && el.closest(HOT));
      // Zoom OUT over anything clickable (the ring opens up and the dot
      // shrinks into it), zoom IN on press. This is the whole tactile signal,
      // so it has to be unmistakable rather than polite.
      sT = down ? (hot ? 1.5 : 0.6) : hot ? 2.1 : 1;
      if (hot) ring.classList.add("is-hot");
      else ring.classList.remove("is-hot");
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      // Written NOW, not next frame. This is the whole point.
      ds.transform = `translate3d(${tx}px,${ty}px,0) translate(-50%,-50%)`;
      if (visT !== 1) {
        visT = 1;
      }
    };
    // `pointerover` fires on boundary crossing only -- a handful of times a
    // second while you move across the page, versus once per mouse report.
    const onOver = (e: PointerEvent) => setTarget(e.target as Element | null);
    const onLeave = () => {
      visT = 0;
    };
    const onDown = (e: PointerEvent) => {
      down = true;
      setTarget(e.target as Element | null);
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      setTarget(e.target as Element | null);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      // Exponential smoothing, frame-rate independent. Only the ring is
      // smoothed now -- the dot is already exact.
      const kr = 1 - Math.exp(-dt / 0.032);
      rx += (tx - rx) * kr;
      ry += (ty - ry) * kr;
      s += (sT - s) * (1 - Math.exp(-dt / 0.05));
      vis += (visT - vis) * (1 - Math.exp(-dt / 0.1));

      rs_.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${s.toFixed(3)})`;

      // Opacity changes are a style recalc; skip the write when the rounded
      // value has not moved.
      const v = Math.round(vis * 100) / 100;
      if (v !== wVis) {
        wVis = v;
        ds.opacity = String(v);
        rs_.opacity = String(v * 0.85);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
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
