import { createFileRoute } from "@tanstack/react-router";

import { loadIndiaSitemap } from "@/lib/india.server";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

/**
 * India Idea Atlas sitemap: the directory plus every PUBLISHED set. Draft
 * fixtures are never listed, so until the first real set is published this
 * returns an empty urlset. Individual ideas are anchors inside a set
 * (#idea-...), not pages, so they are not listed.
 */
export const Route = createFileRoute("/sitemap-india.xml")({
  server: {
    handlers: {
      GET: async () => {
        const sets = await loadIndiaSitemap();
        if (sets.length === 0) return xmlResponse(urlsetXml([]));
        const newest =
          sets
            .map((s) => s.lastmod ?? "")
            .sort()
            .at(-1) || null;
        return xmlResponse(
          urlsetXml([
            { path: "/india/ideas", lastmod: newest },
            ...sets.map((s) => ({ path: `/india/ideas/${s.slug}`, lastmod: s.lastmod })),
          ]),
        );
      },
    },
  },
});
