import { createFileRoute } from "@tanstack/react-router";

import { urlsetXml, xmlResponse } from "@/lib/sitemap";

const STATIC_PAGES = [
  "/",
  "/browse",
  "/blog",
  "/about",
  "/services",
  "/contact",
  "/pricing",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/gdpr",
  "/refund-policy",
];

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(urlsetXml(STATIC_PAGES.map((path) => ({ path })))),
    },
  },
});
