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
          // sitemap-india.xml is left out while it is empty: Search Console reports an
          // empty sitemap as an error (founder, 7 Nov 2026). Add it back when India sets publish.
          { path: "/sitemap-blog.xml", lastmod: blogLastmod },
        ];

        return xmlResponse(sitemapIndexXml(children));
      },
    },
  },
});
