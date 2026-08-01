import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell } from "@/components/site-shell";
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
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            {catalog.totalIdeas} live blueprints
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight">
            Business ideas, researched properly — not listicles.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every entry in the vault is a blueprint: who the customer is, how the money works, what
            will hurt, and a blunt verdict on who should actually build it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse the vault
            </Link>
            <Link
              to="/search"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary"
            >
              Search by keyword
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Categories
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.categories.map((category) => (
            <Link
              key={category.categorySlug}
              to="/category/$categorySlug"
              params={{ categorySlug: category.categorySlug }}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <h3 className="text-base font-semibold">{category.categoryName}</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {category.ideaCount} ideas · {category.subcategories.length} subcategories
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
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
