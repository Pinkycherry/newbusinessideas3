import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { searchIdeas } from "@/lib/ideas.functions";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Search Business Ideas | IdeaVault AI" },
      {
        name: "description",
        content:
          "Search the IdeaVault library by keyword, market or model to find the business idea blueprint that fits you.",
      },
      { property: "og:title", content: "Search Business Ideas | IdeaVault AI" },
      {
        property: "og:description",
        content: "Search the IdeaVault library by keyword, market or business model.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [term, setTerm] = useState(q ?? "");

  const query = useQuery({
    queryKey: ["search", q ?? ""],
    queryFn: () => searchIdeas({ data: { q: q ?? "" } }),
    enabled: Boolean(q && q.trim()),
  });

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Search" }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Search the vault</h1>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { q: term } });
          }}
        >
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. data enrichment, newsletters, automation"
            aria-label="Search business ideas"
            className="w-full rounded-md border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Search
          </button>
        </form>

        <div className="mt-8">
          {!q?.trim() && (
            <p className="text-sm text-muted-foreground">Type a keyword to search every idea.</p>
          )}
          {query.isLoading && <p className="text-sm text-muted-foreground">Searching…</p>}
          {query.isError && (
            <p className="text-sm text-destructive">Search failed. Try again in a moment.</p>
          )}
          {query.data && (
            <>
              <p className="text-sm text-muted-foreground">
                {query.data.length} result{query.data.length === 1 ? "" : "s"} for “{q}”
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {query.data.map((idea) => (
                  <IdeaCard key={idea.ideaId} idea={idea} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </SiteShell>
  );
}