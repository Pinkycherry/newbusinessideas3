import { createFileRoute } from "@tanstack/react-router";

import { urlsetXml, xmlResponse } from "@/lib/sitemap";
import { fetchIdeaTranche } from "@/lib/sitemap.server";

/**
 * One tranche of idea URLs — `/sitemap-ideas/1`, `/sitemap-ideas/2`…
 *
 * This replaced a single flat `/sitemap-ideas.xml` that selected every
 * completed idea with no range. PostgREST caps a response at 1,000 rows and
 * does not error when it truncates, so that file was one batch away from
 * silently omitting most of the site while still reporting success in Search
 * Console. See `src/lib/sitemap.server.ts` for why a tranche is 1,000 rows and
 * why they are ordered by date.
 *
 * A page past the end 404s rather than serving an empty urlset, so a stale
 * child in Google's memory reports as gone instead of as an empty file it
 * would keep re-reading.
 *
 * There is no `.xml` extension because a router param cannot carry one: a
 * literal dot inside the same path segment as `$page` is swallowed into the
 * param name, which TanStack rejects outright. The extension is cosmetic —
 * a sitemap is identified by its `Content-Type` and its XML body, not its
 * filename, which is why plenty of large sites serve `/sitemap/1`.
 */
export const Route = createFileRoute("/sitemap-ideas/$page")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const page = Number(params["page"]);
        if (!Number.isInteger(page) || page < 1) {
          return new Response("Not found", { status: 404 });
        }

        const rows = await fetchIdeaTranche(page);
        if (rows.length === 0) return new Response("Not found", { status: 404 });

        return xmlResponse(
          urlsetXml(rows.map((row) => ({ path: `/idea/${row.slug}`, lastmod: row.lastmod }))),
        );
      },
    },
  },
});
