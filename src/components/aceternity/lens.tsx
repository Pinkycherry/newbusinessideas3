import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Lens — Aceternity UI, ported to this stack and pointed at prose.
 *
 * A magnifier follows the pointer across the block, enlarging whatever sits
 * under it. Upstream this wraps a product photograph; here it wraps body copy,
 * so the mechanics change in one important way: the magnified layer is a
 * DUPLICATE of the text, and a duplicate in the accessibility tree would make
 * a screen reader announce every paragraph on the page twice. The copy is
 * therefore `aria-hidden` and inert, and the readable text is the original
 * underneath, untouched.
 *
 * The lens never appears on touch or under `prefers-reduced-motion`, where a
 * pointer-following magnifier is either impossible or unwelcome — in those
 * cases this renders its children and nothing else.
 */
export default function Lens({
  children,
  className,
  zoom = 1.5,
  radius = 110,
}: {
  children: ReactNode;
  className?: string;
  zoom?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

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

  if (!enabled) return <div className={cn(className)}>{children}</div>;

  // A tight feather. At 78% the falloff was wide enough that the original text
  // bled through the magnified copy all around the rim.
  const mask = `radial-gradient(circle ${radius}px at ${pos.x}px ${pos.y}px, black 94%, transparent 100%)`;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
      className={cn("relative", className)}
    >
      {children}
      {hovering ? (
        <motion.div
          aria-hidden
          inert
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute inset-0 z-20 select-none overflow-hidden"
          // Opaque, or the original text shows through the magnified copy and
          // the two render as unreadable soup. The fallback keeps this correct
          // on the light templates, where --ins-void is not defined.
          style={{
            maskImage: mask,
            WebkitMaskImage: mask,
            backgroundColor: "var(--ins-void, var(--background))",
          }}
        >
          <div
            className={cn("h-full w-full", className)}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: `${pos.x}px ${pos.y}px`,
            }}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
      {hovering ? (
        <span
          aria-hidden
          className="pointer-events-none absolute z-30 rounded-full ring-1 ring-[var(--ins-signal)]/40"
          style={{
            left: pos.x - radius,
            top: pos.y - radius,
            width: radius * 2,
            height: radius * 2,
          }}
        />
      ) : null}
    </div>
  );
}
