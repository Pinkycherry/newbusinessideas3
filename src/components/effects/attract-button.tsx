import { motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Speck {
  x: number;
  y: number;
}

/**
 * A button that gathers its own scattered marks when you approach it.
 *
 * Adapted from Kokonut UI (MIT). Upstream is violet-on-violet with a magnet
 * icon; here the specks are brand ink on paper and there is no icon, so the
 * effect reads as ink drawing together rather than as a magnet illustration.
 *
 * Pointer and touch both drive it. Under reduced motion the specks stay put:
 * the button still works, it simply does not perform.
 */
export default function AttractButton({
  children,
  speckCount = 12,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { speckCount?: number }) {
  const [specks, setSpecks] = useState<Speck[]>([]);
  const controls = useAnimation();

  useEffect(() => {
    setSpecks(
      Array.from({ length: speckCount }, () => ({
        x: Math.random() * 260 - 130,
        y: Math.random() * 260 - 130,
      })),
    );
  }, [speckCount]);

  const gather = useCallback(() => {
    void controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 50, damping: 10 } });
  }, [controls]);

  const scatter = useCallback(() => {
    void controls.start((i: number) => {
      const speck = specks[i];
      return {
        x: speck?.x ?? 0,
        y: speck?.y ?? 0,
        transition: { type: "spring", stiffness: 100, damping: 15 },
      };
    });
  }, [controls, specks]);

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex min-w-40 touch-none items-center justify-center overflow-hidden",
        "rounded-md border border-border bg-card px-6 py-3",
        "text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/50",
        className,
      )}
      onMouseEnter={gather}
      onMouseLeave={scatter}
      onTouchStart={gather}
      onTouchEnd={scatter}
      {...props}
    >
      {specks.map((speck, i) => (
        <motion.span
          aria-hidden
          key={`${speck.x}-${speck.y}-${i}`}
          custom={i}
          animate={controls}
          initial={{ x: speck.x, y: speck.y }}
          className="absolute h-1 w-1 rounded-full bg-primary/70 motion-reduce:hidden"
        />
      ))}
      <span className="relative">{children}</span>
    </button>
  );
}
