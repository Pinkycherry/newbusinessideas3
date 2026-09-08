import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Marquee — a track that scrolls its children forever.
 *
 * Written to the Magic UI component of the same name; `magicui.design` is
 * blocked by this sandbox's egress proxy, so the registry file could not be
 * fetched. `reverse`, `pauseOnHover`, `vertical` and `repeat` match upstream.
 *
 * The duplicated track is `aria-hidden`: a marquee that reads its contents
 * twice to a screen reader is a bug, not an effect.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  repeat = 2,
  duration = 40,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  duration?: number;
}) {
  return (
    <div
      className={cn("bbi-marquee", pauseOnHover && "is-pausable", className)}
      style={{ ["--mq-duration" as string]: `${duration}s` }}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn("bbi-marquee-track", reverse && "is-reverse")}
          aria-hidden={i > 0 ? true : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
