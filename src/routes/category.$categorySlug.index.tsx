import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, useCallback, type CSSProperties } from "react";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { categoryImage } from "@/config/category-imagery";
import { AdSlot } from "@/components/AdSlot";
import { getCategoryPage } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { hideImgIfBroken } from "@/lib/utils";
import {
  useElementPointerGroup,
  useDepthScene,
  useScrollProgress,
  useStaggerReveal,
  useTextReveal,
} from "@/motion";

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
  head: ({ loaderData, params }) => {
    const name = loaderData?.categoryName ?? "Category";
    const image = categoryImage(params.categorySlug);
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
        // The category's featured image is also its share card. Its alt text
        // is the alt text in IMAGE_SEO.md, so the same four keywords describe
        // it to a screen reader, to a crawler and to a link preview.
        { property: "og:image", content: image.src },
        { property: "og:image:alt", content: image.alt },
        { name: "twitter:image", content: image.src },
      ],
    };
  },
  component: CategoryPage,
  errorComponent: () => (
    <SiteShell tone="instrument">
      <p className="mx-auto max-w-6xl px-4 py-24">Couldn't load this category — try refreshing.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell tone="instrument">
      <p className="mx-auto max-w-6xl px-4 py-24">We don't have that category.</p>
    </SiteShell>
  ),
});

function CategoryPage() {
  const { categorySlug } = Route.useParams();
  const { data } = useSuspenseQuery(categoryQuery(categorySlug));
  const categoryName = data.categoryName ?? categorySlug;
  const categoryPath = `/category/${categorySlug}`;
  const featured = categoryImage(categorySlug);

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
  // Publishes --sc-p for the depth planes below. Breadcrumbs stay off the
  // planes: navigation should not drift while you are trying to click it.
  const depthRef = useScrollProgress<HTMLDivElement>();
  // Masthead depth scene. Listing pages are scanning surfaces, so the cursor
  // work is confined to the header — the grid below stays still under the eye
  // (MOTION_SPEC section 3: no tilt, no magnet on listings).
  const mastheadRef = useDepthScene<HTMLDivElement>({ strength: 0.45, scroll: false });
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
      <SiteShell tone="instrument">
        <div ref={depthRef} className="bbi-depth mx-auto max-w-6xl px-4 py-12">
          {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Browse", to: "/browse" },
              { label: data.categoryName ?? categorySlug },
            ]}
          />
          <div ref={mastheadRef} className="bbi-depth-back cx-scene">
            <h1
              ref={headingRef}
              style={{ "--z": 0.5 } as CSSProperties}
              className="bbi-heading-glow cx-layer mt-4 text-3xl font-bold tracking-tight"
            >
              {data.categoryName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{data.ideas.length} ideas</p>
            {/* The category's featured image, served from this domain. Its
                file name, alt text and caption all follow IMAGE_SEO.md. */}
            <figure className="mo-media glass relative mt-6 aspect-[21/9] w-full overflow-hidden">
              <img
                ref={hideImgIfBroken}
                src={featured.src}
                alt={featured.alt}
                width={1200}
                height={514}
                loading="eager"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
              <figcaption className="absolute bottom-3 left-4 right-4 text-[11px] leading-snug text-[var(--ins-read)]">
                {featured.description}
              </figcaption>
            </figure>
          </div>

          {/* Ad and grid share the FRONT plane so they travel together. Split
              across planes they would converge on each other, and the ad-to-grid
              gap is only 32px. */}
          <div className="bbi-depth-front mt-8">
            <AdSlot position="category-above-grid" size="banner" />
          </div>

          <div
            ref={gridRef}
            className="bbi-depth-front mt-8 grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-3"
          >
            {data.ideas.map((idea, i) => (
              <Fragment key={idea.ideaId}>
                <IdeaCard idea={idea} featured={idea.ideaId === leadIdeaId} />
                {(i + 1) % 6 === 0 && i + 1 < data.ideas.length && (
                  <div className="[grid-column:1/-1]">
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
