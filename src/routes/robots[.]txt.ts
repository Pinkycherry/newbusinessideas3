import { createFileRoute } from "@tanstack/react-router";

import { siteUrl, siteIndexable } from "@/lib/site-config";
import { AI_CRAWLERS, AI_ROBOTS_TOKENS } from "@/lib/ai-bots";

/**
 * robots.txt, served from the app so the sitemap line follows the domain.
 *
 * This used to be a static file in `public/` with the sitemap URL typed into
 * it. That URL named a different domain, so attaching a new one would have
 * pointed every crawler at the old site's sitemap -- and a crawler reads the
 * sitemap it is handed. It is generated here instead, from the same `siteUrl()`
 * every canonical and sitemap entry uses.
 *
 * `/search` is excluded because search result pages are infinite, thin, and
 * generate crawl traffic that finds nothing worth indexing.
 *
 * When `SITE_INDEXABLE=false` this becomes a blanket disallow. Note that on a
 * domain being TORN DOWN that is the wrong move on its own: a crawler that
 * cannot fetch a page cannot read the `noindex` that removes it. See the note
 * on `siteIndexable` for the order that actually de-indexes a site.
 */
const BODY = () =>
  (siteIndexable()
    ? [
        // Content protection (7 Nov 2026): AI crawlers and AI training are not allowed. Google Search and AdSense stay allowed.
        ...[...AI_CRAWLERS, ...AI_ROBOTS_TOKENS].flatMap((bot) => [`User-agent: ${bot}`, "Disallow: /", ""]),
        "User-agent: *",
        "Allow: /",
        "Disallow: /search",
        "",
        `Sitemap: ${siteUrl()}/sitemap-index.xml`,
        "",
      ]
    : ["User-agent: *", "Disallow: /", ""]
  ).join("\n");

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(BODY(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
