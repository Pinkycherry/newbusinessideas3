import { useEffect, useRef, type ReactNode } from "react";
import type { gsap as GsapType } from "gsap";

import { loadGsap, prefersReducedMotion } from "@/lib/motion";

const VARIANT_FROM: Record<string, Partial<CSSStyleDeclaration>> = {
  "": { transform: "translateY(46px) scale(0.97)", filter: "blur(4px)" },
  "rv-lift": { transform: "translateY(46px) scale(0.97)", filter: "blur(4px)" },
  "rv-slide": { transform: "translateX(-56px)", filter: "blur(4px)" },
  "rv-zoom": { transform: "scale(0.86)", filter: "blur(5px)" },
  "rv-wipe": { clipPath: "inset(0 100% 0 0)" },
};

/**
 * Scroll-triggered reveal — fade + rise/slide/zoom + de-blur once, on
 * enter. Replaces the old IntersectionObserver + CSS-class implementation;
 * GSAP/ScrollTrigger is now the single engine for scroll-driven motion
 * site-wide (Golden Tree and the twin rings are exempt, unchanged).
 *
 * The hidden starting state is applied with plain inline styles (no gsap
 * needed for that part), so the reveal still looks right even while the
 * gsap/ScrollTrigger chunk is still downloading — the animated tween itself
 * is wired up once gsap resolves, and ScrollTrigger correctly fires
 * immediately on creation if the element is already past its trigger point.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "" | "rv-lift" | "rv-slide" | "rv-zoom" | "rv-wipe";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const from = VARIANT_FROM[variant] ?? VARIANT_FROM[""];
    Object.assign(el.style, { opacity: "0", ...from });

    let cancelled = false;
    let tween: gsap.core.Tween | null = null;

    loadGsap(true).then((gsap: typeof GsapType) => {
      if (cancelled || !ref.current) return;
      tween = gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        ...(variant === "rv-wipe" ? { clipPath: "inset(0 0% 0 0)" } : {}),
        duration: 0.9,
        delay: delay / 1000,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [variant, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
