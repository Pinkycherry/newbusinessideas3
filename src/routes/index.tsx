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
         ============================================================ */}
      <TrustStatsBar totalIdeas={catalog.totalIdeas} categoryCount={catalog.categories.length} />

      {/* ============================================================
          BBI ADDITION — KEYWORD CATEGORY MOSAIC
         ============================================================ */}
      <KeywordMosaic />

      {/* ============================================================
          BBI ADDITION — 10 NEW SECTIONS + 3 FAQ SECTIONS
          Safe to delete: remove any single line below (and its
          comment), plus that section's matching component appended
          at the very bottom of this file. Each is fully independent
          of the others — deleting one never affects any other.
         ============================================================ */}
      <BrandStatementBanner />
      <MarketGapSection />
      <HowItWorksSection />
      <WhoForSection />
      <PricingPhilosophySection />
      <TeamSection />
      <InspiredBySection />
      <ComparisonSection />
      <FutureProofSpotlight />
      <PromiseSection />
      <Faq1Section />
      <Faq2Section />
      <Faq3Section />

      {/* EDITABLE SECTION END */}
    </SiteShell>
  );
}

/* ================================================================
   BBI ADDITION — SCROLL-TRIGGERED REVEAL
   ================================================================ */

function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
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
      const eased = 1 - Math.pow(1 - progress, 3);
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

/* ================================================================
   BBI ADDITION — SECTION 1: BRAND STATEMENT BANNER
   ================================================================ */

function BrandStatementBanner() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass glass-hover sheen bbi-shape-banner px-6 py-12 sm:px-14 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
          Who we are
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
          BBI — Best Business Ideas.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          We&apos;re not another AI validator charging you by the click. BBI is a free, researched
          library of small business ideas, side hustles, and startup blueprints — built by a team
          who got tired of paying $20 for four &quot;validations&quot; that told us nothing.
          Browse for free. Pay once if you want lifetime access. Never pay monthly for an idea.
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 2: THE MARKET GAP
   ================================================================ */

function MarketGapSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass bbi-shape-diamond p-8 sm:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          The problem we found
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Everyone charges $20 a month. We think that&apos;s the real problem.
        </h2>
        <div className="mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            We went looking for a place to validate business ideas before we built BBI. What we
            found: platform after platform charging a minimum of $20 for three or four
            validations, wrapped in language that made it sound like premium research. It isn&apos;t.
            It&apos;s a wrapper around an AI model call — the same kind of call you can run yourself,
            a thousand times over, for the price of one month of Claude, Gemini, or ChatGPT.
          </p>
          <p>
            We&apos;re engineers. Most of us work full-time at other companies and build BBI on the
            side, because we&apos;ve been the person staring at a $20 paywall with nothing to spend it
            on. So we built the thing we wished existed: a real idea library, free to browse, with
            no per-validation charge — because the validation itself is something anyone can
            already do with tools they may already be paying for.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 3: HOW BBI ACTUALLY WORKS
   ================================================================ */

const BBI_HOW_STEPS = [
  {
    n: "01",
    t: "Browse",
    d: "Search or filter thousands of researched business ideas — by industry, investment level, or who you are: student, retiree, stay-at-home parent, veteran, nurse, teenager, solo founder. All free to read.",
  },
  {
    n: "02",
    t: "Take it anywhere",
    d: "Copy the idea, the category, or the full blueprint. Paste it into Claude, ChatGPT, Gemini, or whatever AI tool you already pay for. Ask it to stress-test the idea against your budget, your city, your skills. You already own that tool — use it.",
  },
  {
    n: "03",
    t: "Go lifetime, once, if you want",
    d: "If BBI's research saves you time, unlock full lifetime access for a one-time fee — no subscription, no renewal, no \"your trial has expired\" email six months from now.",
  },
];

function HowItWorksSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">How it works</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        Grab the idea. Validate it however you want. Keep the money.
      </h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {BBI_HOW_STEPS.map((step) => (
          <div key={step.n} className="glass glass-hover bbi-shape-step p-6">
            <span className="bbi-shape-step-badge glass flex h-12 w-12 items-center justify-center text-sm font-extrabold text-accent">
              {step.n}
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{step.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 4: WHO BBI IS BUILT FOR
   ================================================================ */

function WhoForSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass bbi-shape-soft-deep grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            Who we built this for
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            For the person with an idea and nothing else.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Some of us have been jobless. Some of us have started over with no savings. We know
              what it&apos;s like to have a business idea and no laptop, no capital, no one to ask.
              BBI is for that person — the one Googling &quot;business ideas&quot; from a phone,
              at 1am, hoping something makes sense for their actual life.
            </p>
            <p>
              We&apos;re not writing &quot;start a SaaS and make a million dollars&quot; content
              aimed at people who already have funding. We write for people starting from zero: no
              investment, no team, no connections. If that&apos;s not you — great, we&apos;ve got
              the bigger ideas too. But you were never going to be the only person we wrote for.
            </p>
          </div>
        </div>
        <div className="glass bbi-shape-hex self-start p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Built with you in mind
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Any business idea without investment</li>
            <li>Work from home business opportunity</li>
            <li>Best business to start with little money</li>
            <li>Side hustle & best side job ideas</li>
            <li>Business ideas for teenagers & veterans</li>
            <li>Stay-at-home-mom business ideas</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 5: ONE FEE, LIFETIME ACCESS
   ================================================================ */

function PricingPhilosophySection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass glass-hover bbi-shape-ticket p-8 text-center sm:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Pricing, honestly
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          One fee. Once. For life. That&apos;s the whole pricing page.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          No monthly plan. No &quot;Starter / Pro / Enterprise&quot; ladder designed to make you
          feel small on the cheapest tier. Just one option: pay once, unlock everything, forever —
          including every idea we add after the day you join. Not ready to pay yet? Most of the
          library stays free to browse regardless. We priced it low on purpose — we&apos;re not
          trying to build a subscription business off people who are already struggling to afford
          the idea in the first place.
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 6: THE BBI TEAM
   ================================================================ */

function TeamSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass bbi-shape-card-a p-8 sm:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Who&apos;s behind this
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          11 people. 11 states. One website.
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            BBI isn&apos;t a solo founder&apos;s side project with a fake &quot;team&quot; page.
            It&apos;s built and run by 11 people across 11 Indian states — engineering graduates,
            working professionals at established companies, side hustlers ourselves. Some of us
            work from a shared office; most of us work from home. We met through the same
            communities we built this for.
          </p>
          <p>
            There&apos;s no single point of failure here. Hosting is paid. The work is shared. If
            any one of us steps away, the rest keep it running — that&apos;s the whole point of
            doing this as a team instead of a solo bet.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 7: INSPIRED BY
   ================================================================ */

function InspiredBySection() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-3 sm:px-4">
      <div className="glass bbi-shape-card-a p-8 sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Where this came from
        </p>
        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          We didn&apos;t invent this model. We learned it.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Our inspiration is EthicalFounder.com — a platform offering free websites, free MSME
          registration help, and free mentorship to Indian entrepreneurs who can&apos;t afford any
          of it otherwise. We&apos;re not affiliated with them and we don&apos;t take commissions
          from anyone. We just watched how they operated — help first, ask for nothing, let the
          value speak — and decided BBI should work the same way for business idea research
          specifically.
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 8: BBI VS. THE $20 VALIDATORS
   ================================================================ */

function ComparisonSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
        The comparison
      </p>
      <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
        $20 for four validations. Or one AI subscription that does a thousand.
      </h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="glass bbi-shape-compare-sharp border border-border/60 p-7 opacity-80">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Typical validator platform
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Monthly or per-use fee</li>
            <li>3–5 validations per $20</li>
            <li>Generic, boilerplate output</li>
            <li>Paywall before you see anything real</li>
          </ul>
        </div>
        <div className="glass glass-hover sheen bbi-shape-compare-round border border-primary/40 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            BBI + your own AI tool
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-foreground">
            <li>Browse thousands of researched ideas free</li>
            <li>Pay once for lifetime access, if you want it</li>
            <li>Validate as many times as you want, no artificial limit</li>
            <li>Use an AI subscription you may already have</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 9: FUTURE-PROOF & HIGH-TREND SPOTLIGHT
   ================================================================ */

const BBI_FUTURE_TERMS = [
  { label: "future proof business ideas", query: "future proof" },
  { label: "recession proof businesses", query: "recession proof" },
  { label: "AI startup ideas", query: "AI" },
  { label: "profitable SaaS ideas", query: "SaaS" },
  { label: "high profit businesses", query: "high profit" },
  { label: "million dollar company ideas", query: "million dollar" },
];

function FutureProofSpotlight() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass bbi-shape-diamond p-8 sm:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Where the market is headed
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          The ideas that don&apos;t age out.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These categories hold up regardless of what the economy does next — pulled straight from
          the live library, not a marketing list.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {BBI_FUTURE_TERMS.map((term) => (
            <Link
              key={term.label}
              to="/search"
              search={{ q: term.query }}
              className="glass-hover rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_18px_oklch(0.723_0.161_56/35%)]"
            >
              {term.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — SECTION 10: FREE GUIDANCE, NOT A SALES PITCH
   ================================================================ */

function PromiseSection() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-3 sm:px-4">
      <div className="glass glass-hover bbi-shape-shield p-8 text-center sm:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Our promise
        </p>
        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          We&apos;re not here to sell you a dream. We&apos;re here to hand you the research.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          We won&apos;t tell you that you&apos;ll be a millionaire in three months. We won&apos;t
          show you a lifestyle you can&apos;t verify. What we will do: give you honest research,
          free guidance, and a starting point that doesn&apos;t cost you $20 before you&apos;ve
          even decided if the idea is worth pursuing. If you don&apos;t have money to invest yet —
          that&apos;s exactly who this is for. Come here first. Validate later, wherever you want,
          however you want.
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — FAQ SECTIONS (1 of 3): VALIDATING & USING BBI
   ================================================================ */

const BBI_FAQ_1 = [
  {
    q: "Are these real business ideas or generic AI output?",
    a: "Every entry is researched — a named buyer, real revenue mechanics, honest risks, and a founder-fit verdict, not a one-line suggestion.",
  },
  {
    q: "Do I have to pay to browse?",
    a: "No. Browsing the library is free. Lifetime access is a one-time optional unlock, not a requirement to see ideas.",
  },
  {
    q: "Can I use Claude, ChatGPT, or Gemini alongside BBI?",
    a: "Yes — that's the point. Take any idea from BBI and stress-test it with whatever AI tool you already use.",
  },
  {
    q: "How is this different from an AI idea generator?",
    a: "BBI isn't generating random ideas on the fly. Every entry is pre-researched and published, so what you're reading has already been through a real process, not invented on the spot for you.",
  },
];

function Faq1Section() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-3 sm:px-4">
      <div className="glass bbi-shape-faq1 p-6 sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Validating & using BBI
        </p>
        <div className="mt-5 divide-y divide-border">
          {BBI_FAQ_1.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-semibold text-foreground transition-colors hover:text-primary sm:text-base">
                {item.q}
                <span aria-hidden className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — FAQ SECTIONS (2 of 3): PRICING & THE MARKET GAP
   ================================================================ */

const BBI_FAQ_2 = [
  {
    q: "Why is BBI so much cheaper than other platforms?",
    a: "Because we're not charging per validation. We charge once, if at all, for lifetime access to research — not for AI output you could generate yourself elsewhere.",
  },
  {
    q: "Is there a monthly subscription?",
    a: "No. One fee, once, for life. No renewal, no expiring trial.",
  },
  {
    q: "What does lifetime access actually include?",
    a: "Every current idea, plus every idea added after you join, for as long as BBI exists.",
  },
  {
    q: "Why don't you charge like everyone else does?",
    a: "Because we built this after being the person who couldn't afford what everyone else was charging. That's not a tagline — that's why the pricing looks the way it does.",
  },
];

function Faq2Section() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-3 sm:px-4">
      <div className="glass bbi-shape-faq2 p-6 sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Pricing & the market gap
        </p>
        <div className="mt-5 divide-y divide-border">
          {BBI_FAQ_2.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-semibold text-foreground transition-colors hover:text-primary sm:text-base">
                {item.q}
                <span aria-hidden className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BBI ADDITION — FAQ SECTIONS (3 of 3): LONG-TAIL KEYWORD FAQ
   ================================================================ */

const BBI_FAQ_3 = [
  {
    q: "How do I become an entrepreneur with no experience or capital?",
    a: "Start with research, not spending. Browse ideas that match zero-investment or low-investment models, and validate with a free or low-cost AI tool before committing any money.",
  },
  {
    q: "What businesses are considered recession-proof?",
    a: "Categories tied to essential needs — healthcare, senior and elder care, repair services, essential food and goods — tend to hold up better than discretionary spending categories during downturns.",
  },
  {
    q: "How do I validate a SaaS idea before building it?",
    a: "Talk to potential users first, check if anyone's already solving the problem and how well, and use an AI tool to pressure-test your pricing and market size assumptions before writing code.",
  },
  {
    q: "What is TAM, SAM, and SOM?",
    a: "Total Addressable Market, Serviceable Available Market, and Serviceable Obtainable Market — three shrinking circles that estimate the whole possible market, the part you could realistically reach, and the part you could realistically capture.",
  },
  {
    q: "What are good home business ideas for working parents?",
    a: "Look for models with flexible hours and low daily time commitment — coaching, tutoring, subscription-box curation, or service businesses that can run around an existing job or childcare schedule.",
  },
  {
    q: "Why do most startups fail?",
    a: "Most commonly: building something nobody was asking for, running out of money before finding paying customers, or misjudging how much competition already exists in the space.",
  },
];

function Faq3Section() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-3 pb-16 sm:px-4">
      <div className="glass bbi-shape-faq3 p-6 sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Common searches, answered
        </p>
        <div className="mt-5 divide-y divide-border">
          {BBI_FAQ_3.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-semibold text-foreground transition-colors hover:text-primary sm:text-base">
                {item.q}
                <span aria-hidden className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
