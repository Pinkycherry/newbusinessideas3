import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Highlighter — a marker stroke that draws itself under or behind text.
 *
 * Written to the Magic UI component of the same name; the registry is blocked
 * from this sandbox. `action` and `color` match upstream.
 *
 * The stroke is drawn with a `background-size` sweep rather than a
 * pseudo-element width animation, so it composites and never reflows the line
 * it sits on. Text colour is untouched: a highlight that recolours its own
 * text is how these end up failing contrast.
 */
export function Highlighter({
  children,
  className,
  action = "highlight",
  color = "#8052ff",
  duration = 900,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  action?: "highlight" | "underline";
  color?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <span
      className={cn("bbi-hl", action === "underline" && "is-underline", className)}
      style={{
        ["--hl-color" as string]: color,
        ["--hl-duration" as string]: `${duration}ms`,
        ["--hl-delay" as string]: `${delay}ms`,
      }}
    >
      {children}
    </span>
  );
}
