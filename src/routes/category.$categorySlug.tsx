import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { AdSlot } from "@/components/AdSlot";
import { getCategoryPage } from "@/lib/ideas.functions";

const categoryQuery = (categorySlug: string) =>
  queryOptions({
    queryKey: ["category", categorySlug],
    queryFn: () => getCategoryPage({ data: { categorySlug } }),
  });

export const Route = createFileRoute("/category/$categorySlug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(categoryQuery(params.categorySlug));
    if (!data.categoryName) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.categoryName ?? "Category";
    return {
      meta: [
        { title: `${name} Business Ideas | IdeaVault AI` },
        {
          name: "description",
          content: `Explore ${loaderData?.ideas.length ?? 0} researched ${name} business ideas with pros, cons, verdicts and trend scores.`,
        },
        { property: "og:title", content: `${name} Business Ideas | IdeaVault AI` },
        {
          property: "og:description",
          content: `Researched ${name} business blueprints with pros, cons and verdicts.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">This category could not be loaded.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">No such category.</p>
    </SiteShell>
  ),
});

function CategoryPage() {
  const { categorySlug } = Route.useParams();
  const { data } = useSuspenseQuery(categoryQuery(categorySlug));
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Browse", to: "/browse" },
            { label: data.categoryName ?? categorySlug },
          ]}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{data.categoryName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{data.ideas.length} ideas</p>

        <div className="mt-8">
          <AdSlot position="category-above-grid" size="banner" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.ideas.map((idea, i) => (
            <Fragment key={idea.ideaId}>
              <IdeaCard idea={idea} />
              {(i + 1) % 6 === 0 && i + 1 < data.ideas.length && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <AdSlot position={`category-in-grid-${(i + 1) / 6}`} size="banner" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
        {/* EDITABLE SECTION END */}
      </div>
    </SiteShell>
  );
}