export type BlogPostCard = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string | null;
  categories: string[];
  readingMinutes: number;
};

export type BlogPost = BlogPostCard & {
  html: string;
  sourceUrl: string;
};

const BLOCK_TAGS = /<\/?(script|style|iframe|object|embed|form|input|link|meta)[^>]*>/gi;
const EVENT_ATTRS = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

export function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;|&rsquo;|&#8217;/g, "'")
    .replace(/&ldquo;|&rdquo;|&#822[01];/g, '"')
    .replace(/&hellip;|&#8230;/g, "…")
    .replace(/&mdash;|&#8212;/g, "—")
    .replace(/&ndash;|&#8211;/g, "–")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
}

export function stripHtml(input: string): string {
  return decodeEntities(input.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Cuts on a word boundary — never mid-word. */
export function excerpt(text: string, max = 180): string {
  const clean = stripHtml(text);
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const cut = slice.lastIndexOf(" ");
  return `${slice.slice(0, cut > 60 ? cut : max).replace(/[.,;:—–-]$/, "")}…`;
}

/** Removes executable/embedded markup and WordPress theme classes so the post
 *  inherits this site's typography instead of WordPress's default look. */
export function sanitizeWordPressHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(BLOCK_TAGS, "")
    .replace(EVENT_ATTRS, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sid="[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

export function readingMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}