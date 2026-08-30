import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell } from "@/components/site-shell";
import { CategoryBadge } from "@/components/category-badge";
import { AdSlot } from "@/components/AdSlot";
import { HeroSlider, Typewriter } from "@/components/hero-slider";
import { HeroField } from "@/components/hero-field";
import { BusinessIcons } from "@/components/business-icons";
import { WaveText } from "@/components/wave-text";
import { Reveal } from "@/components/reveal";
import { CardFan } from "@/components/card-fan";
import { Spotlight } from "@/components/spotlight";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FEATURED_IDEA_IDS } from "@/config/featured";
import {
  catalogQuery,
  getFeaturedIdeas,
  getSurpriseIdeas,
  getTrendingIdeas,
} from "@/lib/ideas.functions";
import { DemandBoard } from "@/components/demand-board";
import type { CategoryNode } from "@/lib/ideas.functions";
import { hideImgIfBroken } from "@/lib/utils";
import { AccordionItem } from "@/components/accordion-item";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";
import { Odometer, useMagnet, useScrollProgress, useStaggerReveal, useTextReveal } from "@/motion";

/**
 * Hero's primary CTA — spotlight glow behind a pill, plus the page's single
 * magnet (MOTION_SPEC §2.4: one per page, on the most important CTA).
 *
 * The pill hover/press tween that used to sit on this element was removed
 * rather than left in place: `useMagnet` writes `transform` directly on every
 * pointer frame and the pill tween writes `transform` through gsap, so the two
 * would overwrite each other and the CTA would lose its hover scale the moment
 * the cursor moved. One writer per transform is the rule the motion system
 * exists to enforce; every other pill on the page keeps its tween untouched.
 */
function HeroCta() {
  const magnetRef = useMagnet<HTMLAnchorElement>();
  return (
    <Spotlight className="inline-block justify-self-start rounded-full">
      <Link
        to="/browse"
        className="glass-pill inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.18em]"
        ref={magnetRef}
      >
        Browse the library
      </Link>
    </Spotlight>
  );
}

/** Split live categories evenly across 4 marquee rows (works for 9 or 100+). */

/**
 * PROJECT_BRIEF.md Section 8.1 — the homepage's primary engagement hook.
 * Powered by the same random-pull logic as Section 9 (ORDER BY random()
 * LIMIT n at the query level via get_random_ideas), not client shuffling.
 */
function SurpriseMeSection({ categories }: { categories: CategoryNode[] }) {
  const [categorySlug, setCategorySlug] = useState("");
  const run = useServerFn(getSurpriseIdeas);
  const surprise = useMutation({
    mutationFn: () => run({ data: { categorySlug: categorySlug || undefined, count: 5 } }),
  });
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Results appear via a mutation, not a scroll — Reveal's rv-wipe variant
  // is ScrollTrigger-driven and doesn't fit here, so this fires the same
  // clip-path wipe directly on the mutation succeeding instead.
  useEffect(() => {
    const el = resultsRef.current;
    if (!surprise.data || !el || prefersReducedMotion()) return;
    loadGsap().then((gsap) => {
      if (!resultsRef.current) return;
      gsap.fromTo(
        resultsRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0.5 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.7, ease: "power3.out" },
      );
    });
  }, [surprise.data]);

  return (
    <section
      id="surprise-me"
      data-anchor="surprise-me"
      data-anchor-label="Surprise Me"
      className="mx-auto mt-10 max-w-6xl px-3 sm:px-4"
    >
      <div className="glass glass-hover bbi-card-motion rounded-3xl px-6 py-8 sm:px-10 sm:py-10">
        <p className="t-eyebrow">Surprise me</p>
        <h2 className="mt-3">Pick a category, or don&apos;t. We&apos;ll surprise you.</h2>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Select
            value={categorySlug || "any"}
            onValueChange={(v) => setCategorySlug(v === "any" ? "" : v)}
          >
            <SelectTrigger aria-label="Category">
              <SelectValue placeholder="Any category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any category</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.categorySlug} value={c.categorySlug}>
                  {c.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => surprise.mutate()}
            disabled={surprise.isPending}
            className="sheen rounded-full bg-gradient-to-r from-primary to-ember px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-all duration-300 hover:scale-105 disabled:cursor-wait disabled:opacity-70"
          >
            {surprise.isPending ? "Picking…" : "Surprise Me"}
          </button>
        </div>

        {surprise.isError && (
          <p className="mt-5 text-sm text-destructive">
            Could not pull ideas right now. Try again.
          </p>
        )}

        {surprise.data && surprise.data.length > 0 && (
          <div ref={resultsRef} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {surprise.data.map((idea) => (
              <IdeaCard key={idea.ideaId} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

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
    title: "A library built to scale, not to sit still.",
    body: "Organized across categories from Tech and SaaS to Creator and Media, FinTech, E-Commerce and more. Every new category added to the database appears here automatically.",
  },
  {
    title: "Validation is free, and there is no limit on it.",
    body: "Every blueprint has a Validate button. Tap it, and get real research on your idea — market size, your ideal buyer, the money model, and the risks — free, using AI tools you already pay for. No extra cost. No limit.",
  },
];

/** Hero content panels. */
const HERO_PANELS = [
  {
    label: "What you get",
    body: "Every idea here comes with four honest things: who will actually buy from you, how the money really works, the painful risks people find out too late, and a straight answer — build it, or walk away. This is not a list. This is the research you wish someone gave you before you spent your time or money.",
  },
  {
    label: "How it works",
    body: "Browse any category. Read the full blueprint. If it feels right, tap Validate — and get real research on your idea for free, using AI tools you already pay for. No extra charge. No monthly limit. Free to browse. Free to validate, again and again.",
  },
];

/** General closing FAQ. */
const FAQS = [
  {
    q: "Are these real business ideas or just inspiration?",
    a: "Every entry is a researched blueprint, not a topic suggestion. Each one covers what the business actually does day to day, who the specific customer is, how money changes hands, what the realistic obstacles are, and a direct verdict on founder fit. You can evaluate any idea in under ten minutes.",
  },
  {
    q: "Is the whole library free?",
    a: "Yes. Every blueprint is free to read, start to finish. Validating an idea is free too — you use AI tools you already pay for, so it costs you nothing extra, ever.",
  },
  {
    q: "How are trend scores calculated?",
    a: "Each idea receives a trend score based on current market demand signals for that specific micro-niche, not the broader category. A high score indicates strong current momentum.",
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
    a: "Yes. Find the closest matching idea and tap Validate. You'll get real research — market size, competitors, and a launch plan — shaped around your own version of the idea, at no extra cost.",
  },
];

const featuredQuery = queryOptions({
  queryKey: ["featured", FEATURED_IDEA_IDS],
  queryFn: () => getFeaturedIdeas({ data: { ideaIds: FEATURED_IDEA_IDS } }),
});

// Ordered by the live `trend_score` column, so unlike `featuredQuery` above --
// which reads a hand-maintained list of ids -- this moves on its own as the
// data moves.
const trendingQuery = queryOptions({
  queryKey: ["trending"],
  queryFn: () => getTrendingIdeas(),
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      context.queryClient.ensureQueryData(featuredQuery),
      context.queryClient.ensureQueryData(trendingQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "BBI — Bro Business Ideas | Researched Startup Blueprints" },
      {
        name: "description",
        content:
          "BBI (Bro Business Ideas) — researched small business ideas, startup blueprints, and work from home business opportunities. Every idea includes market context, pros, cons, a trend score, and a straight founder-fit verdict.",
      },
      {
        property: "og:title",
        content: "BBI — Bro Business Ideas | Researched Startup Blueprints",
      },
      {
        property: "og:description",
        content:
          "Bro Business Ideas (BBI) — researched small business ideas, startup blueprints, and work from home business opportunities, with market context, pros, cons, trend scores and founder-fit verdicts.",
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
  const { data: highlights } = useSuspenseQuery(featuredQuery);
  const { data: trending } = useSuspenseQuery(trendingQuery);
  const featured = highlights.slice(0, 6);

  // MOTION_SPEC §2.3 — exactly one headline reveal per page, and it is the H1.
  const h1Ref = useTextReveal<HTMLHeadingElement>();
  // Card rows that previously arrived as one block now arrive in sequence.
  const heroPanelsRef = useStaggerReveal<HTMLDivElement>();
  const featuredRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.05 });
  const editorialRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.08 });
  const scrollPanelsRef = useStaggerReveal<HTMLElement>({ stagger: 0.08 });
  // Publishes --sc-p across the editorial section so its ambient wash layers
  // (and only those — never the type) can drift via .mo-drift.
  const editorialSectionRef = useScrollProgress<HTMLElement>();

  return (
    <SiteShell>
      {/* AMBIENT TWIN RINGS — midnight-blue + rotating palette, hollow bands */}
      <div className="bbi-twin-ring ring-1" aria-hidden />
      <div className="bbi-twin-ring ring-2" aria-hidden />

      {/* LLM crawlable summary */}
      <p className="sr-only">
        BBI (Bro Business Ideas) is a business idea directory and startup intelligence library. This
        resource covers small business ideas, work from home business ideas, low investment startup
        ideas, business ideas for women, zero investment business ideas, and startup ideas organized
        by sector, investment level, and founder profile.
      </p>

      {/* HERO */}
      <section
        id="hero"
        data-anchor="hero"
        data-anchor-label="Top"
        className="bbi-field-host px-3 pt-10 pb-6 sm:px-4 sm:pt-16"
      >
        {/* The field IS the hero background. `.bbi-hero-open` drops the panel's
            backdrop-blur, which was blurring the 2px particles into nothing and
            leaving the field visible only in a thin strip around the card. */}
        <HeroField className="bbi-field" />
        <div className="mx-auto max-w-6xl">
          <div className="glass bbi-hero-open blob-1 px-6 py-14 sm:px-12 sm:py-20">
            <p className="t-eyebrow sm:text-xs">
              <Typewriter text="The Truth About Business Ideas" />
            </p>
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
              <div>
                <h1
                  ref={h1Ref}
                  className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
                >
                  <WaveText>
                    Tired of paying just to check if your{" "}
                    <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
                      idea will work
                    </span>
                    ?
                  </WaveText>
                </h1>
                <p data-wave className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  We built a free home for real business ideas — side hustles, zero investment
                  ideas, work from home ideas, and low investment ideas. Every idea is researched,
                  not guessed. We tell you who will actually pay you, how the money works, and what
                  will hurt you in year one. Then we give it to you straight — build it, or walk
                  away. Browse for free. Validate as many times as you want. Pay only once, if you
                  ever want full access.
                </p>

                {/* Quick-action row, styled after the reference: a plain frosted
                search-style bar plus a rotating-color CTA pill, sitting
                inline the way "Search..." and "Button" sit in the reference
                image. Nothing else on the page changes structurally. */}
                <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,24rem)_auto] sm:items-center">
                  <Link
                    to="/search"
                    search={{ q: "" }}
                    className="glass flex min-w-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted-foreground"
                  >
                    <span aria-hidden>⌕</span>
                    <span>Search idea blueprints…</span>
                  </Link>
                  <HeroCta />
                </div>
              </div>
              <div className="iv-fade-up" style={{ animationDelay: "540ms" }}>
                <HeroSlider />
              </div>
            </div>

            <div ref={heroPanelsRef} className="mt-10 grid gap-4 sm:grid-cols-2">
              {HERO_PANELS.map((panel, i) => (
                <div
                  key={panel.label}
                  className={`glass glass-hover ${i === 0 ? "blob-sm-1" : "blob-sm-2"} px-6 py-7`}
                >
                  <h3 className="t-card">{panel.label}</h3>
                  <p className="t-lead mt-2.5">{panel.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SURPRISE ME — Section 8.1, directly below the hero, before any other content */}
      <SurpriseMeSection categories={catalog.categories} />

      {/* Live demand board. Renders nothing at all if no idea in the set
          carries a trend score, rather than showing an empty frame. */}
      <DemandBoard ideas={trending} />

      {/* BRAND ARC — the four founder-generated frames. Every category name
          rendered over them is live DOM from the catalog, never baked pixels. */}

      {/* MOVING CATEGORY TICKER — each pill now rotates through the brand's
          multi-color set by default (see .glass-pill in globals.css), and
          resolves to a light fill + midnight-blue glow + black text on hover. */}
      <section
        id="categories"
        data-anchor="categories"
        data-anchor-label="Browse by category"
        className="pt-10"
        aria-label="Browse by category"
      >
        <style>{`@keyframes iv-ticker-l{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes iv-ticker-r{from{transform:translateX(-50%)}to{transform:translateX(0)}}.iv-ticker-track{width:max-content;animation:iv-ticker-l 70s linear infinite}.iv-ticker-track.rev{animation-name:iv-ticker-r}.iv-ticker:hover .iv-ticker-track,.iv-ticker:active .iv-ticker-track{animation-play-state:paused}`}</style>
        <p className="mx-auto max-w-6xl px-3 t-eyebrow sm:px-4">Browse by category</p>
        {/* Business-model icons, bobbing on staggered offsets — the movement
            from the approved design. Full-bleed, masked at both edges. */}
        <BusinessIcons />
        <div className="iv-ticker mt-4 grid gap-3">
          {tickerRows(catalog.categories).map((row, rowIndex) => {
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
                      className="glass-pill shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300"
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

      {/* SECTION 1: INTERACTIVE GOLDEN TREE */}
      <GoldenTreeSection categories={catalog.categories} />

      <div className="px-3 pt-8 sm:px-4">
        <AdSlot position="homepage-hero-below" size="banner" />
      </div>

      {/* BRAND STATEMENT */}
      <Reveal variant="rv-lift">
        <BrandStatementBanner />
      </Reveal>

      {/* KEYWORD MOSAIC */}
      <Reveal variant="rv-lift">
        <KeywordMosaic />
      </Reveal>

      {/* TRUST STRIP */}
      <Reveal variant="rv-lift">
        <TrustStatsBar totalIdeas={catalog.totalIdeas} categoryCount={catalog.categories.length} />
      </Reveal>

      {/* MARKET GAP + orbit #1 */}
      <MarketGapSection />

      {/* SECTION 3: THE BBI 4-PILLAR BLUEPRINT STANDARD */}
      <FourPillarStandardSection />

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-3 py-16 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="t-eyebrow">Featured blueprints</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Blueprints worth your afternoon
            </h2>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
          >
            Browse the full library →
          </Link>
        </div>
        <div ref={featuredRef} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((idea) => (
            <IdeaCard key={idea.ideaId} idea={idea} />
          ))}
        </div>
      </section>

      <div className="px-3 pb-8 sm:px-4">
        <AdSlot position="homepage-featured-below" size="banner" />
      </div>

      {/* WHY THIS EXISTS — sticky-aside editorial grammar.
          A third device, not the stagger and not the pin: the sidebar holds
          position while the prose scrolls past it, and its four rows
          illuminate in turn as the reader moves down. Driven entirely from
          --sc-p in CSS, so there is no extra React state and every frame maps
          to a real scroll position. */}
      <section className="bbi-editorial mx-auto max-w-6xl px-3 pb-10 sm:px-4">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="t-eyebrow">Why this exists</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              A list of ideas is not research. And it can cost you money.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Most &quot;100 business ideas&quot; pages are written in one afternoon by someone
                who never actually sold anything. They just say &quot;the market is growing&quot;
                and stop there. Finding an idea was never the hard part. The hard part is knowing
                who will really pay you, how often, and what happens when a bigger company copies
                you for free.
              </p>
              <p>
                That is why every blueprint here answers those questions first. We name your exact
                customer. We show you the real numbers. We tell you the risks most people only find
                out after they&apos;ve already spent their money.
              </p>
              <p>
                Sometimes the honest answer is: don&apos;t build this one. That&apos;s the whole
                point. Research that only ever agrees with you isn&apos;t research — it&apos;s
                marketing wearing a lab coat.
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

          <aside className="bbi-editorial-aside glass blob-3 p-6 sm:p-8 lg:mt-16 lg:self-start">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              What every entry has to contain
            </h3>
            <dl className="mt-6 divide-y divide-border">
              {[
                {
                  t: "A named buyer",
                  d: 'Not "small businesses." The real person, their budget, and why they need this now.',
                },
                {
                  t: "Working money mechanics",
                  d: "What you charge, what it costs you, and the point where this stops being a side job and becomes a real business.",
                },
                {
                  t: "The unglamorous risks",
                  d: "The platform risks, slow seasons, and the competitor who's already halfway there.",
                },
                {
                  t: "A founder-fit verdict",
                  d: "Who should build this — and who should walk away.",
                },
              ].map((row) => (
                <div key={row.t} className="bbi-editorial-row py-4 first:pt-0 last:pb-0">
                  <dt className="text-sm font-semibold text-foreground">{row.t}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{row.d}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* EDITORIAL IMAGE TRIO — image slots (.mo-media), and the only ambient
          layers on this page that .mo-drift can actually reach: the twin rings
          and the orbit rings both run keyframe animations that own `transform`
          outright, so a class-level drift can never apply to them. */}
      <section ref={editorialSectionRef} className="mx-auto max-w-6xl px-3 pb-16 sm:px-4">
        <div ref={editorialRef} className="grid gap-6 sm:grid-cols-3 sm:items-start">
          {EDITORIAL_IMAGES.map((img) => (
            <figure
              key={img.src}
              className={`mo-media glass relative ${img.blob} ${img.offset} aspect-[3/4]`}
              style={{ transform: `rotate(${img.tilt}deg)` }}
            >
              <img
                ref={hideImgIfBroken}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              {/* Inset past the frame by more than the drift travel so the
                  wash never exposes an untinted strip at either edge. */}
              <span
                aria-hidden
                className="mo-drift pointer-events-none absolute -inset-6 bg-gradient-to-br from-primary to-ember opacity-15"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS + orbit #2 + Faq1 inline */}
      <Reveal variant="rv-lift">
        <HowItWorksSection />
      </Reveal>

      {/* WHO FOR */}
      <Reveal variant="rv-lift">
        <WhoForSection />
      </Reveal>

      {/* SCROLL-STACK — one stagger on the row, replacing four different
          per-card reveal variants (the "four dialects" MOTION_SPEC exists to
          collapse). The panel divs are now the grid items directly, which is
          the same box the Reveal wrapper used to occupy. */}
      <section
        ref={scrollPanelsRef}
        className="mx-auto mt-16 grid max-w-6xl gap-4 px-3 pb-16 sm:grid-cols-2 sm:px-4"
      >
        {SCROLL_PANELS.map((panel, i) => (
          <div
            key={panel.title}
            className={`mo-card glass glass-hover h-full p-5 sm:p-7 ${["blob-2", "blob-4", "blob-5", "blob-6"][i]}`}
          >
            <h2 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl">
              {panel.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {panel.body}
            </p>
          </div>
        ))}
      </section>

      {/* PRICING PHILOSOPHY + Faq2 inline */}
      <Reveal variant="rv-lift">
        <PricingPhilosophySection />
      </Reveal>

      {/* WHY WE BUILT THIS */}
      <Reveal variant="rv-lift">
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
      </Reveal>

      {/* TEAM + orbit #3 */}
      <Reveal variant="rv-lift">
        <TeamSection />
      </Reveal>

      <Reveal variant="rv-lift">
        <InspiredBySection />
      </Reveal>
      <Reveal variant="rv-lift">
        <ComparisonSection />
      </Reveal>
      <Reveal variant="rv-lift">
        <FutureProofSpotlight />
      </Reveal>

      {/* PROMISE + Faq3 inline */}
      <Reveal variant="rv-lift">
        <PromiseSection />
      </Reveal>

      {/* GENERAL CLOSING FAQ */}
      <section className="mx-auto mt-20 max-w-4xl border-t border-border/60 px-3 pt-16 pb-24 sm:mt-28 sm:px-4 sm:pt-20">
        <p className="t-eyebrow">Common questions</p>
        <div className="mt-6 divide-y divide-border">
          {FAQS.map((item) => (
            <AccordionItem key={item.q} question={item.q} answer={item.a} size="base" />
          ))}
        </div>
      </section>

      <div className="px-3 pb-10 sm:px-4">
        <AdSlot position="homepage-above-footer" size="banner" />
      </div>
    </SiteShell>
  );
}

/* ================================================================
   SECTION 1: INTERACTIVE GOLDEN TREE (CURVED LIQUID CAPSULES)
   ================================================================ */

// The only two tree asset URLs in the app — do not add or swap in others.
const DESKTOP_TREE_SRC =
  "https://ethicalfounder.com/wp-content/uploads/2026/08/business-ideas-tree-for-startup-invention-low-cost-business-ideas-latest-zero-investement.jpg";
const MOBILE_TREE_SRC =
  "https://ethicalfounder.com/wp-content/uploads/2026/08/new-business-ideas-tree-for-small-and-low-upfront-business-or-startups.svg";

function GoldenTreeSection({ categories }: { categories: CategoryNode[] }) {
  // Real blueprint counts, straight from the live catalog. This block used to
  // render a sine wave over hardcoded bases, labelled "weekly web searches" —
  // figures that were never sourced from anything. A node whose category is
  // not in the catalog renders no number at all rather than inventing one.
  const countBySlug = new Map(categories.map((c) => [c.categorySlug, c.ideaCount]));
  const countFor = (slug: string) => countBySlug.get(slug) ?? null;

  const fmt = (n: number | null) =>
    n === null ? "" : `${n} researched blueprint${n === 1 ? "" : "s"}`;

  const desktopNodes = [
    {
      label: "Zero Investment Ideas",
      slug: "zero-investment-business-ideas",
      x: 28,
      y: 18,
      d: 0,
      count: countFor("zero-investment-business-ideas"),
    },
    {
      label: "Work From Home Ideas",
      slug: "work-from-home-business-ideas",
      x: 50,
      y: 12,
      d: 0.6,
      count: countFor("work-from-home-business-ideas"),
    },
    {
      label: "Low Investment Ideas",
      slug: "low-investment-business-ideas",
      x: 72,
      y: 20,
      d: 1.2,
      count: countFor("low-investment-business-ideas"),
    },
    {
      label: "Side Hustle Ideas",
      slug: "side-hustle-ideas",
      x: 20,
      y: 38,
      d: 1.8,
      count: countFor("side-hustle-ideas"),
    },
    { label: "Tech & SaaS", slug: "tech-saas", x: 42, y: 32, d: 2.4, count: countFor("tech-saas") },
    {
      label: "FinTech & Finance",
      slug: "fintech-finance",
      x: 60,
      y: 34,
      d: 3.0,
      count: countFor("fintech-finance"),
    },
    {
      label: "E-Commerce & Retail",
      slug: "ecommerce-retail",
      x: 80,
      y: 40,
      d: 3.6,
      count: countFor("ecommerce-retail"),
    },
    {
      label: "Creator & Media",
      slug: "creator-media",
      x: 30,
      y: 55,
      d: 4.2,
      count: countFor("creator-media"),
    },
    {
      label: "Health & Fitness",
      slug: "health-fitness",
      x: 70,
      y: 56,
      d: 4.8,
      count: countFor("health-fitness"),
    },
    {
      label: "Validation Center",
      path: "/browse",
      x: 50,
      y: 52,
      isCenter: true,
      d: 5.4,
      count: null,
    },
  ];

  return (
    <section
      id="golden-tree"
      data-anchor="golden-tree"
      data-anchor-label="Golden Tree"
      className="mx-auto mt-12 sm:mt-16 max-w-6xl px-3 sm:px-4"
    >
      <div className="text-center max-w-3xl mx-auto">
        <p className="t-eyebrow">Interactive Canopy Map</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
          The Golden Tree of Business Growth
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
          Tap or hover any leaf node to see how many researched blueprints that category holds right
          now, then open the ones behind it.
        </p>
      </div>

      {/* No boxed/16:9 backdrop element here on purpose — the dark glow behind the
          tree lives entirely in .tree-asset-container::before in styles.css, as a
          large, heavily-blurred radial glow with no hard edge or rectangle. */}
      <Reveal
        variant="rv-zoom"
        className="relative mt-8 sm:mt-12 flex w-full items-center justify-center py-10 sm:py-16"
      >
        {/* DESKTOP TREE ASSET — this is a hotlinked cross-origin JPG (lives on
            ethicalfounder.com, not our domain), so any technique that needs
            to read its actual pixel data (a CSS mask-image, an SVG luminance
            filter) is blocked by the browser unless that domain sends CORS
            headers, which it doesn't — the previous attempt at this made the
            whole tree invisible. mix-blend-mode is a pure rendering
            composite, not a pixel read, so it's the only cross-origin-safe
            option here; see .tree-asset-container img in styles.css. */}
        <div className="hidden sm:block relative w-full max-w-5xl aspect-[16/9] group tree-asset-container">
          <img
            ref={hideImgIfBroken}
            src={DESKTOP_TREE_SRC}
            alt="The Golden Tree of Business Growth"
            fetchPriority="high"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_35px_rgba(27,42,107,0.35)] transition-all duration-700 group-hover:drop-shadow-[0_15px_50px_rgba(27,42,107,0.5)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          {desktopNodes.map((node) => (
            <div
              key={node.label}
              className="bbi-tree-node-d absolute group/node z-20"
              style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${node.d}s` }}
            >
              {node.slug ? (
                <CategoryBadge slug={node.slug} label={node.label} dot />
              ) : (
                <CategoryBadge to={node.path ?? "/browse"} label={node.label} dot />
              )}

              <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap glass rounded-md px-2.5 py-1 text-[10px] font-semibold shadow-xl">
                {fmt(node.count)}
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE TREE ASSET — same cross-origin constraint as desktop, so no
            mask-image here either. Organic floating liquid capsules for the
            node pills below. */}
        <div className="block sm:hidden relative w-full max-w-xs aspect-[9/16] tree-asset-container">
          <img
            ref={hideImgIfBroken}
            src={MOBILE_TREE_SRC}
            alt="The Golden Tree of Business Growth (Mobile)"
            fetchPriority="high"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_25px_rgba(27,42,107,0.35)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          {/* Nodes sit on the canopy at organic coordinates (not a vertical list). */}
          <div className="absolute inset-0 z-20">
            {[
              {
                label: "Zero Investment",
                slug: "zero-investment-business-ideas",
                x: 30,
                y: 14,
                d: 0,
              },
              {
                label: "Work From Home",
                slug: "work-from-home-business-ideas",
                x: 70,
                y: 24,
                d: 0.8,
              },
              {
                label: "Low Investment",
                slug: "low-investment-business-ideas",
                x: 26,
                y: 36,
                d: 1.6,
              },
              { label: "Side Hustle", slug: "side-hustle-ideas", x: 68, y: 47, d: 2.4 },
              { label: "Validation Center", path: "/browse", x: 48, y: 60, d: 3.2 },
            ].map((mNode) => (
              <div
                key={mNode.label}
                className="bbi-tree-node-m"
                style={{ left: `${mNode.x}%`, top: `${mNode.y}%`, animationDelay: `${mNode.d}s` }}
              >
                {mNode.path ? (
                  <CategoryBadge to={mNode.path} label={mNode.label} size="sm" dot />
                ) : (
                  <CategoryBadge
                    slug={mNode.slug ?? ""}
                    // The count rides inside the pill. It used to live in a
                    // second grid of cards below the artwork that repeated all
                    // four of these labels verbatim — the same topics printed
                    // twice, on the screen with the least room for it.
                    // Desktop shows the count in a hover tooltip; a phone has
                    // no hover, so it belongs here.
                    label={
                      countFor(mNode.slug ?? "") === null
                        ? mNode.label
                        : `${mNode.label} · ${countFor(mNode.slug ?? "")}`
                    }
                    size="sm"
                    dot
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================================================================
   SECTION 2: LIVE CATEGORY SEARCH DEMAND TRACKER
   ================================================================ */

/* ================================================================
   SECTION 3: THE BBI 4-PILLAR BLUEPRINT STANDARD
   ================================================================ */

function FourPillarStandardSection() {
  const tilesRef = useStaggerReveal<HTMLDivElement>();
  const pillars = [
    {
      num: "01",
      title: "Named Buyer",
      desc: "Exactly who will pay you, and why they have money ready right now.",
    },
    {
      num: "02",
      title: "Unit Economics",
      desc: "Simple numbers on price, cost, and when you actually start making profit.",
    },
    {
      num: "03",
      title: "1st-Year Risks",
      desc: "The hidden costs and traps that quietly kill new businesses.",
    },
    {
      num: "04",
      title: "Founder-Fit Verdict",
      desc: "An honest answer: should you build this, or walk away?",
    },
  ];

  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:mt-24 sm:px-4">
      <div className="mx-auto max-w-2xl text-center">
        <p className="t-eyebrow">The Research Standard</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
          Not just a list. Real research you can trust.
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Before you spend a rupee or a weekend, check these 4 things on every idea.
        </p>
      </div>

      <div ref={tilesRef} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => (
          <div
            key={pillar.num}
            className="glass bbi-card-motion flex flex-col rounded-2xl border border-border p-6"
          >
            <span className="text-xs font-extrabold tracking-widest text-accent">{pillar.num}</span>
            <h3 className="mt-2 text-base font-bold text-foreground">{pillar.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pillar.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/browse"
          className="glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-[0.18em]"
        >
          <span>Explore All Categories</span>
        </Link>
      </div>
    </section>
  );
}

/* ================================================================
   DYNAMIC ROTATING DISCOVERY TOAST
   ================================================================ */

/* ================================================================
   SHARED SUBCOMPONENTS — NO NOISY CENTER BALLS
   ================================================================ */

function OrbitDiagram({
  centerLabel,
  centerSub,
  nodes,
}: {
  centerLabel: string;
  centerSub: string;
  nodes: string[];
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`bbi-orbit-wrap${live ? " is-live" : ""}`}
      role="img"
      aria-label={`${centerLabel}: ${nodes.join(", ")}`}
    >
      <div className="bbi-orbit-ring bbi-orbit-ring-outer" />
      <div className="bbi-orbit-ring bbi-orbit-ring-inner" />
      <div className="bbi-orbit-center">
        <span className="bbi-orbit-center-label">{centerLabel}</span>
        <span className="bbi-orbit-center-sub">{centerSub}</span>
      </div>
      <div className="bbi-orbit-rotor">
        {nodes.map((label, i) => {
          const angle = (360 / nodes.length) * i - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 40 * Math.cos(rad);
          const y = 50 + 40 * Math.sin(rad);
          return (
            <div
              key={label}
              className="bbi-orbit-node"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${i * 110}ms`,
              }}
            >
              <span className="bbi-orbit-node-bob" style={{ animationDelay: `${i * 240}ms` }}>
                <span className="bbi-orbit-node-inner">
                  <span className="bbi-orbit-dot" aria-hidden />
                  <span className="bbi-orbit-node-label">{label}</span>
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrandStatementBanner() {
  // Publishes --sc-p, which the morphing silhouette below reads. The shape is
  // the only thing that moves here — the copy itself never shifts, because
  // this is the one block on the page people actually stop and read.
  const morphRef = useScrollProgress<HTMLElement>();
  return (
    <section ref={morphRef} className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass glass-hover bbi-card-motion bbi-shape-banner bbi-morph-host relative overflow-hidden px-6 py-12 sm:px-14 sm:py-16">
        <span className="bbi-morph-shape" aria-hidden />
        <p className="t-eyebrow">Who we are</p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
          BBI — Bro Business Ideas.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          We have been where you are. We paid for those $20 &quot;validation&quot; platforms too. We
          got a few generic lines back, spent our money, and got nothing real in return. When we
          asked for help, no one answered. That hurt. So we built the thing we needed back then — a
          free, honest library of small business ideas and side hustles, with real research, not
          empty hype. Browse for free, always. Validate as many times as you want, at no extra cost.
          Pay once — ₹199 for 3 months or ₹399 for life — only if you want full access. Never a
          monthly bill.
        </p>
      </div>
    </section>
  );
}

function TrustStatsBar({
  totalIdeas,
  categoryCount,
}: {
  totalIdeas: number;
  categoryCount: number;
}) {
  const statsRef = useStaggerReveal<HTMLDivElement>();
  // MOTION_SPEC §4 — the odometer runs on the ONE figure with a real source
  // behind it (catalog.totalIdeas, straight from loader data). The other two
  // tiles are not loader values, so they are plain text: a number with no live
  // source gets no counter and no animation.
  const stats = [
    {
      value: totalIdeas,
      live: true,
      label: "Researched blueprints",
      note: `Across ${categoryCount} live categories, growing every week`,
      shape: "bbi-shape-stat-1",
    },
    {
      value: 967,
      live: false,
      label: "Founders reviewed us",
      note: "Reviewed BBI's structure and functionality before we shipped it",
      shape: "bbi-shape-stat-2",
    },
    {
      value: 2,
      live: false,
      label: "Simple pricing plans",
      note: "₹199 for 3 months, ₹399 for life. Pay once. No surprise bills, ever.",
      shape: "bbi-shape-stat-3",
    },
  ];
  return (
    <div ref={statsRef} className="mx-auto mt-8 grid max-w-6xl gap-4 px-3 sm:grid-cols-3 sm:px-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`mo-card glass glass-hover ${stat.shape} px-6 py-7 text-center sm:text-left`}
        >
          <p className="text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            {stat.live ? (
              <Odometer value={stat.value} format={(n) => `${Math.round(n)}+`} />
            ) : (
              stat.value
            )}
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

function MarketGapSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <Reveal>
        <div className="glass glass-hover bbi-shape-diamond grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="t-eyebrow">The problem we found</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Why is everyone still charging you $20 to check one idea?
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Before we built BBI, we went looking for a place to check our own business ideas.
                Every place we found charged at least $20 for three or four &quot;validations.&quot;
                It sounded like deep research. It wasn&apos;t. It was research you could run
                yourself, a hundred times over, with AI tools you already pay for.
              </p>
              <p>
                We are regular people. Most of us have full-time jobs and build BBI at night and on
                weekends, because we know what it feels like to stare at a $20 paywall with nothing
                left to spend. So we built the thing we wished someone had built for us.
              </p>
            </div>
          </div>
          <OrbitDiagram
            centerLabel="BBI"
            centerSub="Free library"
            nodes={["Named buyer", "Money mechanics", "Real risks", "Founder verdict"]}
          />
        </div>
      </Reveal>
    </section>
  );
}

const BBI_HOW_STEPS = [
  {
    n: "01",
    t: "Browse",
    d: "Search or filter researched business ideas — by industry, investment level, or who you are: student, retiree, stay-at-home parent, veteran, nurse, teenager, solo founder. All free to read.",
  },
  {
    n: "02",
    t: "Validate it, free",
    d: "Tap Validate on any idea and get real research on it — free, using AI tools you already pay for. No extra cost, every time.",
  },
  {
    n: "03",
    t: "₹199 for 3 months, or ₹399 for life",
    d: "Sign in with Google to unlock full blueprints and the Validate button. ₹199 gets you 3 months, ₹399 gets you lifetime access — no subscription, no renewal.",
  },
];

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
    q: "Is there a limit on how many ideas I can validate?",
    a: "No. Validation is free and unlimited — it costs you nothing extra, using AI tools you already pay for.",
  },
  {
    q: "How is this different from an AI idea generator?",
    a: "BBI isn't generating random ideas on the fly. Every entry is pre-researched and published, so what you're reading has already been through a real process, not invented on the spot for you.",
  },
];

function HowItWorksSection() {
  const stepsRef = useStaggerReveal<HTMLDivElement>();
  // Second depth beat on the page, far enough below ComparisonSection that the
  // two read as rhythm rather than as the whole page drifting.
  const depthRef = useScrollProgress<HTMLElement>();
  return (
    <section ref={depthRef} className="bbi-depth mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="bbi-depth-back">
          <OrbitDiagram
            centerLabel="Your idea"
            centerSub="Start here"
            nodes={["Browse", "Take it anywhere", "Go lifetime"]}
          />
        </div>
        <div className="bbi-depth-front">
          <p className="t-eyebrow">Step by step</p>
          <h2 className="mt-3">Grab the idea. Validate it however you want. Keep the money.</h2>
          <div ref={stepsRef} className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {BBI_HOW_STEPS.map((step) => (
              <div key={step.n} className="mo-card glass glass-hover bbi-shape-step flex gap-4 p-6">
                <span className="bbi-shape-step-badge glass flex h-11 w-11 shrink-0 items-center justify-center text-sm font-extrabold text-accent">
                  {step.n}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{step.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass bbi-shape-faq1 mt-10 p-5 sm:p-7">
        <p className="t-eyebrow">Validating & using BBI</p>
        <div className="mt-5 divide-y divide-border">
          {BBI_FAQ_1.map((item) => (
            <AccordionItem key={item.q} question={item.q} answer={item.a} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The six phrases in the right-hand card are real search queries, and they are
 * kept word-for-word on purpose — that is the whole point of them being here.
 *
 * What was wrong with them was everything around them. They were a bare <ul>:
 * no sentence, no punctuation, nothing to click. Six phrases sitting next to a
 * library that has a page for every one of them, going nowhere.
 *
 * Each one now (a) links to the place in the library that actually answers it,
 * so the block does a job instead of holding keywords, and (b) carries one line
 * underneath in the same voice as the prose beside it. The destinations are
 * real: every slug below was read off the live table, not typed from memory,
 * and every /search query was counted against it first.
 */
const BBI_BUILT_FOR: {
  phrase: string;
  line: string;
  to: string;
  params?: { categorySlug: string };
  search?: { q: string };
}[] = [
  {
    phrase: "Any business idea without investment",
    line: "\u201cSave up first\u201d is not advice when there is nothing to save.",
    to: "/category/$categorySlug",
    params: { categorySlug: "zero-investment-business-ideas" },
  },
  {
    phrase: "Work from home business opportunity",
    line: "Start from the room you are already paying rent for.",
    to: "/category/$categorySlug",
    params: { categorySlug: "work-from-home-business-ideas" },
  },
  {
    phrase: "Best business to start with little money",
    line: "Small capital is a constraint. It is not a verdict.",
    to: "/category/$categorySlug",
    params: { categorySlug: "low-investment-business-ideas" },
  },
  {
    phrase: "Side hustle and best side job ideas",
    line: "Keep the salary. Build the second thing quietly.",
    to: "/category/$categorySlug",
    params: { categorySlug: "side-hustle-ideas" },
  },
  {
    phrase: "Business ideas for teenagers",
    line: "Too young is something people say. It is not a rule.",
    to: "/search",
    search: { q: "teen" },
  },
  {
    phrase: "Stay-at-home-mom business ideas",
    line: "Work that fits around a day you do not get to control.",
    to: "/search",
    search: { q: "mom" },
  },
];

function WhoForSection() {
  // The six keyword links were the last cards on the page with no motion
  // owner at all -- measured, not guessed: they carried no inline opacity and
  // no `data-revealed`, which is the signature of a card no hook has claimed.
  const listRef = useStaggerReveal<HTMLUListElement>({ selector: ".mo-card", stagger: 0.045 });
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass bbi-shape-soft-deep grid gap-6 p-5 sm:p-9 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="t-eyebrow">Who we built this for</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            For the person with an idea and nothing else.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Some of us have been jobless. Some of us have started over with no savings. We know
              what it&apos;s like to have a business idea and no laptop, no capital, no one to ask.
              BBI is for that person — the one Googling &quot;business ideas&quot; from a phone, at
              1am, hoping something makes sense for their actual life.
            </p>
            <p>
              We&apos;re not writing &quot;start a SaaS and make a million dollars&quot; content
              aimed at people who already have funding. We write for people starting from zero: no
              investment, no team, no connections. If that&apos;s not you — great, we&apos;ve got
              the bigger ideas too.
            </p>
          </div>
        </div>
        <div className="glass bbi-shape-hex self-start p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Built with you in mind
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            These are the things people actually type at 1am. Every one of them goes somewhere real.
          </p>
          {/* One column on a phone, two across on a tablet — where this used to
              render as a single thin list under two paragraphs of prose — and
              back to one in the narrow right rail on desktop. */}
          <ul ref={listRef} className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {BBI_BUILT_FOR.map((item) => (
              <li key={item.phrase}>
                <Link
                  to={item.to}
                  {...(item.params ? { params: item.params } : {})}
                  {...(item.search ? { search: item.search } : {})}
                  className="mo-card glass-hover block h-full rounded-xl border border-border/60 px-4 py-3"
                >
                  <span className="block text-sm font-semibold leading-snug text-foreground">
                    {item.phrase}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {item.line}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

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

function PricingPhilosophySection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="glass glass-hover bbi-shape-ticket p-6 text-center sm:p-9">
        <p className="t-eyebrow">Pricing, honestly</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          One fee. Once. For life. That&apos;s the whole pricing page.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          No monthly plan. No &quot;Starter / Pro / Enterprise&quot; ladder designed to make you
          feel small on the cheapest tier. Just one option: pay once, unlock everything, forever —
          including every idea we add after the day you join. Not ready to pay yet? Most of the
          library stays free to browse regardless.
        </p>
      </div>

      <div className="glass bbi-shape-faq2 mt-6 p-5 sm:p-7">
        <p className="t-eyebrow">Pricing & the market gap</p>
        <div className="mt-5 divide-y divide-border">
          {BBI_FAQ_2.map((item) => (
            <AccordionItem key={item.q} question={item.q} answer={item.a} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  // The section is one big card, so the stagger runs on its two columns
  // rather than on the card itself -- staggering a single child is just a
  // fade with extra steps.
  // The ref goes on the SECTION, not the card. With it on the card, the card
  // is the container rather than a child, so the thing you actually see never
  // animates -- only its two columns do.
  const ref = useStaggerReveal<HTMLElement>({ selector: ".mo-card", distance: 22 });
  return (
    <section ref={ref} className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="mo-card glass bbi-shape-card-a grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="t-eyebrow">Who&apos;s behind this</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Built by hand, not by a headcount.
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              BBI is a small, hands-on build — no invented office, no fake team page. We&apos;d
              rather tell you less and have it be true.
            </p>
            <p>
              The full story lives on our{" "}
              <Link to="/about" className="text-accent underline underline-offset-4">
                About page
              </Link>
              .
            </p>
          </div>
        </div>
        <OrbitDiagram
          centerLabel="Hands-on"
          centerSub="build"
          nodes={[
            "Real research",
            "No fake team page",
            "Direct accountability",
            "Always improving",
          ]}
        />
      </div>
    </section>
  );
}

function InspiredBySection() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-3 sm:px-4">
      <div className="glass bbi-shape-card-a p-6 sm:p-8">
        <p className="t-eyebrow">Where this came from</p>
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

/**
 * The two comparison cards slide in from opposite sides and converge — the one
 * bespoke beat kept on this page, because "two things meeting in the middle"
 * is the section's actual argument and no shared primitive expresses it.
 *
 * The glow pulse that used to fire on arrival animated `box-shadow`, which
 * MOTION_SPEC §2.8 forbids outright (it re-rasterises a blurred shadow every
 * frame and is the single most expensive thing you can tween). It is gone; the
 * cards now take their hover response from `.mo-card` like every other card on
 * the site. `clearProps` drops gsap's residual inline transform once the
 * converge lands, so the shared hover lift has an unclaimed transform to use.
 */
function ComparisonSection() {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  // Publishes --sc-p on the section as it crosses the viewport. The depth
  // classes below read it. It is deliberately NOT on the cards: `.mo-card`
  // already owns their `transform` for the hover lift, and two rules writing
  // one property means whichever loses the cascade is silently dropped.
  const depthRef = useScrollProgress<HTMLElement>();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    let cancelled = false;
    let tl: gsap.core.Timeline | null = null;

    loadGsap(true).then((gsap) => {
      if (cancelled) return;
      // Both cards now resolve to full opacity. The left one used to rest at
      // opacity-80 to read as the lesser option, which worked side by side on a
      // desktop and read as a half-loaded card once the columns stacked on a
      // phone. It separates itself by surface and border now, not by fading.
      // If that Tailwind class ever comes back, this tween has to come back
      // with it — a dimmed class and a tween to 1 fight each other.
      gsap.set(left, { x: -60, opacity: 0 });
      gsap.set(right, { x: 60, opacity: 0 });
      tl = gsap.timeline({
        // Was `once: true` — a third one-shot latch, missed in the two-way
        // pass because it is a bespoke timeline in this file rather than a
        // call into `useStaggerReveal`. The two cards now slide in from
        // their own sides on every pass, in both directions.
        scrollTrigger: {
          trigger: left,
          start: "top 85%",
          toggleActions: "restart reverse restart reverse",
        },
      });
      tl.to(left, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0).to(
        right,
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0,
      );
    });

    return () => {
      cancelled = true;
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section ref={depthRef} className="bbi-depth mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <div className="bbi-depth-back">
        <p className="t-eyebrow">The comparison</p>
        <h2 className="mt-2 max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          Validating a business idea should not cost you the money you were going to start it with.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Twenty dollars buys you three or four checks on most idea validation platforms. If the
          answer comes back no, that money is gone and you are back where you started — except
          poorer. We think that is the wrong way round. Read the research first, for free, and
          decide with your own eyes whether an idea is worth your time.
        </p>
      </div>
      <div className="bbi-depth-front mt-8 grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
        <div
          ref={leftRef}
          className="mo-card glass bbi-shape-compare-sharp border border-border/60 p-5 sm:p-7"
        >
          <p className="t-eyebrow hl-coral">What most idea validation tools ask of you</p>
          <ul className="mt-4 divide-y divide-hl-coral/20 text-sm leading-relaxed text-muted-foreground">
            <li className="py-3 first:pt-0 last:pb-0">
              You pay every month, whether you use it that month or not.
            </li>
            <li className="py-3 first:pt-0 last:pb-0">
              Twenty dollars gets you a handful of checks, then it asks for more.
            </li>
            <li className="py-3 first:pt-0 last:pb-0">
              What comes back is the same generic paragraph anyone else would get.
            </li>
            <li className="py-3 first:pt-0 last:pb-0">
              You pay before you are allowed to see whether it was worth paying for.
            </li>
          </ul>
        </div>
        {/* The stacked order on a phone put two cards on top of each other with
            nothing saying they were being compared. This marker sits between
            them on mobile and rides the column gutter from sm: up. */}
        <div aria-hidden className="pointer-events-none -my-1 flex justify-center sm:hidden">
          <span className="glass rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            versus
          </span>
        </div>
        <div
          ref={rightRef}
          className="mo-card glass glass-hover bbi-shape-compare-round border border-primary/40 p-5 sm:p-7"
        >
          <p className="t-eyebrow hl-green">What BBI asks of you</p>
          <ul className="mt-4 divide-y divide-hl-green/25 text-sm leading-relaxed text-foreground">
            <li className="py-3 first:pt-0 last:pb-0">
              Read every researched idea in the library without paying anything.
            </li>
            <li className="py-3 first:pt-0 last:pb-0">
              If you want the full thing, you pay once. There is no second bill.
            </li>
            <li className="py-3 first:pt-0 last:pb-0">
              Validate as many ideas as you like. We do not ration it.
            </li>
            <li className="py-3 first:pt-0 last:pb-0">
              Change your mind, come back in a year, and it is all still yours.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

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
      <div className="glass bbi-shape-diamond p-6 sm:p-9">
        <p className="t-eyebrow">Ways into the library</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Start from a theme instead of a blank search box.
        </h2>
        {/* The previous lead said these were "pulled straight from the live
            library, not a marketing list". BBI_FUTURE_TERMS is six hand-typed
            strings in this file, so that sentence was false on a live page —
            it claimed data provenance for a hardcoded constant, under a
            heading ("where the market is headed") the pills never supported.
            The terms stay verbatim because they carry the search value; the
            copy around them now describes what they actually do. */}
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Each one runs a live search across every blueprint. They are shortcuts, not a ranking
          &mdash; and if one comes back thin, that is the library being honest with you rather than
          a page pretending to be fuller than it is.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {BBI_FUTURE_TERMS.map((term) => (
            <Link
              key={term.label}
              to="/search"
              search={{ q: term.query }}
              className="glass-pill min-w-0 rounded-full px-3 py-2 text-center text-[11px] font-medium leading-snug transition-all duration-300 sm:px-4 sm:text-xs"
            >
              {term.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

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

function KeywordMosaic() {
  const groupsRef = useStaggerReveal<HTMLDivElement>();
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4" aria-label="Browse ideas by keyword">
      <p className="t-eyebrow">Every angle covered</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        Business ideas by industry, founder, and model
      </h2>
      <div ref={groupsRef} className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BBI_KEYWORD_GROUPS.map((group) => (
          <div
            key={group.heading}
            className="mo-card glass glass-hover bbi-shape-card-a h-full p-4 sm:p-6"
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {group.heading}
            </h3>
            <div className="mt-4 grid grid-cols-2 content-start gap-2 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] lg:grid-cols-1 xl:grid-cols-2">
              {group.terms.map((term) => (
                <Link
                  key={term.label}
                  to="/search"
                  search={{ q: term.query }}
                  className="glass-pill min-w-0 rounded-full px-2.5 py-2 text-center text-[11px] font-medium leading-tight"
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

function PromiseSection() {
  return (
    <section
      id="promise"
      data-anchor="promise"
      data-anchor-label="Our promise"
      className="mx-auto mt-16 max-w-4xl px-3 sm:px-4"
    >
      <div className="glass glass-hover bbi-shape-shield p-6 text-center sm:p-9">
        <p className="t-eyebrow">Our promise</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          We&apos;re not here to sell you a dream. We&apos;re here to hand you the research.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          We won&apos;t tell you that you&apos;ll be a millionaire in three months. We won&apos;t
          show you a lifestyle you can&apos;t verify. What we will do: give you honest research,
          free guidance, and a starting point that doesn&apos;t cost you $20 before you&apos;ve even
          decided if the idea is worth pursuing.
        </p>
      </div>

      <div className="glass bbi-shape-faq3 mt-6 p-5 sm:p-7">
        <p className="t-eyebrow">Common searches, answered</p>
        <div className="mt-5 divide-y divide-border">
          {BBI_FAQ_3.map((item) => (
            <AccordionItem key={item.q} question={item.q} answer={item.a} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}
