import { Link } from "@tanstack/react-router";
import { BookOpen, Calculator, Newspaper, SpellCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { PageResources, ResourceLink } from "@/lib/resources.server";

/**
 * The block that closes a long page: twelve calculators, six guides, twelve
 * glossary terms and six blog posts, each under its own heading.
 *
 * The counts are set in resources.server.ts, not here — this file only
 * renders what it is handed, so changing "five guides" to six is one number
 * in one place and the copy below.
 *
 * What it replaces was a thin one: a single "Keep exploring" row of two or
 * three generic links, identical on all 409 idea pages, on a site that
 * already owns sixty calculators, twenty written guides, 159 glossary
 * entries and a blog. Those pages existed and nothing linked to them, so
 * every one of them was an orphan and every idea page was a dead end.
 *
 * Guides, glossary and blog rotate on every request (see resources.server.ts
 * for why the shuffle lives there and not here); the calculators are fixed.
 * The rotation is the point for more than variety: across 409 pages it
 * spreads internal links over the whole library instead of hammering the
 * same five URLs, and a reader who refreshes gets something they have not
 * already skipped.
 *
 * Presentational only. It fetches nothing and randomises nothing — a route
 * loads `getPageResources()` in its loader and hands the result down.
 */

type BlockProps = {
  id: string;
  heading: string;
  standfirst: string;
  Icon: LucideIcon;
  tint: string;
  items: ResourceLink[];
  columns: string;
  render: (item: ResourceLink) => React.ReactNode;
};

function Block({ id, heading, standfirst, Icon, tint, items, columns, render }: BlockProps) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 first:mt-0" aria-labelledby={id}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl"
          style={{
            color: `var(${tint})`,
            background: `color-mix(in oklab, var(${tint}) 14%, transparent)`,
          }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h2 id={id} className="text-xl font-bold tracking-tight sm:text-2xl">
            {heading}
          </h2>
          <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{standfirst}</p>
        </div>
      </div>
      <ul className={`mt-5 grid gap-3 ${columns}`}>{items.map(render)}</ul>
    </section>
  );
}

const CARD =
  "mo-card glass glass-hover group flex h-full flex-col rounded-2xl border border-border/60 p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg";
const CARD_TITLE =
  "text-base font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent";
const CARD_BLURB = "mt-1.5 text-sm leading-relaxed text-muted-foreground";
const CARD_META =
  "mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80";

export function ResourceHub({ resources }: { resources: PageResources | null | undefined }) {
  if (!resources) return null;
  const { calculators, guides, glossary, posts } = resources;
  if (
    calculators.length === 0 &&
    guides.length === 0 &&
    glossary.length === 0 &&
    posts.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="mt-16 border-t border-border pt-10"
      data-anchor="resources"
      data-anchor-label="Free tools"
    >
      <p className="t-eyebrow">Everything below is free. No sign-in, no credits.</p>

      <Block
        id="rh-calculators"
        heading="Free startup calculators"
        standfirst="Twelve of them. Each one does arithmetic on the numbers you type and shows its working — no industry averages, no benchmarks, nothing invented."
        Icon={Calculator}
        tint="--hl-green"
        items={calculators}
        columns="sm:grid-cols-2 lg:grid-cols-3"
        render={(item) => (
          <li key={item.slug}>
            <Link to="/calculator/$slug" params={{ slug: item.slug }} className={CARD}>
              <span className={CARD_TITLE}>{item.label}</span>
              {item.blurb && <span className={CARD_BLURB}>{item.blurb}</span>}
            </Link>
          </li>
        )}
      />

      <Block
        id="rh-guides"
        heading="Startup guides"
        standfirst="Six, drawn from the library at random — refresh for six more."
        Icon={BookOpen}
        tint="--hl-teal"
        items={guides}
        columns="sm:grid-cols-2"
        render={(item) => (
          <li key={item.slug}>
            <Link to="/startup-guides/$slug" params={{ slug: item.slug }} className={CARD}>
              <span className={CARD_TITLE}>{item.label}</span>
              {item.blurb && <span className={CARD_BLURB}>{item.blurb}</span>}
              {item.meta && <span className={CARD_META}>{item.meta}</span>}
            </Link>
          </li>
        )}
      />

      <Block
        id="rh-glossary"
        heading="Startup glossary"
        standfirst="Twelve terms from the 159 defined on this site, in plain words. These rotate too."
        Icon={SpellCheck}
        tint="--hl-gold"
        items={glossary}
        columns="sm:grid-cols-2 lg:grid-cols-3"
        render={(item) => (
          <li key={item.slug}>
            <Link to="/founder-glossary" hash={item.slug} className={CARD}>
              <span className={CARD_TITLE}>{item.label}</span>
              {item.blurb && <span className={CARD_BLURB}>{item.blurb}</span>}
              {item.meta && <span className={CARD_META}>{item.meta}</span>}
            </Link>
          </li>
        )}
      />

      <Block
        id="rh-blog"
        heading="From the blog"
        standfirst="Six posts, picked fresh every time this page loads."
        Icon={Newspaper}
        tint="--hl-coral"
        items={posts}
        columns="sm:grid-cols-2 lg:grid-cols-3"
        render={(item) => (
          <li key={item.slug}>
            <Link to="/blog/$slug" params={{ slug: item.slug }} className={CARD}>
              <span className={CARD_TITLE}>{item.label}</span>
              {item.blurb && <span className={CARD_BLURB}>{item.blurb}</span>}
              {item.meta && <span className={CARD_META}>{item.meta}</span>}
            </Link>
          </li>
        )}
      />
    </div>
  );
}
