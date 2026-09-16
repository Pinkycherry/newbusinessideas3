import { motion, type Transition, type TargetAndTransition } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Snapshot = { filter?: string; opacity?: number; y?: number };

const buildKeyframes = (from: Snapshot, steps: Snapshot[]) => {
  const keys = new Set<keyof Snapshot>([
    ...(Object.keys(from) as (keyof Snapshot)[]),
    ...steps.flatMap((s) => Object.keys(s) as (keyof Snapshot)[]),
  ]);
  const keyframes: Record<string, (string | number | undefined)[]> = {};
  for (const k of keys) keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  return keyframes as TargetAndTransition;
};

/**
 * BlurText — React Bits, ported to this stack.
 *
 * Each word arrives out of a blur, on a stagger, when the line comes into
 * view. This is the site's display-heading treatment on EVERY device: it
 * replaced ParticleText, which resolved into readable letterforms only at
 * desktop size and rendered a phone's H1 as a smear of dots.
 *
 * Three things differ from the upstream component, all of them load-bearing:
 *
 * 1. IT CANNOT FAIL CLOSED. Upstream starts every word at `opacity: 0` via
 *    `initial`, so a missing IntersectionObserver leaves the heading blank
 *    forever — on the H1 of a page whose whole business is being found. Here
 *    the hidden state is only armed once the observer is known to exist, and
 *    server-rendered markup shows the finished line.
 * 2. IT TEARS ITSELF DOWN. `filter: blur()` puts every word on its own
 *    composited layer, and they stay there after the animation ends. Measured
 *    on this homepage, that cost was large enough to be visible in a paint
 *    profile. On completion the spans are replaced by the plain string.
 * 3. IT HAS A CEILING. A fixed per-word delay makes a long line take
 *    `words x delay` to finish; the stagger is capped so the whole line lands
 *    inside `maxWindow` however many words it holds.
 *
 * `prefers-reduced-motion` renders the text with no animation at all.
 */
export default function BlurText({
  text,
  className,
  delay = 110,
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.35,
  maxWindow = 1.1,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  /** Milliseconds between one word and the next, before the cap. */
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
  /** Seconds. The last word starts no later than this. */
  maxWindow?: number;
  /** The element rendered. A heading passes its own tag so the H1 stays an H1. */
  as?: "span" | "p" | "div";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const from = useMemo<Snapshot>(
    () => ({ filter: "blur(10px)", opacity: 0, y: direction === "top" ? -34 : 34 }),
    [direction],
  );
  const to = useMemo<Snapshot[]>(
    () => [
      { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const segments = animateBy === "words" ? text.split(" ") : text.split("");
  const step = Math.min(delay / 1000, maxWindow / Math.max(segments.length - 1, 1));
  const totalDuration = stepDuration * to.length;
  const times = Array.from({ length: to.length + 1 }, (_, i) => i / to.length);
  const keyframes = buildKeyframes(from, to);

  // Plain text: before the observer is known to exist, under reduced motion,
  // and again once the reveal has played.
  if (!armed || done) {
    return (
      <Tag ref={ref as never} className={cn("blur-text", className)}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref as never} className={cn("blur-text", className)}>
      {segments.map((segment, index) => {
        const transition: Transition = {
          duration: totalDuration,
          times,
          delay: index * step,
          ease: [0.16, 1, 0.3, 1],
        };
        return (
          <motion.span
            key={`${segment}-${index}`}
            className="inline-block whitespace-pre will-change-[transform,filter,opacity]"
            initial={from}
            animate={inView ? keyframes : from}
            transition={transition}
            // Only the LAST word, and only once it is actually revealing. While
            // `inView` is false the target equals the initial snapshot, so
            // framer treats it as a completed animation and fires this on the
            // first frame — which collapsed the heading straight back to plain
            // text before a single word had moved.
            {...(inView && index === segments.length - 1
              ? { onAnimationComplete: () => setDone(true) }
              : {})}
          >
            {segment === " " ? " " : segment}
            {animateBy === "words" && index < segments.length - 1 ? " " : ""}
          </motion.span>
        );
      })}
    </Tag>
  );
}
