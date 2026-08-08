import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { AmbientScene } from "@/components/ambient-scene";
import { LiveSearch } from "@/components/live-search";
import { FloatingDock } from "@/components/floating-dock";
import { getCatalog } from "@/lib/ideas.functions";

const navLinks = [
  { to: "/browse", label: "Browse" },
  { to: "/blog", label: "Blog" },
  { to: "/pricing", label: "Pricing" },
];

/** Static grouped columns shown to the right of the live category grid. */
const STATIC_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "By Who You Are",
    items: [
      "Business Ideas for Women",
      "Student Business Ideas",
      "Side Hustle Ideas",
      "One Person Business Ideas",
      "Business Ideas for Retirees",
    ],
  },
  {
    title: "By Investment",
    items: [
      "Zero Investment Business Ideas",
      "Low Investment Business Ideas",
      "Work From Home Business Ideas",
      "High Margin Business Ideas",
      "Quick Cash Business Ideas",
    ],
  },
];

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

function useCatalog() {
  return useQuery({ queryKey: ["catalog"], queryFn: () => getCatalog(), staleTime: 60_000 });
}

function AuthButtons({ onNavigate, full }: { onNavigate?: () => void; full?: boolean }) {
  return (
    <>
      <Link
        to="/sign-in"
        onClick={onNavigate}
        className={`glass rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:border-primary ${full ? "block text-center" : ""}`}
      >
        Sign In
      </Link>
      <Link
        to="/browse"
        onClick={onNavigate}
        className={`sheen rounded-full bg-gradient-to-r from-primary to-ember px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_8px_28px_oklch(0.687_0.161_51.5/40%)] transition-all duration-300 hover:scale-105 ${full ? "block text-center" : ""}`}
      >
        Browse free
      </Link>
    </>
  );
}

/** Desktop mega-menu. Categories are never hardcoded — live from the `ideas` table. */
function CategoryMega() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data } = useCatalog();
  const categories = (data?.categories ?? []).slice(0, 20);

  /** Hover-gap fix: cancel pending close on re-enter, delay close by 150ms. */
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => isDesktop() && openNow()}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onFocus={() => isDesktop() && openNow()}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 uppercase tracking-[0.18em] transition-colors duration-300 hover:text-foreground"
      >
        Categories
        <span
          aria-hidden
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            style={{ background: "oklch(0.255 0.008 274 / 98%)" }}
            className="glass-nav fixed left-1/2 top-20 z-50 w-[min(66rem,94vw)] -translate-x-1/2 rounded-3xl p-5 before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:content-['']"
          >
            <div className="grid gap-6 lg:grid-cols-[2.2fr_1fr]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                  Browse by category
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                  {categories.length === 0 ? (
                    <p className="text-xs normal-case tracking-normal text-muted-foreground">
                      Loading categories…
                    </p>
                  ) : (
                    categories.map((c) => (
                      <Link
                        key={c.categorySlug}
                        to="/category/$categorySlug"
                        params={{ categorySlug: c.categorySlug }}
                        onClick={() => setOpen(false)}
                        className="rounded-full px-3 py-1.5 text-[11px] normal-case tracking-normal text-foreground transition-colors"
                      >
                        <span className="block truncate font-semibold leading-snug">
                          {c.categoryName}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
                <Link
                  to="/browse"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-block rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
                >
                  View all categories →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:border-l lg:border-border lg:pl-6">
                {STATIC_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                      {group.title}
                    </p>
                    <ul className="mt-2.5 space-y-1">
                      {group.items.map((item) => (
                        <li key={item}>
                          <Link
                            to="/browse"
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-2 py-1.5 text-xs normal-case tracking-normal text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [catOpen, setCatOpen] = useState(false);
  const { data } = useCatalog();
  const categories = data?.categories ?? [];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="glass-nav absolute right-0 top-0 flex h-full w-[min(22rem,92vw)] flex-col overflow-y-auto px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
          >
            ✕
          </button>
        </div>

        <LiveSearch className="mt-4" onNavigate={onClose} />

        <nav className="mt-5 grid gap-1 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/search"
            onClick={onClose}
            className="rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Search
          </Link>

          <button
            type="button"
            aria-expanded={catOpen}
            onClick={() => setCatOpen((v) => !v)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-left uppercase tracking-[0.18em] transition-colors hover:bg-secondary hover:text-foreground"
          >
            Categories
            <span
              aria-hidden
              className={`transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>
          {catOpen && (
            <div className="grid gap-0.5 border-l border-border pl-3">
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
                    onClick={onClose}
                    className="rounded-lg px-3 py-2 text-xs font-semibold normal-case tracking-normal text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {c.categoryName}
                  </Link>
                ))
              )}
              <Link
                to="/browse"
                onClick={onClose}
                className="rounded-lg px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary hover:bg-white/10"
              >
                View all categories →
              </Link>
            </div>
          )}
        </nav>

        <div className="mt-auto grid gap-2 pt-8">
          <AuthButtons onNavigate={onClose} full />
        </div>
      </motion.div>
    </div>
  );
}

const footerColumns: { title: string; links: { to: string; label: string }[] }[] = [
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
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <AmbientScene />
      <header className="sticky top-0 z-40 px-3 pt-2 sm:px-4 sm:pt-5">
        <div className="glass-nav mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 sm:px-6 sm:py-3">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 items-baseline gap-2"
          >
            <span className="shrink-0 rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-sm font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_oklch(0.723_0.161_56/45%)] sm:text-lg">
              BBI
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground md:flex">
            <CategoryMega />
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

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <LiveSearch className="w-44 lg:w-56" />
            <AuthButtons />
          </div>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
            className="flex shrink-0 flex-col gap-1.5 rounded-full border border-border px-3 py-2.5 md:hidden"
          >
            <span aria-hidden className="block h-0.5 w-5 bg-foreground" />
            <span aria-hidden className="block h-0.5 w-5 bg-foreground" />
            <span aria-hidden className="block h-0.5 w-5 bg-foreground" />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
      <main className="flex-1">{children}</main>
      <FloatingDock />
      <footer className="px-3 pb-8 pt-20 sm:px-4">
        <div className="glass mx-auto max-w-6xl rounded-3xl px-6 py-10 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Link to="/" className="flex items-baseline gap-2">
                <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-base font-black uppercase tracking-[0.18em] text-primary-foreground">
                  BBI
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Researched business idea blueprints with real market context, trend scoring and a
                blunt founder-fit verdict.
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
            <p>© {new Date().getFullYear()} BBI. All rights reserved.</p>
            <p>Idea data served live from the BBI database.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; to?: string; params?: Record<string, string> }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex max-w-full flex-wrap items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="text-border">
              ›
            </span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              params={item.params as never}
              className="rounded-full border border-border/70 bg-secondary/55 px-2.5 py-1 transition-colors hover:border-primary/60 hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="max-w-[min(18rem,70vw)] truncate rounded-full border border-border bg-card/70 px-2.5 py-1 text-foreground">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
