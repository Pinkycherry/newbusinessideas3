/**
 * SINGLE SOURCE OF TRUTH for this site's own canonical origin (schema.org
 * markup, sitemaps, absolute URLs). Set SITE_URL in the environment once the
 * businessidea.io domain is live; falls back to the current Lovable domain.
 */
export function siteUrl(): string {
  const fromEnv = typeof process !== "undefined" ? process.env?.["SITE_URL"] : undefined;
  return (fromEnv?.trim() || "https://newbusinessideas3.lovable.app").replace(/\/+$/, "");
}

/**
 * SINGLE SOURCE OF TRUTH for the WordPress blog.
 *
 * To point the blog at a different WordPress instance, change this ONE line
 * (or set the WORDPRESS_SITE_URL environment variable, which wins over it).
 * Nothing else in the codebase hardcodes a WordPress URL.
 */
export const DEFAULT_WORDPRESS_SITE_URL = "https://nutrizoe.in";

/** Resolved at request time so an env override can swap sites with no rebuild. */
export function wordpressSiteUrl(): string {
  const fromEnv = typeof process !== "undefined" ? process.env?.["WORDPRESS_SITE_URL"] : undefined;
  return (fromEnv?.trim() || DEFAULT_WORDPRESS_SITE_URL).replace(/\/+$/, "");
}

export function wordpressApiBase(): string {
  return `${wordpressSiteUrl()}/wp-json/wp/v2`;
}
