import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * TextGenerateEffect — Aceternity UI, ported to this stack.
 *
 * Words arrive on a stagger as the paragraph comes into view.
 *
 * TWO REWRITES, both forced by measurement rather than taste:
 *
 * 1. The first version animated `opacity` through an imperative `animate()`
 *    call and could strand a paragraph half-visible. It was deleted.
 * 2. The second gave every word its own `motion.span` with `filter: blur()`.
 *    On a 104-word paragraph that is 104 composited layers, live the whole
 *    time the paragraph sits off-screen, and it showed up in a paint profile
 *    of the homepage. It also took 4.7 seconds to finish.
 *
 * This one is plain spans and one CSS keyframe. No per-frame JavaScript, no
 * blur, no animation library, and the whole paragraph lands inside `WINDOW`
 * however many words it holds — so it can be used on every paragraph of a
 * page without the page paying for it.
 *
 * It cannot fail closed. The hidden state is applied by `data-tg="armed"`,
 * which only JavaScript sets, so server-rendered HTML and a browser with
 * scripting off both show the finished paragraph. `prefers-reduced-motion`
 * never arms at all.
 */
export default function TextGenerateEffect({
  words,
  className,
  stagger = 0.045,
}: {
  words: string;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  // Once the reveal has played, the per-word spans are torn back down to a
  // plain paragraph. Sixteen of these on the homepage is ~600 inline-block
  // boxes; leaving them in place cost measurable layout on every subsequent
  // scroll for an animation that had already finished.
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const tokens = words.split(" ");
  const WINDOW = 0.9;
  const step = Math.min(stagger, WINDOW / Math.max(tokens.length - 1, 1));
  const runtimeMs = (step * Math.max(tokens.length - 1, 0) + 0.42) * 1000 + 120;

  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setDone(true), runtimeMs);
    return () => clearTimeout(t);
  }, [shown, runtimeMs]);

  if (!armed || done) {
    return (
      <p ref={ref} className={cn("tg", className)}>
        {words}
      </p>
    );
  }

  return (
    <p
      ref={ref}
      className={cn("tg", className)}
      {...(armed ? { "data-tg": shown ? "in" : "armed" } : {})}
    >
      {tokens.map((token, index) => (
        <span
          key={`${token}-${index}`}
          className="tg-w"
          style={{ animationDelay: `${(index * step).toFixed(3)}s` }}
        >
          {token}
          {index < tokens.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
