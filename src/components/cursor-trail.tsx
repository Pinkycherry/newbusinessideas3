import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide cursor companion — one lead "face" character followed by 19
 * plain trailing circles, all siblings. The chain-lag effect is a per-circle
 * CSS transition-duration stagger (see .bbi-trail-circle in styles.css):
 * every circle gets the exact same target position on mousemove, but slower
 * circles take longer to visually catch up, which is the whole trick — no
 * animation loop, no lerp math for the trail itself. Position writes go
 * straight to the DOM via refs so a high-frequency mousemove never triggers
 * a React re-render.
 *
 * The face additionally: squashes/stretches along its direction of travel
 * based on real pointer velocity (cheap — one element, transform only), and
 * points an arm at the nearest interactive element when the pointer sits
 * idle over empty space, instead of just facing the viewer statically.
 *
 * Perf note: earlier version ran an infinite CSS animation on all 20
 * circles simultaneously, all the time — real, avoidable compositor cost.
 * Nothing here runs continuously anymore; everything is purely event/
 * timeout-driven and idles at zero cost when the pointer stops.
 *
 * Desktop-with-real-cursor only, absent under reduced motion, lazy-loaded.
 */
const COUNT = 20;
const IDLE_POINT_MS = 1200;
const POINT_MAX_DIST = 420;
const INTERACTIVE_SELECTOR = "a, button, .glass-btn, .glass-pill";

const CIRCLES = Array.from({ length: COUNT }, (_, idx) => {
  const i = idx + 1;
  const size = 100 - i * 4;
  const colorPct = Math.round(((i - 1) / (COUNT - 1)) * 100);
  return {
    i,
    size,
    zIndex: COUNT - i,
    duration: i / COUNT,
    colorPct,
  };
});

export function CursorTrail() {
  const [enabled, setEnabled] = useState(false);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const faceBodyRef = useRef<HTMLDivElement | null>(null);
  const armRRef = useRef<HTMLSpanElement | null>(null);
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

    let last = { x: window.innerWidth / 2, y: window.innerHeight / 2, t: performance.now() };
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let pointing = false;

    const clearIdlePoint = () => {
      pointing = false;
      armRRef.current?.classList.remove("bbi-trail-arm-pointing");
      armRRef.current?.style.removeProperty("transform");
    };

    const tryPointAtNearest = (x: number, y: number) => {
      const targetUnderCursor = document.elementFromPoint(x, y)?.closest(INTERACTIVE_SELECTOR);
      if (targetUnderCursor) return; // already on top of something clickable, nothing to point at

      const candidates = document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR);
      let best: { dx: number; dy: number; dist: number } | null = null;
      for (const el of candidates) {
        const r = el.getBoundingClientRect();
        if (
          r.bottom < 0 ||
          r.top > window.innerHeight ||
          r.right < 0 ||
          r.left > window.innerWidth
        ) {
          continue; // skip anything off-screen, cheap reject before the real distance math
        }
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - x;
        const dy = cy - y;
        const dist = Math.hypot(dx, dy);
        if (dist > POINT_MAX_DIST) continue;
        if (!best || dist < best.dist) best = { dx, dy, dist };
      }
      if (!best || !armRRef.current) return;

      pointing = true;
      const angle = (Math.atan2(best.dy, best.dx) * 180) / Math.PI;
      armRRef.current.classList.add("bbi-trail-arm-pointing");
      armRRef.current.style.transform = `rotate(${angle}deg)`;
    };

    // DOM writes are throttled to one per animation frame — a raw mousemove
    // stream can fire well past 60/sec on some mice/trackpads, and writing
    // 20 elements' inline styles on every single one of those events (not
    // just once per rendered frame) is wasted work the browser can never
    // actually show, which is exactly the kind of thing that reads as
    // "laggy" even though nothing is technically broken.
    let latestEvent: { x: number; y: number } | null = null;
    let frameQueued = false;

    const applyFrame = () => {
      frameQueued = false;
      if (!latestEvent) return;
      const { x: ex, y: ey } = latestEvent;

      const now = performance.now();
      const dt = Math.max(1, now - last.t);
      const dx = ex - last.x;
      const dy = ey - last.y;
      const speed = Math.min(1, Math.hypot(dx, dy) / dt / 1.6);

      if (faceBodyRef.current && speed > 0.03) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const stretch = 1 + speed * 0.32;
        const squash = 1 - speed * 0.16;
        faceBodyRef.current.style.transform = `rotate(${angle}deg) scale(${stretch}, ${squash}) rotate(${-angle}deg)`;
      }

      last = { x: ex, y: ey, t: now };

      const x = `${ex}px`;
      const y = `${ey}px`;
      circleRefs.current.forEach((el) => {
        if (!el) return;
        el.style.left = x;
        el.style.top = y;
      });
    };

    const onMove = (e: MouseEvent) => {
      if (!started.current) {
        started.current = true;
        containerRef.current?.style.setProperty("opacity", "1");
      }
      if (idleTimer) clearTimeout(idleTimer);
      if (pointing) clearIdlePoint();

      latestEvent = { x: e.clientX, y: e.clientY };
      if (!frameQueued) {
        frameQueued = true;
        requestAnimationFrame(applyFrame);
      }

      idleTimer = setTimeout(() => {
        faceBodyRef.current?.style.removeProperty("transform");
        tryPointAtNearest(e.clientX, e.clientY);
      }, IDLE_POINT_MS);
    };

    const onVisibility = () => {
      if (document.hidden) containerRef.current?.style.setProperty("opacity", "0");
      else if (started.current) containerRef.current?.style.setProperty("opacity", "1");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (prefersReducedMotion() || !enabled) return null;

  return (
    <div ref={containerRef} className="bbi-cursor-trail" aria-hidden>
      {CIRCLES.map((c) => (
        <div
          key={c.i}
          ref={(el) => {
            circleRefs.current[c.i - 1] = el;
          }}
          className={c.i === 1 ? "bbi-trail-circle bbi-trail-face" : "bbi-trail-circle"}
          style={{
            width: c.size,
            height: c.size,
            marginLeft: -c.size / 2,
            marginTop: -c.size / 2,
            zIndex: c.zIndex,
            transitionDuration: `${c.duration}s`,
            background:
              c.i === 1
                ? undefined
                : `color-mix(in oklab, var(--violet-soft) ${100 - c.colorPct}%, var(--primary) ${c.colorPct}%)`,
          }}
        >
          {c.i === 1 && (
            <div ref={faceBodyRef} className="bbi-trail-face-body">
              <span className="bbi-trail-tail" />
              <span className="bbi-trail-leg bbi-trail-leg-l" />
              <span className="bbi-trail-leg bbi-trail-leg-r" />
              <span className="bbi-trail-eye bbi-trail-eye-l" />
              <span className="bbi-trail-eye bbi-trail-eye-r" />
              <span className="bbi-trail-mouth" />
              <span className="bbi-trail-arm bbi-trail-arm-l" />
              <span ref={armRRef} className="bbi-trail-arm bbi-trail-arm-r" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
