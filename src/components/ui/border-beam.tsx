import { cn } from "@/lib/utils";

/**
 * Border Beam — a light travelling around an element's edge.
 *
 * Written to the Magic UI component of the same name. `magicui.design` is
 * blocked by this sandbox's egress proxy (403 at CONNECT), so the official
 * registry file could not be fetched; this is a same-shape implementation with
 * the same prop names, so running
 * `npx shadcn add https://magicui.design/r/border-beam.json` on a machine with
 * network access will drop the upstream version in over it cleanly.
 *
 * Pure CSS offset-path rather than framer-motion: the beam runs continuously,
 * and a continuously running spring is a main-thread cost for something that
 * is decoration. `offset-path` animates on the compositor.
 */
export function BorderBeam({
  className,
  size = 62,
  duration = 7,
  delay = 0,
  colorFrom = "#8052ff",
  colorTo = "#ffb829",
  borderWidth = 1,
}: {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("bbi-beam", className)}
      style={
        {
          "--beam-size": `${size}px`,
          "--beam-duration": `${duration}s`,
          "--beam-delay": `${delay}s`,
          "--beam-from": colorFrom,
          "--beam-to": colorTo,
          "--beam-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
    />
  );
}
