import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/home-bbi.html?raw";
import menuPanels from "@/bought/menu-panels.json";
import menuBindings from "@/bought/menus.html?raw";
import sharedHeaderStyles from "@/components/v2/v2.css?raw";
import { boughtPage } from "@/bought/serve";
import { getRecentIdeas } from "@/lib/home.functions";
import { getListsHub } from "@/lib/lists.functions";
import { getHomeLegacyContent } from "@/lib/legacy-ideas.functions";
import { categoryImage } from "@/config/category-imagery";
import { guideImage } from "@/config/guide-imagery";

function safe(value: string | null | undefined): string {
  return (value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

function card(title: string, description: string, href: string, image?: string | null) {
  return `<a class="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" href="${safe(href)}">${image ? `<img src="${safe(image)}" alt="" loading="lazy" width="275" height="145" class="mb-4 h-36 w-full rounded-xl object-cover">` : ""}<h3 class="font-display text-lg font-semibold leading-snug text-[#0f172a]">${safe(title)}</h3><p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">${safe(description)}</p><span class="mt-auto pt-5 text-sm font-semibold text-[#4643ba]">Explore →</span></a>`;
}

function chip(title: string, href: string) {
  return `<a class="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 font-display text-sm font-semibold text-slate-800 transition hover:border-[#4643ba] hover:bg-violet-50 hover:text-[#3a37a0]" href="${safe(href)}">${safe(title)} →</a>`;
}

function rail(cards: string[]) {
  if (!cards.length) return "";
  return `<div class="bbi-home-track"><div class="flex gap-4">${cards.join("")}</div><div class="flex gap-4" aria-hidden="true" inert>${cards.join("")}</div></div>`;
}

async function homeResponse() {
  const [{ categories }, ideas, posts] = await Promise.all([
    getListsHub().catch(() => ({ categories: [] })),
    getRecentIdeas().catch(() => []),
    import("@/lib/blog.server").then(({ fetchPosts }) => fetchPosts(1, 12)).catch(() => ({ posts: [] })),
  ]);
  const legacy = (!ideas.length || !categories.length)
    ? await getHomeLegacyContent().catch(() => ({ ideas: [], categories: [] }))
    : { ideas: [], categories: [] };
  const displayIdeas = ideas.length ? ideas : legacy.ideas.map(i => ({
    slug: i.slug, title: i.title, summary: i.summary, hook: null, categorySlug: i.categorySlug,
    who_pays_you: i.buyer, how_money_comes: i.money, what_hurts: i.risk,
  }));
  const { STARTUP_GUIDES } = await import("@/lib/guides-data");
  const selected = displayIdeas[0];
  const previewUrl = selected ? `/idea/${encodeURIComponent(selected.slug)}` : "/browse";
  const values: Record<string, string> = {
    BBI_IDEA_TITLE: selected?.title ?? "Explore a published business idea",
    BBI_IDEA_SUMMARY: selected?.summary || selected?.hook || "Browse the library for an idea that fits your situation.",
    BBI_IDEA_HOOK: selected?.hook || selected?.summary || "",
    BBI_IDEA_BUYER: selected?.who_pays_you || "Read who pays in the full idea.",
    BBI_IDEA_MONEY: selected?.how_money_comes || "Read how money comes in on the idea page.",
    BBI_IDEA_RISK: selected?.what_hurts || "Read the hard parts on the idea page.",
    BBI_IDEA_URL: previewUrl,
    BBI_CATEGORY_CARDS: categories.length
      ? categories.slice(0, 8).map((c) => chip(c.name, `/category/${encodeURIComponent(c.slug)}`)).join("")
      : legacy.categories.slice(0, 8).map((c) => chip(c.name, `/idea/${encodeURIComponent(c.ideaSlug)}`)).join(""),
    BBI_TREE_CARDS: categories.length
      ? categories.slice(8, 16).map((c) => chip(c.name, `/category/${encodeURIComponent(c.slug)}`)).join("")
      : legacy.categories.slice(8, 16).map((c) => chip(c.name, `/idea/${encodeURIComponent(c.ideaSlug)}`)).join(""),
    BBI_GUIDE_CARDS: rail(STARTUP_GUIDES.slice(0, 8).map((g) => card(g.title, g.description, `/startup-guides/${encodeURIComponent(g.slug)}`, guideImage(g.slug)?.src))),
    BBI_BLOG_CARDS: rail(posts.posts.slice(0, 8).map((p) => card(p.title, p.excerpt, `/blog/${encodeURIComponent(p.slug)}`, p.image))),
    BBI_BLOG_MORE_CARDS: rail(posts.posts.slice(8, 12).map((p) => card(p.title, p.excerpt, `/blog/${encodeURIComponent(p.slug)}`, p.image))),
    BBI_RECENT_CARDS: rail(displayIdeas.map((i) => card(i.title, i.hook || i.summary || "Read this published idea.", `/idea/${encodeURIComponent(i.slug)}`, "categorySlug" in i && i.categorySlug ? categoryImage(i.categorySlug).src : null))),
  };
  let page = purchasedPage.replace(/\{\{(BBI_[A-Z_]+)\}\}/g, (_, key: string) => values[key] === undefined ? "" : key.endsWith("_CARDS") ? values[key] : safe(values[key]));
  if (!selected) page = page.replace(/<section id="reports"[\s\S]*?<\/section>/, "");
  // The homepage is raw purchased HTML, while the other pages render Header
  // from the shared React frame. Use its generated markup, styles and binding
  // script here so desktop and mobile disclosures behave identically.
  page = page.replace(/<nav\b[\s\S]*?<\/nav>/, menuPanels.header);
  page = page.replace("</head>", `<style id="bbi-shared-header-styles">${sharedHeaderStyles}</style></head>`);
  page = page.replace("</body>", `${menuBindings}</body>`);
  return boughtPage(page, "home");
}

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: homeResponse,
    },
  },
});
