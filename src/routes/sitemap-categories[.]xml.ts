import { createFileRoute } from "@tanstack/react-router";

import { db } from "@/lib/ideas.functions";
import { urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-categories.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await db()
          .from("ideas")
          .select("category_slug,subcategory_slug")
          .eq("status", "completed");
        if (error) throw new Error(error.message);

        const categorySlugs = new Set<string>();
        const subcategoryPaths = new Set<string>();
        for (const row of (data ?? []) as { category_slug: string; subcategory_slug: string }[]) {
          categorySlugs.add(row.category_slug);
          subcategoryPaths.add(`${row.category_slug}/${row.subcategory_slug}`);
        }

        const urls: SitemapUrl[] = [
          ...[...categorySlugs].map((slug) => ({ path: `/category/${slug}` })),
          ...[...subcategoryPaths].map((path) => ({ path: `/category/${path}` })),
          // The vertical validation pages. Derived from the SAME set of live
          // category slugs, so a page can never appear in the sitemap unless
          // there are completed ideas behind it — which is exactly the
          // condition the route itself 404s on.
          ...[...categorySlugs].map((slug) => ({ path: `/validate/${slug}` })),
        ];

        return xmlResponse(urlsetXml(urls));
      },
    },
  },
});
