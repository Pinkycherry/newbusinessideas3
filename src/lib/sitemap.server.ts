import { db } from "@/lib/ideas.functions";

/**
 * SINGLE SOURCE OF TRUTH for every database read behind a sitemap or feed.
 *
 * ## Why 1,000
 *
 * PostgREST caps a response at 1,000 rows and does NOT error when it
 * truncates. The sitemap routes used to select every completed idea with no
 * range at all, which worked only because the table was smaller than the cap:
 * past 1,000 ideas they would have gone on returning 200 OK and a valid,
 * green-in-Search-Console sitemap that silently omitted every row beyond the
 * first thousand. Nothing fails, nothing warns, and the only symptom is that
 * most of the site never gets indexed.
 *
 * So one tranche is exactly one thousand rows: one file, one query, filled to
 * the cap. The truncation is then not merely handled, it is unreachable — no
 * single query here can ever want more rows than PostgREST will return.
 */
export const IDEA_TRANCHE_SIZE = 1000;

export type IdeaSitemapRow = { slug: string; lastmod: string | null };

/**
 * `lastmod` currently reads `created_at`, because the `ideas` table has no
 * `updated_at` column. That makes it truthful for a new idea and a lie for an
 * edited one: after an enrichment pass rewrites a row, the sitemap still
 * reports the original creation date and Google sees no reason to re-crawl.
 *
 * Fixing that needs an `updated_at` column with a trigger on the table, which
 * the n8n pipeline also writes to. When it exists, change this one constant
 * and every sitemap becomes honest at once.
 */
const LASTMOD_COLUMN = "created_at";

/** How many completed ideas exist. Counted by Postgres, not fetched. */
export async function countCompletedIdeas(): Promise<number> {
  const { count, error } = await db()
    .from("ideas")
    .select("slug", { count: "exact", head: true })
    .eq("status", "completed");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Number of idea sitemap files at the current row count. Always at least one. */
export function trancheCount(total: number): number {
  return Math.max(1, Math.ceil(total / IDEA_TRANCHE_SIZE));
}

/**
 * One tranche of ideas, 1-indexed to match the URL (`/sitemap-ideas/1.xml`).
 * Returns an empty array for a page past the end, which is what lets the route
 * 404 rather than serve an empty sitemap Google would keep re-reading.
 *
 * ## Why the order is by date and not by slug
 *
 * Tranching only helps if a tranche's CONTENTS are stable. Ordered by slug, a
 * single new idea whose slug sorts early pushes one row across every tranche
 * boundary after it: every file's contents change, every `lastmod` moves, and
 * Google re-reads all of them — precisely the re-crawl that splitting the
 * sitemap was meant to avoid. Ordered by creation date the table is
 * append-only, so a new batch lands in the last tranche (or starts a new one)
 * and every earlier file is byte-identical to what Google already has.
 */
export async function fetchIdeaTranche(page: number): Promise<IdeaSitemapRow[]> {
  const from = (page - 1) * IDEA_TRANCHE_SIZE;
  const { data, error } = await db()
    .from("ideas")
    .select(`slug,${LASTMOD_COLUMN}`)
    .eq("status", "completed")
    .order(LASTMOD_COLUMN, { ascending: true })
    .order("slug", { ascending: true })
    .range(from, from + IDEA_TRANCHE_SIZE - 1);
  if (error) throw new Error(error.message);
  return ((data ?? []) as Record<string, string | null>[]).map((row) => ({
    slug: String(row["slug"]),
    lastmod: row[LASTMOD_COLUMN] ?? null,
  }));
}

/**
 * The newest date inside each tranche, for the sitemap index's `<lastmod>`.
 *
 * Rows are ordered oldest-first, so a tranche's newest date is simply its LAST
 * row — one single-row read per tranche, run in parallel. Ten tiny reads at ten
 * thousand ideas. The alternative is fetching every row's date to find ten
 * maxima, which is the full-table scan this file exists to remove.
 *
 * The final tranche is still filling, so its boundary row does not exist yet;
 * it falls back to the newest date on the table, which is the same value.
 */
export async function fetchTrancheLastmods(count: number): Promise<(string | null)[]> {
  const newestOverall = async (): Promise<string | null> => {
    const { data, error } = await db()
      .from("ideas")
      .select(LASTMOD_COLUMN)
      .eq("status", "completed")
      .order(LASTMOD_COLUMN, { ascending: false })
      .range(0, 0);
    if (error) throw new Error(error.message);
    return ((data ?? []) as Record<string, string | null>[])[0]?.[LASTMOD_COLUMN] ?? null;
  };

  return Promise.all(
    Array.from({ length: count }, async (_unused, index) => {
      const boundary = (index + 1) * IDEA_TRANCHE_SIZE - 1;
      const { data, error } = await db()
        .from("ideas")
        .select(LASTMOD_COLUMN)
        .eq("status", "completed")
        .order(LASTMOD_COLUMN, { ascending: true })
        .order("slug", { ascending: true })
        .range(boundary, boundary);
      if (error) throw new Error(error.message);
      const row = ((data ?? []) as Record<string, string | null>[])[0];
      return row?.[LASTMOD_COLUMN] ?? (await newestOverall());
    }),
  );
}

/**
 * The newest ideas, for the feed. Ordered by date rather than slug, and hard
 * capped — a feed exists to advertise what changed, not to mirror the sitemap.
 */
export async function fetchNewestIdeas(
  limit: number,
): Promise<{ slug: string; title: string; summary: string | null; lastmod: string | null }[]> {
  const { data, error } = await db()
    .from("ideas")
    .select(`slug,title,summary,${LASTMOD_COLUMN}`)
    .eq("status", "completed")
    .order(LASTMOD_COLUMN, { ascending: false })
    .range(0, Math.max(0, Math.min(limit, IDEA_TRANCHE_SIZE) - 1));
  if (error) throw new Error(error.message);
  return ((data ?? []) as Record<string, string | null>[]).map((row) => ({
    slug: String(row["slug"]),
    title: String(row["title"] ?? ""),
    summary: row["summary"] ?? null,
    lastmod: row[LASTMOD_COLUMN] ?? null,
  }));
}

/**
 * Every distinct category and subcategory path, walked in tranches.
 *
 * PostgREST has no DISTINCT, so this has to page through the rows and collect
 * the pairs. It stops as soon as a page comes back short, so the cost tracks
 * the table size rather than a guessed upper bound — and unlike the single
 * unranged query it replaces, it cannot silently stop at a thousand.
 */
export async function fetchCategoryPaths(): Promise<{
  categorySlugs: string[];
  subcategoryPaths: string[];
}> {
  const categorySlugs = new Set<string>();
  const subcategoryPaths = new Set<string>();

  for (let page = 0; ; page += 1) {
    const from = page * IDEA_TRANCHE_SIZE;
    const { data, error } = await db()
      .from("ideas")
      .select("category_slug,subcategory_slug")
      .eq("status", "completed")
      .range(from, from + IDEA_TRANCHE_SIZE - 1);
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as { category_slug: string; subcategory_slug: string }[];
    for (const row of rows) {
      if (row.category_slug) categorySlugs.add(row.category_slug);
      if (row.category_slug && row.subcategory_slug) {
        subcategoryPaths.add(`${row.category_slug}/${row.subcategory_slug}`);
      }
    }
    if (rows.length < IDEA_TRANCHE_SIZE) break;
  }

  return { categorySlugs: [...categorySlugs], subcategoryPaths: [...subcategoryPaths] };
}

export type HubIdea = { slug: string; title: string; categoryName: string; categorySlug: string };

/**
 * Every completed idea, for the HTML sitemap at `/sitemap`.
 *
 * Paged in tranches for the same reason as everything else in this file: an
 * unranged select would stop at a thousand without saying so, and the page
 * whose entire job is to link to every idea would quietly link to a tenth of
 * them.
 */
export async function fetchIdeasForHub(): Promise<HubIdea[]> {
  const out: HubIdea[] = [];

  for (let page = 0; ; page += 1) {
    const from = page * IDEA_TRANCHE_SIZE;
    const { data, error } = await db()
      .from("ideas")
      .select("slug,title,category_name,category_slug")
      .eq("status", "completed")
      .order("category_name", { ascending: true })
      .order("title", { ascending: true })
      .range(from, from + IDEA_TRANCHE_SIZE - 1);
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as {
      slug: string;
      title: string;
      category_name: string;
      category_slug: string;
    }[];
    for (const row of rows) {
      out.push({
        slug: row.slug,
        title: row.title,
        categoryName: row.category_name,
        categorySlug: row.category_slug,
      });
    }
    if (rows.length < IDEA_TRANCHE_SIZE) break;
  }

  return out;
}
