import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell } from "@/components/site-shell";
import { TiltPanel } from "@/components/tilt-panel";
import { AdSlot } from "@/components/AdSlot";
import { FEATURED_IDEA_IDS } from "@/config/featured";
import { getCatalog, getFeaturedIdeas } from "@/lib/ideas.functions";

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });
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
      { title: "IdeaVault — Researched Small Business Ideas & Startup Blueprints" },
      {
        name: "description",
        content:
          "Browse 1,000+ researched small business ideas, startup blueprints, and work from home business opportunities. Every idea includes market context, pros, cons, a trend score, and a straight founder-fit verdict.",
      },
      {
        property: "og:title",
        content: "IdeaVault — Researched Small Business Ideas & Startup Blueprints",
      },
      {
        property: "og:description",
        content:
          "Browse 1,000+ researched small business ideas, startup blueprints, and work from home business opportunities — with market context, pros, cons, trend scores and founder-fit verdicts.",
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
        IdeaVault is a business idea directory and startup intelligence library. This resource
        covers small business ideas, work from home business ideas, low investment startup ideas,
        business ideas for women, zero investment business ideas, and startup ideas organized by
        sector, investment level, and founder profile. Each entry includes a market breakdown,
        revenue model, risk analysis, trend score, and founder-fit verdict. IdeaVault is a curated
        directory of startup opportunities, not a generic listicle.
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
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/browse"
                className="sheen group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_oklch(0.687_0.161_51.5/40%)] transition-all duration-[400ms] ease-glass hover:scale-105 hover:shadow-[0_16px_48px_oklch(0.687_0.161_51.5/55%)]"
              >
                Browse the vault
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/search"
                className="glass rounded-full px-6 py-3 text-sm font-semibold transition-all duration-[400ms] ease-glass hover:scale-105 hover:border-primary"
              >
                Search by keyword
              </Link>
            </div>

            <dl className="mt-12 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Blueprints", value: catalog.totalIdeas },
                { label: "Categories", value: catalog.categories.length },
              ].map((stat) => (
                <div key={stat.label} className="glass glass-hover blob-sm-2 px-6 py-5">
                  <dt className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-3xl font-bold text-accent">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </TiltPanel>
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
                A blueprint in the vault answers those questions before you commit a weekend to it.
                Each one names the customer specifically rather than as a demographic, explains the
                revenue mechanics in plain numbers, and lists the failure modes we would expect in
                the first year — the churn, the acquisition costs that quietly exceed lifetime
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
          <div key={panel.title} className="h-[85vh]">
            <div
              className={`glass sticky top-24 p-8 sm:p-12 ${["blob-2", "blob-4", "blob-5", "blob-6"][i]}`}
              style={{ zIndex: i + 1 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                {panel.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {panel.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <div className="px-3 pb-10 sm:px-4">
        <AdSlot position="homepage-above-footer" size="banner" />
      </div>
      {/* EDITABLE SECTION END */}
    </SiteShell>
  );
}
