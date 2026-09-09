import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getCatalog } from "@/lib/ideas.functions";
import FocusCards from "@/components/aceternity/focus-cards";
import { photoAt } from "@/config/imagery";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { usePillInteraction } from "@/hooks/use-pill-interaction";
import { useScrollProgress, useTextReveal } from "@/motion";

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
  const depthRef = useScrollProgress<HTMLDivElement>();
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
        <div ref={depthRef} className="bbi-depth mx-auto max-w-6xl px-4 py-12">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Browse" }]} />
          <div className="bbi-depth-back">
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
          </div>
          {/* Was `space-y-6`: fourteen full-width bars, each holding a single
              line of text and a count, roughly 1,600px of page to say what a
              grid says in 400. FocusCards instead: hovering one category pulls
              it forward and lets the rest fall back, so a long grid answers
              where the reader is looking. Photography comes from
              ethicalfounder.com, BBI's parent site — see src/config/imagery.ts. */}
          <FocusCards
            className="bbi-depth-front mt-8"
            cards={data.categories.map((category, index) => {
              const photo = photoAt(index);
              return {
                title: category.categoryName,
                meta: `${category.ideaCount} blueprints`,
                ...(photo ? { src: photo.src, alt: photo.alt } : {}),
                to: "/category/$categorySlug",
                params: { categorySlug: category.categorySlug },
              };
            })}
          />
        </div>
      </SiteShell>
    </>
  );
}
