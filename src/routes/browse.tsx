import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getCatalog } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { usePillInteraction } from "@/hooks/use-pill-interaction";
import { useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";

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
      <p className="mx-auto max-w-6xl px-4 py-24">
        Couldn't load the idea library — try refreshing.
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">That page doesn't exist.</p>
    </SiteShell>
  ),
});

function SubcategoryPill({
  categorySlug,
  subcategorySlug,
  label,
}: {
  categorySlug: string;
  subcategorySlug: string;
  label: string;
}) {
  const pill = usePillInteraction<HTMLAnchorElement>();
  return (
    <Link
      to="/category/$categorySlug/$subcategorySlug"
      params={{ categorySlug, subcategorySlug }}
      className="glass-pill iv-tag px-4 py-2 text-sm"
      ref={pill.ref}
      onMouseEnter={pill.onMouseEnter}
      onMouseLeave={pill.onMouseLeave}
      onPointerDown={pill.onPointerDown}
      onPointerUp={pill.onPointerUp}
    >
      {label}
    </Link>
  );
}

function BrowsePage() {
  const { data } = useSuspenseQuery(catalogQuery);
  const headingRef = useTextReveal<HTMLHeadingElement>();
  // MOTION_SPEC section 3 — gallery grammar. One delegated pointer listener
  // for all 14 category panels, and one short-stagger reveal, both anchored
  // on the same container element, so they share a single callback ref.
  const pointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  const revealRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.03 });
  const listRef = useCallback(
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
          <h1 ref={headingRef} className="mt-4 text-3xl font-bold tracking-tight">
            The full idea library
          </h1>
          {/* One line, two figures. The third used to be "N subcategories",
              which was the idea count wearing a different label —
              subcategory_name is byte-identical to title, so there are exactly
              as many subcategories as ideas and the number said nothing. */}
          <p className="mt-2 text-sm text-muted-foreground">
            {data.totalIdeas} researched blueprints across {data.totalCategories} categories
          </p>
          {/* Was `space-y-6`: fourteen full-width bars, each holding a single
              line of text and a count, roughly 1,600px of page to say what a
              grid says in 400. Compact three-up grid instead — the card is
              sized to its content rather than to the container. */}
          <div ref={listRef} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.categories.map((category) => (
              <section
                key={category.categorySlug}
                className="glass glass-hover mo-card rounded-2xl px-4 py-4 sm:px-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/category/$categorySlug"
                    params={{ categorySlug: category.categorySlug }}
                    className="bbi-heading-glow text-base font-bold leading-snug tracking-tight text-foreground transition-colors hover:text-primary sm:text-lg"
                  >
                    {category.categoryName}
                  </Link>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {category.ideaCount}
                  </span>
                </div>
                {/* This block used to render one pill per SUBCATEGORY, and
                    since every idea carries its own unique subcategory that
                    meant one pill per idea — 290 of them on this page today,
                    each labelled with an idea's own title and linking to a
                    one-card page duplicating it. At the 10,000-page target it
                    would have been 10,000 pills in a single tag cloud.

                    The category link and its count above are the navigation.
                    The card stays a card at any catalogue size. */}
              </section>
            ))}
          </div>
        </div>
      </SiteShell>
    </>
  );
}
