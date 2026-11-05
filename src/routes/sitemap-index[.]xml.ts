import { createFileRoute } from "@tanstack/react-router";

import { sitemapIndexXml, xmlResponse, type SitemapChild } from "@/lib/sitemap";
import { fetchBlogPostsForSitemap } from "@/lib/sitemap.server";

/** The one sitemap to submit to Search Console. */
export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () => {
        // The blog lives in the database; a failed read must not take the
        // category sitemap down with it.
        const blogPosts = await fetchBlogPostsForSitemap().catch(() => []);
        const blogLastmod = blogPosts.reduce<string | null>((newest, post) => {
          if (!post.lastmod) return newest;
          return !newest || post.lastmod > newest ? post.lastmod : newest;
        }, null);

        const children: SitemapChild[] = [
          { path: "/sitemap-pages.xml" },
          { path: "/sitemap-categories.xml" },
          { path: "/sitemap-blog.xml", lastmod: blogLastmod },
        ];

        return xmlResponse(sitemapIndexXml(children));
      },
    },
  },
});
