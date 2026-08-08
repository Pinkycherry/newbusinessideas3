import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";

import { IdeaCard } from "@/components/idea-card";
import { ValidateButton } from "@/components/validate-button";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { AdSlot } from "@/components/AdSlot";
import { getIdeaBySlug, getCategoryPage } from "@/lib/ideas.functions";
import { type IdeaCard as IdeaCardType, type IdeaDetail } from "@/lib/ideas-shared";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { useAuth } from "@/hooks/use-auth";

type IdeaDetailData = { idea: IdeaDetail; related: IdeaCardType[] } | null;

const ideaDetailQuery = (slug: string) =>
  queryOptions<IdeaDetailData>({
    queryKey: ["idea-detail", slug],
    queryFn: async () => {
      const result = await getIdeaBySlug({ data: { slug } });
      if (!result) return null;
      const { idea } = result;
      if (!idea) return null;

      const category = await getCategoryPage({
        data: { categorySlug: idea.categorySlug },
      });
      const related = category.ideas.filter((i) => i.ideaId !== idea.ideaId).slice(0, 6);

      return { idea, related };
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
  const { data } = useSuspenseQuery(ideaDetailQuery(slug));
  const auth = useAuth();
  if (!data) return null;
  const { idea, related } = data;
  // PROJECT_BRIEF.md Section 3.2 — full blueprint content is blurred behind
  // a sign-in gate; the title/description teaser above stays visible.
  const contentLocked = auth.status !== "authenticated";

  const showSidebarList = related.length > 3;
  const sidebarRelated = showSidebarList ? related.slice(0, 3) : [];
  const bottomRelated = showSidebarList ? related.slice(3, 6) : related;

  const ideaPath = `/idea/${idea.slug}`;
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
          }),
          breadcrumbSchema(breadcrumbItems),
        ]}
      />
      <SiteShell>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="min-w-0">
            {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
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
                  params: {
                    categorySlug: idea.categorySlug,
                    subcategorySlug: idea.subcategorySlug,
                  },
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
            </div>

            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight">{idea.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{idea.businessDescription}</p>

            <div className="relative">
              <div
                className={contentLocked ? "pointer-events-none select-none blur-sm" : undefined}
              >
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

                <div className="mt-8">
                  <AdSlot position="idea-detail-between-proscons-verdict" size="banner" />
                </div>

                {idea.verdict && (
                  <section className="mt-6 rounded-lg border-l-4 border-primary bg-card p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
                      Verdict
                    </h2>
                    <p className="mt-2 leading-relaxed">{idea.verdict}</p>
                  </section>
                )}

                <div className="mt-8">
                  <AdSlot position="idea-detail-below-verdict" size="banner" />
                </div>
              </div>

              {contentLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/55 text-center">
                  <Lock className="h-6 w-6 text-accent" aria-hidden />
                  <p className="text-sm font-semibold">Sign in free to read the full blueprint</p>
                  <Link
                    to="/sign-in"
                    className="sheen rounded-full bg-gradient-to-r from-primary to-ember px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-[0_10px_36px_oklch(0.687_0.161_51.5/40%)] transition-transform duration-300 hover:scale-105"
                  >
                    Continue with Google
                  </Link>
                </div>
              )}
            </div>

            <div id="validate">
              <ValidateButton slug={idea.slug} />
            </div>

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

            <div className="mt-10">
              <AdSlot position="idea-detail-above-related" size="banner" />
            </div>

            {bottomRelated.length > 0 && (
              <section className="mt-16">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  More in {idea.categoryName}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bottomRelated.map((r) => (
                    <IdeaCard key={r.ideaId} idea={r} />
                  ))}
                </div>
              </section>
            )}
            {/* EDITABLE SECTION END */}
          </article>

          {/* Sticky right column — desktop only. Add or reorder blocks freely. */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <div className="glass rounded-2xl px-5 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Trend score
                </p>
                <p className="mt-1 text-4xl font-extrabold text-accent">{idea.trendScore ?? "—"}</p>
                <a
                  href="#validate"
                  className="sheen mt-5 block w-full rounded-full bg-gradient-to-r from-primary to-ember px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_oklch(0.687_0.161_51.5/40%)] transition-transform duration-300 hover:scale-[1.02]"
                >
                  Validate for free
                </a>
              </div>

              <AdSlot position="idea-detail-right-affiliate" size="rectangle" />

              {sidebarRelated.length > 0 && (
                <div className="glass rounded-2xl px-5 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                    More in {idea.categoryName}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {sidebarRelated.map((r) => (
                      <li key={r.ideaId}>
                        <Link
                          to="/idea/$slug"
                          params={{ slug: r.slug }}
                          className="block text-sm font-semibold leading-snug text-muted-foreground transition-colors hover:text-primary"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </SiteShell>
    </>
  );
}
