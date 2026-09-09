import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A line of type with light travelling across it.
 *
 * Adapted from Kokonut UI (MIT) to this stack: framer-motion rather than
 * motion/react, and BBI ink rather than neutral greys. Used for a single
 * standing line, never for a paragraph — a moving gradient on body copy is
 * unreadable.
 */
export default function ShimmerText({
  text,
  className,
  durationSeconds = 3.2,
}: {
  text: string;
  className?: string;
  durationSeconds?: number;
}) {
  return (
    <motion.span
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      transition={{ duration: durationSeconds, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      className={cn(
        "inline-block bg-[length:200%_100%] bg-clip-text text-transparent",
        "bg-[linear-gradient(90deg,var(--foreground)_0%,var(--primary)_45%,var(--ember)_55%,var(--foreground)_100%)]",
        "motion-reduce:animate-none motion-reduce:bg-none motion-reduce:text-foreground",
        className,
      )}
    >
      {text}
    </motion.span>
  );
}
