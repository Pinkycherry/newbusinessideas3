import { createFileRoute } from "@tanstack/react-router";

import { escapeXml } from "@/lib/sitemap";
import { fetchNewestIdeas } from "@/lib/sitemap.server";
import { siteUrl, siteIndexable, ORGANISATION_NAME } from "@/lib/site-config";

/**
 * RSS 2.0 feed of the newest idea blueprints.
 *
 * ## Why a feed as well as a sitemap
 *
 * Google re-reads a small feed far more often than it re-reads a large XML
 * sitemap, so a feed is the fast-discovery channel for pages published since
 * the last crawl: new idea live, crawled in hours rather than whenever the
 * sitemap cycle next comes round. It can be submitted in the same Search
 * Console field as a sitemap, and every large publisher runs both.
 *
 * Capped deliberately. A feed advertises what CHANGED; mirroring the whole
 * sitemap here would cost the fast polling that makes it useful.
 */
const FEED_SIZE = 50;

/** RSS requires RFC 822 dates, which is not what the database stores. */
function rfc822(value: string | null): string {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toUTCString() : new Date(0).toUTCString();
}

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const origin = siteUrl();
        const ideas = siteIndexable() ? await fetchNewestIdeas(FEED_SIZE) : [];

        const items = ideas
          .map((idea) => {
            const link = `${origin}/idea/${idea.slug}`;
            return [
              "<item>",
              `<title>${escapeXml(idea.title)}</title>`,
              `<link>${escapeXml(link)}</link>`,
              `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
              idea.summary ? `<description>${escapeXml(idea.summary)}</description>` : "",
              `<pubDate>${rfc822(idea.lastmod)}</pubDate>`,
              "</item>",
            ].join("");
          })
          .join("");

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
          "<channel>",
          `<title>${escapeXml(`${ORGANISATION_NAME} — New business idea blueprints`)}</title>`,
          `<link>${escapeXml(`${origin}/`)}</link>`,
          "<description>Researched business idea blueprints, newest first.</description>",
          "<language>en</language>",
          `<atom:link href="${escapeXml(`${origin}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
          items,
          "</channel>",
          "</rss>",
        ].join("");

        return new Response(xml, {
          headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
        });
      },
    },
  },
});
