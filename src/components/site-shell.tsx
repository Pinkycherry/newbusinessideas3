import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { AmbientScene } from "@/components/ambient-scene";
import { getCatalog } from "@/lib/ideas.functions";
import { COLLECTIONS } from "@/config/collections";

const navLinks = [
  { to: "/browse", label: "Browse" },
  { to: "/blog", label: "Blog" },
  { to: "/pricing", label: "Pricing" },
  { to: "/search", label: "Search" },
];

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches;

/** Categories are never hardcoded — they come from the live `ideas` table. */
function CategoryMenu({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => getCatalog(),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Section A: live from the database, top 8 categories by idea count.
  const categories = (data?.categories ?? []).slice(0, 8);

  const openOnHover = () => {
    if (!isDesktop()) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeOnLeave = () => {
    if (!isDesktop()) return;
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };
  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={openOnHover} onMouseLeave={closeOnLeave}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onFocus={openOnHover}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 uppercase tracking-[0.18em] transition-colors duration-300 hover:text-foreground"
      >
        Categories
        <span aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="glass absolute left-0 top-[calc(100%+0.75rem)] z-50 max-h-[60vh] w-[min(20rem,80vw)] overflow-y-auto rounded-2xl p-2 sm:left-auto sm:right-0 sm:top-[calc(100%+1rem)]"
        >
          {categories.length === 0 ? (
            <p className="px-3 py-2 text-xs normal-case tracking-normal text-muted-foreground">
              Loading categories…
            </p>
          ) : (
            <>
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                Browse by type
              </p>
              {categories.map((c) => (
              <Link
                key={c.categorySlug}
                to="/category/$categorySlug"
                params={{ categorySlug: c.categorySlug }}
                onClick={close}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs normal-case tracking-normal text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <span className="font-semibold">{c.categoryName}</span>
                <span className="text-[10px] uppercase tracking-widest text-accent">
                  {c.ideaCount}
                </span>
              </Link>
              ))}
            </>
          )}
          <Link
            to="/browse"
            onClick={close}
            className="mt-1 block rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary hover:bg-white/10"
          >
            View all →
          </Link>

          {/* Section B: static collections, edited in src/config/collections.ts */}
          {COLLECTIONS.length > 0 && (
            <div className="mt-1 border-t border-border pt-2">
              <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                Collections
              </p>
              {COLLECTIONS.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  onClick={close}
                  className="block rounded-xl px-3 py-2.5 text-xs font-semibold normal-case tracking-normal text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const footerColumns: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { to: "/browse", label: "Browse ideas" },
      { to: "/search", label: "Search" },
      { to: "/pricing", label: "Pro Pass pricing" },
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
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <AmbientScene />
      <header className="sticky top-0 z-40 px-3 pt-2 sm:px-4 sm:pt-5">
        <div className="glass-nav mx-auto max-w-6xl rounded-2xl px-3 py-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2 sm:rounded-full sm:px-6 sm:py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:contents">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-sm font-black uppercase tracking-[0.22em] [text-shadow:0_0_18px_oklch(1_0_0/45%)] sm:text-lg">
              Idea
            </span>
            <span className="shrink-0 rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-sm font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_oklch(0.723_0.161_56/45%)] sm:text-lg">
              Vault
            </span>
          </Link>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:hidden"
          >
            Menu
            <span aria-hidden className={`transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>
          </div>
          <nav
            className={`${mobileOpen ? "mt-3 grid" : "hidden"} gap-1 border-t border-border pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:mt-0 sm:flex sm:shrink-0 sm:items-center sm:gap-6 sm:border-0 sm:pt-0 sm:text-xs`}
          >
            <CategoryMenu />
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="relative py-1.5 transition-colors duration-300 hover:text-foreground sm:py-0 sm:after:absolute sm:after:-bottom-1.5 sm:after:left-0 sm:after:h-px sm:after:w-0 sm:after:bg-primary sm:after:transition-all sm:after:duration-500 sm:hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="px-3 pb-8 pt-20 sm:px-4">
        <div className="glass mx-auto max-w-6xl rounded-3xl px-6 py-10 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Link to="/" className="flex items-baseline gap-2">
                <span className="text-base font-black uppercase tracking-[0.22em]">Idea</span>
                <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-base font-black uppercase tracking-[0.18em] text-primary-foreground">
                  Vault
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Researched business idea blueprints with real market context, trend scoring and a
                blunt founder-fit verdict — plus live AI audits on Pro entries.
              </p>
            </div>
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.to}-${link.label}`}>
                      <Link
                        to={link.to}
                        className="transition-colors duration-300 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} IdeaVault AI. All rights reserved.</p>
            <p>Idea data served live from the IdeaVault database.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {item.to ? (
            <Link
              to={item.to}
              params={item.params as never}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
