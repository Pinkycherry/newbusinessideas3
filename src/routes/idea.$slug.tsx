import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { IdeaCinemaPage } from "@/components/idea-cinema/idea-cinema";

import { SiteShell } from "@/components/site-shell";
import { categoryImage } from "@/config/category-imagery";
import {
  getIdeaBySlug,
  type IdeaVariant,
  type IdeaGradient,
  type RelatedCategory,
} from "@/lib/ideas.functions";
import { type IdeaCard as IdeaCardType, type IdeaDetail } from "@/lib/ideas-shared";
import { JsonLd, absoluteUrl, articleSchema, breadcrumbSchema } from "@/lib/schema";

type IdeaDetailData = {
  idea: IdeaDetail;
  related: IdeaCardType[];
  relatedCategories: RelatedCategory[];
  trending: IdeaCardType[];
  variant: IdeaVariant;
  gradient: IdeaGradient;
} | null;

type ContextualLink = { key: string; label: string; to: string; params: Record<string, string> };

/**
 * PROJECT_BRIEF.md Section 8.2 / Build Order step 11 — up to 3 automatic,
 * keyword-matched internal links per page, prioritizing hub-style pages
 * (subcategory, then category) over distant matches. Reuses data already
 * loaded for this page (no extra Supabase round-trip): the idea's own
 * keywords/tags are scanned against the `related` list already fetched for
 * the sidebar/bottom cards to find one genuinely on-topic idea link.
 */
function pickContextualLinks(idea: IdeaDetail, related: IdeaCardType[]): ContextualLink[] {
  const links: ContextualLink[] = [
    {
      key: "subcategory",
      label: idea.subcategoryName,
      to: "/category/$categorySlug/$subcategorySlug",
      params: { categorySlug: idea.categorySlug, subcategorySlug: idea.subcategorySlug },
    },
    {
      key: "category",
      label: idea.categoryName,
      to: "/category/$categorySlug",
      params: { categorySlug: idea.categorySlug },
    },
  ];

  const keywordPool = [...idea.keywords, ...idea.tags]
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  const match = keywordPool.length
    ? related.find((r) => {
        const haystack = `${r.title} ${r.summary} ${r.tags.join(" ")}`.toLowerCase();
        return keywordPool.some((k) => haystack.includes(k));
      })
    : undefined;

  if (match) {
    links.push({
      key: match.ideaId,
      label: match.title,
      to: "/idea/$slug",
      params: { slug: match.slug },
    });
  }

  return links.slice(0, 3);
}

const ideaDetailQuery = (slug: string) =>
  queryOptions<IdeaDetailData>({
    queryKey: ["idea-detail", slug],
    // Used only inside the route loader's ensureQueryData call below, purely
    // as a typed fetch-and-return helper — the component reads the result via
    // Route.useLoaderData(), not via useSuspenseQuery, so these cache settings
    // no longer affect what's rendered (see the note on IdeaPage's data line
    // for why: router.tsx doesn't dehydrate the QueryClient to the client, so
    // a client-side useSuspenseQuery on this query would re-run it — a real
    // problem for Section 9's per-request-random variant/gradient/related
    // picks, since two independent calls return different results).
    staleTime: 0,
    gcTime: 60_000,
    queryFn: async () => {
      const result = await getIdeaBySlug({ data: { slug } });
      if (!result?.idea) return null;
      return result;
    },
  });

export const Route = createFileRoute("/idea/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(ideaDetailQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const idea = loaderData?.idea;
    // Prefer the researched SEO fields when the pipeline has filled them;
    // fall back to the previous behaviour for un-enriched ideas.
    const title = idea
      ? idea.seoTitle || `${idea.title} | BBI – Bro Business Ideas`
      : "Business Idea | BBI – Bro Business Ideas";
    const description =
      idea?.metaDescription ||
      idea?.businessDescription?.slice(0, 155) ||
      "A researched business idea blueprint with pros, cons and a founder-fit verdict.";
    // No idea has a photo of its own — this page had no share image at all
    // before. The category's featured image fills that gap: every idea in
    // "AI & Automation" sharing one thematic image for its link preview is
    // the same pattern a blog's tag pages use, not duplicate content, and it
    // beats the blank preview this page rendered until now.
    const image = idea ? categoryImage(idea.categorySlug) : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: absoluteUrl(image.src) },
              { property: "og:image:alt", content: image.alt },
              { name: "twitter:image", content: absoluteUrl(image.src) },
            ]
          : []),
      ],
    };
  },
  component: IdeaPage,
  errorComponent: () => (
    <SiteShell tone="instrument">
      <p className="mx-auto max-w-6xl px-4 py-24">This idea could not be loaded.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell tone="instrument">
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p>That idea does not exist in the library.</p>
        <Link to="/browse" className="mt-4 inline-block text-primary underline">
          Browse all ideas
        </Link>
      </div>
    </SiteShell>
  ),
});

/**
 * Every idea renders through IdeaCinemaPage (components/idea-cinema), the
 * template approved on the two trial pages on 2026-09-24 and rolled out to
 * the whole library the same day. The previous standard template is in git
 * history before that rollout (rollback/pre-site-rollout-2026-09-24).
 */
function IdeaPage() {
  // Reads the router's own loaderData rather than re-running the query via
  // useSuspenseQuery: router.tsx does not dehydrate the QueryClient, and this
  // query's random related/trending picks would differ between server and
  // client, which is a real hydration mismatch. Non-null by construction:
  // the loader throws notFound() when the query returns null.
  const data = Route.useLoaderData() as NonNullable<IdeaDetailData>;
  if (!data) return null;
  const { idea, related, relatedCategories, trending } = data;
  const contextualLinks = pickContextualLinks(idea, related);

  const ideaPath = `/idea/${idea.slug}`;
  const categoryFeatured = categoryImage(idea.categorySlug);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: idea.categoryName, path: `/category/${idea.categorySlug}` },
    {
      name: idea.subcategoryName,
      path: `/category/${idea.categorySlug}/${idea.subcategorySlug}`,
    },
    { name: idea.title, path: ideaPath },
  ];

  return (
    <>
      <JsonLd
        schema={[
          articleSchema({
            path: ideaPath,
            headline: idea.title,
            description: idea.businessDescription || idea.summary,
            datePublished: idea.createdAt,
            categoryName: idea.categoryName,
            image: categoryFeatured.src,
          }),
          breadcrumbSchema(breadcrumbItems),
        ]}
      />
      <SiteShell tone="instrument">
        <IdeaCinemaPage
          idea={idea}
          related={related}
          trending={trending}
          relatedCategories={relatedCategories}
          contextualLinks={contextualLinks}
        />
      </SiteShell>
    </>
  );
}
