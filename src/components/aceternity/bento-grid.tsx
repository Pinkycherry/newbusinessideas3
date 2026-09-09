import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * BentoGrid — Aceternity UI, ported to this stack.
 *
 * The site's one layout device for sets that are not all the same weight: a
 * grid where a cell may claim two columns because its content earns it, never
 * on a rotation. Cells lift a hair on hover, which is the only motion here.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-3", className)}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  title,
  description,
  header,
  icon,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/bento flex h-full flex-col justify-between gap-4 rounded-md border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50",
        className,
      )}
    >
      {header}
      <div>
        {icon ? <div className="mb-2 text-primary">{icon}</div> : null}
        <div className="font-semibold tracking-tight transition-colors duration-300 group-hover/bento:text-primary">
          {title}
        </div>
        {description ? (
          <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</div>
        ) : null}
      </div>
    </div>
  );
}
