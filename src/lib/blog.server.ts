import { db } from "./ideas.functions";
import {
  excerpt,
  readingMinutes,
  sanitizeWordPressHtml,
  stripHtml,
  type BlogPost,
  type BlogPostCard,
} from "./blog-shared";
import { siteUrl } from "./site-config";

/**
 * The blog reads from Supabase `blog_posts`, not from WordPress.
 *
 * It used to fetch the WordPress REST API of an unrelated site, which is why
 * `/blog` served someone else's posts. The two exported functions below keep
 * the exact signatures the routes already call, so `blog.index.tsx` and
 * `blog.$slug.tsx` are untouched by this change.
 *
 * Only `status = 'published'` rows are ever returned. Drafts are invisible to
 * the site by design -- flipping a post live is a deliberate act in the
 * database, not a side effect of writing one.
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
    // A written excerpt wins; the body is only fallen back on when one is missing.
    excerpt: excerpt(row.excerpt || html, 190),
    // `published_at` is the publication date. `created_at` stands in for a row
    // published without one so a card never renders an empty date.
    date: row.published_at ?? row.created_at ?? "",
    image: row.image,
    categories: row.categories ?? [],
    readingMinutes: readingMinutes(html),
  };
}

export async function fetchPosts(page: number, perPage: number) {
  const from = (page - 1) * perPage;
  const { data, error } = await db()
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

  const { data, error } = await client
    .from("blog_posts")
    .select(`${CARD_COLUMNS}, meta_description`)
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
      // The HTML is generated rather than hand-written, so it is sanitised on
      // the way out exactly as the WordPress body was.
      html: sanitizeWordPressHtml(row.html ?? ""),
      // The post lives here now, so it is its own source.
      sourceUrl: `${siteUrl()}/blog/${row.slug}`,
    },
    related: ((recent ?? []) as BlogRow[]).map(toCard),
  };
}
