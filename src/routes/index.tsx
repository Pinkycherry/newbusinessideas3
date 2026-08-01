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

      <section className="mx-auto max-w-6xl px-3 py-14 sm:px-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Categories
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.categories.map((category) => (
            <Link
              key={category.categorySlug}
              to="/category/$categorySlug"
              params={{ categorySlug: category.categorySlug }}
              className="glass glass-hover rounded-2xl p-5"
            >
              <h3 className="text-base font-semibold">{category.categoryName}</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {category.ideaCount} ideas · {category.subcategories.length} subcategories
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 pb-8 sm:px-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Highest trend scores
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((idea) => (
            <IdeaCard key={idea.ideaId} idea={idea} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
