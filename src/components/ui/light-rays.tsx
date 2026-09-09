import { cn } from "@/lib/utils";

/**
 * Light Rays — a soft directional glow behind a section.
 *
 * Written to the Magic UI component of the same name; the registry is blocked
 * from this sandbox. Upstream renders a WebGL shader; this is a layered
 * conic/radial gradient instead, for two reasons that matter here: the page
 * already runs a canvas particle field and a second GL context on a marketing
 * page is a real cost, and gradients degrade to nothing on a machine that
 * cannot composite them, whereas a failed shader leaves a black rectangle.
 *
 * Deliberately confined to the hero. Rays behind every section would compete
 * with the twin rings, which are kept as they are.
 */
export function LightRays({ className }: { className?: string }) {
  return <div aria-hidden className={cn("bbi-rays", className)} />;
}
