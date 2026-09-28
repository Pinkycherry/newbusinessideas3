import { createFileRoute } from "@tanstack/react-router";

import { sitemapIndexXml, xmlResponse, type SitemapChild } from "@/lib/sitemap";
import {
  countCompletedIdeas,
  fetchBlogPostsForSitemap,
  fetchTrancheLastmods,
  trancheCount,
} from "@/lib/sitemap.server";

/**
 * The one sitemap to submit to Search Console.
 *
 * The idea children are ENUMERATED FROM THE LIVE ROW COUNT, not listed by
 * hand. Cross ten thousand ideas and an eleventh tranche appears here on its
 * own; nothing needs editing and nothing can fall behind the data the way a
 * typed list does.
 */
export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () => {
        const total = await countCompletedIdeas();
        const tranches = trancheCount(total);
        const [lastmods, blogPosts] = await Promise.all([
          fetchTrancheLastmods(tranches),
          fetchBlogPostsForSitemap(),
        ]);
        // Newest of the batch, so the index only re-reads sitemap-blog.xml
        // when a post actually changed — same reasoning as every other
        // child's lastmod here.
        const blogLastmod = blogPosts.reduce<string | null>((newest, post) => {
          if (!post.lastmod) return newest;
          return !newest || post.lastmod > newest ? post.lastmod : newest;
        }, null);

        const children: SitemapChild[] = [
          { path: "/sitemap-pages.xml" },
          { path: "/sitemap-categories.xml" },
          { path: "/sitemap-blog.xml", lastmod: blogLastmod },
          ...Array.from({ length: tranches }, (_unused, index) => ({
            path: `/sitemap-ideas/${index + 1}`,
            lastmod: lastmods[index] ?? null,
          })),
        ];

        return xmlResponse(sitemapIndexXml(children));
      },
    },
  },
});
