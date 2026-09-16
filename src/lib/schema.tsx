import {
  ORGANISATION_LEGAL_NAME,
  ORGANISATION_NAME,
  organisationSameAs,
  siteUrl,
} from "@/lib/site-config";

/**
 * SINGLE SOURCE OF TRUTH for schema.org JSON-LD. Written once per template
 * here, not per idea/page — every idea renders through idea.$slug.tsx, every
 * category through category.$categorySlug.index.tsx, etc, so wiring the
 * matching builder into each template file covers every row already in
 * Supabase and every row it writes in the future with zero per-record work.
 */

/**
 * The publishing entity, reused as `publisher` on every content type.
 *
 * This is the E-E-A-T signal the site was missing entirely: Organization,
 * publisher, and dateModified had zero occurrences in the codebase, so pages
 * described their subject without ever declaring who was accountable for it.
 * Defined once here so one edit updates every page already in Supabase.
 */
export function organisationSchema() {
  const sameAs = organisationSameAs();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANISATION_NAME,
    legalName: ORGANISATION_LEGAL_NAME,
    url: siteUrl(),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Schema.org, Open Graph and Twitter Card all expect a full URL for an
 *  image, never a root-relative path. Every featured image in this codebase
 *  is committed under `public/` and referenced as `/images/...`, so this is
 *  the one place that turns it into the absolute form each of those wants. */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${siteUrl()}${path}`;
}

/** The same entity as a nested reference, for use inside another schema node. */
function publisherRef() {
  return {
    "@type": "Organization",
    name: ORGANISATION_NAME,
    url: siteUrl(),
  };
}

export type BreadcrumbEntry = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`,
    })),
  };
}

export function articleSchema(input: {
  path: string;
  headline: string;
  description: string;
  datePublished?: string | null;
  /** Falls back to datePublished: a page that has never been revised was last
   *  modified when it was written, and omitting it entirely is a weaker signal
   *  than stating the truth. */
  dateModified?: string | null;
  categoryName: string;
  /** Root-relative (`/images/...`) or absolute. Resolved to absolute here —
   *  schema.org and every consumer of it expect a full URL, not a path. */
  image?: string;
}) {
  const modified = input.dateModified ?? input.datePublished;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    about: input.categoryName,
    mainEntityOfPage: `${siteUrl()}${input.path}`,
    publisher: publisherRef(),
  };
}

export function collectionPageSchema(input: {
  path: string;
  name: string;
  description: string;
  itemCount?: number;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: `${siteUrl()}${input.path}`,
    ...(input.itemCount !== undefined ? { numberOfItems: input.itemCount } : {}),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    publisher: publisherRef(),
  };
}

export function webPageSchema(input: { path: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: `${siteUrl()}${input.path}`,
    publisher: publisherRef(),
  };
}

/** Renders one or more JSON-LD objects as inline <script> tags. SSR'd into the initial HTML. */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const items = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
