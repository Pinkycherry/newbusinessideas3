import { createFileRoute } from "@tanstack/react-router";

import { siteUrl, siteIndexable } from "@/lib/site-config";

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
 * When `siteIndexable()` is false, crawlers may fetch the preview so they can
 * read the sitewide noindex header and HTML meta. There is no sitemap. Google
 * explicitly warns that a robots.txt disallow can hide the noindex rule and
 * leave a URL-only result in search.
 */
const BODY = () =>
  (siteIndexable()
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /search",
        "",
        `Sitemap: ${siteUrl()}/sitemap-index.xml`,
        "",
      ]
    : ["User-agent: *", "Allow: /", "# Preview: every response carries noindex", ""]
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
