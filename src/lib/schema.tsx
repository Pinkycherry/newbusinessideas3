import { siteUrl } from "@/lib/site-config";

/**
 * SINGLE SOURCE OF TRUTH for schema.org JSON-LD. Written once per template
 * here, not per idea/page — every idea renders through idea.$slug.tsx, every
 * category through category.$categorySlug.index.tsx, etc, so wiring the
 * matching builder into each template file covers every row already in
 * Supabase and every row it writes in the future with zero per-record work.
 */

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
  categoryName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    about: input.categoryName,
    mainEntityOfPage: `${siteUrl()}${input.path}`,
  };
}

export function collectionPageSchema(input: {
  path: string;
  name: string;
  description: string;
  itemCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: `${siteUrl()}${input.path}`,
    ...(input.itemCount !== undefined ? { numberOfItems: input.itemCount } : {}),
  };
}

export function webPageSchema(input: { path: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: `${siteUrl()}${input.path}`,
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
