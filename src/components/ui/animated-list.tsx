import { Children, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Animated List — children arrive one after another.
 *
 * Written to the Magic UI component of the same name; `magicui.design` is
 * blocked by this sandbox's egress proxy, so the registry file could not be
 * fetched. `delay` and `className` match upstream.
 *
 * One deliberate difference: upstream starts on mount and animates forever in
 * a notification-feed loop. This list is real content — five live blueprints —
 * so it starts when it scrolls into view, runs once, and stops. Content that
 * keeps re-animating under a reader is a distraction, not a device.
 *
 * Each item resolves from a clip inset rather than `opacity: 0`, matching the
 * rest of the void: if the observer never fires, the list is still readable.
 */
export function AnimatedList({
  children,
  className,
  delay = 90,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLUListElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setStarted(true);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = Children.toArray(children);

  return (
    <ul ref={ref} className={cn("bbi-alist", className)} data-started={started ? "true" : "false"}>
      {items.map((child, i) => (
        <li key={i} className="bbi-alist-item" style={{ transitionDelay: `${i * delay}ms` }}>
          {child}
        </li>
      ))}
    </ul>
  );
}
