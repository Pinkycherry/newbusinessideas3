import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/lists-bbi.html?raw";
import { boughtPage } from "@/bought/serve";
import menuPanels from "@/bought/menu-panels.json";
import menuBindings from "@/bought/menus.html?raw";
import sharedHeaderStyles from "@/components/v2/v2.css?raw";
import { getListsHub, getListPage } from "@/lib/lists.functions";
import { fetchPosts } from "@/lib/blog.server";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { guideImage } from "@/config/guide-imagery";
import { READY_CALCULATORS } from "@/lib/calculators";

const esc = (s: string | null | undefined) => (s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c] ?? c);
type ListLink = { name: string; slug: string; category: string };
const listUrl = (slug: string) => `/lists/${encodeURIComponent(slug)}`;
const card = (item: ListLink) => `<a class="block group" href="${listUrl(item.slug)}"><div class="rounded-lg border bg-card text-card-foreground shadow-sm premium-card h-full hover:border-primary/50 hover:-translate-y-0.5 transition-all"><div class="p-4"><h3 class="font-semibold text-base mb-1 group-hover:text-primary transition-colors text-balance">${esc(item.name)}</h3><div class="flex items-center justify-between text-sm text-muted-foreground"><span>${esc(item.category)}</span><span aria-hidden="true">→</span></div></div></div></a>`;
const resource = (title: string, href: string, kind: string) => `<a class="block group" href="${esc(href)}"><div class="rounded-lg border bg-card text-card-foreground shadow-sm premium-card h-full hover:border-primary/50 hover:-translate-y-0.5 transition-all"><div class="p-5"><span class="text-xs font-semibold uppercase tracking-wide text-primary">${esc(kind)}</span><h3 class="font-bold text-lg mt-2 mb-2 group-hover:text-primary transition-colors text-balance">${esc(title)}</h3><span class="text-sm text-muted-foreground">Read more →</span></div></div></a>`;
const article = (title: string, href: string, image?: string | null) => image ? `<a href="${esc(href)}" class="group overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><img src="${esc(image)}" alt="" loading="lazy" width="260" height="150" class="aspect-[16/9] w-full object-cover"><h3 class="p-4 font-semibold text-sm leading-snug group-hover:text-primary">${esc(title)}</h3></a>` : "";

async function listsResponse() {
  const [hub, posts] = await Promise.all([getListsHub(), fetchPosts(1, 50)]);
  const all: ListLink[] = hub.categories.flatMap(cat => cat.subs.map(sub => ({ name:sub.name, slug:sub.slug, category:cat.name })));
  const featured = all[0];
  const detail = featured ? await getListPage({ data:{ slug:featured.slug } }).catch(() => null) : null;
  const groups = Array.from({ length: 6 }, () => [] as typeof hub.categories);
  hub.categories.forEach((category, index) => groups[Math.min(5, Math.floor(index * 6 / hub.categories.length))].push(category));
  const next = [
    ["Explore categories", "/browse", "Start from the published categories and ideas."],
    ["Read startup guides", "/startup-guides", "Work through the question you are facing."],
    ["Use a calculator", "/calculator", "Check the numbers with your own inputs."],
  ];
  const articles = posts.posts.map(post => article(post.title, `/blog/${encodeURIComponent(post.slug)}`, post.image)).filter(Boolean);
  const guides = STARTUP_GUIDES.map(guide => article(guide.title, `/startup-guides/${encodeURIComponent(guide.slug)}`, guideImage(guide.slug)?.src)).filter(Boolean);
  const rail = (items: string[]) => [...items, ...items.map(item => item.replace('<a ', '<a tabindex="-1" aria-hidden="true" '))].join("");
  const slots: Record<string, string> = {
    BBI_CHIPS: hub.categories.map(cat => `<a class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-muted hover:bg-primary/10 hover:text-primary border border-border/50 transition-colors" href="#category-${esc(cat.slug)}">${esc(cat.name)} <span aria-hidden="true">›</span></a>`).join(""),
    BBI_CATEGORY_FILTER: hub.categories.map(cat => `<a class="px-3.5 py-1.5 rounded-full text-sm font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-all" href="#category-${esc(cat.slug)}">${esc(cat.name)}</a>`).join(""),
    BBI_NEXT_STEPS: next.map(([title, href, note]) => `<a class="group rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="${href}"><span class="flex items-center justify-between gap-3 font-semibold">${title}<span class="text-primary" aria-hidden="true">→</span></span><span class="mt-2 block text-sm text-muted-foreground">${note}</span></a>`).join(""),
    BBI_FEATURED: featured ? `<a href="${listUrl(featured.slug)}"><div class="rounded-lg bg-card text-card-foreground shadow-sm premium-card border-2 border-primary/30 hover:border-primary/50 transition-all bg-gradient-to-r from-primary/5 to-transparent"><div class="p-8 lg:p-10"><div class="flex flex-col lg:flex-row lg:items-center gap-6"><div class="flex-1"><div class="flex items-center gap-3 mb-4"><span class="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Featured</span><span class="rounded-full border px-3 py-1 text-xs font-semibold">${esc(featured.category)}</span></div><h3 class="text-2xl lg:text-3xl font-bold mb-3">${esc(featured.name)}</h3><p class="text-muted-foreground">${esc((detail?.intro ?? featured.name).split(/(?<=[.!?])\s/)[0])}</p><span class="inline-flex mt-5 font-semibold text-primary">View list →</span></div></div></div></div></a>` : "",
    BBI_TOOLS: [resource("Explore founder tools", "/tools", "Tools"), ...READY_CALCULATORS.map(tool => resource(tool.title, `/calculator/${encodeURIComponent(tool.slug)}`, "Calculator"))].join(""),
    BBI_GUIDE_RAIL: rail(guides),
    BBI_INDEX: all.slice(0, 12).map(item => `<a href="${listUrl(item.slug)}" class="min-w-0 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium break-words transition hover:border-primary hover:bg-primary/5 hover:text-primary">${esc(item.name)} →</a>`).join(""),
    BBI_FAQ: (detail?.faq ?? []).slice(0, 8).map(item => `<details name="lists-faq" class="group rounded-xl border border-border bg-card p-5 open:shadow-sm"><summary class="flex items-start justify-between gap-4 cursor-pointer list-none"><h3 class="font-semibold text-base md:text-lg pr-4">${esc(item.q)}</h3><span class="text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true">›</span></summary><p class="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">${esc(item.a)}</p></details>`).join(""),
    BBI_ARTICLES: rail(articles),
  };
  groups.forEach((categories, index) => {
    slots[`BBI_SHELF_${index + 5}`] = categories.map(cat => `<div id="category-${esc(cat.slug)}" class="bbi-category-block"><div class="mb-5 flex flex-wrap items-end justify-between gap-3"><h2 class="text-2xl font-bold"><a href="/category/${encodeURIComponent(cat.slug)}" class="hover:text-primary">${esc(cat.name)}</a></h2><a class="text-sm font-semibold text-primary hover:underline" href="/category/${encodeURIComponent(cat.slug)}">Explore category →</a></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">${cat.subs.map(sub => card({ name:sub.name,slug:sub.slug,category:cat.name })).join("")}</div></div>`).join("");
  });
  let page = purchasedPage.replace(/\{\{(BBI_[A-Z_0-9]+)\}\}/g, (_match, key: string) => slots[key] ?? "");
  page = page.replace('<div id="bbi-list-header"></div>', menuPanels.header)
    .replace('<div id="bbi-list-footer"></div>', menuPanels.footer)
    .replace('</head>', `<style id="bbi-shared-header-styles">${sharedHeaderStyles}</style></head>`)
    .replace('</body>', `<script>if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{rootMargin:'0px 0px -5% 0px'});document.querySelectorAll('main > section:not(:first-of-type), .bbi-category-block').forEach(node=>{node.classList.add('bbi-reveal');observer.observe(node)})}</script>${menuBindings}</body>`);
  return boughtPage(page, "lists");
}

export const Route = createFileRoute("/lists/")({
  server: {
    handlers: {
      GET: listsResponse,
    },
  },
});
