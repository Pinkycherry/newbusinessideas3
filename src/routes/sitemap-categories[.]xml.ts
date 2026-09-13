import { createFileRoute } from "@tanstack/react-router";

import { db } from "@/lib/ideas.functions";
import { urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-categories.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await db()
          .from("ideas")
          .select("category_slug")
          .eq("status", "completed");
        if (error) throw new Error(error.message);

        // Subcategory URLs are deliberately NOT emitted here. `subcategory_slug`
        // is unique per idea -- 409 ideas, 409 subcategories -- so every
        // /category/x/y page held exactly one idea and duplicated the idea page
        // it linked to. Submitting 409 of those is thin content at scale, so the
        // route is now noindex,follow and stays out of the sitemap. The column is
        // untouched; when the enrichment run adds a real grouping field these can
        // come back as pages that actually list something.
        const categorySlugs = new Set<string>();
        for (const row of (data ?? []) as { category_slug: string }[]) {
          categorySlugs.add(row.category_slug);
        }

        const urls: SitemapUrl[] = [
          ...[...categorySlugs].map((slug) => ({ path: `/category/${slug}` })),
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
