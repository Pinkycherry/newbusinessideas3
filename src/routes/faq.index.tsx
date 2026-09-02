import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getCategoryFaqCounts } from "@/lib/faqs.functions";
import { getCatalog } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";
import { useCallback } from "react";

/**
 * The FAQ hub index. Every category, with the real size of its pool.
 *
 * The count is shown rather than hidden on purpose. All 14 pools are empty
 * until the FAQ branch of the n8n pipeline runs (see docs/FAQ_POOL_PIPELINE.md),
 * and a page that quietly links to fourteen blank pages is worse than one that
 * says which are ready.
 */
export const Route = createFileRoute("/faq/")({
  loader: async () => {
    const [catalog, counts] = await Promise.all([getCatalog(), getCategoryFaqCounts()]);
    return { categories: catalog.categories, counts };
  },
  head: () => ({
    meta: [
      { title: "Questions and Answers | BBI" },
      {
        name: "description",
        content:
          "Straight answers to the questions people ask before starting a business — by category, India first.",
      },
      { property: "og:title", content: "Questions and Answers | BBI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqIndexPage,
});

function FaqIndexPage() {
  const { categories, counts } = Route.useLoaderData();
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

  const ready = categories.filter((c) => (counts[c.categorySlug] ?? 0) > 0).length;

  return (
    <SiteShell>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Questions", path: "/faq" },
          ]),
          webPageSchema({
            path: "/faq",
            name: "Questions and Answers",
            description: "Questions people ask before starting a business, grouped by category.",
          }),
        ]}
      />

      <main className="mx-auto w-full max-w-6xl px-3 pb-24 pt-6 sm:px-4">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Questions" }]} />

        <p className="mt-8 t-eyebrow">
          Questions
        </p>
        <h1
          ref={headingRef}
          className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          The things people ask first
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Money, time, registration, and the parts nobody mentions until you are already in. Pick a
          category.
          {ready === 0
            ? " We are still writing these, so most are empty right now — the blueprints themselves are all live."
            : ` ${ready} of ${categories.length} categories have answers so far.`}
        </p>

        <div ref={gridRef} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const n = counts[c.categorySlug] ?? 0;
            return (
              <Link
                key={c.categorySlug}
                to="/faq/$categorySlug"
                params={{ categorySlug: c.categorySlug }}
                className="mo-card glass glass-hover rounded-3xl px-5 py-6"
              >
                <h2 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
                  {c.categoryName}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {n > 0
                    ? `${n} question${n === 1 ? "" : "s"} answered`
                    : "Questions still being written"}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-accent">
                  {c.ideaCount} blueprint{c.ideaCount === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </SiteShell>
  );
}
