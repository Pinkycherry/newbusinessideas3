import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { ExploreRail } from "@/components/explore-rail";
import { getCatalog } from "@/lib/ideas.functions";
import FocusCards from "@/components/aceternity/focus-cards";
import { categoryImage } from "@/config/category-imagery";
import { absoluteUrl, JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { PAGE_IMAGES, pageImageMeta } from "@/config/page-imagery";
import { PageHeroImage } from "@/components/page-hero-image";
import { usePillInteraction } from "@/hooks/use-pill-interaction";
import { useScrollProgress, useTextReveal } from "@/motion";

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });

export const Route = createFileRoute("/browse")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { title: "Browse Business Idea Categories | BBI – Bro Business Ideas" },
      {
        name: "description",
        content:
          "Browse every business idea category and subcategory in the BBI library, from AI automation to fintech and creator media.",
      },
      {
        property: "og:title",
        content: "Browse Business Idea Categories | BBI – Bro Business Ideas",
      },
      {
        property: "og:description",
        content:
          "Browse the BBI idea library by category and subcategory. Explore practical business models and use Validate for current local details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...pageImageMeta(PAGE_IMAGES.browse, absoluteUrl),
    ],
  }),
  component: BrowsePage,
  errorComponent: () => (
    <SiteShell tone="instrument">
      <p className="mx-auto max-w-6xl px-4 py-24">
        Couldn't load the idea library — try refreshing.
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell tone="instrument">
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
            image: PAGE_IMAGES.browse.src,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Browse", path: "/browse" },
          ]),
        ]}
      />
      <SiteShell tone="instrument">
        <div ref={depthRef} className="bbi-depth mx-auto max-w-6xl px-4 py-12">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Browse" }]} />
          <div className="bbi-depth-back">
            <h1 ref={headingRef} className="mt-4 text-3xl font-bold tracking-tight">
              The full idea library
            </h1>
            {/* The total comes from live completed ideas. The new expansion
                categories are grouped by their ten approved subcategories. */}
            <p className="mt-2 text-sm text-muted-foreground">
              {data.totalIdeas} business ideas across {data.totalCategories} categories
            </p>
            {/* Someone landing on the library from search has no idea what it
                costs, and the answer is the most persuasive thing on the page. */}
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Free after one sign-in · No credit card · Pay nothing, ever
            </p>
            <PageHeroImage image={PAGE_IMAGES.browse} />
          </div>
          {/* Was `space-y-6`: fourteen full-width bars, each holding a single
              line of text and a count, roughly 1,600px of page to say what a
              grid says in 400. FocusCards instead: hovering one category pulls
              it forward and lets the rest fall back, so a long grid answers
              where the reader is looking. Photography is this site's own
              committed category images (src/config/category-imagery.ts) --
              matched to the category, not an external, unreliable source. */}
          <FocusCards
            className="bbi-depth-front mt-8"
            cards={data.categories.map((category) => {
              const photo = categoryImage(category.categorySlug);
              return {
                title: category.categoryName,
                meta: `${category.ideaCount} blueprints`,
                src: photo.src,
                alt: photo.alt,
                to: "/category/$categorySlug",
                params: { categorySlug: category.categorySlug },
              };
            })}
          />

          <ExploreRail exclude="ideas" heading="Keep exploring" />
        </div>
      </SiteShell>
    </>
  );
}
