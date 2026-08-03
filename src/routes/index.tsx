import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell } from "@/components/site-shell";
import { TiltPanel } from "@/components/tilt-panel";
import { AdSlot } from "@/components/AdSlot";
import { FEATURED_IDEA_IDS } from "@/config/featured";
import { getCatalog, getFeaturedIdeas } from "@/lib/ideas.functions";

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });

/** Split live categories evenly across 4 marquee rows (works for 9 or 100+). */
function tickerRows<T>(categories: T[], rowCount = 4): T[][] {
  const rows: T[][] = Array.from({ length: rowCount }, () => []);
  categories.forEach((c, i) => rows[i % rowCount]!.push(c));
  return rows.filter((r) => r.length > 0);
}

/** Editorial image trio — replace `src` only; nothing structural depends on it. */
const EDITORIAL_IMAGES = [
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-16.jpg.webp",
    alt: "Smiling businesswoman working at a laptop in a relaxed, warmly lit setting",
    blob: "blob-portrait-1",
    tilt: -2,
    offset: "sm:mt-0",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-17.jpg.webp",
    alt: "Businesswoman with a coffee and an open notebook in a calm workspace",
    blob: "blob-portrait-2",
    tilt: 4,
    offset: "sm:mt-24",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-37.jpg.webp",
    alt: "Close-up of hands typing on a laptop keyboard in warm ambient light",
    blob: "blob-portrait-3",
    tilt: -1.5,
    offset: "sm:mt-10",
  },
];

/** Scroll-stack panel copy. */
const SCROLL_PANELS = [
  {
    title: "Most small business ideas are guesses dressed as research.",
    body: "A trend chart and a list of niches is not a blueprint. This directory exists because the hard part of starting a business is never finding an idea — it is knowing if yours will actually pay.",
  },
  {
    title: "Every blueprint answers four questions.",
    body: "Who specifically pays for this. How the money actually moves. What will hurt in year one. And whether you, specifically, are the right person to build it.",
  },
  {
    title: "Hundreds of Business Ideas live. Scaling to 10,000.",
    body: "Organized across categories from Tech and SaaS to Creator and Media, FinTech, E-Commerce and more. Every new category added to the database appears here automatically.",
  },
  {
    title: "The AI audit goes further.",
    body: "Every blueprint has a live AI audit option. Run it and get real-time market sizing, a competitor map, and a 90-day launch plan generated for that specific idea. Pro Pass unlocks it.",
  },
];

/** Hero content panels. */
const HERO_PANELS = [
  {
    label: "What you get",
    body: "Every small business idea in this library comes with a named buyer, a revenue model in plain numbers, the failure modes most people find only after spending money, and a direct verdict on who should actually build it. Not a list. A blueprint.",
  },
  {
    label: "How it works",
    body: "Browse a category. Read the blueprint. If it fits, run a live AI audit and get a real-time market sizing, competitor map, and a 90-day launch plan built for that specific idea. Free to browse. Pro Pass for the audit.",
  },
];

/** FAQ content. */
const FAQS = [
  {
    q: "Are these real business ideas or just inspiration?",
    a: "Every entry is a researched blueprint, not a topic suggestion. Each one covers what the business actually does day to day, who the specific customer is, how money changes hands, what the realistic obstacles are, and a direct verdict on founder fit. You can evaluate any idea in under ten minutes.",
  },
  {
    q: "What is the difference between a free and Pro entry?",
    a: "Free entries give you the full blueprint — summary, pros, cons, and verdict. Pro entries add the live AI audit: a real-time market sizing, competitor analysis, target customer profile, and a 90-day go-to-market plan generated specifically for that idea.",
  },
  {
    q: "How are trend scores calculated?",
    a: "Each idea receives a trend score between 55 and 98 based on current market demand signals for that specific micro-niche, not the broader category. A score above 88 indicates strong current momentum and unlocks Pro tier status.",
  },
  {
    q: "Can I suggest a business idea to add to the library?",
    a: "Yes. Use the Contact page to submit a niche or sector you want covered. We review suggestions and prioritize based on search demand and founder interest.",
  },
  {
    q: "How often is the library updated?",
    a: "New blueprints are added regularly across all categories. Every new entry appears automatically in the browse page and category listings the moment it is published.",
  },
  {
    q: "Is this useful if I already have a business idea?",
    a: "Yes. Run the AI audit on the closest matching entry to get a real-time market sizing, competitive landscape, and launch plan that you can adapt to your own version of the idea.",
  },
];

const featuredQuery = queryOptions({
  queryKey: ["featured", FEATURED_IDEA_IDS],
  queryFn: () => getFeaturedIdeas({ data: { ideaIds: FEATURED_IDEA_IDS } }),
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      context.queryClient.ensureQueryData(featuredQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "BBI — Best Business Ideas | Researched Startup Blueprints" },
      {
        name: "description",
        content:
          "BBI (Best Business Ideas) — 1,000+ researched small business ideas, startup blueprints, and work from home business opportunities. Every idea includes market context, pros, cons, a trend score, and a straight founder-fit verdict.",
      },
      {
        property: "og:title",
        content: "BBI — Best Business Ideas | Researched Startup Blueprints",
      },
      {
        property: "og:description",
        content:
          "Best Business Ideas (BBI) — 1,000+ researched small business ideas, startup blueprints, and work from home business opportunities, with market context, pros, cons, trend scores and founder-fit verdicts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">The idea library could not be loaded.</p>
    </SiteShell>
  ),
});

function HomePage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  // Featured picks are configured in src/config/featured.ts
  const { data: highlights } = useSuspenseQuery(featuredQuery);

  return (
    <SiteShell>
      {/* LLM / AI-search crawlable summary — visually hidden, fully readable by crawlers. */}
      <p className="sr-only">
        BBI (Best Business Ideas) is a business idea directory and startup intelligence library.
        This resource covers small business ideas, work from home business ideas, low investment
        startup ideas, business ideas for women, zero investment business ideas, and startup ideas
        organized by sector, investment level, and founder profile. Each entry includes a market
        breakdown, revenue model, risk analysis, trend score, and founder-fit verdict. BBI is a
        curated directory of startup opportunities, not a generic listicle.
      </p>
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <section className="px-3 pt-10 sm:px-4 sm:pt-16">
        <TiltPanel className="mx-auto max-w-6xl" max={4}>
          <div className="glass blob-1 px-6 py-14 sm:px-12 sm:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent sm:text-xs">
              {catalog.totalIdeas} live blueprints
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              10,000+ small business ideas,{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent [text-shadow:0_0_40px_oklch(0.723_0.161_56/25%)]">
                researched properly
              </span>{" "}
              — not listicles.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Every entry is a blueprint: who the customer is, how the money works, what will hurt,
              and a blunt verdict on who should actually build it. Browse startup ideas, work from
              home business ideas, and low-investment opportunities — all ranked by real market
              demand.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {HERO_PANELS.map((panel, i) => (
                <div key={panel.label} className={`glass glass-hover ${i === 0 ? "blob-sm-1" : "blob-sm-2"} px-6 py-7`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                    {panel.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{panel.body}</p>
                </div>
              ))}
            </div>
          </div>
        </TiltPanel>
      </section>

      {/* MOVING CATEGORY TICKER — categories are live from the database. */}
      <section className="pt-10" aria-label="Browse by category">
        <style>{`@keyframes iv-ticker-l{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes iv-ticker-r{from{transform:translateX(-50%)}to{transform:translateX(0)}}.iv-ticker-track{width:max-content;animation:iv-ticker-l 70s linear infinite}.iv-ticker-track.rev{animation-name:iv-ticker-r}.iv-ticker:hover .iv-ticker-track,.iv-ticker:active .iv-ticker-track{animation-play-state:paused}`}</style>
        <p className="mx-auto max-w-6xl px-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent sm:px-4">
          Browse by category
        </p>
        <div className="iv-ticker mt-4 grid gap-3">
          {tickerRows(catalog.categories).map((row, rowIndex) => {
            // Repeat each row until it is wide enough to loop seamlessly.
            const repeats = Math.max(2, Math.ceil(14 / Math.max(row.length, 1))) * 2;
            const items = Array.from({ length: repeats }, () => row).flat();
            return (
              <div
                key={`ticker-row-${rowIndex}`}
                className="overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div
                  className={`iv-ticker-track flex gap-3 px-3 sm:px-4 ${rowIndex % 2 === 1 ? "rev" : ""}`}
                  style={{ animationDuration: `${70 + rowIndex * 10}s` }}
                >
                  {items.map((c, i) => (
                    <Link
                      key={`${rowIndex}-${c.categorySlug}-${i}`}
                      to="/category/$categorySlug"
                      params={{ categorySlug: c.categorySlug }}
                      className="glass shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_24px_oklch(0.723_0.161_56/45%)]"
                    >
                      {c.categoryName}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="px-3 pt-8 sm:px-4">
        <AdSlot position="homepage-hero-below" size="banner" />
      </div>

      <section className="mx-auto max-w-6xl px-3 py-16 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              Featured blueprints
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Three blueprints worth your afternoon
            </h2>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
          >
            See all {catalog.totalIdeas} →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((idea) => (
            <IdeaCard key={idea.ideaId} idea={idea} />
          ))}
        </div>
      </section>

      <div className="px-3 pb-8 sm:px-4">
        <AdSlot position="homepage-featured-below" size="banner" />
      </div>

      <section className="mx-auto max-w-6xl px-3 pb-10 sm:px-4">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              Why this exists
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              A list of ideas is not research.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Most idea lists are written in an afternoon by someone who has never sold the thing
                they are describing. They tell you the market is growing and stop there. The hard
                part of starting a business was never finding a plausible-sounding idea — it was
                working out who pays, how often, at what margin, and what happens on the day a
                bigger company decides to do the same thing for free.
              </p>
              <p>
                A blueprint in the library answers those questions before you commit a weekend to
                it. Each one names the customer specifically rather than as a demographic, explains
                the revenue mechanics in plain numbers, and lists the failure modes we would expect
                in the first year — the churn, the acquisition costs that quietly exceed lifetime
                value, the regulation nobody mentions until you are already trading.
              </p>
              <p>
                The verdict at the end is deliberately blunt. Some entries end with a
                recommendation not to build. That is the point: research that only ever agrees with
                you is marketing wearing a lab coat.
              </p>
            </div>
            <Link
              to="/browse"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
            >
              Read a blueprint
              <span aria-hidden>→</span>
            </Link>
          </div>

          <aside className="glass blob-3 p-8 lg:mt-16 lg:self-start sm:p-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              What every entry has to contain
            </h3>
            <dl className="mt-6 divide-y divide-border">
              {[
                {
                  t: "A named buyer",
                  d: "Not \"small businesses\" — the specific role, the budget it comes out of, and why it is a priority this quarter.",
                },
                {
                  t: "Working money mechanics",
                  d: "Pricing, delivery cost and the point at which the model stops being a job and starts being a business.",
                },
                {
                  t: "The unglamorous risks",
                  d: "Platform dependency, seasonality, licensing, and the competitor already halfway there.",
                },
                {
                  t: "A founder-fit verdict",
                  d: "Who is well placed to build it, and who should walk away from it entirely.",
                },
              ].map((row) => (
                <div key={row.t} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-sm font-semibold text-foreground">{row.t}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{row.d}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* EDITORIAL IMAGE TRIO — swap only the `src` values below to change images. */}
      <section className="mx-auto max-w-6xl px-3 pb-16 sm:px-4">
        <div className="grid gap-6 sm:grid-cols-3 sm:items-start">
          {EDITORIAL_IMAGES.map((img) => (
            <figure
              key={img.src}
              className={`glass relative overflow-hidden ${img.blob} ${img.offset} aspect-[3/4]`}
              style={{ transform: `rotate(${img.tilt}deg)` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary to-ember opacity-15"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* SCROLL-STACK — panels pin and stack as you scroll. Edit SCROLL_PANELS below. */}
      <section className="mx-auto max-w-5xl px-3 pb-24 sm:px-4">
        {SCROLL_PANELS.map((panel, i) => (
          <div key={panel.title} className="h-[70vh]">
            <div
              className={`glass sticky top-24 p-8 sm:p-12 ${["blob-2", "blob-4", "blob-5", "blob-6"][i]}`}
              style={{ zIndex: i + 1 }}
            >
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                {panel.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {panel.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* WHY WE BUILT THIS */}
      <section className="mx-auto max-w-4xl px-3 pb-24 sm:px-4">
        <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
          We got tired of the same 50 ideas recycled into infinity.
        </h2>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            Every business idea list on the internet is the same list. Drop shipping. Print on
            demand. Start a blog. Sell on Etsy. They are not wrong exactly, but they are not
            researched either. Nobody tells you the margin, the failure rate, the licensing
            requirement, or the competitor who already owns the space.
          </p>
          <p>
            This library exists because a genuine small business idea blueprint is worth more than
            a hundred recycled suggestions. We research each one properly — market context, real
            revenue mechanics, honest risks — and we tell you directly whether you are the right
            person to build it.
          </p>
        </div>
        <Link
          to="/browse"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
        >
          Read a blueprint
          <span aria-hidden>→</span>
        </Link>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-3 pb-24 sm:px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Common questions
        </p>
        <div className="mt-6 divide-y divide-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-foreground transition-colors hover:text-primary sm:text-lg">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="px-3 pb-10 sm:px-4">
        <AdSlot position="homepage-above-footer" size="banner" />
      </div>

      {/* ============================================================
          BBI ADDITION — TRUST STATS BAR (animated superellipse cards)
          Safe to delete: remove this one <TrustStatsBar ... /> line
          (and this comment), plus the whole block appended at the
          very bottom of this file (also marked "BBI ADDITION —
          TRUST STATS BAR"). Nothing else in this file is affected.
         ============================================================ */}
      <TrustStatsBar totalIdeas={catalog.totalIdeas} categoryCount={catalog.categories.length} />

      {/* ============================================================
          BBI ADDITION — KEYWORD CATEGORY MOSAIC
          Safe to delete: remove this one <KeywordMosaic /> line (and
          this comment), plus the whole block appended at the very
          bottom of this file (also marked "BBI ADDITION — KEYWORD
          CATEGORY MOSAIC"). Nothing else in this file is affected.
          Every pill links to /search?q=..., which always resolves —
          even for terms with no exact matching category yet — so
          nothing here can ever 404.
         ============================================================ */}
      <KeywordMosaic />

      {/* EDITABLE SECTION END */}
    </SiteShell>
  );
}

/* ================================================================
   BBI ADDITION — SCROLL-TRIGGERED REVEAL
   Everything below this line is self-contained. To remove: delete
   everything from here to the end of the file, plus the two render
   lines marked "BBI ADDITION" inside HomePage() above, plus the
   `useEffect, useRef, useState` import at the very top of this file.

   useInView watches an element with IntersectionObserver and flips
   to true the first time it scrolls into the viewport — works the
   same on mobile, tablet and desktop since it's driven by real
   viewport geometry, not a fixed timer. It disconnects after firing
   once, so scrolling past and back doesn't re-trigger the count.
   ================================================================ */

function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer support: reveal immediately rather than never animating.
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * Renders the final number on first paint (server-safe, no hydration
 * mismatch), then — once `start` flips true from useInView — resets to 0
 * and animates up to the target. Nothing moves until the visitor actually
 * scrolls the section into view.
 */
function useCountUp(target: number, start: boolean, durationMs = 1400) {
  const [display, setDisplay] = useState(target);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    let frameId: number;
    const startTime = performance.now();
    setDisplay(0);

    function tick(now: number) {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [start, target, durationMs]);

  return display;
}

function AnimatedNumber({ value, start }: { value: number; start: boolean }) {
  const display = useCountUp(value, start);
  return <>{display.toLocaleString()}</>;
}

/* ================================================================
   BBI ADDITION — TRUST STATS BAR
   Real numbers only. The first two are AI idea audits run ahead of
   BBI's public launch — shared via our live preview URL with testers
   across WhatsApp groups, friends and family. A single idea can be
   (and has been) audited multiple times by different people, which
   is expected and fine. No accounts/auth yet, so nothing is logged
   automatically — UPDATE THESE TWO NUMBERS BY HAND as real counts
   change. The other two stats are live from the database.

   Shapes: superellipse-1..4 (defined in src/styles.css) give each
   card a soft, symmetric squircle outline — rounder and calmer than
   the organic blob-* shapes used elsewhere, on purpose, to read as
   "data" rather than "editorial." Percentage-based radii scale with
   the card automatically on mobile/tablet/desktop.
   ================================================================ */

const BBI_TOTAL_VALIDATIONS = 3797;
const BBI_VALIDATIONS_LAST_30_DAYS = 1900;

const BBI_STAT_SHAPES = [
  "superellipse-1",
  "superellipse-2",
  "superellipse-3",
  "superellipse-4",
] as const;

function TrustStatsBar({
  totalIdeas,
  categoryCount,
}: {
  totalIdeas: number;
  categoryCount: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const stats = [
    {
      value: BBI_TOTAL_VALIDATIONS,
      label: "AI idea audits run",
      note: "Across our pre-launch testing group",
    },
    {
      value: BBI_VALIDATIONS_LAST_30_DAYS,
      label: "Audits in the last 30 days",
      note: "And climbing as we head to launch",
    },
    {
      value: totalIdeas,
      label: "Researched Business Ideas live",
      note: "Every one a completed, published entry",
    },
    {
      value: categoryCount,
      label: "Categories covered",
      note: "From fintech to senior care to SaaS",
    },
  ];

  return (
    <div
      ref={ref}
      className="mx-auto mt-8 grid max-w-6xl gap-4 px-3 sm:grid-cols-2 sm:px-4 lg:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`glass glass-hover sheen ${BBI_STAT_SHAPES[i % BBI_STAT_SHAPES.length]} px-6 py-7 text-center transition-transform duration-300 hover:scale-[1.03] sm:text-left`}
        >
          <p className="text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            <AnimatedNumber value={stat.value} start={inView} />
            <span aria-hidden>+</span>
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
            {stat.label}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{stat.note}</p>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   BBI ADDITION — KEYWORD CATEGORY MOSAIC
   Every chip's visible `label` can stay a full, readable SEO phrase —
   but the `query` sent to /search is the short core term only. The
   search function does an ilike match against title/summary/
   description/keywords/category/subcategory, so a long literal phrase
   like "fintech business ideas" almost never appears verbatim in a
   row and returns zero results. A short term like "fintech" matches
   far more of the library. This guarantees every link resolves to
   something, even for terms with no exact matching category in the
   database yet, so nothing here can ever 404 into an empty page.
   ================================================================ */

type KeywordTerm = { label: string; query: string };
type KeywordGroup = { heading: string; terms: KeywordTerm[] };

const BBI_KEYWORD_GROUPS: KeywordGroup[] = [
  {
    heading: "By industry",
    terms: [
      { label: "fintech business ideas", query: "fintech" },
      { label: "healthcare business ideas", query: "healthcare" },
      { label: "food and beverage business ideas", query: "food and beverage" },
      { label: "fashion business ideas", query: "fashion" },
      { label: "agriculture business ideas", query: "agriculture" },
      { label: "SaaS business ideas", query: "SaaS" },
    ],
  },
  {
    heading: "By who you are",
    terms: [
      { label: "business ideas for retirees", query: "retirees" },
      { label: "business ideas for veterans", query: "veterans" },
      { label: "business ideas for teenagers", query: "teenagers" },
      { label: "stay at home mom business ideas", query: "stay at home mom" },
      { label: "solo entrepreneur ideas", query: "solo entrepreneur" },
      { label: "business ideas for nurses", query: "nurses" },
      { label: "business ideas for couples", query: "couples" },
      { label: "senior care business ideas", query: "senior care" },
    ],
  },
  {
    heading: "By model",
    terms: [
      { label: "dropshipping business ideas", query: "dropshipping" },
      { label: "subscription box business ideas", query: "subscription box" },
      { label: "coaching business ideas", query: "coaching" },
      { label: "passive income ideas", query: "passive income" },
      { label: "high profit business ideas", query: "high profit" },
      { label: "low overhead business ideas", query: "low overhead" },
      { label: "recession proof business ideas", query: "recession proof" },
    ],
  },
];

const BBI_MOSAIC_SHAPES = ["superellipse-5", "superellipse-6"] as const;

function KeywordMosaic() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4" aria-label="Browse ideas by keyword">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
        Every angle covered
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        Business ideas by industry, founder, and model
      </h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {BBI_KEYWORD_GROUPS.map((group, groupIndex) => (
          <div
            key={group.heading}
            className={`glass ${BBI_MOSAIC_SHAPES[groupIndex % BBI_MOSAIC_SHAPES.length]} p-6`}
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {group.heading}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.terms.map((term) => (
                <Link
                  key={term.label}
                  to="/search"
                  search={{ q: term.query }}
                  className="glass-hover rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_18px_oklch(0.723_0.161_56/35%)]"
                >
                  {term.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
