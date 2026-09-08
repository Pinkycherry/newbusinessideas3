import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Kinetic Text — words arrive individually, with weight.
 *
 * Written to the Magic UI component of the same name; `magicui.design` is
 * blocked by this sandbox's egress proxy (403 at CONNECT), so the registry
 * file could not be fetched. `text`, `className` and `delay` match upstream,
 * so `pnpm dlx shadcn@latest add @magicui/kinetic-text` on a networked machine
 * replaces this cleanly.
 *
 * Placed on the STATEMENT section, not the hero. The hero already carries the
 * page's one authored moment — its three lines rising out of their clips — and
 * stacking a second per-word animation on the same element is exactly the
 * scattered-effects failure to avoid. The statement is a single sentence alone
 * on the screen with no other motion, so the kinetics have something to do
 * there.
 *
 * Splits on words rather than characters: per-character animation on a
 * 56px sentence reads as a novelty, and it breaks text selection and screen
 * reader flow far worse. The whole sentence is exposed as one accessible
 * string via `aria-label`, with the animated spans hidden from the tree.
 */
export function KineticText({
  text,
  className,
  delay = 55,
  highlight,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** A word to render in the accent colour, matched exactly. */
  highlight?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setOn(true);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <span
      ref={ref}
      className={cn("bbi-kinetic", className)}
      data-on={on ? "true" : "false"}
      aria-label={text}
    >
      {words.map((w, i) => {
        const isHl = highlight !== undefined && w.replace(/[^\w$.]/g, "") === highlight;
        return (
          <span className="bbi-kinetic-w" key={`${w}-${i}`} aria-hidden>
            <span
              className={cn("bbi-kinetic-i", isHl && "v-hl")}
              style={{ transitionDelay: `${i * delay}ms` }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Convenience wrapper so a statement can mix kinetic text with plain nodes. */
export function KineticLine({ children }: { children: ReactNode }) {
  return <span className="bbi-kinetic-line">{children}</span>;
}
