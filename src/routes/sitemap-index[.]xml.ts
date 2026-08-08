import { createFileRoute } from "@tanstack/react-router";

import { sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () =>
        xmlResponse(
          sitemapIndexXml(["/sitemap-ideas.xml", "/sitemap-categories.xml", "/sitemap-pages.xml"]),
        ),
    },
  },
});
