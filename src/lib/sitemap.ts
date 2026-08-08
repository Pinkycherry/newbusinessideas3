import { siteUrl } from "@/lib/site-config";

/**
 * SINGLE SOURCE OF TRUTH for sitemap XML rendering. sitemap-*.xml server
 * routes each import from here — the escaping and envelope logic lives once.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type SitemapUrl = { path: string; lastmod?: string | null };

export function urlsetXml(urls: SitemapUrl[]): string {
  const entries = urls
    .map((u) => {
      const loc = escapeXml(`${siteUrl()}${u.path}`);
      const lastmod = u.lastmod ? `<lastmod>${escapeXml(u.lastmod.slice(0, 10))}</lastmod>` : "";
      return `<url><loc>${loc}</loc>${lastmod}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

export function sitemapIndexXml(sitemapPaths: string[]): string {
  const entries = sitemapPaths
    .map((path) => `<sitemap><loc>${escapeXml(`${siteUrl()}${path}`)}</loc></sitemap>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
