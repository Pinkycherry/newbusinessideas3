import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell } from "@/components/site-shell";
import { CategoryBadge } from "@/components/category-badge";
import { AdSlot } from "@/components/AdSlot";
import { HeroSlider } from "@/components/hero-slider";
import { BusinessIcons } from "@/components/business-icons";
import { CardFan } from "@/components/card-fan";
import HoverBorderGradient from "@/components/aceternity/hover-border-gradient";
import ContainerTextFlip from "@/components/aceternity/container-text-flip";
import InfiniteMovingCards from "@/components/aceternity/infinite-moving-cards";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import MovingImageCards from "@/components/aceternity/moving-image-cards";
import LayoutTextFlip from "@/components/aceternity/layout-text-flip";
import TextGenerateEffect from "@/components/aceternity/text-generate-effect";
import EncryptedText from "@/components/aceternity/encrypted-text";
import EvervaultCard from "@/components/aceternity/evervault-card";
import LinkPreview from "@/components/aceternity/link-preview";
import Lens from "@/components/aceternity/lens";
import ParticleText from "@/components/aceternity/particle-text";
import LineWaves from "@/components/aceternity/line-waves";
import GlowCursor from "@/components/aceternity/glow-cursor";
import Tabs from "@/components/aceternity/tabs";
import { photoAt } from "@/config/imagery";
import CardSpotlight from "@/components/aceternity/card-spotlight";
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
import { Odometer, useScrollProgress, useStaggerReveal } from "@/motion";

/**
 * Hero's primary CTA. Every action on this page is a HoverBorderGradient now,
 * at the founder's instruction: brand ink travels the plate's border until the
 * pointer arrives, then fills it.
 */
/** The mark that rides inside every action on this page, matching the
 * HoverBorderGradient reference: a glyph and a label, not a bare word. */
function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5 shrink-0">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 66 65" fill="none" aria-hidden className="h-3 w-3 shrink-0">
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroCta() {
  return (
    <HoverBorderGradient asChild containerClassName="rounded-full justify-self-start">
      <Link
        to="/browse"
        className="rounded-full text-xs font-extrabold uppercase tracking-[0.18em]"
      >
        <ArrowGlyph />
        <span>Browse the library</span>
      </Link>
    </HoverBorderGradient>
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
      <CardSpotlight className="px-6 py-8 sm:px-10 sm:py-10">
        <p className="ins-legend flex flex-wrap items-baseline gap-2">
          Surprise me
          <ContainerTextFlip
            words={categories.map((c) => c.categoryName)}
            className="text-sm font-semibold normal-case tracking-normal sm:text-base"
          />
        </p>
        <h2 className="mt-4 text-[2rem] leading-[1.05] sm:text-[3rem]">
          Pick a category, or don&apos;t. We&apos;ll surprise you.
        </h2>
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
          <HoverBorderGradient
            onClick={() => surprise.mutate()}
            disabled={surprise.isPending}
            className="disabled:cursor-wait disabled:opacity-70"
          >
            {surprise.isPending ? "Picking…" : "Surprise Me"}
          </HoverBorderGradient>
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
      </CardSpotlight>
    </section>
  );
}

function tickerRows<T>(categories: T[], rowCount = 4): T[][] {
  const rows: T[][] = Array.from({ length: rowCount }, () => []);
  categories.forEach((c, i) => rows[i % rowCount]!.push(c));
  return rows.filter((r) => r.length > 0);
}

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
    <SiteShell tone="instrument">
      <p className="mx-auto max-w-6xl px-4 py-24">The idea library could not be loaded.</p>
    </SiteShell>
  ),
});

function HomePage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const { data: highlights } = useSuspenseQuery(featuredQuery);
  const { data: trending } = useSuspenseQuery(trendingQuery);
  const featured = highlights.slice(0, 6);

  return (
    <SiteShell tone="instrument">
      {/* The trail. It does not replace the system cursor — the canvas is
          pointer-events:none, so every hit target is exactly where it was. */}
      <GlowCursor />

      {/* LLM crawlable summary */}
      <p className="sr-only">
        BBI (Bro Business Ideas) is a business idea directory and startup intelligence library. This
        resource covers small business ideas, work from home business ideas, low investment startup
        ideas, business ideas for women, zero investment business ideas, and startup ideas organized
        by sector, investment level, and founder profile.
      </p>

      {/* HERO. The readout sidebar is gone — it was a generic dashboard rail
          and it stole a fifth of the fold from the headline. The two figures
          it carried now sit inline under the H1, where they read as part of
          the sentence rather than as chrome. */}
      <section
        id="hero"
        data-anchor="hero"
        data-anchor-label="Top"
        className="relative overflow-hidden border-b border-[var(--ins-rule)]"
      >
        {/* The field lives in the HERO, not behind the document. Fixed to the
            viewport it showed through every section — sections have no ground
            of their own — so all the body copy and every heading sat on moving
            light bands. They measured #FFFFFF and still read grey, because the
            thing behind them was brighter than they were. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <LineWaves className="h-full w-full" brightness={0.11} />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--ins-void)]/40 via-[var(--ins-void)]/55 to-[var(--ins-void)]" />
        </div>
        <div className="relative mx-auto max-w-[92rem] px-6 py-10 lg:py-14">
          <p className="ins-legend">The Truth About Business Ideas</p>

          <h1 className="mt-5">
            <ParticleText
              text="Tired of paying just to check if your idea will work?"
              className="h-[11rem] sm:h-[17rem]"
              fontSize="clamp(2.1rem, 4.6vw, 3.6rem)"
              fontWeight={700}
              color="#FFFFFF"
              highlightColor="#B2B2B2"
            />
          </h1>

          <dl className="mt-2 flex flex-wrap items-baseline gap-x-10 gap-y-3">
            <div className="flex items-baseline gap-2.5">
              <dd className="ins-num text-3xl font-semibold leading-none text-[var(--ins-bright)]">
                {catalog.totalIdeas}
              </dd>
              <dt className="ins-num text-[0.6875rem] text-[var(--ins-dim)]">
                researched blueprints
              </dt>
            </div>
            <div className="flex items-baseline gap-2.5">
              <dd className="ins-num text-3xl font-semibold leading-none text-[var(--ins-bright)]">
                {catalog.categories.length}
              </dd>
              <dt className="ins-num text-[0.6875rem] text-[var(--ins-dim)]">live categories</dt>
            </div>
          </dl>

          <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,44ch)_1fr] lg:items-start">
            <Lens className="text-base leading-relaxed text-[var(--ins-read)]">
              <p>
                We built a free home for real business ideas — side hustles, zero investment ideas,
                work from home ideas, and low investment ideas. Every idea is researched, not
                guessed. We tell you who will actually pay you, how the money works, and what will
                hurt you in year one. Then we give it to you straight — build it, or walk away.
                Browse for free. Validate as many times as you want. Pay only once, if you ever want
                full access.
              </p>
            </Lens>
            {/* A ratio rather than a cap: the cap cropped the Golden Tree
                artwork mid-canopy, and no bound at all let the frame grow past
                900px tall. */}
            <div className="aspect-[16/10] w-full lg:pl-2">
              <HeroSlider />
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <HeroCta />
            <HoverBorderGradient asChild containerClassName="rounded-full">
              <Link
                to="/search"
                search={{ q: "" }}
                className="ins-num rounded-full text-[0.8125rem]"
              >
                <SearchGlyph />
                <span>Search idea blueprints…</span>
              </Link>
            </HoverBorderGradient>
          </div>
        </div>

        {/* The two hero panels, sharing one rule with the block above. */}
        <div className="mx-auto max-w-[92rem]">
          <div className="ins-grid border-t border-[var(--ins-rule)] sm:grid-cols-2">
            {HERO_PANELS.map((panel) => (
              <EvervaultCard
                key={panel.label}
                seed={panel.label.length}
                className="ins-cell border-0 px-6 py-7"
              >
                <h3 className="text-base font-semibold text-[var(--ins-bright)]">{panel.label}</h3>
                <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-[var(--ins-read)]">
                  {panel.body}
                </p>
              </EvervaultCard>
            ))}
          </div>
        </div>
      </section>

      {/* SURPRISE ME — Section 8.1, directly below the hero, before any other content */}
      <SurpriseMeSection categories={catalog.categories} />

      {/* Live demand board. Renders nothing at all if no idea in the set
          carries a trend score, rather than showing an empty frame. */}

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
        <p className="ins-legend mx-auto max-w-6xl px-3 sm:px-4">Browse by category</p>
        {/* Business-model icons, bobbing on staggered offsets — the movement
            from the approved design. Full-bleed, masked at both edges. */}
        <BusinessIcons />
        {/* Four counter-running rows of live categories. Each row is an
            InfiniteMovingCards track: it duplicates its own items once and
            travels exactly half its width, so the loop never seams however
            many categories the catalog holds. Hover or tab into a row and it
            stops. */}
        <div className="mt-4 grid gap-3 px-3 sm:px-4">
          {tickerRows(catalog.categories).map((row, rowIndex) => (
            <InfiniteMovingCards
              key={`ticker-row-${rowIndex}`}
              direction={rowIndex % 2 === 1 ? "right" : "left"}
              speed={34 + rowIndex * 5}
              items={row.map((c) => ({
                label: c.categoryName,
                to: "/category/$categorySlug",
                params: { categorySlug: c.categorySlug },
              }))}
            />
          ))}
        </div>
      </section>

      {/* Two counter-running rows of live category plates, imagery from
          ethicalfounder.com via src/config/imagery.ts. Replaces the parallax
          band: same content, and a marquee reads as a library going past
          rather than as a hero effect. */}
      <section
        data-anchor="library"
        data-anchor-label="The library"
        className="ins-module py-12"
        aria-label="Every category, and what it actually holds."
      >
        <div className="mx-auto max-w-[92rem] px-6">
          <p className="ins-legend">The library</p>
          <h2 className="mt-3 max-w-3xl">Every category, and what it actually holds.</h2>
        </div>
        <div className="mt-8 grid gap-4">
          {[0, 1].map((row) => {
            const slice = catalog.categories.filter((_, i) => i % 2 === row);
            return (
              <MovingImageCards
                key={`lib-row-${row}`}
                direction={row === 1 ? "right" : "left"}
                speed={46 + row * 8}
                cards={slice.map((category, index) => {
                  const photo = photoAt(index + row);
                  return {
                    title: category.categoryName,
                    meta: `${category.ideaCount} blueprints`,
                    src: photo.src,
                    alt: photo.alt,
                    to: "/category/$categorySlug",
                    params: { categorySlug: category.categorySlug },
                  };
                })}
              />
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
      <BrandStatementBanner />

      {/* KEYWORD MOSAIC */}
      <KeywordMosaic />

      {/* TRUST STRIP */}
      <TrustStatsBar totalIdeas={catalog.totalIdeas} categoryCount={catalog.categories.length} />

      {/* MARKET GAP + orbit #1 */}

      {/* SECTION 3: THE BBI 4-PILLAR BLUEPRINT STANDARD */}

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-3 py-16 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ins-legend">Featured blueprints</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Blueprints worth your afternoon
            </h2>
          </div>
          <HoverBorderGradient asChild>
            <Link to="/browse" className="text-xs font-semibold uppercase tracking-[0.2em]">
              Browse the full library →
            </Link>
          </HoverBorderGradient>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* EDITORIAL IMAGE TRIO — image slots (.mo-media), and the only ambient
          layers on this page that .mo-drift can actually reach: the twin rings
          and the orbit rings both run keyframe animations that own `transform`
          outright, so a class-level drift can never apply to them. */}

      {/* HOW IT WORKS + orbit #2 + Faq1 inline */}
      <HowItWorksSection />

      {/* WHO FOR */}
      <WhoForSection />

      {/* PRICING PHILOSOPHY + Faq2 inline */}
      <PricingPhilosophySection />

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
            This library exists because a genuine small business idea blueprint is worth more than a
            hundred recycled suggestions. We research each one properly — market context, real
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

      {/* TEAM + orbit #3 */}
      <TeamSection />

      <InspiredBySection />
      <ComparisonSection />
      <FutureProofSpotlight />

      {/* PROMISE + Faq3 inline */}
      <PromiseSection />

      {/* GENERAL CLOSING FAQ */}
      <section className="mx-auto mt-20 max-w-4xl border-t border-border/60 px-3 pt-16 pb-24 sm:mt-28 sm:px-4 sm:pt-20">
        <p className="ins-legend">Common questions</p>
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
        <p className="ins-legend">Interactive Canopy Map</p>
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
      <div className="relative mt-8 flex w-full items-center justify-center py-10 sm:mt-12 sm:py-16">
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
      </div>
    </section>
  );
}

/* ================================================================
   SECTION 2: LIVE CATEGORY SEARCH DEMAND TRACKER
   ================================================================ */

/* ================================================================
   SECTION 3: THE BBI 4-PILLAR BLUEPRINT STANDARD
   ================================================================ */

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
  return (
    // Was a bordered card with a morphing colour wash behind it. The block
    // people actually stop and read does not need a frame around it: a rule
    // above, the statement at display size, and the prose set to a real
    // measure beside it.
    <section className="mx-auto mt-16 max-w-6xl border-t border-border px-3 pt-12 sm:px-4 sm:pt-16">
      <p className="ins-legend">Who we are</p>
      <div className="mt-4 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* The flip runs through the words of the name itself, so the
            component earns its motion without a syllable being invented. */}
        <h2 className="text-[2.4rem] leading-[1.04] sm:text-[3.4rem]">
          <LayoutTextFlip
            text="BBI —"
            words={["Bro", "Business", "Ideas."]}
            wordClassName="text-[0.9em]"
          />
        </h2>
        {/* Back on the word reveal, but the rebuilt component cannot strand a
            sentence: its rest state is visible, and with no IntersectionObserver
            it shows everything rather than nothing. */}
        <TextGenerateEffect
          className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
          words={`We have been where you are. We paid for those $20 "validation" platforms too. We got a few generic lines back, spent our money, and got nothing real in return. When we asked for help, no one answered. That hurt. So we built the thing we needed back then — a free, honest library of small business ideas and side hustles, with real research, not empty hype. Browse for free, always. Validate as many times as you want, at no extra cost. Pay once — ₹199 for 3 months or ₹399 for life — only if you want full access. Never a monthly bill.`}
        />
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
    },
    {
      value: 967,
      live: false,
      label: "Founders reviewed us",
      note: "Reviewed BBI's structure and functionality before we shipped it",
    },
    {
      value: 2,
      live: false,
      label: "Simple pricing plans",
      note: "₹199 for 3 months, ₹399 for life. Pay once. No surprise bills, ever.",
    },
  ];
  return (
    // Three identical tiles said the three figures carried equal weight. Only
    // one of them has a live source behind it, so only that one claims two
    // columns — the grid ranks them the way the data does.
    <BentoGrid className="mx-auto mt-8 max-w-6xl px-3 sm:px-4">
      {stats.map((stat) => (
        <BentoGridItem
          key={stat.label}
          className={stat.live ? "md:col-span-2" : ""}
          header={
            <p
              className={`font-extrabold tracking-tight text-primary ${
                stat.live ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl"
              }`}
            >
              {stat.live ? (
                <Odometer value={stat.value} format={(n) => `${Math.round(n)}+`} />
              ) : (
                stat.value
              )}
            </p>
          }
          title={
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">{stat.label}</span>
          }
          description={stat.note}
        />
      ))}
    </BentoGrid>
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
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <p className="ins-legend">Step by step</p>
      <h2 className="mt-4 max-w-4xl text-[2rem] leading-[1.05] sm:text-[3rem]">
        Grab the idea. Validate it however you want. Keep the money.
      </h2>

      {/* This was a mask-reveal over a sparkle field with a pinned plate
          beside it. It cost a WebGL-adjacent canvas and a per-frame re-render
          to hide the heading behind a hole the reader had to find with the
          cursor, and the plate next to it repeated a word already on screen.
          Three steps, so it is drawn as three steps: a rule per row, the
          numeral at display size, and the row lights on hover. Nothing here
          hides content behind an interaction. */}
      <ol className="mt-12 border-t border-border">
        {BBI_HOW_STEPS.map((step) => (
          <li
            key={step.n}
            className="group/step grid gap-4 border-b border-border py-8 transition-colors duration-300 hover:bg-[var(--ins-face)] sm:grid-cols-[6rem_minmax(0,22ch)_1fr] sm:gap-8 sm:px-4"
          >
            <span className="ins-num text-[2.5rem] leading-none text-[var(--ins-faint)] transition-colors duration-300 group-hover/step:text-[var(--ins-bright)] sm:text-[3.5rem]">
              {step.n}
            </span>
            <h3 className="self-center text-xl font-semibold leading-snug text-[var(--ins-bright)] sm:text-2xl">
              {step.t}
            </h3>
            <p className="self-center max-w-[62ch] text-base leading-relaxed text-[var(--ins-read)]">
              {step.d}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-14 border-t border-border pt-8">
        <p className="ins-legend">Validating & using BBI</p>
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
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <p className="ins-legend">Who we built this for</p>
      <h2 className="mt-3 max-w-3xl">For the person with an idea and nothing else.</h2>
      {/* Two paragraphs at a real reading measure, side by side, rather than
          stacked in the left half of a card. */}
      <Lens className="mt-6 grid gap-6 text-base leading-relaxed text-muted-foreground sm:grid-cols-2 sm:gap-10">
        <p>
          Some of us have been jobless. Some of us have started over with no savings. We know what
          it&apos;s like to have a business idea and no laptop, no capital, no one to ask. BBI is
          for that person — the one Googling &quot;business ideas&quot; from a phone, at 1am, hoping
          something makes sense for their actual life.
        </p>
        <p>
          We&apos;re not writing &quot;start a SaaS and make a million dollars&quot; content aimed
          at people who already have funding. We write for people starting from zero: no investment,
          no team, no connections. If that&apos;s not you — great, we&apos;ve got the bigger ideas
          too.
        </p>
      </Lens>

      <div className="mt-12 border-t border-border pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Built with you in mind
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These are the things people actually type at 1am. Every one of them goes somewhere real.
        </p>
        {/* Was six flat cards with the sub-line stranded at the bottom by a
            justify-between and nothing to engage with. Each is an Evervault
            plate now: the pointer carries a window through a character field,
            the query is numbered so the set reads as a list, and the two lines
            sit together instead of at opposite ends of a tall box. */}
        <div className="mt-6 grid gap-px bg-[var(--ins-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {BBI_BUILT_FOR.map((item, index) => (
            <EvervaultCard
              key={item.phrase}
              seed={item.phrase.length + index}
              className="border-0 bg-[var(--ins-void)]"
            >
              <Link
                to={item.to}
                {...(item.params ? { params: item.params } : {})}
                {...(item.search ? { search: item.search } : {})}
                className="group/q flex h-full flex-col gap-2 p-5"
              >
                <span className="ins-num text-[0.6875rem] text-[var(--ins-faint)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold leading-snug text-[var(--ins-bright)] transition-colors duration-300 group-hover/q:text-[var(--ins-signal)]">
                  {item.phrase}
                </span>
                <span className="text-sm leading-relaxed text-[var(--ins-read)]">{item.line}</span>
                <span
                  aria-hidden
                  className="mt-3 h-px w-0 bg-[var(--ins-bright)] transition-all duration-500 group-hover/q:w-full"
                />
              </Link>
            </EvervaultCard>
          ))}
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
    <section className="mt-16">
      {/* The one inverted band on the page. Twelve sections of paper in a row
          flatten out; the pricing statement is the right place to break the
          rhythm, and it is the only block here that is genuinely an assertion
          rather than an explanation. */}
      <div className="bg-primary py-16 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-foreground/70">
            Pricing, honestly
          </p>
          <h2 className="mt-4 max-w-4xl text-[2.1rem] leading-[1.06] text-primary-foreground sm:text-[3.2rem]">
            One fee. Once. For life. That&apos;s the whole pricing page.
          </h2>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            No monthly plan. No &quot;Starter / Pro / Enterprise&quot; ladder designed to make you
            feel small on the cheapest tier. Just one option: pay once, unlock everything, forever —
            including every idea we add after the day you join. Not ready to pay yet? Most of the
            library stays free to browse regardless.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-3 sm:px-4">
        <p className="ins-legend">Pricing & the market gap</p>
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
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      {/* Was prose squeezed into the left half of a card with the diagram
          filling the right. The text is short and personal; it reads better at
          a narrow measure with the diagram given its own full width below. */}
      <div className="max-w-2xl">
        <p className="ins-legend">Who&apos;s behind this</p>
        <h2 className="mt-3">Built by hand, not by a headcount.</h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            BBI is a small, hands-on build — no invented office, no fake team page. We&apos;d rather
            tell you less and have it be true.
          </p>
          <p>
            The full story lives on our{" "}
            <LinkPreview url="https://newbusinessideas3.vercel.app/about" className="font-semibold">
              <Link
                to="/about"
                className="font-semibold text-primary underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                About page
              </Link>
            </LinkPreview>
            .
          </p>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-10">
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
      {/* Was a centred card. This is an attribution, so it is set as one: a
          rule down the left edge, the way a citation is marked in print. */}
      <div className="border-l-2 border-primary pl-6 sm:pl-8">
        <p className="ins-legend">Where this came from</p>
        <h2 className="mt-3">We didn&apos;t invent this model. We learned it.</h2>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
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

const BBI_THEM = [
  "You pay every month, whether you use it that month or not.",
  "Twenty dollars gets you a handful of checks, then it asks for more.",
  "What comes back is the same generic paragraph anyone else would get.",
  "You pay before you are allowed to see whether it was worth paying for.",
];

const BBI_US = [
  "Read every researched idea in the library without paying anything.",
  "If you want the full thing, you pay once. There is no second bill.",
  "Validate as many ideas as you like. We do not ration it.",
  "Change your mind, come back in a year, and it is all still yours.",
];

function ComparisonSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4">
      <p className="ins-legend">The comparison</p>
      <h2 className="mt-3 max-w-3xl">
        Validating a business idea should not cost you the money you were going to start it with.
      </h2>
      <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
        Twenty dollars buys you three or four checks on most idea validation platforms. If the
        answer comes back no, that money is gone and you are back where you started — except poorer.
        We think that is the wrong way round. Read the research first, for free, and decide with
        your own eyes whether an idea is worth your time.
      </p>

      {/* Was two blocks of loose sentences with no markers, so nothing said
          which line answered which, or even that these were lists. Numbered
          rows on a shared centre rule now: row 1 opposite row 1, each with a
          mark, so the trade is readable at a glance. */}
      <div className="relative mt-10 overflow-hidden rounded-md border border-border">
        <div className="grid sm:grid-cols-2">
          <div className="border-b border-border p-5 sm:border-b-0 sm:border-r sm:p-7">
            <p className="ins-legend">What most idea validation tools ask of you</p>
            <ol className="mt-5 space-y-4">
              {BBI_THEM.map((line, index) => (
                <li key={line} className="flex gap-3.5">
                  <span className="ins-num mt-0.5 shrink-0 text-[0.6875rem] text-[var(--ins-faint)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-[var(--ins-faint)]" />
                  <span className="text-sm leading-relaxed text-[var(--ins-dim)]">{line}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-5 sm:p-7">
            <p className="ins-legend">What BBI asks of you</p>
            <ol className="mt-5 space-y-4">
              {BBI_US.map((line, index) => (
                <li key={line} className="flex gap-3.5">
                  <span className="ins-num mt-0.5 shrink-0 text-[0.6875rem] text-[var(--ins-bright)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-[var(--ins-bright)]" />
                  <span className="text-sm leading-relaxed text-[var(--ins-read)]">{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-[var(--ins-void)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ins-dim)] sm:block"
        >
          versus
        </span>
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
    <section className="mx-auto mt-16 max-w-6xl border-t border-border px-3 pt-12 sm:px-4">
      <p className="ins-legend">Ways into the library</p>
      <h2 className="mt-3 max-w-3xl">Start from a theme instead of a blank search box.</h2>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
        Each one runs a live search across every blueprint. They are shortcuts, not a ranking
        &mdash; and if one comes back thin, that is the library being honest with you rather than a
        page pretending to be fuller than it is.
      </p>
      <div className="mt-7 flex flex-wrap gap-2.5">
        {BBI_FUTURE_TERMS.map((term) => (
          <Link
            key={term.label}
            to="/search"
            search={{ q: term.query }}
            className="rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
          >
            {term.label}
          </Link>
        ))}
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
  return (
    <section className="mx-auto mt-16 max-w-6xl px-3 sm:px-4" aria-label="Browse ideas by keyword">
      <p className="ins-legend">Every angle covered</p>
      <h2 className="mt-2 max-w-2xl">
        <EncryptedText
          text="Business ideas by industry, founder, and model"
          encryptedClassName="text-[var(--ins-faint)]"
          revealedClassName="text-[var(--ins-bright)]"
        />
      </h2>
      {/* Was three panels side by side, each a wall of pills — 18 links
          competing at once, and the same shape repeated three times. As tabs,
          one axis is legible at a time and the marker slides between them. */}
      <Tabs
        className="mt-7"
        listClassName="inline-flex"
        items={BBI_KEYWORD_GROUPS.map((group) => ({
          value: group.heading,
          label: group.heading,
          content: (
            <div className="flex flex-wrap gap-2.5">
              {group.terms.map((term) => (
                <Link
                  key={term.label}
                  to="/search"
                  search={{ q: term.query }}
                  className="rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
                >
                  {term.label}
                </Link>
              ))}
            </div>
          ),
        }))}
      />
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
      className="mx-auto mt-16 max-w-6xl px-3 sm:px-4"
    >
      {/* The last statement on the page, so it is set as one — no card around
          it, the claim at display size, the qualification beside it. */}
      <div className="border-t border-border pt-12">
        <p className="ins-legend">Our promise</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <h2 className="text-[2rem] leading-[1.08] sm:text-[2.8rem]">
            We&apos;re not here to sell you a dream. We&apos;re here to hand you the research.
          </h2>
          <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            We won&apos;t tell you that you&apos;ll be a millionaire in three months. We won&apos;t
            show you a lifestyle you can&apos;t verify. What we will do: give you honest research,
            free guidance, and a starting point that doesn&apos;t cost you $20 before you&apos;ve
            even decided if the idea is worth pursuing.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <p className="ins-legend">Common searches, answered</p>
        <div className="mt-5 divide-y divide-border">
          {BBI_FAQ_3.map((item) => (
            <AccordionItem key={item.q} question={item.q} answer={item.a} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}
