import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, useCallback } from "react";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { AdSlot } from "@/components/AdSlot";
import { getCategoryPage } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";

const categoryQuery = (categorySlug: string) =>
  queryOptions({
    queryKey: ["category", categorySlug],
    queryFn: () => getCategoryPage({ data: { categorySlug } }),
  });

export const Route = createFileRoute("/category/$categorySlug/")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(categoryQuery(params.categorySlug));
    if (!data.categoryName) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.categoryName ?? "Category";
    return {
      meta: [
        { title: `${name} Business Ideas | BBI` },
        {
          name: "description",
          content: `Explore ${loaderData?.ideas.length ?? 0} researched ${name} business ideas with pros, cons, verdicts and trend scores.`,
        },
        { property: "og:title", content: `${name} Business Ideas | BBI` },
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
      <p className="mx-auto max-w-6xl px-4 py-24">Couldn't load this category — try refreshing.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">We don't have that category.</p>
    </SiteShell>
  ),
});

function CategoryPage() {
  const { categorySlug } = Route.useParams();
  const { data } = useSuspenseQuery(categoryQuery(categorySlug));
  const categoryName = data.categoryName ?? categorySlug;
  const categoryPath = `/category/${categorySlug}`;

  const headingRef = useTextReveal<HTMLHeadingElement>();
  // MOTION_SPEC section 3 — gallery grammar. `useElementPointerGroup` puts ONE
  // delegated listener on the grid for every cell in it (the largest category
  // renders 50), and the reveal runs at the short 0.03s stagger so a full grid
  // is on screen in well under a second. Both hooks target the same element,
  // so their refs are assigned together from one callback ref. The selector
  // deliberately matches `.mo-card` only: the ad slots interleaved into this
  // grid are not cards and must never be hidden or staggered.
  const pointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  const revealRef = useStaggerReveal<HTMLDivElement>({ selector: ".mo-card", stagger: 0.03 });
  const gridRef = useCallback(
    (node: HTMLDivElement | null) => {
      pointerRef.current = node;
      revealRef.current = node;
    },
    [pointerRef, revealRef],
  );

  // Brief section 12.7 — no repetitive same-size card walls. Exactly one tile
  // in the grid is enlarged, and which one is decided by real data rather than
  // an arbitrary index: the loader orders by trend_score DESC, so `ideas[0]`
  // is the highest-trending idea in this category. Below four results there is
  // no wall to break up, and an idea with no trend score has earned nothing.
  const lead = data.ideas.length >= 4 ? data.ideas[0] : undefined;
  const leadIdeaId = lead && lead.trendScore !== null ? lead.ideaId : null;

  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: categoryPath,
            name: `${categoryName} Business Ideas`,
            description: `Researched ${categoryName} business idea blueprints with pros, cons and verdicts.`,
            itemCount: data.ideas.length,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Browse", path: "/browse" },
            { name: categoryName, path: categoryPath },
          ]),
        ]}
      />
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
          <h1 ref={headingRef} className="bbi-heading-glow mt-4 text-3xl font-bold tracking-tight">
            {data.categoryName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.ideas.length} ideas</p>

          <div className="mt-8">
            <AdSlot position="category-above-grid" size="banner" />
          </div>

          <div ref={gridRef} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.ideas.map((idea, i) => (
              <Fragment key={idea.ideaId}>
                <IdeaCard idea={idea} featured={idea.ideaId === leadIdeaId} />
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
    </>
  );
}
