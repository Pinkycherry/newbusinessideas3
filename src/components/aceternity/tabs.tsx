import { motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type TabItem = { value: string; label: string; content: ReactNode };

/**
 * Tabs — Aceternity UI, ported to this stack.
 *
 * The active marker is a single shared layout element, so switching tabs slides
 * one plate rather than cross-fading two. Arrow keys move between tabs and the
 * panel is wired with the roving `aria-controls`/`aria-labelledby` pair, which
 * the original demo left out.
 */
export default function Tabs({
  items,
  className,
  listClassName,
}: {
  items: TabItem[];
  className?: string;
  listClassName?: string;
}) {
  const uid = useId();
  const [active, setActive] = useState(items[0]?.value ?? "");
  const current = items.find((item) => item.value === active) ?? items[0];

  const move = (delta: number) => {
    const index = items.findIndex((item) => item.value === active);
    const next = items[(index + delta + items.length) % items.length];
    if (next) setActive(next.value);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cn(
          "flex flex-wrap gap-1 rounded-md border border-border bg-card p-1",
          listClassName,
        )}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {items.map((item) => {
          const selected = item.value === current?.value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${uid}-tab-${item.value}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.value)}
              className={cn(
                "relative rounded-[calc(var(--radius)-2px)] px-4 py-2 text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`${uid}-tab-marker`}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="absolute inset-0 rounded-[calc(var(--radius)-2px)] bg-primary"
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
      {current ? (
        <div
          role="tabpanel"
          id={`${uid}-panel-${current.value}`}
          aria-labelledby={`${uid}-tab-${current.value}`}
          className="mt-5"
        >
          {current.content}
        </div>
      ) : null}
    </div>
  );
}
