import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, useCallback, type CSSProperties } from "react";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { AdSlot } from "@/components/AdSlot";
import { ExploreBanner, EXPLORE_BANNER_ROTATION } from "@/components/explore-rail";
import { categoryImage } from "@/config/category-imagery";
import { EXPANSION_SUBCATEGORIES } from "@/config/expansion-taxonomy";
import { getExpansionCategoryPage } from "@/lib/expansion-category.functions";
import { getCategoryPage } from "@/lib/ideas.functions";
import { JsonLd, absoluteUrl, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
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
    queryFn: () =>
      EXPANSION_SUBCATEGORIES[categorySlug]
        ? getExpansionCategoryPage({ data: { categorySlug } })
        : getCategoryPage({ data: { categorySlug } }),
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
    const isExpansionCategory = Boolean(EXPANSION_SUBCATEGORIES[params.categorySlug]);
    return {
      meta: [
        { title: `${name} Business Ideas | BBI – Bro Business Ideas` },
        {
          name: "description",
          content: isExpansionCategory
            ? `Explore ten ${name} collections and their practical business ideas for Indian readers.`
            : `Explore ${loaderData?.ideas.length ?? 0} ${name} business ideas with pros, cons and verdicts.`,
        },
        { property: "og:title", content: `${name} Business Ideas | BBI – Bro Business Ideas` },
        {
          property: "og:description",
          content: isExpansionCategory
            ? `Browse ten ${name} collections and their business ideas.`
            : `${name} business ideas with pros, cons and verdicts.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        // The category's featured image doubles as its share card. Alt text
        // is the same one IMAGE_SEO.md assigns it, so a screen reader, a
        // crawler and a link preview all describe it identically.
        { property: "og:image", content: absoluteUrl(image.src) },
        { property: "og:image:alt", content: image.alt },
        { name: "twitter:image", content: absoluteUrl(image.src) },
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
  const expansionSubcategories = EXPANSION_SUBCATEGORIES[categorySlug];
  // The approved expansion taxonomy defines the new three-level navigation.
  // Every legacy category keeps its existing direct idea-card layout.
  const showLegacyGrid = !expansionSubcategories;
  const totalIdeas = "totalIdeas" in data ? data.totalIdeas : data.ideas.length;
  const expansionCounts = "subcategoryCounts" in data ? data.subcategoryCounts : [];
  const subcategoryCounts = new Map<string, number>(
    expansionCounts.map((item): [string, number] => [item.slug, item.ideaCount]),
  );

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
            description: expansionSubcategories
              ? `Ten ${categoryName} collections with practical ideas for Indian readers.`
              : `${categoryName} business ideas with pros, cons and verdicts.`,
            itemCount: totalIdeas,
            image: featured.src,
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
            <p className="mt-2 text-sm text-muted-foreground">
              {expansionSubcategories
                ? `10 subcategories · ${totalIdeas} ideas`
                : `${totalIdeas} ideas`}
            </p>
            {/* Category pages are the most common organic landing point after
                an idea page, and they said nothing about the price. */}
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Free after one sign-in · No credit card · Pay nothing, ever
            </p>
            {/* The category's featured image, served from this domain. File
                name, alt text and caption all follow IMAGE_SEO.md. `.mo-media`
                gives it the same subtle hover zoom every other media slot on
                the site uses (motion.css) -- no bespoke effect invented here. */}
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

          {expansionSubcategories && (
            <section className="bbi-depth-front mt-8" aria-labelledby="subcategory-heading">
              <h2 id="subcategory-heading" className="text-2xl font-semibold tracking-tight">
                Explore the ten subcategories
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick a subject to see its business ideas. Collections fill out as new ideas are
                added.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {expansionSubcategories.map((subcategory) => {
                  const count = subcategoryCounts.get(subcategory.slug) ?? 0;
                  const content = (
                    <>
                      <span className="block text-base font-semibold">{subcategory.name}</span>
                      <span className="mt-2 block text-sm text-muted-foreground">
                        {count > 0
                          ? `${count} ${count === 1 ? "idea" : "ideas"}`
                          : "Ideas coming soon"}
                      </span>
                    </>
                  );
                  const className =
                    "glass block rounded-xl border border-border/50 p-5 transition-colors";
                  return count > 0 ? (
                    <Link
                      key={subcategory.id}
                      to="/category/$categorySlug/$subcategorySlug"
                      params={{ categorySlug, subcategorySlug: subcategory.slug }}
                      className={`${className} hover:border-primary/60`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={subcategory.id} className={`${className} opacity-60`}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Ad and grid share the FRONT plane so they travel together. Split
              across planes they would converge on each other, and the ad-to-grid
              gap is only 32px. */}
          {showLegacyGrid && (
            <div className="bbi-depth-front mt-8">
              <AdSlot position="category-above-grid" size="banner" />
            </div>
          )}

          {showLegacyGrid && (
            <div
              ref={gridRef}
              className="bbi-depth-front mt-8 grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-3"
            >
            {data.ideas.map((idea, i) => {
              const n = i + 1;
              const interstitial = n % 6 === 0 && n < data.ideas.length;
              // Every 6th slot alternates ad / cross-link so a long category
              // page interleaves both without cutting ad inventory: slot 6,
              // 18, 30... is an AdSlot; slot 12, 24, 36... is an ExploreBanner
              // pointing at another template, rotating through
              // EXPLORE_BANNER_ROTATION so the 2nd, 3rd... banner on one page
              // doesn't repeat the same destination.
              const isBannerSlot = interstitial && (n / 6) % 2 === 0;
              const bannerPick = isBannerSlot
                ? EXPLORE_BANNER_ROTATION[(n / 6 / 2 - 1) % EXPLORE_BANNER_ROTATION.length]
                : null;
              return (
                <Fragment key={idea.ideaId}>
                  <IdeaCard idea={idea} featured={idea.ideaId === leadIdeaId} />
                  {interstitial && (
                    <div className="[grid-column:1/-1]">
                      {isBannerSlot && bannerPick ? (
                        <ExploreBanner pick={bannerPick} exclude="ideas" />
                      ) : (
                        <AdSlot position={`category-in-grid-${n / 6}`} size="banner" />
                      )}
                    </div>
                  )}
                </Fragment>
              );
            })}
            </div>
          )}
          {/* EDITABLE SECTION END */}

          {/* A category page used to end on its last idea card. It now
              closes with the site's resource block — twelve calculators, six
              guides, twelve glossary terms, six blog posts — rendered by
              SiteShell above the footer, on every page but the homepage and
              the policy pages, so it is no longer wired here by hand. */}
        </div>
      </SiteShell>
    </>
  );
}
