import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A link whose label slides up and is replaced on hover.
 *
 * Adapted from Kokonut UI (MIT): TanStack Router's Link in place of next/link,
 * and the motion is pure CSS so it costs nothing at runtime. The swapped-in
 * label defaults to the original, so it reads as a crisp vertical shift rather
 * than a word change unless you ask for one.
 */
export default function SlideTextLink({
  to,
  children,
  hoverLabel,
  className,
}: {
  to: string;
  children: ReactNode;
  hoverLabel?: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md px-6",
        "border border-border bg-card text-sm font-semibold text-foreground",
        "transition-colors duration-200 hover:border-primary/50",
        className,
      )}
    >
      <span className="relative inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <span className="block opacity-100 transition-opacity duration-200 group-hover:opacity-0">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute left-0 top-full block text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          {hoverLabel ?? children}
        </span>
      </span>
    </Link>
  );
}
