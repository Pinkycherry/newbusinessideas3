import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { usePillInteraction } from "@/hooks/use-pill-interaction";

/**
 * Single reusable pill for every category (or category-shaped) tag in the
 * app — header dropdown, Golden Tree nodes, footer "Popular categories".
 * Visual styling for `.glass-pill`-class links lives centrally in
 * styles.css; this component just centralizes the markup (dot, truncation,
 * sizing) so every call site stays in sync.
 */
type CategoryBadgeBase = {
  label: string;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
  onClick?: () => void;
};

type CategoryBadgeProps =
  | (CategoryBadgeBase & { slug: string; to?: never; search?: never })
  | (CategoryBadgeBase & { to: string; slug?: never; search?: Record<string, string> });

export function CategoryBadge(props: CategoryBadgeProps) {
  const { label, size = "md", dot = false, className = "", onClick } = props;
  const pill = usePillInteraction<HTMLAnchorElement>();

  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-[11px] font-semibold" : "px-3 py-1.5 text-[11px] font-bold";

  const content: ReactNode = (
    <>
      {dot && (
        <span aria-hidden className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-white/80" />
      )}
      <span className="truncate">{label}</span>
    </>
  );

  const linkClassName = `glass-pill inline-flex max-w-full items-center gap-1.5 truncate rounded-full normal-case tracking-normal shadow-lg transition-colors ${sizeClasses} ${className}`;
  const motionProps = {
    ref: pill.ref,
    onMouseEnter: pill.onMouseEnter,
    onMouseLeave: pill.onMouseLeave,
    onPointerDown: pill.onPointerDown,
    onPointerUp: pill.onPointerUp,
  };

  if ("slug" in props) {
    return (
      <Link
        to="/category/$categorySlug"
        params={{ categorySlug: props.slug }}
        onClick={onClick}
        className={linkClassName}
        {...motionProps}
      >
        {content}
      </Link>
    );
  }

  if (props.search) {
    return (
      <Link
        to={props.to}
        search={props.search}
        onClick={onClick}
        className={linkClassName}
        {...motionProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link to={props.to} onClick={onClick} className={linkClassName} {...motionProps}>
      {content}
    </Link>
  );
}
