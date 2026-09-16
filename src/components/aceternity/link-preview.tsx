import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * LinkPreview — Aceternity UI, ported to this stack.
 *
 * Hovering an inline link floats a screenshot of its destination above it,
 * tilting slightly toward the pointer. The thumbnail comes from microlink,
 * which renders the page server-side; the build environment's proxy blocks
 * that host, so the frame is empty in a local preview and fills in for real
 * visitors. If it ever fails the card hides itself rather than showing a
 * broken frame — see `failed` below.
 *
 * The preview is decoration on top of a working link: it is aria-hidden, it
 * never opens on focus, and it is suppressed entirely for anyone who asks for
 * reduced motion or is on a coarse pointer, where a hover card is a trap.
 */
export default function LinkPreview({
  url,
  children,
  className,
  width = 200,
  height = 125,
}: {
  url: string;
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const hostRef = useRef<HTMLSpanElement | null>(null);

  const x = useMotionValue(0);
  const spring = useSpring(x, { stiffness: 100, damping: 15 });
  const translateX = useTransform(spring, [-0.5, 0.5], [-60, 60]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !still.matches);
    sync();
    fine.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  const src = `https://api.microlink.io/?url=${encodeURIComponent(
    url,
  )}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=true&viewport.deviceScaleFactor=1&viewport.width=${
    width * 3
  }&viewport.height=${height * 3}`;

  return (
    <span
      ref={hostRef}
      className="relative inline-block"
      onMouseEnter={() => enabled && !failed && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (rect.width === 0) return;
        x.set((event.clientX - rect.left) / rect.width - 0.5);
      }}
    >
      <AnimatePresence>
        {open ? (
          <motion.span
            key={id}
            aria-hidden
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ x: translateX }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 block -translate-x-1/2 overflow-hidden rounded-md border border-border bg-card p-1 shadow-lg"
          >
            <img
              src={src}
              width={width}
              height={height}
              alt=""
              onError={() => {
                setFailed(true);
                setOpen(false);
              }}
              className="block rounded-[3px] object-cover"
              style={{ width, height }}
            />
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span className={cn(className)}>{children}</span>
    </span>
  );
}
