import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { useCallback } from "react";

import { AdSlot } from "@/components/AdSlot";
import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getListicle, type ListicleEntry, type ListiclePage } from "@/lib/lists.functions";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";
import { useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";

/**
 * PROJECT_BRIEF.md Section 6.3 — the listicle template. One page per category,
 * keyed on the real category slug: /list/side-hustle-ideas, and so on.
 *
 * The top ten are written out on the page and the remainder are cards linking
 * to their own /idea/[slug] blueprint, which is the point of the template —
 * internal linking density. Every word in an entry comes from a column on that
 * idea's row (see lists.functions.ts); where a column is empty the block it
 * would have filled is not rendered at all.
 */
const listicleQuery = (categorySlug: string) =>
  queryOptions<ListiclePage | null>({
    queryKey: ["listicle", categorySlug],
    queryFn: () => getListicle({ data: { categorySlug } }),
  });

export const Route = createFileRoute("/list/$slug")({
  // Read through Route.useLoaderData() in the component rather than
  // useSuspenseQuery: this app's QueryClient is not dehydrated to the client,
  // so a client-side suspense read would re-run the query against a cold cache
  // and mismatch the server-rendered markup.
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(listicleQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Business Idea List | BBI" }] };
    const title = `${loaderData.title} | BBI`;
    const description = `All ${loaderData.totalIdeas} ${loaderData.categoryName} blueprints, ordered by trend score — the top ${loaderData.entries.length} covered in detail, every one linked to its full page.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ListiclePageRoute,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">Couldn't load this list — try refreshing.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p>We don't have a list for that category.</p>
        <Link to="/list" className="mt-4 inline-block text-primary underline">
          See every list
        </Link>
      </div>
    </SiteShell>
  ),
});

function Entry({ entry, categorySlug }: { entry: ListicleEntry; categorySlug: string }) {
  return (
    <article className="glass mo-card rounded-3xl p-6 sm:p-8">
      <header className="flex items-start gap-4">
        <span
          aria-hidden
          className="mt-1 shrink-0 font-mono text-2xl font-bold leading-none tabular-nums text-accent"
        >
          {String(entry.rank).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Link
              to="/category/$categorySlug/$subcategorySlug"
              params={{ categorySlug, subcategorySlug: entry.subcategorySlug }}
              className="mo-link truncate"
            >
              {entry.subcategoryName}
            </Link>
            {entry.trendScore !== null && (
              <span className="text-accent">Trend {entry.trendScore}</span>
            )}
          </div>
          <h2 className="mt-2 break-words text-xl font-bold leading-snug sm:text-2xl">
            <Link
              to="/idea/$slug"
              params={{ slug: entry.slug }}
              className="transition-colors hover:text-accent"
            >
              {entry.title}
            </Link>
          </h2>
        </div>
      </header>

      {entry.lead.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground"
        >
          {paragraph}
        </p>
      ))}

      {entry.sections.map((section) => (
        <div key={section.label} className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-accent">
            {section.label}
          </h3>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">
            {section.body}
          </p>
        </div>
      ))}

      {entry.facts.length > 0 && (
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {entry.facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-border bg-card/60 p-4">
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {(entry.pros.length > 0 || entry.cons.length > 0) && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {entry.pros.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Working for it
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {entry.pros.map((pro) => (
                  <li key={pro}>{pro}</li>
                ))}
              </ul>
            </div>
          )}
          {entry.cons.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Working against it
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {entry.cons.map((con) => (
                  <li key={con}>{con}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {entry.verdict && (
        <p className="mt-6 border-l-2 border-accent pl-4 text-sm leading-relaxed">
          {entry.verdict}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          to="/idea/$slug"
          params={{ slug: entry.slug }}
          className="mo-link text-sm font-semibold text-primary"
        >
          Read the full {entry.title} blueprint
        </Link>
        {entry.tags.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="max-w-full truncate rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </span>
        )}
      </div>
    </article>
  );
}

function ListiclePageRoute() {
  const data = Route.useLoaderData();
  const listPath = `/list/${data.categorySlug}`;

  // MOTION_SPEC section 3, listing pages. One headline reveal, on the H1 only.
  // Each of the two grids gets one delegated pointer listener and one short
  // 0.03s stagger — never a listener per cell — and neither gets tilt or a
  // magnet, because the cursor here is scanning rather than aiming.
  const headingRef = useTextReveal<HTMLHeadingElement>();

  const entriesPointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  const entriesRevealRef = useStaggerReveal<HTMLDivElement>({
    selector: ".mo-card",
    stagger: 0.03,
  });
  const entriesRef = useCallback(
    (node: HTMLDivElement | null) => {
      entriesPointerRef.current = node;
      entriesRevealRef.current = node;
    },
    [entriesPointerRef, entriesRevealRef],
  );

  const restPointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  const restRevealRef = useStaggerReveal<HTMLDivElement>({ selector: ".mo-card", stagger: 0.03 });
  const restRef = useCallback(
    (node: HTMLDivElement | null) => {
      restPointerRef.current = node;
      restRevealRef.current = node;
    },
    [restPointerRef, restRevealRef],
  );

  // Subcategories are only a useful facet when they actually group ideas. In
  // parts of the library a subcategory holds a single idea, and a row of
  // fifty one-item facets is noise, not navigation — so only the ones that
  // group are offered, and only when there are enough of them to be a facet row.
  const facets = data.subcategories.filter((sub) => sub.ideaCount > 1);
  const showFacets = facets.length >= 3;

  return (
    <>
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: data.title,
            description: `${data.categoryName} business idea blueprints, ordered by trend score.`,
            url: `${siteUrl()}${listPath}`,
            numberOfItems: data.totalIdeas,
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            itemListElement: [
              ...data.entries.map((entry) => ({
                "@type": "ListItem",
                position: entry.rank,
                name: entry.title,
                url: `${siteUrl()}/idea/${entry.slug}`,
              })),
              ...data.rest.map((idea, i) => ({
                "@type": "ListItem",
                position: data.entries.length + i + 1,
                name: idea.title,
                url: `${siteUrl()}/idea/${idea.slug}`,
              })),
            ],
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lists", path: "/list" },
            { name: data.title, path: listPath },
          ]),
        ]}
      />
      <SiteShell>
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Lists", to: "/list" },
              { label: data.title },
            ]}
          />
          <h1
            ref={headingRef}
            className="bbi-heading-glow mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {data.title}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every {data.categoryName} blueprint in the library, ordered by trend score. The first{" "}
            {data.entries.length} are written out below; the remaining {data.rest.length} link
            straight to their own page.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <Link
              to="/category/$categorySlug"
              params={{ categorySlug: data.categorySlug }}
              className="mo-link"
            >
              Browse {data.categoryName} as a grid
            </Link>
          </p>

          {showFacets && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {facets.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    to="/category/$categorySlug/$subcategorySlug"
                    params={{ categorySlug: data.categorySlug, subcategorySlug: sub.slug }}
                    className="mo-row inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs"
                  >
                    <span>{sub.name}</span>
                    <span className="text-muted-foreground">{sub.ideaCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div ref={entriesRef} className="mt-10 space-y-6">
            {data.entries.map((entry) => (
              <Entry key={entry.ideaId} entry={entry} categorySlug={data.categorySlug} />
            ))}
          </div>

          {data.rest.length > 0 && (
            <section className="mt-14">
              <AdSlot position="list-between-entries-and-grid" size="banner" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                The other {data.rest.length} in {data.categoryName}
              </h2>
              <div ref={restRef} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.rest.map((idea) => (
                  <IdeaCard key={idea.ideaId} idea={idea} />
                ))}
              </div>
            </section>
          )}

          {data.otherLists.length > 0 && (
            <section className="mt-14">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Other lists
              </h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {data.otherLists.map((list) => (
                  <li key={list.categorySlug}>
                    <Link
                      to="/list/$slug"
                      params={{ slug: list.categorySlug }}
                      className="mo-row flex items-center justify-between gap-4 px-2 py-3 text-sm"
                    >
                      <span className="min-w-0 truncate font-medium">{list.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {list.ideaCount} ideas
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/list"
                className="mo-link mt-4 inline-block text-sm font-semibold text-primary"
              >
                See every list
              </Link>
            </section>
          )}
          {/* EDITABLE SECTION END */}
        </div>
      </SiteShell>
    </>
  );
}
