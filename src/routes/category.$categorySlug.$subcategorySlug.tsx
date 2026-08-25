import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getSubcategoryPage } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";

const subQuery = (categorySlug: string, subcategorySlug: string) =>
  queryOptions({
    queryKey: ["subcategory", categorySlug, subcategorySlug],
    queryFn: () => getSubcategoryPage({ data: { categorySlug, subcategorySlug } }),
  });

export const Route = createFileRoute("/category/$categorySlug/$subcategorySlug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      subQuery(params.categorySlug, params.subcategorySlug),
    );
    if (!data.subcategoryName) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.subcategoryName ?? "Subcategory";
    return {
      meta: [
        { title: `${name} Ideas | BBI` },
        {
          name: "description",
          content: `Business idea blueprints in ${name}: what the business is, who it serves, pros, cons and a founder-fit verdict.`,
        },
        { property: "og:title", content: `${name} Ideas | BBI` },
        {
          property: "og:description",
          content: `Business idea blueprints in ${name} with pros, cons and a founder-fit verdict.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: SubcategoryPage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">
        Couldn't load this subcategory — try refreshing.
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">We don't have that subcategory.</p>
    </SiteShell>
  ),
});

function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = Route.useParams();
  const { data } = useSuspenseQuery(subQuery(categorySlug, subcategorySlug));
  const categoryName = data.categoryName ?? categorySlug;
  const subcategoryName = data.subcategoryName ?? subcategorySlug;
  const subcategoryPath = `/category/${categorySlug}/${subcategorySlug}`;

  const headingRef = useTextReveal<HTMLHeadingElement>();
  // MOTION_SPEC section 3 — same gallery grammar as the category grid: one
  // delegated pointer listener for the whole grid, one short-stagger reveal,
  // both on the same container element via a single callback ref.
  const pointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  const revealRef = useStaggerReveal<HTMLDivElement>({ selector: ".mo-card", stagger: 0.03 });
  const gridRef = useCallback(
    (node: HTMLDivElement | null) => {
      pointerRef.current = node;
      revealRef.current = node;
    },
    [pointerRef, revealRef],
  );

  // Brief section 12.7 — one earned emphasis per grid. The loader orders by
  // trend_score DESC, so `ideas[0]` is the highest-trending idea here.
  const lead = data.ideas.length >= 4 ? data.ideas[0] : undefined;
  const leadIdeaId = lead && lead.trendScore !== null ? lead.ideaId : null;

  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: subcategoryPath,
            name: `${subcategoryName} Business Ideas`,
            description: `Business idea blueprints in ${subcategoryName}: what the business is, who it serves, pros, cons and a founder-fit verdict.`,
            itemCount: data.ideas.length,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Browse", path: "/browse" },
            { name: categoryName, path: `/category/${categorySlug}` },
            { name: subcategoryName, path: subcategoryPath },
          ]),
        ]}
      />
      <SiteShell>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Browse", to: "/browse" },
              {
                label: data.categoryName ?? categorySlug,
                to: "/category/$categorySlug",
                params: { categorySlug },
              },
              { label: data.subcategoryName ?? subcategorySlug },
            ]}
          />
          <h1 ref={headingRef} className="mt-4 text-3xl font-bold tracking-tight">
            {data.subcategoryName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.ideas.length} ideas</p>
          <div ref={gridRef} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.ideas.map((idea) => (
              <IdeaCard key={idea.ideaId} idea={idea} featured={idea.ideaId === leadIdeaId} />
            ))}
          </div>
        </div>
      </SiteShell>
    </>
  );
}
