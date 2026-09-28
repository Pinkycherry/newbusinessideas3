import { createFileRoute } from "@tanstack/react-router";

import { urlsetXml, xmlResponse, type SitemapUrl } from "@/lib/sitemap";
import { fetchBlogPostsForSitemap } from "@/lib/sitemap.server";

/**
 * Every published blog post.
 *
 * Blog posts live in Supabase (`blog_posts`, `status = 'published'`) and had
 * no sitemap coverage at all before this file: `sitemap-pages.xml` only
 * listed the `/blog` index page itself, never the individual `/blog/$slug`
 * posts, and `feed.xml` is idea-only by design. A published post was
 * reachable only by Google crawling the index page's own links — far slower
 * than direct sitemap inclusion, and exactly the gap guides, calculators and
 * founder stories don't have, since those already derive their sitemap
 * entries from the same data their routes render.
 */
export const Route = createFileRoute("/sitemap-blog.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await fetchBlogPostsForSitemap();

        const urls: SitemapUrl[] = posts.map((post) => ({
          path: `/blog/${post.slug}`,
          lastmod: post.lastmod,
        }));

        return xmlResponse(urlsetXml(urls));
      },
    },
  },
});
