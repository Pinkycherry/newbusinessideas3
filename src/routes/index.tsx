import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell } from "@/components/site-shell";
import { TiltPanel } from "@/components/tilt-panel";
import { getCatalog, getTrendingIdeas } from "@/lib/ideas.functions";

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });
const trendingQuery = queryOptions({ queryKey: ["trending"], queryFn: () => getTrendingIdeas() });

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      context.queryClient.ensureQueryData(trendingQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "IdeaVault AI — Researched Business Idea Blueprints" },
      {
        name: "description",
        content:
          "Browse researched business idea blueprints with real market context, pros, cons, trend scores and a straight founder-fit verdict.",
      },
      { property: "og:title", content: "IdeaVault AI — Researched Business Idea Blueprints" },
      {
        property: "og:description",
        content:
          "Researched business idea blueprints with pros, cons, trend scores and founder-fit verdicts.",
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
  const { data: trending } = useSuspenseQuery(trendingQuery);
  const highlights = trending.slice(0, 3);

  return (
    <SiteShell>
      <section className="px-3 pt-10 sm:px-4 sm:pt-16">
        <TiltPanel className="mx-auto max-w-6xl" max={4}>
          <div className="glass rounded-[2rem] px-6 py-14 sm:px-12 sm:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent sm:text-xs">
              {catalog.totalIdeas} live blueprints
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Business ideas,{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent [text-shadow:0_0_40px_oklch(0.723_0.161_56/25%)]">
                researched properly
              </span>{" "}
              — not listicles.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Every entry in the vault is a blueprint: who the customer is, how the money works, what
              will hurt, and a blunt verdict on who should actually build it.
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

            <dl className="mt-12 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Blueprints", value: catalog.totalIdeas },
                { label: "Categories", value: catalog.categories.length },
                {
                  label: "Subcategories",
                  value: catalog.categories.reduce((n, c) => n + c.subcategories.length, 0),
                },
              ].map((stat) => (
                <div key={stat.label} className="glass glass-hover rounded-2xl px-5 py-4">
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

      <section className="mx-auto max-w-6xl px-3 py-16 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              This week's picks
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

          <aside className="glass rounded-3xl p-7 lg:mt-16 lg:self-start sm:p-9">
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

      <section className="mx-auto max-w-6xl px-3 pb-10 sm:px-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              to: "/browse" as const,
              eyebrow: "Explore",
              title: "Browse the vault",
              body: `Every blueprint, organised across ${catalog.categories.length} categories and ${catalog.totalSubcategories} subcategories.`,
            },
            {
              to: "/search" as const,
              eyebrow: "Targeted",
              title: "Search by keyword",
              body: "Already know your market? Search titles, summaries, descriptions and tags in one pass.",
            },
            {
              to: "/blog" as const,
              eyebrow: "Long-form",
              title: "Founder playbooks",
              body: "Deep-dive articles on building in specific markets — separate from the idea library.",
            },
          ].map((card) => (
            <Link key={card.to} to={card.to} className="glass glass-hover rounded-3xl p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                {card.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
