import { db } from "./ideas.functions";
import {
  excerpt,
  readingMinutes,
  sanitizeHtml,
  stripHtml,
  type BlogPost,
  type BlogPostCard,
} from "./blog-shared";
import { siteUrl } from "./site-config";

/**
 * The blog reads from Supabase `blog_posts`.
 *
 * It used to fetch the REST API of an unrelated site, which is why `/blog`
 * served someone else's posts. The two exported functions below keep the exact
 * signatures the routes already call, so `blog.index.tsx` and `blog.$slug.tsx`
 * are untouched by this change.
 *
 * Two rules this file holds to:
 *
 * 1. Only `status = 'published'` rows are ever returned. A draft becoming
 *    public is a deliberate act in the database, never a side effect of code.
 * 2. When the database is unreachable the blog is EMPTY, not mocked. Elsewhere
 *    in this codebase a missing client falls back to sample rows; that is fine
 *    for a catalogue count and wrong for editorial content, because a mock blog
 *    post is a fabricated article with a byline the site does not have.
 */

type BlogRow = {
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  html: string | null;
  image: string | null;
  categories: string[] | null;
  published_at: string | null;
  created_at: string | null;
};

const CARD_COLUMNS = "id, slug, title, excerpt, html, image, categories, published_at, created_at";

function toCard(row: BlogRow): BlogPostCard {
  const html = row.html ?? "";
  return {
    id: Number(row.id),
    slug: row.slug,
    title: stripHtml(row.title ?? ""),
    // A written excerpt wins; the body is only fallen back on when none exists.
    excerpt: excerpt(row.excerpt || html, 190),
    // `created_at` stands in for a row published without a date, so a card
    // never renders an empty timestamp.
    date: row.published_at ?? row.created_at ?? "",
    image: row.image,
    categories: row.categories ?? [],
    readingMinutes: readingMinutes(html),
  };
}

export async function fetchPosts(page: number, perPage: number) {
  const client = db();
  if (!client) {
    return { posts: [] as BlogPostCard[], siteUrl: siteUrl(), page, hasMore: false };
  }

  const from = (page - 1) * perPage;
  const { data, error } = await client
    .from("blog_posts")
    .select(CARD_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(from, from + perPage - 1);

  if (error) throw new Error(`Blog posts query failed: ${error.message}`);

  const posts = (data ?? []) as BlogRow[];
  return {
    posts: posts.map(toCard),
    siteUrl: siteUrl(),
    page,
    hasMore: posts.length === perPage,
  };
}

export async function fetchPostBySlug(slug: string): Promise<{
  post: BlogPost;
  related: BlogPostCard[];
} | null> {
  const client = db();
  if (!client) return null;

  const { data, error } = await client
    .from("blog_posts")
    .select(CARD_COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Blog post query failed: ${error.message}`);
  if (!data) return null;

  const row = data as BlogRow;

  const { data: recent, error: recentError } = await client
    .from("blog_posts")
    .select(CARD_COLUMNS)
    .eq("status", "published")
    .neq("slug", slug)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(3);

  if (recentError) throw new Error(`Related posts query failed: ${recentError.message}`);

  return {
    post: {
      ...toCard(row),
      // Generated rather than hand-written, so the body is sanitised on the
      // way out before it is rendered.
      html: sanitizeHtml(row.html ?? ""),
      // The post lives here now, so it is its own source.
      sourceUrl: `${siteUrl()}/blog/${row.slug}`,
    },
    related: ((recent ?? []) as BlogRow[]).map(toCard),
  };
}
