import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Animated Shiny Text — a highlight that sweeps across the text.
 *
 * Written to the Magic UI component of the same name; `magicui.design` is
 * blocked by this sandbox's egress proxy (403 at CONNECT) so the registry file
 * could not be fetched. Prop names match upstream, so
 * `pnpm dlx shadcn@latest add @magicui/animated-shiny-text` on a networked
 * machine drops the official version in over it.
 *
 * Upstream animates a `background-clip: text` gradient, which means the text
 * itself is painted by the gradient. On this page that would make the copy
 * mid-grey at the sweep's trailing edge and fail contrast, and the craft floor
 * bans gradient text outright. So the base colour stays a solid token and only
 * a narrow highlight rides over it — the effect reads the same and the text
 * never drops below its measured contrast.
 */
export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 110,
  duration = 5,
}: {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
  duration?: number;
}) {
  return (
    <span
      className={cn("bbi-shiny", className)}
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
          "--shiny-duration": `${duration}s`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
