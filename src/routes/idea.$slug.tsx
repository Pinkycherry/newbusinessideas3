import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { AiAudit } from "@/components/ai-audit";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getIdeaBySlug } from "@/lib/ideas.functions";

const ideaQuery = (slug: string) =>
  queryOptions({ queryKey: ["idea", slug], queryFn: () => getIdeaBySlug({ data: { slug } }) });

export const Route = createFileRoute("/idea/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(ideaQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const idea = loaderData?.idea;
    const title = idea ? `${idea.title} | IdeaVault AI` : "Business Idea | IdeaVault AI";
    const description =
      idea?.businessDescription?.slice(0, 155) ??
      "A researched business idea blueprint with pros, cons and a founder-fit verdict.";
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
  component: IdeaPage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">This idea could not be loaded.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p>That idea does not exist in the library.</p>
        <Link to="/browse" className="mt-4 inline-block text-primary underline">
          Browse all ideas
        </Link>
      </div>
    </SiteShell>
  ),
});

function IdeaPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(ideaQuery(slug));
  if (!data) return null;
  const { idea, related } = data;

  return (
    <SiteShell>
      <article className="mx-auto max-w-4xl px-4 py-12">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Browse", to: "/browse" },
            {
              label: idea.categoryName,
              to: "/category/$categorySlug",
              params: { categorySlug: idea.categorySlug },
            },
            {
              label: idea.subcategoryName,
              to: "/category/$categorySlug/$subcategorySlug",
              params: { categorySlug: idea.categorySlug, subcategorySlug: idea.subcategorySlug },
            },
          ]}
        />

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest">
          <span className="rounded-sm bg-secondary px-2 py-1 text-secondary-foreground">
            {idea.ideaId}
          </span>
          {idea.trendScore !== null && (
            <span className="text-accent">Trend score {idea.trendScore}</span>
          )}
          {idea.locked && (
            <span className="rounded-sm bg-primary px-2 py-1 text-primary-foreground">
              Pro Pass idea
            </span>
          )}
        </div>

        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight">{idea.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{idea.businessDescription}</p>

        {idea.locked ? (
          <div className="mt-10 rounded-lg border border-primary/50 bg-card p-6">
            <h2 className="text-lg font-semibold">This blueprint is part of the Pro Pass</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The full breakdown, pros, cons and founder-fit verdict for this idea are marked{" "}
              <span className="text-foreground">premium</span> in the library. Pro Pass checkout is
              not live yet, so this content stays locked rather than being faked.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                The breakdown
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed">{idea.summary}</p>
            </section>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
                  Why it works
                </h2>
                <ul className="mt-3 space-y-3 text-sm">
                  {idea.pros.map((pro) => (
                    <li key={pro} className="flex gap-2">
                      <span aria-hidden className="text-accent">
                        +
                      </span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-destructive">
                  What will hurt
                </h2>
                <ul className="mt-3 space-y-3 text-sm">
                  {idea.cons.map((con) => (
                    <li key={con} className="flex gap-2">
                      <span aria-hidden className="text-destructive">
                        −
                      </span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {idea.verdict && (
              <section className="mt-6 rounded-lg border-l-4 border-primary bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Verdict
                </h2>
                <p className="mt-2 leading-relaxed">{idea.verdict}</p>
              </section>
            )}
          </>
        )}

        <AiAudit slug={idea.slug} />

        {idea.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              More in {idea.categoryName}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <IdeaCard key={r.ideaId} idea={r} />
              ))}
            </div>
          </section>
        )}
      </article>
    </SiteShell>
  );
}