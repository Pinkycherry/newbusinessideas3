import { useEffect, useRef, type ReactNode } from "react";

/**
 * The void's motion grammar. It replaces GSAP on the homepage rather than
 * layering over it — the previous system (Reveal, stagger, depth scenes, orbit
 * rings, ticker marquees, wave text) is gone from this route, not recoloured.
 *
 * One idea, applied twice:
 *
 * - **The hero is the authored moment.** Its lines arrive through a rising
 *   clip-path with an exponential ease-out, each one a beat behind the last.
 *   It happens once, on load, and nothing else on the page competes with it.
 * - **Sections wipe from the side they live on.** The page is a zigzag, so a
 *   left-hand block wipes in from the left and a right-hand block from the
 *   right. The entrance is not identical section to section: the layout picks
 *   the direction, which is what stops it reading as one canned effect
 *   repeated eight times.
 *
 * Everything reveals from an already-visible default: the un-revealed state is
 * a clip inset, not `opacity: 0`, so a failed observer or a dead script leaves
 * readable text rather than an invisible page. That failure mode has bitten
 * this project before — an unconditional `opacity: 0` on every heading once
 * left the whole site blank when hydration failed.
 */

type Dir = "up" | "left" | "right";

export function VoidReveal({
  children,
  dir = "up",
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  dir?: Dir;
  delay?: number;
  as?: "div" | "section" | "li";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset["revealed"] = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const node = e.target as HTMLElement;
          node.style.transitionDelay = `${delay}ms`;
          node.dataset["revealed"] = "true";
          io.unobserve(node);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag
      // @ts-expect-error — one ref across three possible tags
      ref={ref}
      data-void-reveal={dir}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * The hero headline, split into lines that rise behind a clip. Split on
 * explicit line breaks the copy declares rather than on measured wrapping —
 * measuring means reading layout during paint, and the copy already knows
 * where it wants to break.
 */
export function VoidHeadline({ lines, className = "" }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // One frame's grace so the initial clipped state is painted before the
    // transition starts; without it the browser coalesces both and the reveal
    // never runs.
    const id = requestAnimationFrame(() => {
      if (reduced) {
        el.dataset["revealed"] = "true";
        return;
      }
      el.dataset["revealed"] = "true";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <h1 ref={ref} data-void-headline className={className}>
      {lines.map((line, i) => (
        <span className="vh-line" key={line}>
          <span className="vh-inner" style={{ transitionDelay: `${170 * i}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
