import { PUBLISHED_BLOG_POSTS, type PublishedBlogRow } from "@/data/blog-posts";
import { blogImage } from "@/config/blog-imagery";
import {
  excerpt, readingMinutes, sanitizeHtml, stripHtml,
  type BlogPost, type BlogPostCard,
} from "./blog-shared";
import { siteUrl } from "./site-config";

const SOURCE_IDEA_ALIASES: Record<string, string> = {
  "social-caption-template-packs": "passive-income-caption-template-selling-business",
  "onboarding-checklist-sets-employers": "new-hire-onboarding-document-service",
  "niche-job-board-one-trade": "niche-job-board-business-idea-2",
  "home-inspector-member-community": "home-inspector-membership-community-idea",
  "weekend-coffee-roasting-market": "part-time-coffee-roasting-business",
  "subscription-box-curation-software": "subscription-box-software-business-idea",
  "invoice-template-sets-trades": "passive-income-invoice-template-selling-business",
};

/** Legacy post copy contains original idea slugs. Seven have since changed.
 * Keep the authored HTML intact on disk and map those links only in output.
 * Local idea routes read completed source blueprints when the target schema lacks them.
 */
function linkToLocalBlueprints(html: string): string {
  return html.replace(/href="\/idea\/([^"#?]+)"/g, (_match, slug: string) =>
    `href="/idea/${SOURCE_IDEA_ALIASES[slug] ?? slug}"`,
  );
}

/** Published source rows are versioned with this demo because its database
 * does not contain blog_posts. The file set contains no drafts or user data.
 * The original body is sanitized on the way out, as in the staging site.
 */
function toCard(row: PublishedBlogRow): BlogPostCard {
  const html = row.html ?? "";
  const art = blogImage(row.slug);
  return {
    id: row.id,
    slug: row.slug,
    title: stripHtml(row.title ?? ""),
    excerpt: excerpt(row.excerpt || html, 190),
    date: row.published_at ?? row.created_at ?? "",
    image: row.image ?? art?.src ?? null,
    imageAlt: row.image ? null : (art?.alt ?? null),
    imageWidth: row.image ? null : (art?.width ?? null),
    imageHeight: row.image ? null : (art?.height ?? null),
    imageCaption: row.image ? null : (art?.description ?? null),
    categories: row.categories ?? [],
    readingMinutes: readingMinutes(html),
  };
}

export async function fetchPosts(page: number, perPage: number) {
  const from = (page - 1) * perPage;
  const rows = PUBLISHED_BLOG_POSTS.slice(from, from + perPage);
  return {
    posts: rows.map(toCard),
    siteUrl: siteUrl(),
    page,
    hasMore: from + perPage < PUBLISHED_BLOG_POSTS.length,
  };
}

export async function fetchPostBySlug(slug: string): Promise<{
  post: BlogPost;
  related: BlogPostCard[];
} | null> {
  const row = PUBLISHED_BLOG_POSTS.find((item) => item.slug === slug);
  if (!row) return null;
  return {
    post: {
      ...toCard(row),
      html: linkToLocalBlueprints(sanitizeHtml(row.html ?? "")),
      sourceUrl: `${siteUrl()}/blog/${row.slug}`,
    },
    related: PUBLISHED_BLOG_POSTS.filter((item) => item.slug !== slug).slice(0,3).map(toCard),
  };
}
