import { createFileRoute } from "@tanstack/react-router";

import { categoryImage } from "@/config/category-imagery";
import { TAXONOMY } from "@/data/taxonomy";
import { urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";

/**
 * The indexed core of the site: the 100 main categories and their 1,000
 * subcategories, straight from the approved architecture. No database read,
 * so the sitemap can never disagree with the pages the router will serve.
 * Idea pages are deliberately absent: none are published yet.
 */
export const Route = createFileRoute("/sitemap-categories.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls: SitemapUrl[] = [];
        for (const category of TAXONOMY) {
          urls.push({
            path: `/category/${category.slug}`,
            images: [categoryImage(category.slug).src],
          });
          for (const sub of category.subcategories) {
            urls.push({ path: `/category/${category.slug}/${sub.slug}` });
          }
        }
        return xmlResponse(urlsetXml(urls));
      },
    },
  },
});
