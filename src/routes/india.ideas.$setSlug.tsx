import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";

import { SiteShell } from "@/components/site-shell";
import { AtlasRoot, DraftNotice, HeroPlate, Masthead, Pager } from "@/components/india/atlas-parts";
import { SaveToggle, ShortlistProvider } from "@/components/india/shortlist";
import atlasCss from "@/components/india/india-atlas.css?url";
import { getIndiaSet } from "@/lib/india.functions";
import {
  BUDGET_CEILINGS,
  INDIA_FAMILIES,
  INDIA_IDEAS_PER_PAGE,
  WORK_MODES,
  budgetLabel,
  eligibilityLabels,
  hoursLabel,
  isFiltered,
  pad2,
  setSearchSchema,
  type SetSearch,
} from "@/lib/india-shared";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const Route = createFileRoute("/india/ideas/$setSlug")({
  validateSearch: setSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const data = await getIndiaSet({ data: { slug: params.setSlug, ...deps } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {};
    const { set, source } = loaderData;
    const title = `${set.title} | India idea sets | BBI – Bro Business Ideas`;
    const noindex = source === "fixture" || isFiltered(match.search);
    return {
      links: [{ rel: "stylesheet", href: atlasCss }],
      meta: [
        { title },
        { name: "description", content: set.introduction },
        { property: "og:title", content: title },
        { property: "og:description", content: set.introduction },
        { property: "og:type", content: "website" },
        ...(noindex ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
    };
  },
  component: IndiaSetPage,
  notFoundComponent: () => (
    <SiteShell tone="instrument">
      <AtlasRoot>
        <p className="ia-text">
          That set is not published.{" "}
          <Link to="/india/ideas" className="ia-link">
            See every India set
          </Link>
          .
        </p>
      </AtlasRoot>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell tone="instrument">
      <AtlasRoot>
        <p className="ia-text">This set could not load. Try refreshing the page.</p>
      </AtlasRoot>
    </SiteShell>
  ),
});

function IndiaSetPage() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const { setSlug } = Route.useParams();
  const navigate = useNavigate({ from: "/india/ideas/$setSlug" });
  const { set, items, evidence } = data;
  const path = `/india/ideas/${set.slug}`;
  const filtered = isFiltered(search);
  const labels = eligibilityLabels(set);
  const go = (next: Partial<SetSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...next, page: undefined }), resetScroll: false });

  const reviewed = set.reviewedAt
    ? new Date(set.reviewedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <SiteShell tone="instrument">
      <JsonLd
        schema={[
          collectionPageSchema({
            path,
            name: set.title,
            description: set.introduction,
            itemCount: data.totalItems,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "India idea sets", path: "/india/ideas" },
            { name: set.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: set.title,
            numberOfItems: data.totalItems,
            itemListElement: items.map((it) => ({
              "@type": "ListItem",
              position: it.rank,
              name: it.idea.title,
              url: `${siteUrl()}${path}#idea-${it.idea.key}`,
            })),
          },
        ]}
      />
      <AtlasRoot>
        <ShortlistProvider pageIdeas={items.map((i) => i.idea)}>
          <Masthead
            crumbs={[
              { label: "Home", to: "/" },
              { label: "India idea sets", to: "/india/ideas" },
              { label: set.title },
            ]}
          />
          <DraftNotice source={data.source} />

          <header className="ia-dossier">
            <div>
              <p className="ia-label">{INDIA_FAMILIES[set.family]} / India</p>
              <h1 className="ia-h1">{set.title}</h1>
              <p className="ia-text">{set.introduction}</p>
              <p className="ia-criterion">
                <span>Why these ideas are here</span>
                {set.selectionCriterion}
              </p>
              <p className="ia-dossier-facts">
                <span>
                  <b>{data.totalItems}</b> {data.totalItems === 1 ? "idea" : "ideas"}
                  {filtered ? " match your filters" : " in this set"}
                </span>
                {reviewed && (
                  <span>
                    Reviewed <b>{reviewed}</b>
                  </span>
                )}
                <span>Order is editorial, not a success ranking</span>
              </p>
            </div>
            <HeroPlate variant={set.heroVariant} count={data.totalItems} />
          </header>

          <div className="ia-layout">
            <aside className="ia-rail" aria-label="At a glance">
              <details className="ia-rail-box" open>
                <summary className="ia-rail-summary">
                  At a glance <span aria-hidden="true">▾</span>
                </summary>
                <div className="ia-rail-body">
                  <div className="ia-field">
                    <label className="ia-field-label" htmlFor="ia-mode">
                      How you work
                    </label>
                    <select
                      id="ia-mode"
                      value={search.mode ?? ""}
                      onChange={(e) =>
                        go({ mode: (e.target.value || undefined) as SetSearch["mode"] })
                      }
                    >
                      <option value="">Any way</option>
                      {Object.entries(WORK_MODES).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ia-field">
                    <label className="ia-field-label" htmlFor="ia-budget-cap">
                      Budget estimate
                    </label>
                    <select
                      id="ia-budget-cap"
                      value={search.budget ?? ""}
                      onChange={(e) =>
                        go({ budget: (e.target.value || undefined) as SetSearch["budget"] })
                      }
                    >
                      <option value="">Any budget</option>
                      {Object.entries(BUDGET_CEILINGS).map(([v, o]) => (
                        <option key={v} value={v}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <span className="ia-small">
                      Ideas with no estimate are left out of budget filters.
                    </span>
                  </div>
                  {filtered && (
                    <Link to="/india/ideas/$setSlug" params={{ setSlug }} className="ia-link">
                      Clear filters
                    </Link>
                  )}
                  {labels.length > 0 && <p className="ia-small">Set rules: {labels.join(" · ")}</p>}
                  <p className="ia-small">
                    Budgets are estimates with their basis and exclusions stated. Hours are
                    assumptions. Neither is a promise of income.
                  </p>
                  <Link to="/india/ideas" className="ia-link">
                    All India sets
                  </Link>
                </div>
              </details>
            </aside>

            <div>
              <h2 className="ia-h2 ia-text-xl" style={{ marginBottom: 20 }}>
                Explore the ideas
              </h2>
              {items.length === 0 ? (
                <p className="ia-empty">
                  No idea in this set matches those filters. Remove one to see more.
                </p>
              ) : (
                <ol className="ia-ideas">
                  {items.map((it) => {
                    const idea = it.idea;
                    const sources = evidence.filter((e) => e.ideaKey === idea.key);
                    return (
                      <li key={idea.key} id={`idea-${idea.key}`} className="ia-idea">
                        <div className="ia-idea-top">
                          <span className="ia-rank" aria-hidden="true">
                            {pad2(it.rank)}
                          </span>
                          <div>
                            <p className="ia-label">
                              {WORK_MODES[idea.workMode]} · Budget: {budgetLabel(idea)}
                            </p>
                            <h3 className="ia-h3 ia-idea-title">{idea.title}</h3>
                          </div>
                          <SaveToggle idea={idea} />
                        </div>
                        <dl className="ia-pair">
                          <div>
                            <dt>Who pays</dt>
                            <dd>{idea.customer}</dd>
                          </div>
                          <div>
                            <dt>The offer</dt>
                            <dd>{idea.offer}</dd>
                          </div>
                        </dl>
                        <p className="ia-fit">{it.fitReason}</p>
                        <details className="ia-more">
                          <summary className="ia-more-summary">
                            Money, reach, first test and risks
                            <span className="ia-plus" aria-hidden="true">
                              +
                            </span>
                          </summary>
                          <dl className="ia-more-body">
                            <dt>The problem</dt>
                            <dd>{idea.problem}</dd>
                            <dt>How it earns</dt>
                            <dd>{idea.revenueModel}</dd>
                            <dt>Reaching customers</dt>
                            <dd>{idea.customerReach}</dd>
                            <dt>First test</dt>
                            <dd>{idea.firstTest}</dd>
                            <dt>Main risk</dt>
                            <dd>{idea.mainRisk}</dd>
                            <dt>Budget estimate</dt>
                            <dd>
                              {budgetLabel(idea)}
                              {idea.budgetBasis ? `. Basis: ${idea.budgetBasis}` : ""}
                              {idea.budgetExcludes ? `. Excludes: ${idea.budgetExcludes}` : ""}
                            </dd>
                            <dt>Time</dt>
                            <dd>{hoursLabel(idea)}</dd>
                            {idea.assumptions && (
                              <>
                                <dt>Assumptions</dt>
                                <dd>{idea.assumptions}</dd>
                              </>
                            )}
                            {sources.length > 0 && (
                              <>
                                <dt>Sources</dt>
                                <dd>
                                  {sources.map((s) => (
                                    <span key={s.url} style={{ display: "block" }}>
                                      {s.finding}{" "}
                                      <a
                                        href={s.url}
                                        className="ia-link"
                                        rel="noopener"
                                        target="_blank"
                                      >
                                        Source
                                      </a>
                                    </span>
                                  ))}
                                </dd>
                              </>
                            )}
                          </dl>
                        </details>
                      </li>
                    );
                  })}
                </ol>
              )}
              <Pager
                page={data.page}
                pageCount={data.pageCount}
                prev={
                  <Link
                    to="/india/ideas/$setSlug"
                    params={{ setSlug }}
                    search={{ ...search, page: data.page - 1 === 1 ? undefined : data.page - 1 }}
                    className="ia-link"
                    rel="prev"
                  >
                    Previous {INDIA_IDEAS_PER_PAGE}
                  </Link>
                }
                next={
                  <Link
                    to="/india/ideas/$setSlug"
                    params={{ setSlug }}
                    search={{ ...search, page: data.page + 1 }}
                    className="ia-link"
                    rel="next"
                  >
                    Next ideas
                  </Link>
                }
              />
            </div>
          </div>

          <aside className="ia-note" aria-labelledby="ia-spend-h">
            <h2 id="ia-spend-h" className="ia-h2 ia-text-xl">
              Before you spend
            </h2>
            <ul className="ia-checklist">
              <li>
                Talk to three people who match the customer, and ask how they handle this today.
              </li>
              <li>Run the first test with no purchase, or the smallest one you can reverse.</li>
              <li>Ask for money, or a firm commitment, before building more.</li>
              <li>Check any licence, tax or safety rule that applies in your state.</li>
            </ul>
            <p className="ia-note-text">
              Every idea here is a proposal to test, not a validated opportunity. A budget appears
              only where it has a stated basis; otherwise it says "Not estimated".
            </p>
          </aside>

          {data.related.length > 0 && (
            <section className="ia-section" aria-labelledby="ia-related-h">
              <h2 id="ia-related-h" className="ia-h2 ia-text-xl">
                Another direction
              </h2>
              <ul className="ia-related">
                {data.related.map((r, i) => (
                  <li key={r.slug}>
                    <Link
                      to="/india/ideas/$setSlug"
                      params={{ setSlug: r.slug }}
                      className="ia-row"
                    >
                      <span className="ia-row-num" aria-hidden="true">
                        {pad2(i + 1)}
                      </span>
                      <span>
                        <span className="ia-row-title">{r.title}</span>
                        <span className="ia-row-purpose">{r.introduction}</span>
                        <span className="ia-row-meta">
                          {r.ideaCount === 1 ? "1 idea" : `${r.ideaCount} ideas`}
                        </span>
                      </span>
                      <span className="ia-row-arrow" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </ShortlistProvider>
      </AtlasRoot>
    </SiteShell>
  );
}
