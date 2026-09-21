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
 * SINGLE SOURCE OF TRUTH for the contact-address domain.
 *
 * Eight addresses were typed across `contact.tsx` and the policy pages, so
 * the trial deployment served `hello@businessidea.io` on bbusiness.online — a
 * domain the visitor was not on, naming a mailbox nobody reads. A domain is
 * infrastructure, not a brand name; the brand is BBI and Bro Business Ideas,
 * and the host follows the deployment.
 *
 * `import.meta.env`, NOT `process.env`. These addresses render in the browser,
 * and `process` does not exist there — `siteUrl()` guards for that and falls
 * back, which is correct for a server-rendered canonical but would make the
 * server and the client disagree here and throw a hydration mismatch. A
 * `VITE_`-prefixed variable is inlined at build time and reads identically on
 * both sides.
 */
export function contactEmailDomain(): string {
  const fromEnv = import.meta.env["VITE_CONTACT_EMAIL_DOMAIN"] as string | undefined;
  return (fromEnv?.trim() || "bbusiness.online").replace(/^@+/, "");
}

/**
 * The ONE public address. `contact@` and nothing else.
 *
 * There were four — hello@, research@, privacy@ and security@ — and none of
 * them was a mailbox anyone reads. A contact page that lists addresses which
 * bounce is worse than one that lists a single address that works, and on an
 * AdSense review a dead contact route is exactly the kind of thing that reads
 * as an unmaintained site.
 *
 * The local part is fixed and only the domain is configurable, so switching
 * deployments cannot silently invent `research@` on a host that has no such
 * mailbox.
 */
export function contactEmail(): string {
  return `contact@${contactEmailDomain()}`;
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
/**
 * SINGLE SOURCE OF TRUTH for the community figure.
 *
 * The house rule is that every number traces to a real source. This one does
 * — it is the founder's own count of groups he owns — but a membership count
 * is true on the day it is taken and wrong the day after, so it is published
 * WITH the date it was counted. A dated snapshot stays honest forever; a bare
 * figure quietly becomes a false claim the moment someone joins.
 *
 * Update both fields together, or not at all.
 */
export const COMMUNITY = {
  members: 5737,
  groups: 2,
  /** ISO date the count was taken. */
  countedOn: "2026-09-20",
  countedOnLabel: "20 September 2026",
} as const;

/** `5,737` — grouped the way a reader expects, not the way JS prints it. */
export function communityMembers(): string {
  return COMMUNITY.members.toLocaleString("en-IN");
}

/**
 * The people behind the content, declared once.
 *
 * This is the half of E-E-A-T the site had no answer for. Every page named
 * its publisher and none of them named a human, so 409 researched blueprints
 * published with nobody accountable for them. Google's guidance on
 * AI-assisted content asks who, how and why; this is the who, and `/about`
 * is the how and the why.
 *
 * Every credential here is checkable. Nothing is added that cannot be.
 */
export type TeamMember = {
  name: string;
  /** What they actually do here, not a title for its own sake. */
  role: string;
  credential: string;
};

export const FOUNDER: TeamMember = {
  name: "Kartik Ramaswamy",
  role: "Founder. Researches and signs off every blueprint published here.",
  credential: "B.E. Computer Science and MBA, Anna University Regional Campus, Madurai",
};

export const CO_FOUNDER: TeamMember = {
  name: "Chandini",
  role: "Co-founder. Editorial and quality review, and the first reader of every idea.",
  credential: "B.E. Electronics and MBA, Anna University Regional Campus, Madurai",
};

export const TEAM: TeamMember[] = [
  FOUNDER,
  CO_FOUNDER,
  {
    name: "Muthuraj Iyer",
    role: "Research and verification. Volunteers his time and takes nothing for it.",
    credential: "B.E. Computer Science and MBA, Anna University Regional Campus, Madurai",
  },
  {
    name: "Prathap Purohit",
    role: "Replies to roughly half the email that reaches us, and is learning the rest of it as he goes.",
    credential: "B.E. Computer Science, Anna University Regional Campus, Madurai",
  },
];

/**
 * The brand is one name, everywhere: logo, titles, meta, footer and schema.
 * "BBI" alone reads as an abbreviation with nothing behind it, and "BBusiness"
 * came from the domain rather than the brand — a reader seeing three variants
 * cannot form a stable idea of who this is, and neither can Google.
 */
export const ORGANISATION_NAME = "BBI – Bro Business Ideas";
export const ORGANISATION_LEGAL_NAME = "Bro Business Ideas";

export function organisationSameAs(): string[] {
  const fromEnv = typeof process !== "undefined" ? process.env?.["SITE_SAME_AS"] : undefined;
  return (fromEnv ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
