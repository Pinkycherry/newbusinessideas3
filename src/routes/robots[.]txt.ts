import { createFileRoute } from "@tanstack/react-router";

import { siteUrl } from "@/lib/site-config";

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
 */

const BODY = () =>
  [
    "User-agent: *",
    "Allow: /",
    "Disallow: /search",
    "",
    `Sitemap: ${siteUrl()}/sitemap-index.xml`,
    "",
  ].join("\n");

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
