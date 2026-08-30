import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { getCategoryPage } from "@/lib/ideas.functions";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { useStaggerReveal, useTextReveal } from "@/motion";

/**
 * Vertical validation pages — /validate/[industry].
 *
 * The highest-intent page family the reference architecture in
 * PROJECT_BRIEF.md §4.2 lists that BBI did not have. Someone searching "how to
 * validate a fintech idea" is much further down the funnel than someone
 * browsing a category, and until now the site had nothing to meet them with.
 *
 * Butterfly check, run before this was written:
 *   1. Modifies a shared file?      No — one new route file, nothing else.
 *   2. Changes Supabase?            No — reuses `getCategoryPage`, read-only.
 *   3. Changes global styling?      No — existing classes and tokens only.
 *   4. Changes a data contract?     No — consumes `IdeaCard` as it is.
 *   5. Can it be a NEW thing?       Yes, and it is.
 * All "no" on 1-4 and "yes" on 5, which the map calls the safest work there is.
 *
 * Every one of these pages is filled from the live catalogue. That matters:
 * PENDING2.md §"Still open" recorded /guide, /tools, /compare and /validate as
 * blocked because "building empty shells would add four dead pages". This one
 * is unblocked precisely because it needs no new content to be real — the
 * ideas, the counts, the trend scores and the subcategory spread are already
 * in the database. A vertical with no ideas in it returns a 404 rather than
 * rendering an empty page, so a thin category can never become a dead page.
 */

const industryQuery = (categorySlug: string) =>
  queryOptions({
    queryKey: ["validate-industry", categorySlug],
    queryFn: () => getCategoryPage({ data: { categorySlug } }),
  });

export const Route = createFileRoute("/validate/$industrySlug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(industryQuery(params.industrySlug));
    // No name means no such category; no ideas means we would be publishing an
    // empty page. Both are a 404, not a render.
    if (!data.categoryName || data.ideas.length === 0) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    // No loaderData means the route 404'd; titling that page "How to validate
    // a Business business idea" is worse than saying nothing useful.
    if (!loaderData?.categoryName) {
      return { meta: [{ title: "Validate a business idea | BBI" }] };
    }
    const name = subject(loaderData.categoryName);
    const n = loaderData.ideas.length;
    const title = `How to validate a ${name} business idea | BBI`;
    const desc = `Validate a ${name} idea before you spend on it. Work through ${n} researched ${name} blueprints — who pays, how the money moves, what hurts in year one — free.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ValidateIndustryPage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">Couldn&apos;t load this page — try refreshing.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-24">
        <h1>We don&apos;t cover that industry yet.</h1>
        <p className="t-lead mt-4">
          Every industry page here is built from blueprints we have actually researched, so we
          don&apos;t publish one until there is something real behind it.{" "}
          <Link to="/browse" className="underline">
            Browse what is live
          </Link>
          .
        </p>
      </div>
    </SiteShell>
  ),
});

/**
 * Category names in the database already end in "Ideas" or "Business Ideas"
 * ("Side Hustle Ideas", "Work From Home Business Ideas"), so dropping one
 * straight into a sentence produces "How to validate a Work From Home
 * Business Ideas business idea". Trim the trailing noun so the headings read
 * like English.
 */
function subject(categoryName: string) {
  return (
    categoryName
      .replace(/\s*business\s+ideas\s*$/i, "")
      .replace(/\s*ideas\s*$/i, "")
      .trim() || categoryName
  );
}

/** The four questions BBI answers about every idea, as validation steps. */
const STEPS = [
  {
    n: "01",
    t: "Find the closest blueprint",
    d: "Not the perfect match — the closest one. The economics of a business are usually set by its shape, not by its exact niche, so a neighbouring idea will tell you most of what you need.",
  },
  {
    n: "02",
    t: "Check who actually pays",
    d: "Not who benefits. Who takes out a card. If you cannot name that person in one sentence after reading, the idea is not ready and no amount of research will change that.",
  },
  {
    n: "03",
    t: "Follow the money the whole way",
    d: "What comes in, what goes out, and how long the gap between them lasts. Most ideas that fail were never bad ideas — they ran out of runway in the gap.",
  },
  {
    n: "04",
    t: "Read the year-one risks before you commit",
    d: "Every blueprint says what hurts, plainly. Read that part twice. It is the part you will otherwise learn by paying for it.",
  },
];

function ValidateIndustryPage() {
  const { industrySlug } = Route.useParams();
  const { data } = useSuspenseQuery(industryQuery(industrySlug));
  const name = subject(data.categoryName ?? "Business");

  const headRef = useTextReveal<HTMLHeadingElement>();
  const stepsRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.07 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ selector: ".mo-card", stagger: 0.04 });

  // Everything below is derived from the live rows, never hardcoded.
  const scored = data.ideas.filter((i) => typeof i.trendScore === "number");
  const topScore = scored.length ? Math.max(...scored.map((i) => i.trendScore as number)) : null;
  const subcategories = [...new Set(data.ideas.map((i) => i.subcategoryName).filter(Boolean))];
  const top = data.ideas.slice(0, 12);

  return (
    <SiteShell>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name, path: `/category/${industrySlug}` },
          { name: `Validate a ${name} idea`, path: `/validate/${industrySlug}` },
        ])}
      />
      <div className="mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-14">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: name, to: "/category/$categorySlug", params: { categorySlug: industrySlug } },
            { label: "Validate" },
          ]}
        />

        <section className="mt-8">
          <p className="t-eyebrow">Validate before you spend</p>
          <h1 ref={headRef} className="mt-3">
            How to validate a {name} business idea.
          </h1>
          <p className="t-lead mt-5 max-w-3xl">
            You do not need a subscription to find out whether a {name.toLowerCase()} idea is worth
            your time. Below are {data.ideas.length} researched {name.toLowerCase()} blueprints —
            each one already answers who pays, how the money moves, and what will hurt in year one.
            Read them for free, then validate your own version as many times as you want.
          </p>

          {/* Live figures, not claims. */}
          <dl className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="glass rounded-2xl p-4">
              <dt className="t-meta">Researched blueprints</dt>
              <dd className="mt-1 text-2xl font-semibold text-hl-teal">{data.ideas.length}</dd>
            </div>
            <div className="glass rounded-2xl p-4">
              <dt className="t-meta">Sub-areas covered</dt>
              <dd className="mt-1 text-2xl font-semibold text-hl-teal">{subcategories.length}</dd>
            </div>
            <div className="glass rounded-2xl p-4">
              <dt className="t-meta">Cost to read all of it</dt>
              <dd className="mt-1 text-2xl font-semibold text-hl-green">Free</dd>
            </div>
          </dl>
          {topScore !== null && (
            <p className="t-meta mt-3">
              Highest current demand signal in {name}: {topScore}/100, across {scored.length} scored
              blueprints.
            </p>
          )}
        </section>

        <section className="mt-14">
          <p className="t-eyebrow">The four checks</p>
          <h2 className="mt-3">What validating one of these actually involves.</h2>
          <div ref={stepsRef} className="mt-7 grid gap-4 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.n} className="mo-card glass flex gap-4 rounded-2xl p-5 sm:p-6">
                <span className="t-meta shrink-0 text-hl-gold">{s.n}</span>
                <div>
                  <h3 className="t-card">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="t-eyebrow">Start with these</p>
          <h2 className="mt-3">{name} blueprints, strongest demand signal first.</h2>
          <div ref={gridRef} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((idea) => (
              <IdeaCard key={idea.ideaId} idea={idea} />
            ))}
          </div>
          {data.ideas.length > top.length && (
            <p className="mt-6">
              <Link
                to="/category/$categorySlug"
                params={{ categorySlug: industrySlug }}
                className="t-eyebrow underline"
              >
                See all {data.ideas.length} {name} blueprints
              </Link>
            </p>
          )}
        </section>

        {subcategories.length > 1 && (
          <section className="mt-14">
            <p className="t-eyebrow">Narrower than that</p>
            <h2 className="mt-3">Sub-areas inside {name}.</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {subcategories.slice(0, 24).map((s) => (
                <li
                  key={s}
                  className="glass rounded-full px-3.5 py-1.5 text-sm text-muted-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </SiteShell>
  );
}
