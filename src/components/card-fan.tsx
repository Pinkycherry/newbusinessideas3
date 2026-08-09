import { useEffect, useRef, type ReactNode } from "react";
import type { gsap as GsapType } from "gsap";

import { loadGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Shallow overlapping-arc card reveal: cards fan out with a small rotation
 * step between neighbors. On hover/focus the targeted card straightens,
 * scales up and lifts above the rest, while its immediate neighbors ease
 * aside to make room. Built for small, fixed-count card groups (a handful
 * of items) — not for the idea/blog/category browsing grids, which keep
 * their own hover-lift-on-scroll treatment since they're comparison UI.
 *
 * gsap loads lazily on mount (see lib/motion.ts), not as a static import.
 * Reduced motion: renders the same overlapping arc with zero rotation and
 * no hover interaction (gsap is never loaded at all), so it degrades to a
 * flat, static, still-legible row instead of a broken one.
 */
export function CardFan({
  children,
  className = "",
  cardClassName = "",
  rotateStep = 4,
  overlap = "-2.5rem",
}: {
  children: ReactNode[];
  className?: string;
  cardClassName?: string;
  rotateStep?: number;
  overlap?: string;
}) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gsapRef = useRef<typeof GsapType | null>(null);
  const count = children.length;
  const mid = (count - 1) / 2;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    loadGsap().then((gsap: typeof GsapType) => {
      if (cancelled) return;
      gsapRef.current = gsap;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, {
          rotate: (i - mid) * rotateStep,
          zIndex: count - Math.round(Math.abs(i - mid)),
        });
      });
    });
    return () => {
      cancelled = true;
    };
  }, [count, mid, rotateStep]);

  const focusCard = (i: number) => {
    const gsap = gsapRef.current;
    if (!gsap || prefersReducedMotion()) return;
    cardRefs.current.forEach((card, j) => {
      if (!card) return;
      if (j === i) {
        gsap.to(card, {
          rotate: 0,
          scale: 1.08,
          y: -14,
          zIndex: count + 10,
          duration: 0.45,
          ease: "power3.out",
        });
      } else {
        const dir = j < i ? -1 : 1;
        const dist = Math.abs(j - i);
        gsap.to(card, { x: dir * (18 + dist * 5), duration: 0.45, ease: "power3.out" });
      }
    });
  };

  const resetCards = () => {
    const gsap = gsapRef.current;
    if (!gsap || prefersReducedMotion()) return;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.to(card, {
        rotate: (i - mid) * rotateStep,
        scale: 1,
        x: 0,
        y: 0,
        zIndex: count - Math.round(Math.abs(i - mid)),
        duration: 0.5,
        ease: "power3.out",
      });
    });
  };

  return (
    <div className={cn("flex items-center justify-center flex-wrap", className)}>
      {children.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          tabIndex={0}
          onMouseEnter={() => focusCard(i)}
          onFocus={() => focusCard(i)}
          onMouseLeave={resetCards}
          onBlur={resetCards}
          className={cn("bbi-fan-card relative", cardClassName)}
          style={{ marginLeft: i === 0 ? 0 : overlap }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
