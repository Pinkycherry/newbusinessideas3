import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AmbientScene } from "@/components/ambient-scene";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/search", label: "Search" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <AmbientScene />
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-5">
        <div className="glass mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-base font-black uppercase tracking-[0.22em] [text-shadow:0_0_18px_oklch(1_0_0/45%)] sm:text-lg">
              Idea
            </span>
            <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-base font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_oklch(0.723_0.161_56/45%)] sm:text-lg">
              Vault
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:gap-6 sm:text-xs">
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
      <footer className="px-3 pb-6 pt-16 sm:px-4">
        <div className="glass mx-auto max-w-6xl rounded-3xl px-6 py-8 text-sm text-muted-foreground">
          IdeaVault AI — business idea blueprints, sourced from the live IdeaVault dataset.
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
