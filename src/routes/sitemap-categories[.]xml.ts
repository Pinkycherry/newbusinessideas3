import { createFileRoute } from "@tanstack/react-router";

import { urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";
import { fetchCategoryPaths } from "@/lib/sitemap.server";

/**
 * Category, subcategory and vertical-validation URLs.
 *
 * The distinct-slug walk lives in `fetchCategoryPaths`, which pages through
 * the table in tranches. It used to be one unranged `select` of every
 * completed row — which meant ten thousand rows fetched to produce a couple of
 * hundred URLs, and, worse, a silent stop at PostgREST's 1,000-row cap that
 * would have dropped whole categories from the sitemap with nothing failing.
 */
export const Route = createFileRoute("/sitemap-categories.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { categorySlugs, subcategoryPaths } = await fetchCategoryPaths();

        const urls: SitemapUrl[] = [
          ...categorySlugs.map((slug) => ({ path: `/category/${slug}` })),
          ...subcategoryPaths.map((path) => ({ path: `/category/${path}` })),
          // The vertical validation pages. Derived from the SAME set of live
          // category slugs, so a page can never appear in the sitemap unless
          // there are completed ideas behind it — which is exactly the
          // condition the route itself 404s on.
          ...categorySlugs.map((slug) => ({ path: `/validate/${slug}` })),
        ];

        return xmlResponse(urlsetXml(urls));
      },
    },
  },
});
