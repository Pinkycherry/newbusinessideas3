import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getCatalog } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });

export const Route = createFileRoute("/browse")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { title: "Browse Business Idea Categories | BBI" },
      {
        name: "description",
        content:
          "Browse every business idea category and subcategory in the BBI library, from AI automation to fintech and creator media.",
      },
      { property: "og:title", content: "Browse Business Idea Categories | BBI" },
      {
        property: "og:description",
        content: "Every category and subcategory in the BBI business idea library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrowsePage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">The idea library could not be loaded.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">Not found.</p>
    </SiteShell>
  ),
});

function BrowsePage() {
  const { data } = useSuspenseQuery(catalogQuery);
  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/browse",
            name: "Browse Business Idea Categories",
            description: "Every category and subcategory in the BBI business idea library.",
            itemCount: data.totalIdeas,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Browse", path: "/browse" },
          ]),
        ]}
      />
      <SiteShell>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Browse" }]} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight">The full idea library</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.totalIdeas} ideas · {data.totalSubcategories} subcategories ·{" "}
            {data.categories.length} categories
          </p>
          <div className="mt-10 space-y-10">
            {data.categories.map((category) => (
              <section key={category.categorySlug}>
                <div className="flex items-baseline justify-between border-b border-border pb-2">
                  <Link
                    to="/category/$categorySlug"
                    params={{ categorySlug: category.categorySlug }}
                    className="text-xl font-semibold hover:text-primary"
                  >
                    {category.categoryName}
                  </Link>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {category.ideaCount} ideas
                  </span>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {category.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        to="/category/$categorySlug/$subcategorySlug"
                        params={{ categorySlug: category.categorySlug, subcategorySlug: sub.slug }}
                        className="flex items-center rounded-md border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-primary"
                      >
                        <span>{sub.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </SiteShell>
    </>
  );
}
