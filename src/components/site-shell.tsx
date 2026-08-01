import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { AmbientScene } from "@/components/ambient-scene";
import { getCatalog } from "@/lib/ideas.functions";

const navLinks = [
  { to: "/browse", label: "Browse" },
  { to: "/blog", label: "Blog" },
  { to: "/pricing", label: "Pricing" },
  { to: "/search", label: "Search" },
];

/** Categories are never hardcoded — they come from the live `ideas` table. */
function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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

  const categories = data?.categories ?? [];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
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
          className="glass absolute right-0 top-[calc(100%+1rem)] z-50 max-h-[60vh] w-[min(20rem,80vw)] overflow-y-auto rounded-2xl p-2"
        >
          {categories.length === 0 ? (
            <p className="px-3 py-2 text-xs normal-case tracking-normal text-muted-foreground">
              Loading categories…
            </p>
          ) : (
            categories.map((c) => (
              <Link
                key={c.categorySlug}
                to="/category/$categorySlug"
                params={{ categorySlug: c.categorySlug }}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs normal-case tracking-normal text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <span className="font-semibold">{c.categoryName}</span>
                <span className="text-[10px] uppercase tracking-widest text-accent">
                  {c.ideaCount}
                </span>
              </Link>
            ))
          )}
          <Link
            to="/browse"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary hover:bg-white/10"
          >
            View all →
          </Link>
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
      { to: "/services", label: "What we do" },
      { to: "/blog", label: "Founder playbooks" },
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
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <AmbientScene />
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-5">
        <div className="glass mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[1.75rem] px-4 py-3 sm:rounded-full sm:px-6">
          <Link to="/" className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-base font-black uppercase tracking-[0.22em] [text-shadow:0_0_18px_oklch(1_0_0/45%)] sm:text-lg">
              Idea
            </span>
            <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-base font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_oklch(0.723_0.161_56/45%)] sm:text-lg">
              Vault
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:gap-6 sm:text-xs">
            <CategoryMenu />
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-500 hover:after:w-full"
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
