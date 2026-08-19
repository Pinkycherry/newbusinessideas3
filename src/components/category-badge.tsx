import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { usePillInteraction } from "@/hooks/use-pill-interaction";

/**
 * Single reusable pill for every category (or category-shaped) tag in the
 * app — header dropdown, Golden Tree nodes, footer "Popular categories".
 * Visual styling for `.glass-pill`-class links lives centrally in
 * styles.css; this component just centralizes the markup (dot, wrapping,
 * sizing) so every call site stays in sync.
 *
 * Long labels WRAP onto a second line rather than truncating with an
 * ellipsis. `.glass-pill` centers its flex content (`justify-content:
 * center`), and a `text-overflow: ellipsis` span inside a centered flex
 * parent is unreliable (see the `.iv-tag-cloud .iv-tag` fix in styles.css
 * for the original, more severe version of this bug — silent clipping with
 * no "…" shown at all). Here the ellipsis rendered correctly, but it still
 * meant 2 of the 10 "Browse by type" pills ("Zero Investment Business
 * Ideas", "Work From Home Business Ideas") had real label text hidden
 * behind it. Wrapping keeps every full label visible, on every call site,
 * without depending on each caller opting in via a shared wrapper class.
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
    size === "sm"
      ? "px-2.5 py-1 text-[11px] font-semibold cb-sm"
      : "px-3 py-2 text-[11px] font-bold cb-md";

  const content: ReactNode = (
    <>
      {dot && (
        <span aria-hidden className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-white/80" />
      )}
      <span className="category-badge-label whitespace-normal break-words leading-snug">
        {label}
      </span>
    </>
  );

  const linkClassName = `glass-pill category-badge inline-flex max-w-full items-center gap-1.5 rounded-full text-center normal-case tracking-normal shadow-lg transition-colors ${sizeClasses} ${className}`;
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
