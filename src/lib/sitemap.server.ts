import { db } from "@/lib/db";

/**
 * Database reads behind the blog sitemap and the HTML sitemap. Categories and
 * subcategories are static (src/data/taxonomy.ts) and need no query.
 *
 * Every query is ranged in pages of 1,000: PostgREST caps a response at 1,000
 * rows and does NOT error when it truncates.
 */
const PAGE_SIZE = 1000;

/**
 * Every published blog post, for `/sitemap-blog.xml`.
 *
 * Ranged for the same reason as every other query in this file: an unranged
 * select silently stops at 1,000 rows on this project's Postgres cap. The
 * blog is nowhere near that today, but writing the range in now means it
 * never needs remembering later, the same bet already made everywhere else
 * here.
 *
 * `lastmod` reads `updated_at` over `published_at` when present — whichever
 * is more recent reflects the truth better, and `updated_at` defaults to
 * `now()` on the row, so a never-edited post still reports something
 * meaningful.
 */
export async function fetchBlogPostsForSitemap(): Promise<
  { slug: string; lastmod: string | null }[]
> {
  const out: { slug: string; lastmod: string | null }[] = [];

  for (let page = 0; ; page += 1) {
    const from = page * PAGE_SIZE;
    const { data, error } = await db()
      .from("blog_posts")
      .select("slug,published_at,updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: true })
      .order("slug", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as {
      slug: string;
      published_at: string | null;
      updated_at: string | null;
    }[];
    for (const row of rows) {
      out.push({ slug: row.slug, lastmod: row.updated_at ?? row.published_at });
    }
    if (rows.length < PAGE_SIZE) break;
  }

  return out;
}

export type HubBlogPost = { slug: string; title: string };

/**
 * Every published blog post, for the HTML sitemap at `/sitemap`.
 *
 * Same ranged pattern as `fetchBlogPostsForSitemap` above, kept as a separate
 * query rather than reused because the HTML sitemap needs a title to link
 * with and the XML one only ever needs a slug and a date.
 */
export async function fetchBlogPostsForHub(): Promise<HubBlogPost[]> {
  const out: HubBlogPost[] = [];

  for (let page = 0; ; page += 1) {
    const from = page * PAGE_SIZE;
    const { data, error } = await db()
      .from("blog_posts")
      .select("slug,title")
      .eq("status", "published")
      .order("published_at", { ascending: true })
      .order("slug", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as { slug: string; title: string | null }[];
    for (const row of rows) {
      out.push({ slug: row.slug, title: row.title ?? row.slug });
    }
    if (rows.length < PAGE_SIZE) break;
  }

  return out;
}
