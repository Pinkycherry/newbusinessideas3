import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Number Ticker — a value that counts to its target when it scrolls into view.
 *
 * Written to the Magic UI component of the same name. `magicui.design` is
 * blocked by this sandbox's egress proxy, so the official registry file could
 * not be fetched; the prop names match upstream so
 * `npx shadcn add https://magicui.design/r/number-ticker.json` will replace it
 * cleanly on a networked machine.
 *
 * Two departures worth stating, both deliberate:
 *
 * - It renders the FINAL value on the server and in markup, then counts from a
 *   start value once mounted. A ticker that server-renders `0` ships a page
 *   whose headline number is wrong to every crawler and to anyone whose JS
 *   fails. The figure here is real product truth (290 blueprints), so it is
 *   never allowed to be wrong in the DOM.
 * - It uses `tabular-nums`, so the row does not reflow on every frame as digit
 *   widths change.
 */
export function NumberTicker({
  value,
  startValue = 0,
  delay = 0,
  duration = 1600,
  className,
}: {
  value: number;
  startValue?: number;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Same exponential ease-out the rest of the void uses.
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(startValue + (value - startValue) * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          setDisplay(startValue);
          timer = setTimeout(run, delay);
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [value, startValue, delay, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display.toLocaleString()}
    </span>
  );
}
