import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { CategoryNode } from "@/lib/ideas.functions";

/**
 * The homepage's own header and footer.
 *
 * Why this exists rather than another pass of overrides on `site-shell.tsx`:
 * that component is built against the light palette and paints itself
 * `#0c0c25 !important` from inside `@layer base` in half a dozen places. Every
 * attempt to make it work in the void was a specificity fight, and the result
 * was the old header wearing dark paint — which is not what was asked for. The
 * ask was a new header and a new footer.
 *
 * So the void gets its own, used only on `/`. The other 25 routes keep
 * `SiteShell` untouched, which is also the lowest-blast-radius way to do this:
 * nothing here can regress a page it does not render on.
 *
 * The structure follows the reference rather than the old shell: a transparent
 * bar sitting directly on the canvas with no pill container and no backdrop
 * blur, ghost text links, and exactly one filled violet action.
 */

const EXPLORE_ITEMS = [
  { to: "/browse", label: "Browse all ideas" },
  { to: "/search", label: "Search" },
  { to: "/blog", label: "Blog" },
  { to: "/services", label: "Services" },
] as const;

const COMPANY_ITEMS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { to: "/browse", label: "Browse ideas" },
      { to: "/search", label: "Search" },
      { to: "/pricing", label: "Pricing" },
      { to: "/services", label: "Services" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of service" },
      { to: "/privacy", label: "Privacy policy" },
      { to: "/disclaimer", label: "Disclaimer" },
      { to: "/gdpr", label: "GDPR" },
      { to: "/refund-policy", label: "Refund policy" },
    ],
  },
] as const;

function Mark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="vs-mark">
      <path
        d="M12 2.5 L21.5 20.5 L2.5 20.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/** One dropdown. Opens on hover on a pointer device, on click everywhere. */
function Menu({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="vs-menu"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="vs-navlink"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <span className="vs-caret" aria-hidden />
      </button>
      <div className={`vs-panel${wide ? " is-wide" : ""}`} data-open={open ? "true" : "false"}>
        {children}
      </div>
    </div>
  );
}

export function VoidHeader({ categories }: { categories: CategoryNode[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const top = categories.slice(0, 12);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="vs-header">
      <div className="vs-bar">
        <Link to="/" className="vs-logo" aria-label="BBI home">
          <Mark />
          <span>BBI</span>
        </Link>

        <nav className="vs-nav" aria-label="Primary">
          <Menu label="Categories" wide>
            <p className="vs-panel-label">Browse by category</p>
            <div className="vs-panel-grid">
              {top.map((c) => (
                <Link
                  key={c.categorySlug}
                  to="/category/$categorySlug"
                  params={{ categorySlug: c.categorySlug }}
                  className="vs-panel-row"
                >
                  <span>{c.categoryName}</span>
                  <span className="vs-count">{c.ideaCount}</span>
                </Link>
              ))}
            </div>
            <div className="vs-panel-foot">
              <Link to="/browse">All {categories.length} categories</Link>
              <Link to="/search">Search every field</Link>
            </div>
          </Menu>

          <Menu label="Explore">
            {EXPLORE_ITEMS.map((i) => (
              <Link key={i.to} to={i.to} className="vs-panel-row">
                <span>{i.label}</span>
              </Link>
            ))}
          </Menu>

          <Menu label="Company">
            {COMPANY_ITEMS.map((i) => (
              <Link key={i.to} to={i.to} className="vs-panel-row">
                <span>{i.label}</span>
              </Link>
            ))}
          </Menu>

          <Link to="/pricing" className="vs-navlink">
            Pricing
          </Link>
        </nav>

        <div className="vs-actions">
          <Link to="/search" className="vs-search" aria-label="Search ideas">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span>Search ideas</span>
          </Link>
          <Link to="/sign-in" className="vs-signin">
            Sign in
          </Link>
          <Link to="/browse" data-cta="primary" className="vs-cta">
            Browse free
          </Link>
          <button
            type="button"
            className="vs-burger"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="vs-drawer" data-open={mobileOpen ? "true" : "false"}>
        <div className="vs-drawer-top">
          <span className="vs-panel-label">Menu</span>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            Close
          </button>
        </div>
        <p className="vs-panel-label">Categories</p>
        {top.slice(0, 8).map((c) => (
          <Link
            key={c.categorySlug}
            to="/category/$categorySlug"
            params={{ categorySlug: c.categorySlug }}
            className="vs-panel-row"
            onClick={() => setMobileOpen(false)}
          >
            <span>{c.categoryName}</span>
            <span className="vs-count">{c.ideaCount}</span>
          </Link>
        ))}
        <p className="vs-panel-label">Explore</p>
        {[...EXPLORE_ITEMS, ...COMPANY_ITEMS, { to: "/pricing", label: "Pricing" } as const].map(
          (i) => (
            <Link
              key={i.to}
              to={i.to}
              className="vs-panel-row"
              onClick={() => setMobileOpen(false)}
            >
              <span>{i.label}</span>
            </Link>
          ),
        )}
        <Link
          to="/browse"
          data-cta="primary"
          className="vs-cta vs-drawer-cta"
          onClick={() => setMobileOpen(false)}
        >
          Browse free
        </Link>
      </div>
    </header>
  );
}

export function VoidFooter({
  categories,
  totalIdeas,
}: {
  categories: CategoryNode[];
  totalIdeas: number;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="vs-footer">
      <div className="vs-footer-grid">
        <div>
          <h3 className="vs-footer-h">Browse</h3>
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c.categorySlug}
              to="/category/$categorySlug"
              params={{ categorySlug: c.categorySlug }}
              className="vs-footer-link"
            >
              {c.categoryName}
            </Link>
          ))}
          <Link to="/browse" className="vs-footer-link vs-footer-more">
            All {categories.length} categories
          </Link>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="vs-footer-h">{col.title}</h3>
            {col.links.map((l) => (
              <Link key={l.to} to={l.to} className="vs-footer-link">
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="vs-footer-base">
        <p>
          © {year} Bro Business Ideas · businessidea.io · {totalIdeas} researched blueprints, free
        </p>
        <p className="vs-footer-note">
          Made in India, for everyone starting from zero. We were there too.
        </p>
      </div>
    </footer>
  );
}
