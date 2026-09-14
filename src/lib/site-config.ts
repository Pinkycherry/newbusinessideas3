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
