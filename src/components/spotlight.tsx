import { useEffect, useRef, type ReactNode } from "react";
import type { gsap as GsapType } from "gsap";

import { loadGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Cursor-follow spotlight: a soft radial glow that tracks the pointer inside
 * its container, lagging gently via gsap.quickTo instead of snapping to the
 * cursor. Position is written to CSS custom properties (--spot-x/--spot-y)
 * consumed by the ::before-style glow layer below — no per-frame React
 * re-render, just two GPU-cheap custom-property tweens. gsap loads lazily
 * (see lib/motion.ts) so it isn't part of the initial page bundle.
 *
 * Wrap a CTA (or any container) with this to put the glow behind it:
 *   <Spotlight><Button>Get lifetime access</Button></Spotlight>
 */
export function Spotlight({
  children,
  className = "",
  size = 220,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const quick = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;

    loadGsap().then((gsap: typeof GsapType) => {
      if (cancelled || !ref.current) return;
      quick.current = {
        x: gsap.quickTo(ref.current, "--spot-x", { duration: 0.55, ease: "power3" }),
        y: gsap.quickTo(ref.current, "--spot-y", { duration: 0.55, ease: "power3" }),
      };
    });

    return () => {
      cancelled = true;
      quick.current = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (quick.current) {
          quick.current.x(x);
          quick.current.y(y);
        } else {
          el.style.setProperty("--spot-x", `${x}px`);
          el.style.setProperty("--spot-y", `${y}px`);
        }
      }}
      onMouseEnter={() => ref.current?.style.setProperty("--spot-o", "1")}
      onMouseLeave={() => ref.current?.style.setProperty("--spot-o", "0")}
      className={cn("bbi-spotlight relative isolate", className)}
      style={{ "--spot-size": `${size}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
