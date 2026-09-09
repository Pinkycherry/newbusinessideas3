import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Hyper Text — letters scramble, then resolve.
 *
 * Written to the Magic UI component of the same name; the registry is blocked
 * from this sandbox. `text`, `duration`, `className` and `animateOnHover`
 * match upstream.
 *
 * The real string is always in the accessibility tree via `aria-label`, and
 * the scrambling spans are hidden from it — otherwise a screen reader reads
 * gibberish for the duration. It runs once, on entering view, and never loops:
 * text that keeps scrambling under a reader is unreadable, not kinetic.
 */
export function HyperText({
  text,
  className,
  duration = 900,
  animateOnHover = true,
}: {
  text: string;
  className?: string;
  duration?: number;
  animateOnHover?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(text);
  const running = useRef(false);

  const scramble = () => {
    if (running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    const chars = text.split("");
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * chars.length);
      setShown(
        chars
          .map((c, i) =>
            i < settled || c === " " || c === "—"
              ? c
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (t < 1) requestAnimationFrame(step);
      else {
        setShown(text);
        running.current = false;
      }
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          scramble();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      ref={ref}
      className={cn("bbi-hyper", className)}
      aria-label={text}
      onMouseEnter={animateOnHover ? scramble : undefined}
    >
      <span aria-hidden>{shown}</span>
    </span>
  );
}
