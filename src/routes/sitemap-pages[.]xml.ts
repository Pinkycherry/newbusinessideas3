import { createFileRoute } from "@tanstack/react-router";

import { urlsetXml, xmlResponse } from "@/lib/sitemap";
import { CALCULATORS } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { CASE_STUDIES } from "@/lib/case-studies-data";

/**
 * Every page on this site that is not an idea or a category.
 *
 * Detail pages are DERIVED from the same data their routes render, never
 * hand-listed. This file used to hold twelve typed paths, and by the time
 * anyone checked it was missing all sixty calculators, all twenty guides, the
 * founder stories, the glossary, the learning resources, the FAQ index and the
 * shortlists — every section built after the list was written. A hand-kept list
 * of URLs always falls behind the site it describes. A derived one cannot.
 *
 * Deliberately absent:
 * - `/useful-tools`, which redirects to `/calculator`. A sitemap should name the
 *   destination, not the signpost.
 * - `/search` and `/sign-in`, functional pages with nothing to index.
 * - `/idea/*`, `/category/*` and `/validate/*`, which sitemap-ideas and
 *   sitemap-categories already own. Listing a URL in two sitemaps is not an
 *   error, but it makes coverage reports harder to read for no gain.
 */

const STATIC_PAGES = [
  "/",
  "/browse",
  "/blog",
  "/calculator",
  "/startup-guides",
  "/founder-stories",
  "/founder-glossary",
  "/learning-resources",
  "/list",
  "/faq",
  "/sitemap",
  "/about",
  // The destination of the author link on every idea page and every blog
  // post. Left out of here it would be crawled only through those bylines,
  // which is the weakest way for the page backing 409 authorship claims to
  // be found.
  "/founders",
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
      GET: async () =>
        xmlResponse(
          urlsetXml([
            ...STATIC_PAGES.map((path) => ({ path })),
            ...CALCULATORS.map((calculator) => ({ path: `/calculator/${calculator.slug}` })),
            ...STARTUP_GUIDES.map((guide) => ({ path: `/startup-guides/${guide.slug}` })),
            ...CASE_STUDIES.map((story) => ({ path: `/founder-stories/${story.slug}` })),
          ]),
        ),
    },
  },
});
