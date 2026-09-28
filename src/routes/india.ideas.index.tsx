import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";

import { SiteShell } from "@/components/site-shell";
import { AtlasRoot, DraftNotice, Masthead, Pager } from "@/components/india/atlas-parts";
import atlasCss from "@/components/india/india-atlas.css?url";
import { getIndiaDirectory } from "@/lib/india.functions";
import {
  BUDGET_CEILINGS,
  INDIA_FAMILIES,
  TIME_PATTERNS,
  WORK_MODES,
  directorySearchSchema,
  eligibilityLabels,
  isFiltered,
  pad2,
  type DirectorySearch,
  type IndiaFamily,
  type IndiaSetSummary,
} from "@/lib/india-shared";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

const TITLE = "India Business Idea Sets | BBI – Bro Business Ideas";
const DESCRIPTION =
  "Short, curated sets of business ideas for people starting in India: who pays, the offer, a first test and the main risk for each.";

export const Route = createFileRoute("/india/ideas/")({
  validateSearch: directorySearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getIndiaDirectory({ data: deps }),
  head: ({ loaderData, match }) => {
    const noindex = loaderData?.source === "fixture" || isFiltered(match.search);
    return {
      links: [{ rel: "stylesheet", href: atlasCss }],
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        // Filter combinations are not separate pages: noindex them so they
        // never multiply into near-duplicates. Draft previews stay out too.
        ...(noindex ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
    };
  },
  component: IndiaDirectoryPage,
  errorComponent: () => (
    <SiteShell tone="instrument">
      <AtlasRoot>
        <p className="ia-text">The India sets could not load. Try refreshing the page.</p>
      </AtlasRoot>
    </SiteShell>
  ),
});

function IndiaDirectoryPage() {
  const dir = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/india/ideas/" });
  const filtered = isFiltered(search);

  const go = (next: Partial<DirectorySearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...next, page: undefined }), resetScroll: false });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    go({ q: q || undefined });
  };

  // Group the page's sets by family, keeping the server's order.
  const groups = new Map<IndiaFamily, IndiaSetSummary[]>();
  for (const set of dir.sets) groups.set(set.family, [...(groups.get(set.family) ?? []), set]);
  let running = (dir.page - 1) * 24;

  return (
    <SiteShell tone="instrument">
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/india/ideas",
            name: "India business idea sets",
            description: DESCRIPTION,
            itemCount: dir.total,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "India idea sets", path: "/india/ideas" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: dir.sets.map((s, i) => ({
              "@type": "ListItem",
              position: (dir.page - 1) * 24 + i + 1,
              name: s.title,
              url: `${siteUrl()}/india/ideas/${s.slug}`,
            })),
          },
        ]}
      />
      <AtlasRoot>
        <Masthead crumbs={[{ label: "Home", to: "/" }, { label: "India idea sets" }]} />
        <DraftNotice source={dir.source} />

        <header className="ia-hero">
          <div>
            <p className="ia-label">A place to begin</p>
            <h1 className="ia-h1">
              Your next business. <span className="ia-soft">Made for India.</span>
            </h1>
            <p className="ia-hero-lede">
              Short sets of ideas for people starting from where they are: the customer who pays,
              the offer, one cheap test, and what could go wrong.
            </p>
          </div>
          <div className="ia-folio" aria-hidden="true">
            <div className="ia-folio-top">
              <span>Field notes</span>
              <span>Vol. 01 / IN</span>
            </div>
            <p className="ia-folio-word">
              A small start. <span>A real customer.</span>
            </p>
            <span className="ia-stamp">
              Built for<b>India</b>
            </span>
          </div>
        </header>

        <section className="ia-section" aria-labelledby="ia-finder-h">
          <div className="ia-section-head">
            <h2 id="ia-finder-h" className="ia-h2 ia-text-xl">
              Find your starting point
            </h2>
          </div>
          <form
            className="ia-finder"
            action="/india/ideas"
            method="get"
            onSubmit={onSubmit}
            role="search"
          >
            <div className="ia-field" data-active={Boolean(search.q)}>
              <label className="ia-field-label" htmlFor="ia-q">
                What are you interested in?
              </label>
              <input
                id="ia-q"
                name="q"
                type="search"
                defaultValue={search.q ?? ""}
                placeholder="Try shops, languages, repair"
                autoComplete="off"
              />
            </div>
            <FilterSelect
              id="ia-budget"
              label="Budget"
              value={search.budget}
              options={Object.entries(BUDGET_CEILINGS).map(([v, o]) => [v, o.label])}
              anyLabel="Any budget"
              onChange={(v) => go({ budget: v as DirectorySearch["budget"] })}
            />
            <FilterSelect
              id="ia-setting"
              label="Where you work"
              value={search.setting}
              options={Object.entries(WORK_MODES)}
              anyLabel="Anywhere"
              onChange={(v) => go({ setting: v as DirectorySearch["setting"] })}
            />
            <FilterSelect
              id="ia-time"
              label="Time you have"
              value={search.time}
              options={Object.entries(TIME_PATTERNS)}
              anyLabel="Any schedule"
              onChange={(v) => go({ time: v as DirectorySearch["time"] })}
            />
            <div className="ia-finder-submit">
              <button type="submit" className="bbi-bare ia-btn">
                Search{" "}
                <span className="ia-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </form>
          <div className="ia-result-bar">
            <p className="ia-small" role="status" aria-live="polite">
              {dir.total === 1 ? "1 set" : `${dir.total} sets`}
              {filtered ? " match your filters" : " in the India edition"}
            </p>
            {filtered && (
              <Link to="/india/ideas" className="ia-link">
                Clear all filters
              </Link>
            )}
          </div>
          {dir.families.length > 1 && (
            <ul className="ia-families" aria-label="Browse by family">
              {dir.families.map(({ family, count }) => (
                <li key={family}>
                  <Link
                    to="/india/ideas"
                    search={{ family: search.family === family ? undefined : family }}
                    className="ia-family-link"
                    aria-current={search.family === family ? "true" : undefined}
                  >
                    {INDIA_FAMILIES[family]} <small>{count}</small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ia-section" aria-labelledby="ia-sets-h">
          <h2 id="ia-sets-h" className="ia-h2 ia-text-xl">
            Explore the sets
          </h2>
          {dir.sets.length === 0 ? (
            <p className="ia-empty">
              No set matches all of those filters. Try removing one, or{" "}
              <Link to="/india/ideas" className="ia-link">
                start again with every set
              </Link>
              .
            </p>
          ) : (
            <div className="ia-groups">
              {[...groups].map(([family, sets]) => (
                <div className="ia-group" key={family}>
                  <h3 className="ia-group-title">{INDIA_FAMILIES[family]}</h3>
                  <ol className="ia-rows">
                    {sets.map((set) => {
                      running += 1;
                      const labels = eligibilityLabels(set);
                      return (
                        <li key={set.slug}>
                          <Link
                            to="/india/ideas/$setSlug"
                            params={{ setSlug: set.slug }}
                            className="ia-row"
                          >
                            <span className="ia-row-num" aria-hidden="true">
                              {pad2(running)}
                            </span>
                            <span>
                              <span className="ia-row-title">{set.title}</span>
                              <span className="ia-row-purpose">{set.introduction}</span>
                              <span className="ia-row-meta">
                                <span>
                                  {set.ideaCount === 1 ? "1 idea" : `${set.ideaCount} ideas`}
                                </span>
                                {labels.map((l) => (
                                  <span key={l}>{l}</span>
                                ))}
                              </span>
                            </span>
                            <span className="ia-row-arrow" aria-hidden="true">
                              →
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          )}
          <Pager
            page={dir.page}
            pageCount={dir.pageCount}
            prev={
              <Link
                to="/india/ideas"
                search={{ ...search, page: dir.page - 1 === 1 ? undefined : dir.page - 1 }}
                className="ia-link"
                rel="prev"
              >
                Previous sets
              </Link>
            }
            next={
              <Link
                to="/india/ideas"
                search={{ ...search, page: dir.page + 1 }}
                className="ia-link"
                rel="next"
              >
                More sets
              </Link>
            }
          />
        </section>

        <aside className="ia-note" aria-labelledby="ia-guide-h">
          <h2 id="ia-guide-h" className="ia-h2 ia-text-xl">
            You don't need every idea. You need a useful next step.
          </h2>
          <ol className="ia-steps">
            <li>1. Choose a set</li>
            <li>2. Compare a few</li>
            <li>3. Test one</li>
          </ol>
          <p className="ia-note-text">
            Each idea names who might pay, what you would offer and one small test to run before
            spending money. You can keep up to three side by side.
          </p>
        </aside>
      </AtlasRoot>
    </SiteShell>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
  anyLabel,
  onChange,
}: {
  id: string;
  label: string;
  value: string | undefined;
  options: [string, string][];
  anyLabel: string;
  onChange: (value: string | undefined) => void;
}) {
  const name = id.replace("ia-", "");
  const chosen = options.find(([v]) => v === value)?.[1];
  return (
    <div className="ia-field" data-active={Boolean(value)}>
      <label className="ia-field-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">{anyLabel}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {chosen && <span className="ia-field-check">✓ {chosen}</span>}
    </div>
  );
}
