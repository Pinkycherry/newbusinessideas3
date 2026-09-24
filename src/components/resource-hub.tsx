import { Link } from "@tanstack/react-router";
import { BookOpen, Calculator, Newspaper, SpellCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { PageResources, ResourceLink } from "@/lib/resources.server";
import { CinemaIcon } from "@/components/idea-cinema/cinema-icons";

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

/** Shared by both layouts below so the copy cannot drift between them. */
const STANDFIRST = {
  calc: "Twelve of them. Each one does arithmetic on the numbers you type and shows its working — no industry averages, no benchmarks, nothing invented.",
  guides: "Six, drawn from the library at random — refresh for six more.",
  glossary: "Twelve terms from the 159 defined on this site, in plain words. These rotate too.",
  blog: "Six posts, picked fresh every time this page loads.",
};

const CARD =
  "mo-card glass glass-hover group flex h-full flex-col rounded-2xl border border-border/60 p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg";
const CARD_TITLE =
  "text-base font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent";
const CARD_BLURB = "mt-1.5 text-sm leading-relaxed text-muted-foreground";
const CARD_META =
  "mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80";

export function ResourceHub({
  resources,
  cinema = false,
}: {
  resources: PageResources | null | undefined;
  /** The idea-page cinema trial's layout: the same links, as compact rows
   * with "Show more" disclosures. */
  cinema?: boolean;
}) {
  if (!resources) return null;
  if (cinema) return <CinemaResourceHub resources={resources} />;
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
        standfirst={STANDFIRST.calc}
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
        standfirst={STANDFIRST.guides}
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
        standfirst={STANDFIRST.glossary}
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
        standfirst={STANDFIRST.blog}
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

/* ---- Cinema trial layout -------------------------------------------------
   Same four lists, same links and copy as above, as compact rows:
   calculators as a two-column list, guides and blog posts as title-and-
   summary rows, glossary terms as a dense register. Rendered only when
   SiteShell's `visualTrial` is on.

   Each list shows a short first set; the rest stay in the page behind an
   accessible "Show more" disclosure, and every group links to its full
   collection. Nothing is dropped. */

const CINEMA_SHOWN = { calculators: 6, guides: 3, glossary: 6, posts: 3 };

function CinemaBlock({
  id,
  heading,
  standfirst,
  all,
  children,
}: {
  id: string;
  heading: string;
  standfirst: string;
  all: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="cm-hub-block" aria-labelledby={id}>
      <div className="cm-hub-head">
        <div className="min-w-0">
          <h2 id={id} className="text-xl">
            {heading}
          </h2>
          <p>{standfirst}</p>
        </div>
        <Link to={all.to} className="cm-trace-link cm-hub-all">
          {all.label}
          <CinemaIcon name="arrow" size={16} className="cm-arrow" />
        </Link>
      </div>
      {children}
    </section>
  );
}

/** First `shown` items in `wrap`, the rest in the same wrapper behind a disclosure. */
function Split<T>({
  items,
  shown,
  noun,
  wrap,
  render,
}: {
  items: T[];
  shown: number;
  noun: string;
  wrap: (children: React.ReactNode, start: number) => React.ReactNode;
  render: (item: T, index: number) => React.ReactNode;
}) {
  const head = items.slice(0, shown);
  const tail = items.slice(shown);
  return (
    <>
      {wrap(
        head.map((item, i) => render(item, i)),
        1,
      )}
      {tail.length > 0 && (
        <details className="cm-more">
          <summary>
            Show {tail.length} more {noun}
            <span className="cm-faq-mark" aria-hidden="true" />
          </summary>
          {wrap(
            tail.map((item, i) => render(item, i + shown)),
            shown + 1,
          )}
        </details>
      )}
    </>
  );
}

function CinemaResourceHub({ resources }: { resources: PageResources }) {
  const { calculators, guides, glossary, posts } = resources;
  if (
    calculators.length === 0 &&
    guides.length === 0 &&
    glossary.length === 0 &&
    posts.length === 0
  ) {
    return null;
  }
  const editorial = (to: "/startup-guides/$slug" | "/blog/$slug") => (item: ResourceLink) => (
    <li key={item.slug}>
      <Link to={to} params={{ slug: item.slug }} className="cm-editorial-item cm-trace">
        {item.meta && <span className="cm-editorial-meta">{item.meta}</span>}
        <span className="cm-editorial-title">{item.label}</span>
        {item.blurb && <span className="cm-editorial-blurb">{item.blurb}</span>}
      </Link>
    </li>
  );
  return (
    <div id="resources" className="cm-hub" data-reveal="rise">
      <p className="cm-eyebrow">Everything below is free. No sign-in, no credits.</p>
      {calculators.length > 0 && (
        <CinemaBlock
          id="rh-calculators"
          heading="Free startup calculators"
          standfirst={STANDFIRST.calc}
          all={{ to: "/calculator", label: "All calculators" }}
        >
          <Split
            items={calculators}
            shown={CINEMA_SHOWN.calculators}
            noun="calculators"
            wrap={(children, start) => (
              <ol className="cm-index" start={start}>
                {children}
              </ol>
            )}
            render={(item) => (
              <li key={item.slug}>
                <Link
                  to="/calculator/$slug"
                  params={{ slug: item.slug }}
                  className="cm-index-row cm-trace"
                >
                  <span className="cm-index-text">
                    <span className="cm-index-title">{item.label}</span>
                    {item.blurb && <span className="cm-index-blurb">{item.blurb}</span>}
                  </span>
                  <CinemaIcon name="arrow" size={18} className="cm-arrow" />
                </Link>
              </li>
            )}
          />
        </CinemaBlock>
      )}
      {guides.length > 0 && (
        <CinemaBlock
          id="rh-guides"
          heading="Startup guides"
          standfirst={STANDFIRST.guides}
          all={{ to: "/startup-guides", label: "All guides" }}
        >
          <Split
            items={guides}
            shown={CINEMA_SHOWN.guides}
            noun="guides"
            wrap={(children) => <ul className="cm-editorial">{children}</ul>}
            render={editorial("/startup-guides/$slug")}
          />
        </CinemaBlock>
      )}
      {glossary.length > 0 && (
        <CinemaBlock
          id="rh-glossary"
          heading="Startup glossary"
          standfirst={STANDFIRST.glossary}
          all={{ to: "/founder-glossary", label: "Full glossary" }}
        >
          <Split
            items={glossary}
            shown={CINEMA_SHOWN.glossary}
            noun="terms"
            wrap={(children) => <ul className="cm-register">{children}</ul>}
            render={(item) => (
              <li key={item.slug}>
                <Link to="/founder-glossary" hash={item.slug} className="cm-register-row">
                  <span className="cm-register-term">{item.label}</span>
                  {item.blurb && <span className="cm-register-def">{item.blurb}</span>}
                  {item.meta && <span className="cm-register-meta">{item.meta}</span>}
                </Link>
              </li>
            )}
          />
        </CinemaBlock>
      )}
      {posts.length > 0 && (
        <CinemaBlock
          id="rh-blog"
          heading="From the blog"
          standfirst={STANDFIRST.blog}
          all={{ to: "/blog", label: "All posts" }}
        >
          <Split
            items={posts}
            shown={CINEMA_SHOWN.posts}
            noun="posts"
            wrap={(children) => <ul className="cm-editorial">{children}</ul>}
            render={editorial("/blog/$slug")}
          />
        </CinemaBlock>
      )}
    </div>
  );
}
