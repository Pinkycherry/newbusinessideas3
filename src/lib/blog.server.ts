import { wordpressApiBase, wordpressSiteUrl } from "./site-config";
import {
  excerpt,
  readingMinutes,
  sanitizeWordPressHtml,
  stripHtml,
  type BlogPost,
  type BlogPostCard,
} from "./blog-shared";

type WpPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string }[];
    "wp:term"?: { name: string; taxonomy: string }[][];
  };
};

function toCard(post: WpPost): BlogPostCard {
  const media = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const terms = (post._embedded?.["wp:term"] ?? [])
    .flat()
    .filter((t) => t?.taxonomy === "category")
    .map((t) => t.name);
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: excerpt(post.excerpt.rendered || post.content.rendered, 190),
    date: post.date,
    image: media,
    categories: terms,
    readingMinutes: readingMinutes(post.content.rendered),
  };
}

async function wpFetch(path: string): Promise<unknown> {
  const res = await fetch(`${wordpressApiBase()}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`WordPress request failed [${res.status}]: ${await res.text()}`);
  }
  return res.json();
}

export async function fetchPosts(page: number, perPage: number) {
  const posts = (await wpFetch(
    `/posts?per_page=${perPage}&page=${page}&_embed=1&orderby=date&order=desc`,
  )) as WpPost[];
  return {
    posts: posts.map(toCard),
    siteUrl: wordpressSiteUrl(),
    page,
    hasMore: posts.length === perPage,
  };
}

export async function fetchPostBySlug(slug: string): Promise<{
  post: BlogPost;
  related: BlogPostCard[];
} | null> {
  const found = (await wpFetch(
    `/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
  )) as WpPost[];
  const post = found[0];
  if (!post) return null;

  const recent = (await wpFetch(`/posts?per_page=4&_embed=1&orderby=date&order=desc`)) as WpPost[];

  return {
    post: {
      ...toCard(post),
      html: sanitizeWordPressHtml(post.content.rendered),
      sourceUrl: post.link,
    },
    related: recent.filter((p) => p.slug !== slug).slice(0, 3).map(toCard),
  };
}