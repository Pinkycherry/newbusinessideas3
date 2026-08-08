import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

import { AmbientScene } from "@/components/ambient-scene";
import { LiveSearch } from "@/components/live-search";
import { FloatingDock } from "@/components/floating-dock";
import { ThemeToggle } from "@/components/theme-toggle";
import { CategoryBadge } from "@/components/category-badge";
import { catalogQuery } from "@/lib/ideas.functions";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth-client";

/**
 * Header/nav grouping (PROJECT_BRIEF.md Section 12.5 — 3-4 dropdowns).
 * Exact structure is provisional pending the founder's reference images;
 * see PENDING.md.
 */
const navLinks = [{ to: "/pricing", label: "Pricing" }];

const EXPLORE_ITEMS = [
  { to: "/browse", label: "Browse all ideas" },
  { to: "/search", label: "Search" },
  { to: "/blog", label: "Blog" },
  { to: "/services", label: "Services" },
];

const COMPANY_ITEMS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/** Curated static groupings — link through to /browse (no dedicated filtered route yet). */
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
  return useQuery(catalogQuery);
}

function AuthButtons({ onNavigate, full }: { onNavigate?: () => void; full?: boolean }) {
  const auth = useAuth();

  if (auth.status === "authenticated") {
    const metadata = auth.session.user.user_metadata as Record<string, unknown> | undefined;
    const fullName = metadata?.["full_name"] as string | undefined;
    const name = fullName?.split(" ")[0] ?? auth.session.user.email?.split("@")[0] ?? "Account";
    return (
      <div className={`flex items-center gap-2 ${full ? "flex-col" : ""}`}>
        <span
          className={`glass flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground ${full ? "w-full justify-center" : ""}`}
        >
          <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{name}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            void signOut();
            onNavigate?.();
          }}
          className={`rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:border-primary hover:text-foreground ${full ? "w-full" : ""}`}
        >
          Sign out
        </button>
      </div>
    );
  }

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
        className={`sheen rounded-full bg-gradient-to-r from-primary to-ember px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_8px_28px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-all duration-300 hover:scale-105 ${full ? "block text-center" : ""}`}
      >
        Browse free
      </Link>
    </>
  );
}

/** Desktop mega-menu. Categories are never hardcoded — live from the `ideas` table. */
/**
 * Shared dropdown shell (hover-open with a close-delay gap fix, outside-click
 * close, keyboard focus support). Every header dropdown is built on this one
 * implementation instead of four copies of the same open/close logic.
 */
function NavDropdown({
  label,
  panelClassName = "glass-nav absolute left-0 top-full z-50 mt-3 w-64 rounded-2xl p-3",
  children,
}: {
  label: string;
  panelClassName?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        {label}
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
            className={`iv-nav-panel ${panelClassName}`}
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryMega() {
  const { data } = useCatalog();
  const categories = (data?.categories ?? []).slice(0, 20);

  return (
    <NavDropdown
      label="Categories"
      panelClassName="glass-nav absolute left-0 top-full z-50 mt-3 w-[min(48rem,94vw)] rounded-3xl p-5"
    >
      {(close) => (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
            Browse by category
          </p>
          <div className="iv-tag-cloud mt-3">
            {categories.length === 0 ? (
              <p className="text-xs normal-case tracking-normal text-muted-foreground">
                Loading categories…
              </p>
            ) : (
              categories.map((c) => (
                <CategoryBadge
                  key={c.categorySlug}
                  slug={c.categorySlug}
                  label={c.categoryName}
                  onClick={close}
                  className="iv-tag"
                />
              ))
            )}
          </div>
          <Link
            to="/browse"
            onClick={close}
            className="mt-3 inline-block rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            View all categories →
          </Link>
        </div>
      )}
    </NavDropdown>
  );
}

function BrowseByTypeDropdown() {
  return (
    <NavDropdown
      label="Browse by type"
      panelClassName="glass-nav absolute left-0 top-full z-50 mt-3 w-[min(32rem,90vw)] rounded-2xl p-4"
    >
      {(close) => (
        <div className="grid gap-5 sm:grid-cols-2">
          {STATIC_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                {group.title}
              </p>
              <div className="iv-tag-cloud mt-2.5">
                {group.items.map((item) => (
                  <CategoryBadge
                    key={item}
                    to="/browse"
                    label={item}
                    size="sm"
                    className="iv-tag"
                    onClick={close}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </NavDropdown>
  );
}

function LinkListDropdown({
  label,
  items,
}: {
  label: string;
  items: { to: string; label: string }[];
}) {
  return (
    <NavDropdown label={label}>
      {(close) => (
        <div className="iv-tag-cloud">
          {items.map((item) => (
            <CategoryBadge
              key={item.to}
              to={item.to}
              label={item.label}
              size="sm"
              className="iv-tag"
              onClick={close}
            />
          ))}
        </div>
      )}
    </NavDropdown>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [catOpen, setCatOpen] = useState(false);
  const { data } = useCatalog();
  const categories = data?.categories ?? [];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              ✕
            </button>
          </div>
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

          <p className="mt-4 px-3 text-[10px] normal-case tracking-normal text-accent">Explore</p>
          {EXPLORE_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="rounded-xl px-3 py-2.5 text-xs normal-case tracking-normal text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <p className="mt-4 px-3 text-[10px] normal-case tracking-normal text-accent">Company</p>
          {COMPANY_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="rounded-xl px-3 py-2.5 text-xs normal-case tracking-normal text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
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
  const { data: catalog } = useCatalog();
  const popularCategories = (catalog?.categories ?? []).slice(0, 6);
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
            <span className="shrink-0 rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-sm font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_45%,transparent)] sm:text-lg">
              BBI
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:flex">
            <CategoryMega />
            <BrowseByTypeDropdown />
            <LinkListDropdown label="Explore" items={EXPLORE_ITEMS} />
            <LinkListDropdown label="Company" items={COMPANY_ITEMS} />
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

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LiveSearch className="w-44 xl:w-56" />
            <ThemeToggle />
            <AuthButtons />
          </div>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
            className="flex shrink-0 flex-col gap-1.5 rounded-full border border-border px-3 py-2.5 lg:hidden"
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
        <div className="glass mx-auto max-w-7xl rounded-3xl px-6 py-10 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
            <div>
              <Link to="/" className="flex items-baseline gap-2">
                <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-base font-black uppercase tracking-[0.18em] text-primary-foreground">
                  BBI
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Researched business idea blueprints with real market context, trend scoring and a
                blunt founder-fit verdict. Validate any idea free, on your own Claude or Perplexity
                account.
              </p>
            </div>
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                  {col.title}
                </h3>
                <div className="iv-tag-cloud mt-4">
                  {col.links.map((link) => (
                    <CategoryBadge
                      key={`${col.title}-${link.to}-${link.label}`}
                      to={link.to}
                      label={link.label}
                      size="sm"
                      className="iv-tag"
                    />
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                Popular categories
              </h3>
              <div className="iv-tag-cloud mt-4">
                {popularCategories.length === 0 ? (
                  <span className="text-xs text-muted-foreground">Loading…</span>
                ) : (
                  popularCategories.map((c) => (
                    <CategoryBadge
                      key={c.categorySlug}
                      slug={c.categorySlug}
                      label={c.categoryName}
                      size="sm"
                      className="iv-tag"
                    />
                  ))
                )}
              </div>
            </div>
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
