import { createFileRoute, notFound, Link } from "@tanstack/react-router";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { FaqList, FaqSchema, FaqEmptyState } from "@/components/faq-list";
import { getRandomCategoryFaqs } from "@/lib/faqs.functions";
import { getCatalog } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { useTextReveal } from "@/motion";

/**
 * PROJECT_BRIEF.md Section 6.4 — one FAQ hub per category.
 *
 * Data comes from the route loader and is read with `Route.useLoaderData()`,
 * not `useSuspenseQuery`. `src/router.tsx` builds a fresh, empty QueryClient
 * on both the server and the client with no dehydration between them, so a
 * suspense query re-runs on the client and its result can differ from the
 * server's — which here would be visible, since the pool is drawn with
 * ORDER BY random(). Loader data IS dehydrated by TanStack Router, so both
 * renders show the same draw.
 */
export const Route = createFileRoute("/faq/$categorySlug")({
  loader: async ({ params }) => {
    const catalog = await getCatalog();
    const category = catalog.categories.find((c) => c.categorySlug === params.categorySlug);
    if (!category) throw notFound();

    const faqs = await getRandomCategoryFaqs({
      data: { categorySlug: params.categorySlug, count: 15 },
    });
    return { category, faqs };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.category.categoryName ?? "Category";
    const n = loaderData?.faqs.length ?? 0;
    return {
      meta: [
        { title: `${name} — Questions and Answers | BBI` },
        {
          name: "description",
          content:
            n > 0
              ? `Straight answers to the questions people ask before starting a ${name.toLowerCase()} business in India.`
              : `Questions and answers for ${name.toLowerCase()} on BBI.`,
        },
        { property: "og:title", content: `${name} — Questions and Answers | BBI` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FaqCategoryPage,
  notFoundComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">We don&apos;t have that category.</p>
    </SiteShell>
  ),
});

function FaqCategoryPage() {
  const { category, faqs } = Route.useLoaderData();
  const headingRef = useTextReveal<HTMLHeadingElement>();
  const path = `/faq/${category.categorySlug}`;

  return (
    <SiteShell>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Questions", path: "/faq" },
            { name: category.categoryName, path },
          ]),
          webPageSchema({
            path,
            name: `${category.categoryName} — Questions and Answers`,
            description: `Questions people ask before starting a ${category.categoryName.toLowerCase()} business.`,
          }),
        ]}
      />
      {/* Emitted only when there is at least one real question — see FaqSchema. */}
      <FaqSchema faqs={faqs} />

      <main className="mx-auto w-full max-w-4xl px-3 pb-24 pt-6 sm:px-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Questions", to: "/faq" },
            { label: category.categoryName },
          ]}
        />

        <p className="mt-8 t-eyebrow">
          Questions
        </p>
        <h1
          ref={headingRef}
          className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {category.categoryName}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          The things people actually want to know before starting one of these — money, time, and
          the parts nobody mentions. {category.ideaCount} researched blueprint
          {category.ideaCount === 1 ? "" : "s"} sit behind this category.
        </p>

        {faqs.length > 0 ? (
          <FaqList faqs={faqs} />
        ) : (
          <FaqEmptyState>
            <Link
              to="/category/$categorySlug"
              params={{ categorySlug: category.categorySlug }}
              className="mo-link t-eyebrow"
            >
              Read the {category.ideaCount} blueprints instead
            </Link>
            <Link
              to="/browse"
              className="mo-link t-eyebrow"
            >
              The full library
            </Link>
          </FaqEmptyState>
        )}

        <div className="mt-12 border-t border-border pt-6">
          <Link
            to="/category/$categorySlug"
            params={{ categorySlug: category.categorySlug }}
            className="mo-link text-sm font-semibold text-accent"
          >
            Browse all {category.ideaCount} {category.categoryName} blueprints
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
