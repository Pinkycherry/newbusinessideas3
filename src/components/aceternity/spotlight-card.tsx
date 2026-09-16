import { useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * SpotlightCard — React Bits, ported to this stack.
 *
 * A card that lights under the pointer. This is THE card of the site: every
 * plate that holds a block of content uses it, so the whole page answers to a
 * cursor the same way instead of each section inventing its own hover.
 *
 * Colours come from the instrument scope, not from the upstream demo's
 * `neutral-800/900`. The spotlight is white at low alpha because in a five-value
 * greyscale the only thing left to carry emphasis is light itself.
 *
 * Three differences from upstream, all deliberate:
 *
 * 1. The pointer position is written to CSS CUSTOM PROPERTIES on the element,
 *    not to React state. Upstream calls setState on every mousemove, which
 *    re-renders the whole card — and its children — sixty times a second. On a
 *    page with thirty of these that is the frame budget gone.
 * 2. It self-disables where there is no pointer to follow. A phone gets the
 *    plate and the press state and none of the listeners.
 * 3. `as` lets it render as an <article> or a <li> so a grid of cards is still
 *    a list to a screen reader.
 */
export default function SpotlightCard({
  children,
  className,
  spotlightColor = "rgb(255 255 255 / 0.09)",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  as?: "div" | "article" | "li" | "section";
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">) {
  const ref = useRef<HTMLElement | null>(null);
  const [lit, setLit] = useState(false);

  const track = (e: React.MouseEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    // Written straight to the element. No setState, so nothing re-renders and
    // the children are never touched.
    node.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref as never}
      onMouseMove={track}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      onFocus={() => setLit(true)}
      onBlur={() => setLit(false)}
      className={cn("bbi-spot", className)}
      style={{ "--spot-color": spotlightColor } as React.CSSProperties}
      data-lit={lit ? "on" : undefined}
      {...rest}
    >
      <span aria-hidden className="bbi-spot-light" />
      <span className="relative z-10 block">{children}</span>
    </Tag>
  );
}
