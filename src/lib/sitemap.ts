import { siteUrl, siteIndexable } from "@/lib/site-config";

/**
 * SINGLE SOURCE OF TRUTH for sitemap XML rendering. sitemap-*.xml server
 * routes each import from here — the escaping and envelope logic lives once.
 */

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type SitemapUrl = { path: string; lastmod?: string | null };

/** One child of the sitemap index. `lastmod` is what makes tranching pay off. */
export type SitemapChild = { path: string; lastmod?: string | null };

function lastmodTag(lastmod: string | null | undefined): string {
  return lastmod ? `<lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>` : "";
}

/**
 * A urlset. Returns an EMPTY one when the deployment is not indexable, so the
 * staging flag cannot be defeated by a sitemap that still advertises every URL.
 */
export function urlsetXml(urls: SitemapUrl[]): string {
  const entries = siteIndexable()
    ? urls
        .map(
          (u) =>
            `<url><loc>${escapeXml(`${siteUrl()}${u.path}`)}</loc>${lastmodTag(u.lastmod)}</url>`,
        )
        .join("")
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

/**
 * The sitemap index.
 *
 * Every child carries a `<lastmod>`, and that single tag is the whole reason
 * to split a sitemap at all. Google reads this index, compares each child's
 * date against what it last saw, and re-fetches ONLY the children that moved.
 * Without it, adding one batch of ideas forces a re-read of every URL on the
 * site to find the new ones, and the crawl budget is spent re-reading pages
 * that have not changed. With it, one tranche moves and one tranche is read.
 */
export function sitemapIndexXml(children: SitemapChild[]): string {
  const entries = siteIndexable()
    ? children
        .map(
          (c) =>
            `<sitemap><loc>${escapeXml(`${siteUrl()}${c.path}`)}</loc>${lastmodTag(c.lastmod)}</sitemap>`,
        )
        .join("")
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
