import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { useCallback } from "react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getListicleIndex, type ListicleSummary } from "@/lib/lists.functions";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";
import { useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";

/**
 * PROJECT_BRIEF.md Section 6.3 — the index of every listicle. One listicle per
 * category, so this page is generated entirely from the live category set and
 * never from a hand-kept array: a new category in Supabase appears here on its
 * own, with its own real idea count.
 */
const listsQuery = queryOptions<ListicleSummary[]>({
  queryKey: ["listicles"],
  queryFn: () => getListicleIndex(),
});

export const Route = createFileRoute("/list/")({
  // Read in the component through Route.useLoaderData(), not useSuspenseQuery:
  // this app's QueryClient is not dehydrated to the client, so a client-side
  // suspense read of this key would re-run the query and mismatch the SSR'd
  // markup (same reason idea.$slug.tsx reads its loader data directly).
  loader: ({ context }) => context.queryClient.ensureQueryData(listsQuery),
  head: ({ loaderData }) => {
    const lists = loaderData ?? [];
    const totalIdeas = lists.reduce((sum, list) => sum + list.ideaCount, 0);
    const description = totalIdeas
      ? `${lists.length} ranked business idea lists covering ${totalIdeas} researched blueprints, ordered by trend score.`
      : "Ranked business idea lists, one per category, ordered by trend score.";
    return {
      meta: [
        { title: "Business Idea Lists | BBI" },
        { name: "description", content: description },
        { property: "og:title", content: "Business Idea Lists | BBI" },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ListIndexPage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">Couldn't load the lists — try refreshing.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">That page doesn't exist.</p>
    </SiteShell>
  ),
});

function ListIndexPage() {
  const lists = Route.useLoaderData();
  const totalIdeas = lists.reduce((sum, list) => sum + list.ideaCount, 0);

  // MOTION_SPEC section 3, listing pages: one delegated pointer listener on
  // the grid rather than one per cell, and the short 0.03s stagger so the
  // whole grid lands quickly. No tilt and no magnet — this is a scanning
  // surface. Both hooks anchor on the same node, so they share one callback ref.
  const headingRef = useTextReveal<HTMLHeadingElement>();
  const pointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  const revealRef = useStaggerReveal<HTMLDivElement>({ selector: ".mo-card", stagger: 0.03 });
  const gridRef = useCallback(
    (node: HTMLDivElement | null) => {
      pointerRef.current = node;
      revealRef.current = node;
    },
    [pointerRef, revealRef],
  );

  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/list",
            name: "Business Idea Lists",
            description: "Ranked business idea lists, one per category, ordered by trend score.",
            itemCount: lists.length,
          }),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Business Idea Lists",
            numberOfItems: lists.length,
            itemListElement: lists.map((list, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: list.title,
              url: `${siteUrl()}/list/${list.categorySlug}`,
            })),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lists", path: "/list" },
          ]),
        ]}
      />
      <SiteShell>
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Lists" }]} />
          <h1 ref={headingRef} className="bbi-heading-glow mt-4 text-3xl font-bold tracking-tight">
            Every list, ranked
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            One list per category, ordered by trend score. The first ten of each are written out in
            full; the rest link straight to their blueprints.
          </p>
          {lists.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {lists.length} lists · {totalIdeas} ideas
            </p>
          )}

          {lists.length === 0 ? (
            <p className="mt-12 text-muted-foreground">No lists are published yet.</p>
          ) : (
            <div ref={gridRef} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lists.map((list) => (
                <Link
                  key={list.categorySlug}
                  to="/list/$slug"
                  params={{ slug: list.categorySlug }}
                  className="glass glass-hover mo-card group flex h-full min-w-0 flex-col gap-3 rounded-3xl p-6"
                >
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {list.ideaCount} ideas
                  </span>
                  <h2 className="break-words text-lg font-semibold leading-snug transition-colors duration-300 group-hover:text-accent">
                    {list.title}
                  </h2>
                  {list.topIdeaTitle && (
                    <p className="mt-auto break-words pt-2 text-sm text-muted-foreground">
                      Leads with {list.topIdeaTitle}
                      {list.topTrendScore !== null && (
                        <span className="text-accent"> · Trend {list.topTrendScore}</span>
                      )}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
          {/* EDITABLE SECTION END */}
        </div>
      </SiteShell>
    </>
  );
}
