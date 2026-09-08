import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { VoidParticles } from "@/components/void-particles";
import { VoidReveal, VoidHeadline } from "@/components/void-reveal";
import { VoidHeader, VoidFooter } from "@/components/void-shell";
import { GoldenTreeSection } from "@/components/golden-tree-section";
import { AdSlot } from "@/components/AdSlot";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { KineticText } from "@/components/ui/kinetic-text";
import { Marquee } from "@/components/ui/marquee";
import { Highlighter } from "@/components/ui/highlighter";
import { LightRays } from "@/components/ui/light-rays";
import { HyperText } from "@/components/ui/hyper-text";
import { Floating3DParticles } from "@/components/ui/floating-3d-particles";
import { DemandBoard } from "@/components/demand-board";
import { FEATURED_IDEA_IDS } from "@/config/featured";
import {
  catalogQuery,
  getTrendingIdeas,
  getSurpriseIdeas,
  getFeaturedIdeas,
} from "@/lib/ideas.functions";

/** Restored: the three editorial photographs from the pre-void homepage. */
const EDITORIAL = [
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-17.jpg.webp",
    alt: "Businesswoman with a coffee and an open notebook in a calm workspace",
    tilt: 4,
    lift: "4rem",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-37.jpg.webp",
    alt: "Close-up of hands typing on a laptop keyboard in warm ambient light",
    tilt: -1.5,
    lift: "1.5rem",
  },
];

/** Restored from the pre-void homepage — the search-intent groups, unchanged. */
const KEYWORD_GROUPS = [
  {
    heading: "By industry",
    terms: ["fintech", "healthcare", "food and beverage", "fashion", "agriculture", "SaaS"],
  },
  {
    heading: "By who you are",
    terms: [
      "retirees",
      "veterans",
      "teenagers",
      "stay at home mom",
      "solo entrepreneur",
      "nurses",
      "couples",
      "senior care",
    ],
  },
  {
    heading: "By model",
    terms: [
      "dropshipping",
      "subscription box",
      "coaching",
      "passive income",
      "high profit",
      "low overhead",
      "recession proof",
    ],
  },
];

/**
 * SURPRISE ME — restored. This is a real feature, not copy: it calls
 * `getSurpriseIdeas`, which does the randomisation in SQL (ORDER BY random()),
 * not a client-side shuffle of an already-loaded page. Dropping it in the
 * recomposition removed working functionality, which is a different and worse
 * mistake than dropping a paragraph.
 */
function SurpriseSection({
  categories,
}: {
  categories: { categorySlug: string; categoryName: string }[];
}) {
  const [slug, setSlug] = useState("");
  const run = useServerFn(getSurpriseIdeas);
  const surprise = useMutation({
    mutationFn: () => run({ data: { categorySlug: slug || undefined, limit: 3 } }),
  });
  const picks = surprise.data ?? [];

  return (
    <section className="v-surprise">
      <VoidReveal dir="left" className="v-surprise-head">
        <p className="t-eyebrow">Surprise me</p>
        <h2 className="v-h2 v-h2-sm">Pick a category, or don&rsquo;t. We&rsquo;ll surprise you.</h2>
      </VoidReveal>
      <VoidReveal dir="up" delay={90} className="v-surprise-controls">
        <select
          className="v-select"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          aria-label="Category"
        >
          <option value="">Any category</option>
          {categories.map((c) => (
            <option key={c.categorySlug} value={c.categorySlug}>
              {c.categoryName}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-cta="primary"
          onClick={() => surprise.mutate()}
          disabled={surprise.isPending}
        >
          {surprise.isPending ? "Pulling…" : "Deal me three"}
        </button>
      </VoidReveal>
      {picks.length > 0 && (
        <ul className="v-surprise-out">
          {picks.map((i) => (
            <li key={i.ideaId}>
              <Link to="/idea/$slug" params={{ slug: i.slug }}>
                <span className="v-surprise-t">{i.title}</span>
                <span className="v-surprise-c">{i.categoryName}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {surprise.isError && <p className="v-surprise-err">That pull failed. Try again.</p>}
    </section>
  );
}

const trendingQuery = queryOptions({
  queryKey: ["trending"],
  queryFn: () => getTrendingIdeas(),
});

const featuredQuery = queryOptions({
  queryKey: ["featured", FEATURED_IDEA_IDS],
  queryFn: () => getFeaturedIdeas({ data: { ideaIds: FEATURED_IDEA_IDS } }),
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      context.queryClient.ensureQueryData(trendingQuery),
      context.queryClient.ensureQueryData(featuredQuery),
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
    <div className="mx-auto max-w-6xl px-4 py-24">
      <p>The idea library could not be loaded.</p>
    </div>
  ),
});

/**
 * SEVEN DIFFERENT SECTION FORMS, not one form repeated.
 *
 * That is the point of this file, and the thing three previous versions got
 * wrong. A heading beside a paragraph, restyled and respaced, is still a
 * heading beside a paragraph — colour and spacing are not structure. Every
 * section below is a different KIND of object:
 *
 *   1. STAGE      full viewport; the headline is the entire composition
 *   2. LEDGER     four numbered rules, tabular, no prose at all
 *   3. TREE       full bleed, unchanged
 *   4. STATEMENT  one sentence at display scale, alone on the screen
 *   5. LIST       the live library as a numbered large-type index
 *   6. WALL       every category edge to edge, deliberately dense
 *   7. COLUMN     one narrow centred measure, the quietest thing here
 *
 * They alternate wide/narrow and dense/spacious so scrolling feels like moving
 * through different rooms rather than down one long list.
 */
function HomePage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const { data: trending } = useSuspenseQuery(trendingQuery);
  const { data: featured } = useSuspenseQuery(featuredQuery);

  const categories = catalog.categories;
  const topIdeas = trending.slice(0, 6);

  const rules: [string, string][] = [
    ["Who pays", "The specific person with the specific budget, not “small businesses”."],
    ["How the money works", "Price, margin, and what a realistic first month looks like."],
    ["What hurts", "The year-one failure mode, written down before you meet it."],
    ["Whether to build it", "Including the entries that say no. Some of them do."],
  ];

  return (
    <>
      <VoidParticles />
      {/* AMBIENT TWIN RINGS — kept exactly as they were, by request. */}
      <div className="bbi-twin-ring ring-1" aria-hidden />
      <div className="bbi-twin-ring ring-2" aria-hidden />

      <VoidHeader categories={categories} />

      <p className="sr-only">
        BBI (Bro Business Ideas) is a business idea directory and startup intelligence library. This
        resource covers small business ideas, work from home business ideas, low investment startup
        ideas, business ideas for women, zero investment business ideas, and startup ideas organized
        by sector, investment level, and founder profile.
      </p>

      {/* ── 1. STAGE ─────────────────────────────────────────────────────── */}
      <section className="v-stage">
        <LightRays />
        <VoidHeadline
          className="v-stage-h"
          lines={["Start from zero.", "Not from a", "blank page."]}
        />
        <div className="v-stage-foot">
          <VoidReveal dir="up" delay={420} className="v-stage-lead">
            <p>
              Every idea answers who pays you, how the money works, what hurts in year one, and
              whether to build it at all.
            </p>
            <Link to="/browse" data-cta="primary" className="v-stage-cta">
              Browse the library
              <BorderBeam size={70} duration={6} />
            </Link>
          </VoidReveal>
          <VoidReveal dir="up" delay={560} className="v-stage-stat">
            <span className="v-stat-n">
              <NumberTicker value={catalog.totalIdeas} startValue={0} delay={700} />
            </span>
            <span className="v-stat-l">
              <AnimatedShinyText>blueprints, free</AnimatedShinyText>
            </span>
          </VoidReveal>
        </div>
      </section>

      {/* ── 2. LEDGER ────────────────────────────────────────────────────── */}
      <section className="v-ledger">
        <VoidReveal dir="left">
          <p className="t-eyebrow">The research standard</p>
        </VoidReveal>
        <ol className="v-ledger-rows">
          {rules.map(([term, def], i) => (
            <VoidReveal as="li" key={term} dir="up" delay={i * 80} className="v-ledger-row">
              <span className="v-ledger-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="v-ledger-t">{term}</span>
              <span className="v-ledger-d">{def}</span>
            </VoidReveal>
          ))}
        </ol>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section className="v-strip">
        {[
          [String(catalog.totalIdeas), "researched blueprints"],
          [String(categories.length), "categories"],
          ["0", "rupees, forever"],
        ].map(([n, l], i) => (
          <VoidReveal key={l} dir="up" delay={i * 90} className="v-strip-cell">
            <span className="v-strip-n">{n}</span>
            <span className="v-strip-l">{l}</span>
          </VoidReveal>
        ))}
      </section>

      {/* ── 3. TREE — unchanged, by request ──────────────────────────────── */}
      <GoldenTreeSection categories={categories} />

      <div className="px-3 sm:px-4">
        <AdSlot position="homepage-hero-below" size="banner" />
      </div>

      {/* ── SURPRISE ME — restored feature ───────────────────────────────── */}
      <SurpriseSection categories={categories} />

      {/* ── 4. STATEMENT ─────────────────────────────────────────────────── */}
      <section className="v-statement">
        <VoidReveal dir="up">
          <p className="t-eyebrow">The problem we found</p>
          <p className="v-statement-h">
            <KineticText
              text="Everyone charges you $20 to check one idea — using the money you were going to start it with."
              highlight="$20"
            />
          </p>
          <p className="v-statement-sub">
            <Highlighter action="underline" color="#ffb829">
              Behind a paywall
            </Highlighter>
            , before you see whether any of it was worth paying for.
          </p>
        </VoidReveal>
      </section>

      {/* ── 5. LIST ──────────────────────────────────────────────────────── */}
      <section className="v-list-sec">
        <VoidReveal dir="left" className="v-list-head">
          <p className="t-eyebrow">Moving right now</p>
          <h2 className="v-h2">What the library actually tells you.</h2>
        </VoidReveal>
        <ul className="v-list">
          {topIdeas.map((idea, i) => (
            <VoidReveal as="li" key={idea.ideaId} dir="up" delay={i * 60}>
              <Link to="/idea/$slug" params={{ slug: idea.slug }} className="v-list-row">
                <span className="v-list-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="v-list-t">{idea.title}</span>
                <span className="v-list-c">{idea.categoryName}</span>
                <span className="v-list-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </VoidReveal>
          ))}
        </ul>
        <VoidReveal dir="up" delay={100}>
          <Link to="/browse" className="v-list-all">
            See all {catalog.totalIdeas} blueprints
          </Link>
        </VoidReveal>
      </section>

      {/* ── FEATURED — restored, the curated picks ───────────────────────── */}
      {featured.length > 0 && (
        <section className="v-featured">
          <VoidReveal dir="left">
            <p className="t-eyebrow">Hand-picked</p>
            <h2 className="v-h2 v-h2-sm">The ones we would start with.</h2>
          </VoidReveal>
          <ul className="v-featured-grid">
            {featured.slice(0, 4).map((idea, i) => (
              <VoidReveal as="li" key={idea.ideaId} dir="up" delay={i * 90}>
                <Link to="/idea/$slug" params={{ slug: idea.slug }} className="v-feat">
                  <span className="v-feat-c">{idea.categoryName}</span>
                  <span className="v-feat-t">{idea.title}</span>
                  <span className="v-feat-s">{idea.summary.slice(0, 150)}…</span>
                </Link>
              </VoidReveal>
            ))}
          </ul>
        </section>
      )}

      {/* ── DEMAND BOARD — restored ──────────────────────────────────────── */}
      <section className="v-demand">
        <VoidReveal dir="left">
          <p className="t-eyebrow">Where the demand is</p>
          <h2 className="v-h2 v-h2-sm">Ordered by live trend score, not by our opinion.</h2>
        </VoidReveal>
        <DemandBoard ideas={trending} />
      </section>

      {/* ── HOW IT WORKS — restored, as a triptych ───────────────────────── */}
      <section className="v-triptych">
        <VoidReveal dir="left" className="v-triptych-head">
          <p className="t-eyebrow">Step by step</p>
          <h2 className="v-h2 v-h2-sm">
            Grab the idea. Validate it however you want. Keep the money.
          </h2>
        </VoidReveal>
        <div className="v-triptych-row">
          {[
            ["Grab", "Read the blueprint. Take the market context, the numbers, the warnings."],
            ["Validate", "Check it with whatever you already use. Nothing here asks for a card."],
            ["Keep", "The money you would have spent on a validation tool is still yours."],
          ].map(([t, d], i) => (
            <VoidReveal key={t} dir="up" delay={i * 110} className="v-tri">
              <span className="v-tri-n">{i + 1}</span>
              <span className="v-tri-t">{t}</span>
              <span className="v-tri-d">{d}</span>
            </VoidReveal>
          ))}
        </div>
      </section>

      {/* ── COMPARISON — restored, as two facing columns ─────────────────── */}
      <section className="v-vs">
        <VoidReveal dir="up" className="v-vs-head">
          <p className="t-eyebrow">The comparison</p>
          <h2 className="v-h2 v-h2-sm">Two ways to check whether an idea is worth your year.</h2>
        </VoidReveal>
        <div className="v-vs-row">
          <VoidReveal dir="left" className="v-vs-col is-them">
            <p className="v-vs-l">A validation tool</p>
            <ul>
              <li>You pay every month, whether you use it or not.</li>
              <li>You pay before you are allowed to see whether it was worth paying for.</li>
              <li>Generic output, assembled from the same sources you could search yourself.</li>
              <li>A handful of checks, then an upgrade prompt.</li>
            </ul>
          </VoidReveal>
          <span className="v-vs-mark" aria-hidden>
            vs
          </span>
          <VoidReveal dir="right" delay={90} className="v-vs-col is-us">
            <p className="v-vs-l">This library</p>
            <ul>
              <li>Free. No account, no card, no trial that expires.</li>
              <li>Every blueprint is readable in full before you decide anything.</li>
              <li>Written against the same four questions, in the same order, every time.</li>
              <li>Including the entries that tell you not to build it.</li>
            </ul>
          </VoidReveal>
        </div>
      </section>

      {/* ── 6. WALL ──────────────────────────────────────────────────────── */}
      <section className="v-wall">
        <VoidReveal dir="left" className="v-wall-head">
          <p className="t-eyebrow">Ways in</p>
          <h2 className="v-h2 v-h2-sm">Start from a theme, not a blank search box.</h2>
        </VoidReveal>
        <ul className="v-wall-grid">
          {categories.map((c, i) => (
            <VoidReveal as="li" key={c.categorySlug} dir="up" delay={Math.min(i * 24, 300)}>
              <Link
                to="/category/$categorySlug"
                params={{ categorySlug: c.categorySlug }}
                className="v-wall-cell"
              >
                <span className="v-wall-name">{c.categoryName}</span>
                <span className="v-wall-n">{c.ideaCount}</span>
              </Link>
            </VoidReveal>
          ))}
        </ul>
      </section>

      {/* ── KEYWORD MARQUEE — restored ───────────────────────────────────── */}
      <section className="v-mq-sec">
        <VoidReveal dir="left" className="v-mq-head">
          <p className="t-eyebrow">Every angle covered</p>
          <h2 className="v-h2 v-h2-sm">Business ideas by industry, founder, and model.</h2>
        </VoidReveal>
        {KEYWORD_GROUPS.map((g, gi) => (
          <div key={g.heading} className="v-mq-group">
            <p className="v-mq-h">{g.heading}</p>
            <Marquee reverse={gi % 2 === 1} duration={44 + gi * 8}>
              {g.terms.map((term) => (
                <Link key={term} to="/search" search={{ q: term }} className="v-mq-term">
                  {term}
                </Link>
              ))}
            </Marquee>
          </div>
        ))}
      </section>

      {/* ── EDITORIAL — restored, the photographs ────────────────────────── */}
      <section className="v-editorial">
        <VoidReveal dir="left" className="v-editorial-head">
          <p className="t-eyebrow">The room this gets read in</p>
          <h2 className="v-h2 v-h2-sm">A phone, a kitchen table, and one hour after work.</h2>
        </VoidReveal>
        <div className="v-editorial-row">
          {EDITORIAL.map((img, i) => (
            <VoidReveal key={img.src} dir={i === 0 ? "left" : "right"} delay={i * 120}>
              <figure
                className="v-fig"
                style={{ transform: `rotate(${img.tilt}deg)`, marginTop: img.lift }}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
              </figure>
            </VoidReveal>
          ))}
        </div>
      </section>

      {/* ── PRICING — restored as its own section ────────────────────────── */}
      <section className="v-pricing">
        <VoidReveal dir="up">
          <p className="t-eyebrow">Pricing, honestly</p>
          <p className="v-price-n">Free</p>
          <p className="v-price-s">
            That is the whole pricing page. No tier, no trial that expires, no upgrade prompt
            sitting on top of the research.
          </p>
        </VoidReveal>
      </section>

      {/* ── BRAND STATEMENT — restored ───────────────────────────────────── */}
      <section className="v-brand">
        <VoidReveal dir="up">
          <p className="t-eyebrow">Who we are</p>
          <Floating3DParticles className="v-brand-p3d" count={110} />
          <p className="v-brand-mark">
            <HyperText text="BRO BUSINESS IDEAS" />
          </p>
          <p className="v-brand-sub">
            A library, not a launchpad. The research is the product, and it is open.
          </p>
        </VoidReveal>
      </section>

      {/* ── INSPIRED BY — restored, as a quote ───────────────────────────── */}
      <section className="v-quote">
        <VoidReveal dir="up">
          <blockquote className="v-quote-b">
            We didn&rsquo;t invent this model. We learned it — from the people who had already
            started something and were willing to say what it actually cost them.
          </blockquote>
          <p className="v-quote-c">Where this came from</p>
        </VoidReveal>
      </section>

      {/* ── TEAM — restored, one line ────────────────────────────────────── */}
      <section className="v-team">
        <VoidReveal dir="left">
          <p className="t-eyebrow">Who&rsquo;s behind this</p>
          <p className="v-team-l">
            Built by hand, not by a headcount. One person, researching and writing, with the ideas,
            the model and the architecture their own.
          </p>
        </VoidReveal>
      </section>

      {/* ── PROMISE — restored as its own section ────────────────────────── */}
      <section className="v-promise">
        <VoidReveal dir="up">
          <p className="t-eyebrow">Our promise</p>
          <p className="v-promise-h">
            We&rsquo;re not here to sell you a dream. We&rsquo;re here to hand you the research.
          </p>
        </VoidReveal>
      </section>

      {/* ── 7. COLUMN ────────────────────────────────────────────────────── */}
      <section className="v-column">
        <VoidReveal dir="up">
          <p className="t-eyebrow">Who we built this for</p>
          <p className="v-column-p">
            No capital, no team, often no laptop — reading this on a phone, late, after searching
            “business ideas” one more time.
          </p>
          <p className="v-column-p">
            We have been there. That is the entire audience, and the reason none of it costs money.
          </p>
          <p className="v-column-p v-column-p-quiet">
            Every figure traces to a real source. Where something cannot be verified, the blueprint
            says so instead of inventing a number.
          </p>
          <Link to="/browse" data-cta="primary" className="v-column-cta">
            Browse the library
          </Link>
        </VoidReveal>
      </section>

      <VoidFooter categories={categories} totalIdeas={catalog.totalIdeas} />
    </>
  );
}
