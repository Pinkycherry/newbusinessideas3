/**
 * SINGLE SOURCE OF TRUTH for this site's own canonical origin (schema.org
 * markup, sitemaps, absolute URLs). SITE_URL must be set in the environment at
 * BOTH build time and runtime; the fallback is the production domain so that a
 * missing variable degrades to the right site rather than an old preview one.
 */
export function siteUrl(): string {
  const fromEnv = typeof process !== "undefined" ? process.env?.["SITE_URL"] : undefined;
  return (fromEnv?.trim() || "https://businessidea.io").replace(/\/+$/, "");
}

/**
 * The canonical URL for a path on THIS site.
 *
 * Every public absolute URL is built from `siteUrl()`, so moving domains is one
 * environment variable and nothing else. A hand-typed domain anywhere in the
 * codebase survives a domain change silently and points crawlers at the old
 * site, which is what this exists to prevent.
 *
 * Query strings and fragments are dropped deliberately: `/browse?page=2` and
 * `/browse` are one page to a crawler, and a canonical that varies by query
 * parameter splits a single page into many in the index.
 */
export function canonicalUrl(pathname: string): string {
  const path = (pathname || "/").split("?")[0]!.split("#")[0]!;
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  // The homepage keeps its trailing slash so the canonical matches the URL the
  // server actually serves rather than a bare origin.
  return trimmed === "" ? `${siteUrl()}/` : `${siteUrl()}/${trimmed}`;
}

/**
 * SINGLE SOURCE OF TRUTH for whether this deployment may be indexed.
 *
 * Defaults to TRUE so the production site behaves normally with no variable
 * set. Setting `SITE_INDEXABLE=false` on a deployment turns the whole site
 * into a staging site in one move, read at request time with no rebuild:
 *
 *   - `robots.txt` becomes `Disallow: /`
 *   - every page emits `<meta name="robots" content="noindex,nofollow">`
 *   - every sitemap returns an empty urlset
 *
 * All three matter together. A `noindex` tag alone still lets crawlers walk
 * the site, and a `Disallow` alone is worse than nothing: a blocked page can
 * still be indexed from a link elsewhere, and because the crawler may not
 * fetch it, it never reads the `noindex` that would have removed it. The
 * teardown order that follows from this is deliberate -- serve `noindex` with
 * crawling still ALLOWED until the URLs have dropped out, and only then
 * block. Doing both at once is the usual reason a de-indexed domain stays in
 * the index for months.
 */
export function siteIndexable(): boolean {
  const raw = typeof process !== "undefined" ? process.env?.["SITE_INDEXABLE"] : undefined;
  return (raw ?? "").trim().toLowerCase() !== "false";
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

/**
 * SINGLE SOURCE OF TRUTH for the publishing entity behind this site.
 *
 * Every page asserts what it is about; none of them asserted who stands behind
 * it. `Organization` as `publisher` is the signal search engines and AI
 * crawlers use to attach authorship and accountability to content, and it was
 * absent from the whole codebase.
 *
 * `sameAs` is deliberately empty. It is meant to list profiles the same
 * organisation genuinely controls, and inventing URLs there is worse than
 * omitting it -- a broken or wrong profile is a trust signal pointing the
 * wrong way. Fill it in when the real accounts exist.
 */
export const ORGANISATION_NAME = "BBI";
export const ORGANISATION_LEGAL_NAME = "Bro Business Ideas";

export function organisationSameAs(): string[] {
  const fromEnv = typeof process !== "undefined" ? process.env?.["SITE_SAME_AS"] : undefined;
  return (fromEnv ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
