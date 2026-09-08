import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";
import { VoidParticles } from "@/components/void-particles";
import { VoidReveal, VoidHeadline } from "@/components/void-reveal";
import { GoldenTreeSection } from "@/components/golden-tree-section";
import { AdSlot } from "@/components/AdSlot";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedList } from "@/components/ui/animated-list";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
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
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">The idea library could not be loaded.</p>
    </SiteShell>
  ),
});

/**
 * A beat: one message, two columns, alternating side. This is the whole page
 * structure now.
 *
 * The reference is emphatic that density is the enemy — one or two things per
 * viewport, no card grids, no multi-column feature blocks — so the nineteen
 * dense sections the homepage used to carry were not deleted, they were given
 * room. Every message survives; the containers around them did not.
 *
 * `side` drives the composition AND the entrance direction together, which is
 * what stops the motion reading as one canned effect repeated a dozen times.
 */
function Beat({
  eyebrow,
  heading,
  children,
  side = "left",
}: {
  eyebrow: string;
  heading: string;
  children?: ReactNode;
  side?: "left" | "right";
}) {
  const textFirst = side === "left";
  return (
    <section className="bbi-beat">
      <div className={`bbi-beat-grid${textFirst ? "" : " is-flipped"}`}>
        <VoidReveal dir={textFirst ? "left" : "right"} className="bbi-beat-head">
          <p className="t-eyebrow">{eyebrow}</p>
          <h2 className="bbi-beat-h">{heading}</h2>
        </VoidReveal>
        <VoidReveal dir={textFirst ? "right" : "left"} delay={90} className="bbi-beat-body">
          {children}
        </VoidReveal>
      </div>
    </section>
  );
}

function HomePage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const { data: trending } = useSuspenseQuery(trendingQuery);

  const categories = catalog.categories;
  const topIdeas = trending.slice(0, 5);

  return (
    <SiteShell>
      {/* The ambient triangle field of the void. */}
      <VoidParticles />
      {/* AMBIENT TWIN RINGS — kept exactly as they were, by request. */}
      <div className="bbi-twin-ring ring-1" aria-hidden />
      <div className="bbi-twin-ring ring-2" aria-hidden />

      {/* LLM crawlable summary */}
      <p className="sr-only">
        BBI (Bro Business Ideas) is a business idea directory and startup intelligence library. This
        resource covers small business ideas, work from home business ideas, low investment startup
        ideas, business ideas for women, zero investment business ideas, and startup ideas organized
        by sector, investment level, and founder profile.
      </p>

      {/* ── THE AUTHORED MOMENT ─────────────────────────────────────────── */}
      <section className="bbi-hero">
        <VoidHeadline
          className="bbi-hero-h"
          lines={["Start from zero.", "Not from a", "blank page."]}
        />
        <VoidReveal dir="up" delay={420}>
          <p className="t-lead bbi-hero-lead">
            Every idea here answers four things: who specifically will pay you, how the money
            actually works, what will hurt in year one, and whether you should build it at all —
            including when the answer is no.
          </p>
          <div className="bbi-hero-cta">
            <Link to="/browse" data-cta="primary">
              Browse the library
              <BorderBeam size={70} duration={6} />
            </Link>
          </div>
          <p className="t-meta bbi-hero-meta">
            <AnimatedShinyText>
              <NumberTicker value={catalog.totalIdeas} startValue={0} delay={700} /> researched
              blueprints across{" "}
              <NumberTicker value={categories.length} startValue={0} delay={900} /> categories.
              Free, no account.
            </AnimatedShinyText>
          </p>
        </VoidReveal>
      </section>

      {/* ── THE TREE — unchanged, by request ────────────────────────────── */}
      <GoldenTreeSection categories={categories} />

      <div className="px-3 sm:px-4">
        <AdSlot position="homepage-hero-below" size="banner" />
      </div>

      <Beat
        eyebrow="The research standard"
        heading="Not just a list. Real research you can trust."
        side="left"
      >
        <p>
          Every blueprint is written against the same four questions, in the same order, whether the
          answer flatters the idea or not. No idea gets in because it sounded good.
        </p>
        <p>
          That is the whole standard. It is also why some entries end with a plain instruction not
          to build the thing.
        </p>
      </Beat>

      <Beat
        eyebrow="The problem we found"
        heading="Why is everyone still charging you $20 to check one idea?"
        side="right"
      >
        <p>
          Validation tools bill monthly for a handful of checks, behind a paywall, before you see
          whether any of it was worth paying for.
        </p>
        <p>
          You were going to spend that money starting the business. That is the part nobody says out
          loud.
        </p>
      </Beat>

      <Beat
        eyebrow="Step by step"
        heading="Grab the idea. Validate it however you want. Keep the money."
        side="left"
      >
        <p>
          Read the blueprint. Take the market context, the numbers, the year-one warnings. Then go
          and check it with whatever you already use.
        </p>
        <p>Nothing here asks for a card, an email, or an account to do that.</p>
      </Beat>

      {/* ── THE LIBRARY, AS AN EDITORIAL INDEX — NOT A CARD GRID ────────── */}
      <section className="bbi-beat">
        <VoidReveal dir="left" className="bbi-beat-head">
          <p className="t-eyebrow">Moving right now</p>
          <h2 className="bbi-beat-h bbi-beat-h-wide">What the library actually tells you.</h2>
        </VoidReveal>
        <AnimatedList className="bbi-list" delay={90}>
          {topIdeas.map((idea) => (
            <Link
              key={idea.ideaId}
              to="/idea/$slug"
              params={{ slug: idea.slug }}
              className="bbi-row-link"
            >
              <span className="bbi-row-title">{idea.title}</span>
              <span className="bbi-row-cat">{idea.categoryName}</span>
            </Link>
          ))}
        </AnimatedList>
        <VoidReveal dir="up" delay={120}>
          <p className="bbi-list-foot">
            <Link to="/browse">See all {catalog.totalIdeas} blueprints</Link>
          </p>
        </VoidReveal>
      </section>

      <Beat
        eyebrow="Who we built this for"
        heading="For the person with an idea and nothing else."
        side="right"
      >
        <p>
          No capital, no team, often no laptop — reading this on a phone, late, after searching
          &ldquo;business ideas&rdquo; one more time.
        </p>
        <p>
          We have been there. That is the entire audience, and the reason none of it costs money.
        </p>
      </Beat>

      {/* ── CATEGORIES, AS A QUIET INDEX ────────────────────────────────── */}
      <section className="bbi-beat">
        <VoidReveal dir="left" className="bbi-beat-head">
          <p className="t-eyebrow">Ways into the library</p>
          <h2 className="bbi-beat-h bbi-beat-h-wide">
            Start from a theme instead of a blank search box.
          </h2>
        </VoidReveal>
        <VoidReveal dir="up" delay={90}>
          <ul className="bbi-index">
            {categories.map((c) => (
              <li key={c.categorySlug}>
                <Link to="/category/$categorySlug" params={{ categorySlug: c.categorySlug }}>
                  {c.categoryName}
                </Link>
              </li>
            ))}
          </ul>
        </VoidReveal>
      </section>

      <Beat
        eyebrow="Pricing, honestly"
        heading="It is free. That is the whole pricing page."
        side="right"
      >
        <p>
          No tier, no trial that expires, no upgrade prompt sitting on top of the research. The
          library is the product and it is open.
        </p>
      </Beat>

      <Beat
        eyebrow="Where this came from"
        heading="We didn’t invent this model. We learned it."
        side="left"
      >
        <p>
          The four questions are the ones anyone who has actually started something ends up asking.
          The only unusual part is writing the honest answer down where it can be read for free.
        </p>
      </Beat>

      <Beat eyebrow="Who’s behind this" heading="Built by hand, not by a headcount." side="right">
        <p>
          One person, researching and writing, with the ideas, the model and the architecture their
          own. Not a content farm.
        </p>
      </Beat>

      <Beat
        eyebrow="Our promise"
        heading="We’re not here to sell you a dream. We’re here to hand you the research."
        side="left"
      >
        <p>
          Every figure traces to a real source. Where something cannot be verified, the blueprint
          says so instead of inventing a number.
        </p>
        <div className="bbi-hero-cta">
          <Link to="/browse" data-cta="primary">
            Browse the library
          </Link>
        </div>
      </Beat>
    </SiteShell>
  );
}
