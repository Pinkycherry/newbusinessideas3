import { CALCULATORS } from "./calculators";
import { GLOSSARY_DATA } from "./glossary-data";
import { STARTUP_GUIDES } from "./guides-data";
import { fetchPosts } from "./blog.server";

/**
 * The cross-link block that closes every long page, assembled SERVER-SIDE.
 *
 * Three of the four pools live in modules this file is the only importer of:
 * `guides-data.ts` inlines twenty full markdown articles, `glossary-data.ts`
 * carries 159 terms, and `calculators.ts` carries sixty compute functions.
 * Shipping any of that to the browser to render a list of links would cost
 * several hundred kilobytes on every idea page. Nothing here is imported by a
 * route: `resources.functions.ts` reaches this module through a dynamic
 * `import()` inside a server handler, so it stays out of the client bundle
 * and only the slim result below crosses the wire.
 *
 * WHY THE RANDOMISATION IS HERE AND NOT IN A COMPONENT: the founder asked for
 * guides, glossary terms and blog posts that change on every refresh. A
 * `Math.random()` inside a React component runs once on the server and again
 * in the browser, returns different picks each time, and React answers the
 * mismatch by throwing the server's markup away — the exact bug already
 * documented on `IdeaPage`'s own variant/gradient picks. Picked once per
 * request, here, the result travels to the client through the router's
 * loader data and both sides render the identical list.
 */

export type ResourceLink = { slug: string; label: string; blurb: string; meta?: string };

export type PageResources = {
  calculators: ResourceLink[];
  guides: ResourceLink[];
  glossary: ResourceLink[];
  posts: ResourceLink[];
};

/** Fisher-Yates over a copy. The pools are never mutated. */
function sample<T>(pool: readonly T[], size: number): T[] {
  const copy = pool.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy.slice(0, size);
}

function trim(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max).lastIndexOf(" ");
  return `${clean.slice(0, cut > 40 ? cut : max).replace(/[.,;:—–-]$/, "")}…`;
}

/**
 * Twelve calculators, and the same twelve every time.
 *
 * Only guides, glossary and blog rotate — the founder named those three. A
 * calculator strip that reshuffles on every refresh makes the tools feel like
 * a feed rather than a fixed set of things this site has, and a reader who
 * came back for the break-even calculator should find it where it was.
 *
 * Twelve, not ten, at the founder's request 2026-09-22. It also divides
 * cleanly into the three-column grid the hub renders it in, where ten left a
 * short last row.
 */
const CALCULATOR_PICKS = CALCULATORS.filter(Boolean).slice(0, 12);

export async function buildPageResources(): Promise<PageResources> {
  const calculators: ResourceLink[] = CALCULATOR_PICKS.map((calculator) => ({
    slug: calculator.slug,
    label: calculator.title,
    blurb: trim(calculator.answers || calculator.highlight || "", 96),
  }));

  // Six of the twenty written guides, redrawn per request.
  const guides: ResourceLink[] = sample(STARTUP_GUIDES, 6).map((guide) => ({
    slug: guide.slug,
    label: guide.title,
    blurb: trim(guide.description, 130),
    meta: guide.readTime,
  }));

  // Twelve of the 159 defined terms, redrawn per request.
  const glossary: ResourceLink[] = sample(GLOSSARY_DATA, 12).map((term) => ({
    slug: term.slug,
    label: term.term,
    blurb: trim(term.definition, 110),
    meta: term.category,
  }));

  // The blog is the one pool that is not a bundled module, so it is the one
  // that can be empty: `fetchPosts` returns no posts rather than mock ones
  // when the database is unreachable, and the component drops the block.
  // A wider window than six, then six drawn from it, so the rotation reaches
  // past the most recent handful.
  let posts: ResourceLink[] = [];
  try {
    const { posts: recent } = await fetchPosts(1, 30);
    posts = sample(recent, 6).map((post) => ({
      slug: post.slug,
      label: post.title,
      blurb: trim(post.excerpt, 130),
      meta: `${post.readingMinutes} min read`,
    }));
  } catch {
    posts = [];
  }

  return { calculators, guides, glossary, posts };
}
