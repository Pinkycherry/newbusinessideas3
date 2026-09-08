import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { VoidParticles } from "@/components/void-particles";
import { VoidReveal, VoidHeadline } from "@/components/void-reveal";
import { VoidHeader, VoidFooter } from "@/components/void-shell";
import { GoldenTreeSection } from "@/components/golden-tree-section";
import { AdSlot } from "@/components/AdSlot";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { KineticText } from "@/components/ui/kinetic-text";
import { catalogQuery, getTrendingIdeas } from "@/lib/ideas.functions";

const trendingQuery = queryOptions({
  queryKey: ["trending"],
  queryFn: () => getTrendingIdeas(),
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
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

      {/* ── 3. TREE — unchanged, by request ──────────────────────────────── */}
      <GoldenTreeSection categories={categories} />

      <div className="px-3 sm:px-4">
        <AdSlot position="homepage-hero-below" size="banner" />
      </div>

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
            Behind a paywall, before you see whether any of it was worth paying for.
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

      {/* ── 7. COLUMN ────────────────────────────────────────────────────── */}
      <section className="v-column">
        <VoidReveal dir="up">
          <p className="t-eyebrow">Who we built this for</p>
          <p className="v-column-p">
            No capital, no team, often no laptop — reading this on a phone, late, after searching
            “business ideas” one more time.
          </p>
          <p className="v-column-p">
            We have been there. That is the entire audience, and the reason none of it costs money:
            no tier, no trial that expires, no upgrade prompt sitting on top of the research.
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
