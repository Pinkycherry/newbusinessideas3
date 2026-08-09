import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide cursor trail — one lead "face" element followed by 19 plain
 * trailing circles, all siblings. The whole lag/chain effect comes from a
 * per-circle CSS transition-duration stagger (see .bbi-trail-circle in
 * styles.css): every circle is given the exact same target position on
 * mousemove, but slower circles take longer to visually catch up to it,
 * which is what produces the trailing chain — no lerp math, no animation
 * loop, position writes go straight to the DOM via refs so a
 * high-frequency mousemove never triggers a React re-render.
 *
 * Desktop-with-real-cursor only, absent under reduced motion, lazy-loaded.
 */
const COUNT = 20;

const CIRCLES = Array.from({ length: COUNT }, (_, idx) => {
  const i = idx + 1;
  const size = 100 - i * 4;
  const colorPct = Math.round(((i - 1) / (COUNT - 1)) * 100);
  return {
    i,
    size,
    zIndex: COUNT - i,
    duration: i / COUNT,
    pulseDelay: i / COUNT / 4,
    colorPct,
  };
});

export function CursorTrail() {
  const [enabled, setEnabled] = useState(false);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

    const onMove = (e: MouseEvent) => {
      if (!started.current) {
        started.current = true;
        containerRef.current?.style.setProperty("opacity", "1");
      }
      const x = `${e.clientX}px`;
      const y = `${e.clientY}px`;
      circleRefs.current.forEach((el) => {
        if (!el) return;
        el.style.left = x;
        el.style.top = y;
      });
    };

    const onVisibility = () => {
      if (document.hidden) containerRef.current?.style.setProperty("opacity", "0");
      else if (started.current) containerRef.current?.style.setProperty("opacity", "1");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
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
            animationDelay: `${c.pulseDelay}s`,
            background: `color-mix(in oklab, var(--violet-soft) ${100 - c.colorPct}%, var(--primary) ${c.colorPct}%)`,
          }}
        >
          {c.i === 1 && (
            <>
              <span className="bbi-trail-eye bbi-trail-eye-l" />
              <span className="bbi-trail-eye bbi-trail-eye-r" />
              <span className="bbi-trail-mouth" />
              <span className="bbi-trail-arm bbi-trail-arm-l" />
              <span className="bbi-trail-arm bbi-trail-arm-r" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
