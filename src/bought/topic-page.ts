/**
 * India topic pages on the purchased topics layout.
 *
 * Markup and class names are the seller's topics components (breadcrumb bar,
 * hero, card grid, accordion FAQ, CTA band) and the page loads the seller's
 * own stylesheet from public/bought/topics/. Every word, link and SEO field
 * comes from the page's data file in src/data/topic-pages*.ts, so titles and
 * slugs can be renamed there without touching this file. Header and footer
 * are the shared site header and footer.
 */
import { menuPanels, keywordScript } from "./shared-chrome";
import menuBindings from "./menus.html?raw";
import sharedHeaderStyles from "@/components/v2/v2.css?raw";
import sellerShell from "./topics.html?raw";
import { canonicalUrl, CO_FOUNDER, TEAM } from "@/lib/site-config";
import { dbOrNull } from "@/lib/db";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProviderPromptActions } from "@/components/founder-workspace/provider-prompt-actions";
import { topicValidatePrompt, buildTopicPrompt, COMMON_INPUTS } from "@/lib/topic-validate-prompt";
import { TOPIC_INPUTS } from "@/data/topic-inputs";
import { faqEntries, normalizeFaqQuestion } from "@/lib/lists.functions";
import glassCss from "@/components/home/glass.css?raw";
import emberCss from "@/components/home/ember.css?raw";

export type Link = { label: string; href: string; note?: string };
export type Section =
  | { type: "takeaways"; heading: string; intro?: string; items: string[] }
  | { type: "steps"; heading: string; intro?: string; items: { title: string; body: string; check?: string }[] }
  | { type: "table"; heading: string; intro?: string; columns: string[]; rows: string[][]; note?: string }
  | { type: "list"; heading: string; intro?: string; items: { title: string; body: string }[] }
  | { type: "cards"; heading: string; intro?: string; items: { title: string; body: string; href?: string; cta?: string }[] }
  | { type: "quiz"; heading: string; intro?: string; items: string[]; result: string }
  | { type: "faq"; heading: string; intro?: string; items: { q: string; a: string }[] }
  | { type: "sources"; heading: string; items: Link[] }
  | { type: "chips"; heading: string; intro?: string; items: Link[] }
  | { type: "cta"; heading: string; body: string; button: Link; note?: string }
  /** Long-form section: paragraphs, sub-headings, lists, tables, checklists and callouts inside one seller section. */
  | { type: "rich"; heading: string; intro?: string; blocks: Block[] }
  /** Questions from our published ideas' FAQ in Supabase (no new Q&A research). `match` is a case-insensitive regex on the question. */
  | { type: "dbfaq"; heading: string; intro?: string; categories: string[]; match?: string; limit: number }
  /** Cards for our published ideas in these categories, from Supabase. */
  | { type: "dbideas"; heading: string; intro?: string; categories: string[]; limit: number; all?: Link };

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "table"; columns: string[]; rows: string[][]; note?: string }
  | { kind: "checklist"; title: string; items: string[] }
  | { kind: "callout"; title: string; text: string }
  | { kind: "steps"; items: { title: string; body: string }[] };

export type TopicPage = {
  slug: string;
  sellerRef: string;
  /** ISO date of the last content review, shown on the page and in schema. */
  updated: string;
  parent: Link;
  seo: { title: string; description: string };
  hero: { eyebrow: string; h1: string; highlight?: string; intro: string; sub?: string; updated: string; primary: Link; secondary?: Link; image: string; imageAlt: string };
  sections: Section[];
  /** Category slugs that drive the "explore" bands placed between sections. */
  explore?: { categories?: string[]; guideCategory?: string };
  /** Extra one-tap questions for this page, shown with the common ones above the Validate button. */
  inputs?: { label: string; options: string[] }[];
};

const STYLE = (() => {
  const blocks = [...sellerShell.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  return blocks.join("\n");
})();

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
/** Inline emphasis: **bold** only. */
/**
 * Numbers rule (founder, 5 Nov 2026): topic pages carry no researched figures. Any `[Data pending: ...]` or
 * `[Validate: ...]` marker in page data renders as an inline line pointing to the page's Validate button,
 * so the visitor gets today's figure for their own city from their own Validate session.
 */
const VALIDATE_LINE = '<a class="font-medium text-primary underline-offset-2 hover:underline" href="#validate">Check today\'s figure for your city with the Validate button.</a>';
const rich = (v: string) =>
  esc(v)
    .replace(/\s*\[(?:Data pending|Validate): [^\]]+\]/g, " " + VALIDATE_LINE)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\[([^\]]+)\]\((\/[^)\s]*|#[^)\s]*)\)/g, '<a class="text-primary underline-offset-2 hover:underline" href="$2">$1</a>')
    .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '<a class="text-primary underline-offset-2 hover:underline" href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .trim();
const cell = (v: string) => rich(v);

const ICON = {
  arrow: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  chevron: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0 transition-transform duration-200" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  sep: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  alert: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px] text-amber-600 shrink-0 mt-0.5" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
};

const BTN = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation active:scale-[0.98] active:opacity-90 h-12 rounded-lg px-6 text-base min-h-[48px] w-full sm:w-auto";
const BTN_DARK = `${BTN} bg-slate-900 text-white hover:bg-slate-700 shadow-sm hover:shadow-md`;
const BTN_LIGHT = `${BTN} border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-900 shadow-sm`;
const CARD = "rounded-lg border bg-card text-card-foreground shadow-sm h-full";
const SEC = ["py-10 md:py-12 px-4", "py-10 md:py-12 px-4 bg-muted/20 border-y border-border/40"];

function head(title: string, sub?: string) {
  return `<div class="flex items-end justify-between mb-6"><div><h2 class="text-xl md:text-2xl font-bold mb-1">${esc(title)}</h2>${sub ? `<p class="text-sm text-muted-foreground">${rich(sub)}</p>` : ""}</div></div>`;
}

function block(b: Block): string {
  switch (b.kind) {
    case "p": return `<p>${rich(b.text)}</p>`;
    case "h3": return `<h3 id="${slugId(b.text)}" class="pt-4 text-lg font-semibold text-foreground scroll-mt-24">${esc(b.text)}</h3>`;
    case "list": { const tag = b.ordered ? "ol" : "ul"; return `<${tag} class="${b.ordered ? "list-decimal" : "list-disc"} pl-6 space-y-1.5">${b.items.map((i) => `<li>${rich(i)}</li>`).join("")}</${tag}>`; }
    case "table": return `<div class="overflow-x-auto rounded-xl border border-border/60 bg-white"><table class="w-full text-sm"><thead class="bg-muted/40"><tr>${b.columns.map((c) => `<th class="text-left font-semibold text-foreground px-4 py-3">${esc(c)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr class="border-t border-border/50">${r.map((c, k) => `<td class="px-4 py-3 align-top ${k === 0 ? "font-medium text-foreground" : ""}">${cell(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${b.note ? `<p class="text-xs">${rich(b.note)}</p>` : ""}`;
    case "checklist": return `<div class="rounded-xl border border-border/60 bg-white p-5" data-topic-quiz data-kind="worksheet"><p class="font-semibold text-foreground mb-3">${esc(b.title)}</p><ul class="space-y-2">${b.items.map((q, n) => `<li><label class="flex gap-3 items-start cursor-pointer"><input type="checkbox" class="mt-1 h-4 w-4" data-q="${n}"><span>${rich(q)}</span></label></li>`).join("")}</ul><p class="mt-3 text-sm" data-quiz-out data-total="${b.items.length}">Tick each line as you finish it.</p></div>`;
    case "callout": return `<div class="rounded-xl border border-primary/20 bg-primary/5 p-5"><p class="font-semibold text-foreground mb-1">${esc(b.title)}</p><p>${rich(b.text)}</p></div>`;
    case "steps": return `<ol class="space-y-3">${b.items.map((st, n) => `<li class="rounded-lg border bg-card p-4"><div class="flex gap-3"><span class="w-7 h-7 shrink-0 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">${n + 1}</span><div><p class="font-semibold text-foreground">${esc(st.title)}</p><p class="mt-1">${rich(st.body)}</p></div></div></li>`).join("")}</ol>`;
  }
}

let faqId = 0;
const slugId = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const ANCHOR: Partial<Record<Section["type"], string>> = { steps: "steps", list: "mistakes", quiz: "check" };
let used = new Set<string>();
function anchorFor(s: Section): string {
  const BY_HEADING: [RegExp, string][] = [[/^compare/i, "compare"], [/stages/i, "stages"], [/quick reference/i, "numbers"], [/^register/i, "register"], [/funding questions/i, "questions"]];
  const h = "heading" in s ? s.heading : "";
  const id = BY_HEADING.find(([re]) => re.test(h))?.[1] ?? ANCHOR[s.type] ?? (s.type === "rich" ? slugId(h) : undefined);
  if (!id || used.has(id)) return "";
  used.add(id);
  return ` id="${id}"`;
}

function section(s: Section, i: number): string {
  const tone = SEC[i % 2];
  const anchor = anchorFor(s);
  const wrap = (inner: string, width = "max-w-6xl") => `<section${anchor} class="${tone} scroll-mt-24"><div class="container mx-auto ${width}">${inner}</div></section>`;
  switch (s.type) {
    case "takeaways":
      return wrap(`${head(s.heading, s.intro)}<ul class="grid md:grid-cols-2 gap-3">${s.items.map((t) => `<li class="flex gap-3 ${CARD} p-4 text-[15px] leading-relaxed">${ICON.check}<span>${rich(t)}</span></li>`).join("")}</ul>`, "max-w-5xl");
    case "steps":
      return wrap(`${head(s.heading, s.intro)}<ol class="space-y-3">${s.items.map((st, n) => `<li class="${CARD} p-5"><div class="flex gap-4"><span class="w-9 h-9 shrink-0 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center">${n + 1}</span><div><h3 class="font-semibold text-[16px] mb-1">${esc(st.title)}</h3><p class="text-sm text-muted-foreground leading-relaxed">${rich(st.body)}</p>${st.check ? `<p class="mt-3 text-sm rounded-md bg-primary/5 border border-primary/15 px-3 py-2"><span class="font-semibold text-foreground">Try this now:</span> ${rich(st.check)}</p>` : ""}</div></div></li>`).join("")}</ol>`, "max-w-4xl");
    case "table":
      return wrap(`${head(s.heading, s.intro)}<div class="overflow-x-auto rounded-xl border border-border/60 bg-white"><table class="w-full text-sm"><thead class="bg-muted/40"><tr>${s.columns.map((c) => `<th class="text-left font-semibold px-4 py-3">${esc(c)}</th>`).join("")}</tr></thead><tbody>${s.rows.map((r) => `<tr class="border-t border-border/50">${r.map((c, k) => `<td class="px-4 py-3 align-top ${k === 0 ? "font-medium text-foreground" : "text-muted-foreground"}">${cell(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${s.note ? `<p class="text-xs text-muted-foreground mt-3">${rich(s.note)}</p>` : ""}`, "max-w-5xl");
    case "list":
      return wrap(`${head(s.heading, s.intro)}<div class="grid md:grid-cols-2 gap-3">${s.items.map((m) => `<div class="${CARD} p-5"><div class="flex gap-3">${ICON.alert}<div><h3 class="font-semibold text-[15px] mb-1">${esc(m.title)}</h3><p class="text-sm text-muted-foreground leading-relaxed">${rich(m.body)}</p></div></div></div>`).join("")}</div>`, "max-w-5xl");
    case "cards":
      return wrap(`${head(s.heading, s.intro)}<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${s.items.map((c, n) => {
        const body = `<div class="${CARD} ${c.href ? "hover:border-primary hover:shadow-md transition-all" : ""} animate-fade-up" style="animation-delay: ${(n * 0.04).toFixed(2)}s;"><div class="p-5"><h3 class="font-semibold text-[15px] mb-1 ${c.href ? "group-hover:text-primary transition-colors" : ""}">${esc(c.title)}</h3><p class="text-xs text-muted-foreground mb-3 leading-relaxed">${rich(c.body)}</p>${c.href ? `<span class="inline-flex items-center gap-1 text-xs font-medium text-primary">${esc(c.cta ?? "Open")} ${ICON.arrow}</span>` : ""}</div></div>`;
        return c.href ? `<a class="group" href="${esc(c.href)}"${/^https?:/.test(c.href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${body}</a>` : body;
      }).join("")}</div>`);
    case "quiz":
      return wrap(`${head(s.heading, s.intro)}<div class="bg-white rounded-xl border border-border/60 p-5" data-topic-quiz><ul class="space-y-2">${s.items.map((q, n) => `<li><label class="flex gap-3 items-start text-[15px] cursor-pointer"><input type="checkbox" class="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" data-q="${n}"><span>${rich(q)}</span></label></li>`).join("")}</ul><p class="mt-4 text-sm text-muted-foreground" data-quiz-out data-total="${s.items.length}">Tick what is true for you today. ${rich(s.result)}</p></div>`, "max-w-3xl");
    case "faq":
      return wrap(`<h2 class="text-xl md:text-2xl font-bold mb-1">${esc(s.heading)}</h2>${s.intro ? `<p class="text-sm text-muted-foreground mb-6">${rich(s.intro)}</p>` : '<div class="mb-6"></div>'}<div class="bg-white rounded-xl border border-border/60 px-4" data-orientation="vertical">${s.items.map((f) => {
        const id = `topic-faq-${++faqId}`;
        return `<div data-state="closed" class="border-b last:border-b-0"><h3 class="flex"><button type="button" aria-controls="${id}" aria-expanded="false" data-state="closed" class="flex flex-1 items-center justify-between py-4 transition-all [&[data-state=open]>svg]:rotate-180 text-left text-[15px] font-medium hover:no-underline" data-topic-acc><span>${esc(f.q)}</span>${ICON.chevron}</button></h3><div id="${id}" hidden role="region" class="overflow-hidden text-sm"><div class="pb-4 pt-0 text-muted-foreground leading-relaxed">${rich(f.a)}</div></div></div>`;
      }).join("")}</div>`, "max-w-3xl");
    case "sources":
      return wrap(`${head(s.heading, "Official pages we checked for this guide. Rules change; confirm on the official page before you apply.")}<ul class="grid sm:grid-cols-2 gap-2 text-sm">${s.items.map((l) => `<li class="${CARD} px-4 py-3"><a class="text-primary hover:underline" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>${l.note ? `<p class="text-xs text-muted-foreground mt-1">${rich(l.note)}</p>` : ""}</li>`).join("")}</ul>`, "max-w-5xl");
    case "chips":
      return wrap(`${head(s.heading, s.intro)}<div class="flex flex-wrap gap-2">${s.items.map((l) => `<a class="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors" href="${esc(l.href)}">${esc(l.label)} ${ICON.arrow}</a>`).join("")}</div>`, "max-w-5xl");
    case "rich":
      return wrap(`${head(s.heading, s.intro)}<div class="space-y-4 text-[15px] leading-relaxed text-muted-foreground">${s.blocks.map(block).join("")}</div>`, "max-w-4xl");
    case "dbfaq":
    case "dbideas":
      return "";
    case "cta":
      return `<section class="py-10 md:py-14 px-4 bg-gradient-to-br from-brand-500/10 via-brand-400/5 to-background border-t border-border/40"><div class="container mx-auto max-w-3xl text-center"><h2 class="text-2xl md:text-3xl font-bold mb-3">${esc(s.heading)}</h2><p class="text-base text-muted-foreground mb-6 max-w-2xl mx-auto">${rich(s.body)}</p><a class="${BTN_DARK}" href="${esc(s.button.href)}">${esc(s.button.label)} ${ICON.arrow}</a>${s.note ? `<p class="text-xs text-muted-foreground mt-3">${rich(s.note)}</p>` : ""}</div></section>`;
  }
}

function hero(p: TopicPage) {
  const h = p.hero;
  const title = h.highlight ? esc(h.h1).replace(esc(h.highlight), `<span class="gradient-text">${esc(h.highlight)}</span>`) : esc(h.h1);
  return `<section class="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/60 to-white py-8 md:py-10 lg:py-14 border-b border-border/40" aria-labelledby="topic-hero"><div aria-hidden="true" class="absolute -top-10 -right-20 w-[28rem] h-[28rem] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none animate-glow-float"></div><div class="container mx-auto max-w-6xl px-4 relative z-10"><div class="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center"><div class="lg:col-span-7 order-2 lg:order-1"><div class="flex items-center gap-2 mb-3 animate-fade-up flex-wrap"><span class="text-sm font-semibold tracking-tight text-slate-900">${esc(h.eyebrow)}</span><div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold border-transparent bg-secondary text-secondary-foreground ml-auto sm:ml-2 text-[10px] sm:text-xs">${esc(h.updated)}</div></div><h1 id="topic-hero" class="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight mb-3 md:mb-4 animate-fade-up" style="animation-delay: 0.05s;">${title}</h1><p class="text-[15px] md:text-lg text-muted-foreground max-w-2xl mb-3 md:mb-4 animate-fade-up" style="animation-delay: 0.1s;">${rich(h.intro)}</p>${h.sub ? `<p class="text-[13px] md:text-sm text-muted-foreground mb-5 md:mb-6 animate-fade-up leading-relaxed" style="animation-delay: 0.15s;">${rich(h.sub)}</p>` : ""}<div class="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 animate-fade-up" style="animation-delay: 0.2s;"><a class="${BTN_DARK}" href="${esc(h.primary.href)}">${esc(h.primary.label)} ${ICON.arrow}</a>${h.secondary ? `<a class="${BTN_LIGHT}" href="${esc(h.secondary.href)}">${esc(h.secondary.label)}</a>` : ""}</div>${byline(p)}</div><div class="lg:col-span-5 order-1 lg:order-2"><div class="relative rounded-2xl overflow-hidden border border-border/60 shadow-lg animate-fade-up"><img src="${esc(h.image)}" alt="${esc(h.imageAlt)}" width="640" height="420" class="w-full h-auto object-cover" loading="eager" decoding="async"></div></div></div></div></section>`;
}

const REVIEWER = TEAM.find((m) => /verification/i.test(m.role)) ?? TEAM[0]!;
const longDate = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
function byline(p: TopicPage) {
  return `<p class="mt-5 text-[13px] text-muted-foreground leading-relaxed animate-fade-up" style="animation-delay: 0.25s;">Written by <a class="font-medium text-foreground hover:text-primary" href="/about">${esc(CO_FOUNDER.name)}</a>, editorial lead · Reviewed by <a class="font-medium text-foreground hover:text-primary" href="/about">${esc(REVIEWER.name)}</a>, research and verification · Last updated <time datetime="${esc(p.updated)}">${esc(longDate(p.updated))}</time></p>`;
}

function crumbs(p: TopicPage) {
  return `<div class="bg-muted/30 border-b pt-24 lg:pt-28 pb-3"><div class="container mx-auto max-w-6xl px-4"><nav class="flex flex-wrap items-center text-sm text-muted-foreground" aria-label="Breadcrumb"><ol class="flex flex-wrap items-center gap-1.5 sm:gap-2.5"><li class="inline-flex items-center gap-1.5"><a aria-label="Home" class="flex items-center text-muted-foreground hover:text-primary" href="/">${ICON.home}</a></li><li class="mx-1" aria-hidden="true">${ICON.sep}</li><li class="inline-flex items-center gap-1.5"><a class="hover:text-primary" href="${esc(p.parent.href)}">${esc(p.parent.label)}</a></li><li class="mx-1" aria-hidden="true">${ICON.sep}</li><li class="inline-flex items-center gap-1.5"><span class="text-foreground font-medium">${esc(p.hero.eyebrow)}</span></li></ol></nav></div></div>`;
}

function schema(p: TopicPage) {
  const url = canonicalUrl(`/${p.slug}`);
  const faq = p.sections.find((s) => s.type === "faq") as Extract<Section, { type: "faq" }> | undefined;
  const graph: unknown[] = [
    { "@type": "Article", headline: p.hero.h1, description: p.seo.description, inLanguage: "en-IN", mainEntityOfPage: url, dateModified: p.updated, author: { "@type": "Person", name: CO_FOUNDER.name, url: canonicalUrl("/about") }, reviewedBy: { "@type": "Person", name: REVIEWER.name, url: canonicalUrl("/about") }, publisher: { "@type": "Organization", name: "bbusiness.online" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") }, { "@type": "ListItem", position: 2, name: p.parent.label, item: canonicalUrl(p.parent.href) }, { "@type": "ListItem", position: 3, name: p.hero.eyebrow, item: url }] },
  ];
  if (faq) graph.push({ "@type": "FAQPage", mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") } })) });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

const SCRIPT_RAW = `<script>(function(){document.querySelectorAll('[data-topic-validate]').forEach(function(w){var pre=w.querySelector('pre');w.querySelectorAll('button').forEach(function(b){if(!/Copy/.test(b.textContent))return;b.addEventListener('click',function(){var t=pre?pre.textContent:'';(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.lastChild.textContent=' Copied';},function(){var r=document.createRange();if(pre){r.selectNodeContents(pre);var sel=getSelection();sel.removeAllRanges();sel.addRange(r);}});});});});document.querySelectorAll('[data-topic-acc]').forEach(function(b){b.addEventListener('click',function(){var open=b.getAttribute('aria-expanded')==='true';var r=document.getElementById(b.getAttribute('aria-controls'));b.setAttribute('aria-expanded',String(!open));b.dataset.state=open?'closed':'open';b.closest('[data-state]').dataset.state=open?'closed':'open';if(r)r.hidden=open;});});var stEl=document.getElementById('topic-state');if(stEl){var st=JSON.parse(stEl.textContent);var build=BUILD_FN;var picked={};var ENC=encodeURIComponent;var upd=function(){var tk=[],ny=[];document.querySelectorAll('[data-topic-quiz] input[type=checkbox]').forEach(function(c){var t=(c.closest('label')||c.parentNode).textContent.trim();if(c.checked)tk.push(t);else if(!c.closest('[data-kind=worksheet]'))ny.push(t);});var s={title:st.title,questions:st.questions,date:st.date,answers:picked,ticked:tk,notYet:ny};var full=build(s,false),short=build(s,true);document.querySelectorAll('[data-topic-validate]').forEach(function(w){var pre=w.querySelector('pre');if(pre)pre.textContent=full;w.querySelectorAll('a[href]').forEach(function(a){var h=a.getAttribute('href');var m=h.match(/^(https:\\/\\/[^?]+\\?q=)/)||h.match(/^(https:\\/\\/(?:chatgpt\\.com\\/|claude\\.ai\\/new|grok\\.com\\/|www\\.perplexity\\.ai\\/search))$/);if(!m)return;var base=m[1].indexOf('?q=')>0?m[1]:m[1].replace(/\\/?$/,'')+(/claude|perplexity/.test(m[1])?'?q=':'/?q=');base=base.replace('.com//?q=','.com/?q=');var g=/grok\\.com/.test(base);var u=base+ENC(g?short:full);if(u.length>7200)u=base+ENC(short);a.setAttribute('href',u);});});;var tr=document.getElementById('topic-tray');if(tr&&!tr.dataset.off){var n=Object.keys(picked).length,k=tk.length;if(n+k){tr.hidden=false;tr.querySelector('[data-tray-text]').textContent=Object.keys(picked).map(function(x){return picked[x];}).join(' · ')||'Your answers are saved';}else tr.hidden=true;}};var trx=document.querySelector('.topic-tray-x');if(trx)trx.addEventListener('click',function(){var t=document.getElementById('topic-tray');t.dataset.off='1';t.hidden=true;});var wz=document.querySelector('[data-topic-inputs]');var steps=wz?[].slice.call(wz.querySelectorAll('.topic-wiz-step')):[];var cur=0;var show=function(i){cur=i;steps.forEach(function(x,k){x.classList.toggle('is-on',k===i);});var done=i>=steps.length;wz.querySelector('[data-wiz-done]').hidden=!done;wz.querySelector('[data-wiz-fill]').style.width=Math.round(Math.min(i,steps.length)/steps.length*100)+'%';wz.querySelector('[data-wiz-count]').textContent=done?'All '+steps.length+' done':'Question '+(i+1)+' of '+steps.length;wz.querySelector('[data-wiz-back]').disabled=i===0;wz.querySelector('[data-wiz-skip]').style.visibility=done?'hidden':'visible';if(done){var v=Object.keys(picked).map(function(x){return picked[x];});wz.querySelector('[data-wiz-summary]').textContent=v.length?v.join(' · '):'You skipped the questions; the AI will ask you instead.';}};if(wz&&steps.length){wz.classList.add('js-wiz');show(0);wz.querySelector('[data-wiz-back]').addEventListener('click',function(){show(Math.max(0,cur-1));});wz.querySelector('[data-wiz-skip]').addEventListener('click',function(){show(cur+1);});}document.querySelectorAll('.topic-chip').forEach(function(b){b.addEventListener('click',function(){var g=b.dataset.group;var on=b.getAttribute('aria-pressed')!=='true';document.querySelectorAll('.topic-chip[data-group="'+g+'"]').forEach(function(x){x.setAttribute('aria-pressed','false');});if(on){b.setAttribute('aria-pressed','true');picked[g]=b.dataset.value;}else{delete picked[g];}upd();if(wz&&on){var st=b.closest('.topic-wiz-step');if(st&&+st.dataset.step===cur)setTimeout(function(){show(cur+1);},220);}});});document.addEventListener('change',function(e){if(e.target.closest&&e.target.closest('[data-topic-quiz]'))upd();});upd();}document.querySelectorAll('[data-mq]').forEach(function(m){var t;m.addEventListener('touchstart',function(){clearTimeout(t);m.classList.add('is-held');},{passive:true});m.addEventListener('touchend',function(){t=setTimeout(function(){m.classList.remove('is-held');},2500);});});document.querySelectorAll('[data-topic-quiz]').forEach(function(q){var out=q.querySelector('[data-quiz-out]');var base=out.textContent;q.addEventListener('change',function(){var n=q.querySelectorAll('input:checked').length;var t=+out.dataset.total;out.textContent=n+' of '+t+' ticked. '+(n===t?'You are ready for the next step.':base.replace(/^Tick what is true for you today\\. /,''));});});})();</script>`;
const SCRIPT = SCRIPT_RAW.replace("BUILD_FN", "(" + buildTopicPrompt.toString() + ")");

type IdeaRow = { slug: string; title: string; hook: string | null; summary: string | null; faq: unknown; category_code: string };
async function ideasFor(slugs: string[]): Promise<IdeaRow[]> {
  const client = dbOrNull();
  if (!client) return [];
  try {
    const { data: cats } = await client.from("categories").select("code,slug").in("slug", slugs);
    const codes = (cats ?? []).map((c: { code: string }) => c.code);
    if (!codes.length) return [];
    const { data } = await client.from("ideas").select("slug,title,hook,summary,faq,category_code").eq("status", "published").in("category_code", codes).order("code").limit(400);
    return (data ?? []) as IdeaRow[];
  } catch {
    return [];
  }
}

/** Turn database-backed sections into plain sections. A section with no rows falls back to a link to our FAQ page. */
async function resolve(sections: Section[]): Promise<Section[]> {
  return Promise.all(sections.map(async (s): Promise<Section> => {
    if (s.type === "dbfaq") {
      const rows = await ideasFor(s.categories);
      const re = s.match ? new RegExp(s.match, "i") : null;
      const seen = new Set<string>();
      const items: { q: string; a: string }[] = [];
      for (const row of rows) {
        for (const f of faqEntries(row.faq)) {
          const key = normalizeFaqQuestion(f.q);
          if (seen.has(key) || (re && !re.test(f.q))) continue;
          seen.add(key);
          items.push({ q: f.q, a: `${f.a} [Read the full idea: ${row.title}](/idea/${encodeURIComponent(row.slug)})` });
          break;
        }
        if (items.length >= s.limit) break;
      }
      if (!items.length) return { type: "chips", heading: s.heading, intro: s.intro ?? "", items: [{ label: "Browse all founder questions", href: "/faq" }] };
      return { type: "faq", heading: s.heading, intro: s.intro ?? "Answers from our published idea guides. More on our [founder FAQ page](/faq).", items };
    }
    if (s.type === "dbideas") {
      const rows = (await ideasFor(s.categories)).slice(0, s.limit);
      if (!rows.length) return { type: "chips", heading: s.heading, intro: s.intro ?? "", items: [s.all ?? { label: "Browse all ideas", href: "/browse" }] };
      return { type: "cards", heading: s.heading, intro: s.intro ?? "", items: rows.map((r) => ({ title: r.title, body: (r.hook || r.summary || "").slice(0, 160), href: `/idea/${encodeURIComponent(r.slug)}`, cta: "Read the idea" })).concat(s.all ? [{ title: s.all.label, body: s.all.note ?? "See every published idea in this area.", href: s.all.href, cta: "Browse" }] : []) };
    }
    return s;
  }));
}

const DEFAULT_CATS = ["home-based-business-ideas", "food-business-ideas", "online-business-ideas", "women-friendly-business-ideas", "village-and-small-town-business-ideas", "freelance-business-ideas", "reselling-business-ideas", "side-hustle-business-ideas"];
const band = (inner: string) => `<section class="py-7 px-4 border-y border-border/40 bg-white overflow-hidden"><div class="container mx-auto max-w-6xl">${inner}</div></section>`;
const bandHead = (t: string, link?: Link) => `<div class="flex items-end justify-between gap-3 mb-4"><h2 class="text-lg md:text-xl font-bold">${esc(t)}</h2>${link ? `<a class="text-sm font-medium text-primary hover:underline whitespace-nowrap" href="${esc(link.href)}">${esc(link.label)} ${ICON.arrow}</a>` : ""}</div>`;
/** Small hash of the slug: picks how many motion bands a page gets, their order and where they sit, so no two pages share one pattern. */
const seedOf = (t: string) => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
/** Motion rail (founder, 5 Nov 2026): small cards that drift sideways; alternate rails move in opposite directions. Pauses on hover or touch; static scroll when the visitor prefers reduced motion. */
const ASK_CSS = `.topic-ask{background:hsl(var(--muted)/.45);border-top:1px solid hsl(var(--border));border-bottom:1px solid hsl(var(--border));padding:28px 16px}.topic-ask-in{max-width:720px;margin:0 auto}.topic-ask .topic-wiz-bar{background:hsl(var(--border))}.topic-ask a.group>svg:last-child{display:none}.topic-ask a.group>span:nth-child(2){white-space:nowrap}.topic-ask .topic-wiz{border:0;box-shadow:none;background:transparent;padding:0;margin:0 0 28px;border-radius:0}.topic-ask [aria-label="Choose an AI provider"]{border:0!important;box-shadow:none!important;background:transparent!important;padding:0!important;border-radius:0!important}.topic-ask [aria-label="Choose an AI provider"] h3{font-size:18px!important;line-height:1.3}.topic-ask [aria-label="Choose an AI provider"]>p{font-size:13.5px!important;line-height:1.5!important;margin-top:4px!important}.topic-ask [aria-label="Choose an AI provider"]>div.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}@media (min-width:640px){.topic-ask [aria-label="Choose an AI provider"]>div.grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}}.topic-ask a.group{min-height:48px!important;padding:10px 12px!important;gap:8px!important;border-radius:12px!important;box-shadow:none!important;background:#fff!important;font-size:14px!important;transform:none!important}.topic-ask a.group:hover{border-color:hsl(var(--primary))!important}.topic-ask a.group>span:first-child{width:22px!important;height:22px!important;border:0!important;box-shadow:none!important;background:none!important;border-radius:0!important}.topic-ask details{border:0!important;background:none!important;padding:0!important;margin-top:14px!important;border-radius:0!important}.topic-ask summary{font-size:14px;color:hsl(var(--primary))!important}.topic-ask pre{background:#fff;border:1px solid hsl(var(--border));border-radius:10px;padding:12px;font-size:13px!important}.topic-ask [aria-label="Choose an AI provider"] button{border:0!important;background:none!important;padding:4px 0!important;min-height:0!important;color:hsl(var(--primary))!important}`;
const CHIP_CSS = `.topic-wiz{margin-bottom:20px;border:1px solid hsl(var(--border));border-radius:16px;background:#fff;padding:18px;box-shadow:0 6px 20px rgba(15,23,42,.06)}.topic-wiz-title{margin:0;font-size:18px;font-weight:700;color:hsl(var(--foreground))}.topic-wiz-sub{margin:4px 0 0;font-size:13.5px;color:hsl(var(--muted-foreground))}.topic-wiz-bar{margin-top:14px;height:6px;border-radius:99px;background:hsl(var(--muted));overflow:hidden}.topic-wiz-bar span{display:block;height:100%;width:0;background:hsl(var(--primary));border-radius:99px;transition:width .35s ease}.topic-wiz-count{margin:6px 0 0;font-size:12px;color:hsl(var(--muted-foreground))}.topic-wiz-step{margin-top:16px}.topic-wiz-q{margin:0 0 10px;font-size:16px;font-weight:600;color:hsl(var(--foreground))}.topic-wiz-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}@media (min-width:640px){.topic-wiz-opts{grid-template-columns:repeat(3,minmax(0,1fr))}}.topic-chip{min-height:48px;text-align:left;border:1px solid hsl(var(--border));background:#fff;color:hsl(var(--foreground));border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.25;cursor:pointer;transition:border-color .15s,background .15s,transform .15s}.topic-chip:hover{border-color:hsl(var(--primary))}.topic-chip:active{transform:scale(.98)}.topic-chip[aria-pressed="true"]{border-color:hsl(var(--primary));background:hsl(var(--primary));color:#fff;font-weight:600}.topic-wiz-nav{display:flex;justify-content:space-between;margin-top:14px}.topic-wiz-back,.topic-wiz-skip{background:none;border:0;padding:6px 2px;font-size:13px;font-weight:600;color:hsl(var(--primary));cursor:pointer}.topic-wiz-back[disabled]{visibility:hidden}.js-wiz .topic-wiz-step{display:none}.js-wiz .topic-wiz-step.is-on{display:block;animation:wizIn .25s ease}@keyframes wizIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.js-wiz .topic-wiz-step.is-on{animation:none}.topic-wiz-bar span{transition:none}}.topic-wiz-done{margin-top:16px}`+`.topic-tray{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:60;width:calc(100% - 32px);max-width:560px;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid hsl(var(--border));border-radius:14px;padding:6px 6px 6px 14px;box-shadow:0 4px 16px rgba(15,23,42,.10)}.topic-tray[hidden]{display:none}.topic-tray-text{flex:1;min-width:0;margin:0;font-size:13px;line-height:1.3;color:hsl(var(--foreground));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.topic-tray-go{flex:0 0 auto;background:hsl(var(--primary));color:#fff;border-radius:10px;padding:7px 14px;font-size:13px;font-weight:600;text-decoration:none}.topic-tray-x{flex:0 0 auto;background:none;border:0;color:hsl(var(--muted-foreground));font-size:12px;cursor:pointer;padding:4px}`;
const MQ_CSS = `.bbi-mq{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}.bbi-mq-track{display:flex;width:max-content;animation:bbi-mq var(--mq,48s) linear infinite}.bbi-mq[data-dir="right"] .bbi-mq-track{animation-direction:reverse}.bbi-mq:hover .bbi-mq-track,.bbi-mq:focus-within .bbi-mq-track,.bbi-mq.is-held .bbi-mq-track{animation-play-state:paused}.bbi-mq-item{flex:0 0 auto;margin-right:12px}@keyframes bbi-mq{to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.bbi-mq{overflow-x:auto;-webkit-mask-image:none;mask-image:none}.bbi-mq-track{animation:none}}`;
const MQ_CARD = "bbi-mq-item block w-[210px] sm:w-[232px] rounded-lg border bg-card text-card-foreground overflow-hidden hover:border-primary transition-colors";
function marquee(items: string[], dir: "left" | "right", secs: number): string {
  const dup = items.map((h) => h.replace(/^<a /, '<a tabindex="-1" aria-hidden="true" '));
  return `<div class="bbi-mq" data-mq data-dir="${dir}" style="--mq:${secs}s"><div class="bbi-mq-track">${items.join("")}${dup.join("")}</div></div>`;
}
const imgCard = (href: string, img: string | null, alt: string, kicker: string, title: string) => `<a class="${MQ_CARD}" href="${esc(href)}">${img ? `<img src="${esc(img)}" alt="${esc(alt)}" decoding="async" fetchpriority="low" class="w-full aspect-[16/9] object-cover">` : ""}<div class="p-3"><p class="text-[11px] text-primary font-medium mb-1 truncate">${esc(kicker)}</p><h3 class="font-semibold text-[13.5px] leading-snug line-clamp-2">${esc(title)}</h3></div></a>`;
const textCard = (href: string, kicker: string, title: string, body: string) => `<a class="${MQ_CARD} p-3.5" href="${esc(href)}"><p class="text-[11px] text-primary font-medium mb-1">${esc(kicker)}</p><h3 class="font-semibold text-[13.5px] leading-snug mb-1">${esc(title)}</h3><p class="text-xs text-muted-foreground line-clamp-2">${esc(body)}</p></a>`;
const pillCard = (l: Link) => `<a class="bbi-mq-item inline-flex items-center rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-foreground hover:border-primary hover:text-primary transition-colors whitespace-nowrap" href="${esc(l.href)}">${esc(l.label)}</a>`;

/** Motion bands of our own pages placed between seller sections: guides, articles, calculators and tools, categories and lists. */
async function exploreBands(p: TopicPage): Promise<string[]> {
  const cats = p.explore?.categories ?? DEFAULT_CATS;
  const [{ TAXONOMY }, { STARTUP_GUIDES }, { guideImage }, blog] = await Promise.all([
    import("@/data/taxonomy"),
    import("@/lib/guides-data"),
    import("@/config/guide-imagery"),
    import("@/lib/blog.server").then((m) => m.fetchPosts(1, 10)).catch(() => ({ posts: [] as { slug: string; title: string; excerpt: string; image: string | null; imageAlt: string | null }[] })),
  ]);
  const seed = seedOf(p.slug);
  const tax = TAXONOMY as { slug: string; short?: string; name?: string }[];
  const catLinks: Link[] = [...tax.filter((c) => cats.includes(c.slug)), ...tax.filter((c) => !cats.includes(c.slug)).slice(seed % 40, (seed % 40) + 6)].map((c) => ({ label: `${c.short ?? c.name} business ideas`, href: `/category/${c.slug}` }));
  const ideas = (dir: "left" | "right") => band(`${bandHead("Find a business idea that fits you", { label: "Browse all categories", href: "/browse" })}${marquee([...catLinks, { label: "Idea lists", href: "/lists" }, { label: "Business models compared", href: "/business-models-india" }, { label: "Side business ideas", href: "/side-business-ideas-india" }].map(pillCard), dir, 60)}`);
  const first = STARTUP_GUIDES.filter((g) => g.category === p.explore?.guideCategory);
  const guides = [...first, ...STARTUP_GUIDES.filter((g) => !first.includes(g) && !/saas|b2b/i.test(g.slug))].slice(0, 9);
  const guideRail = (dir: "left" | "right") => band(`${bandHead("Business guides for Indian founders", { label: "All guides", href: "/startup-guides" })}${marquee(guides.map((g) => { const img = guideImage(g.slug); return imgCard(`/startup-guides/${g.slug}`, img?.src ?? null, img?.alt ?? g.title, `${g.category} · ${g.readTime}`, g.title); }), dir, 55)}`);
  const posts = (blog as { posts: { slug: string; title: string; excerpt: string; image: string | null; imageAlt: string | null }[] }).posts;
  const blogRail = (dir: "left" | "right") => posts.length ? band(`${bandHead("From the founder journal", { label: "All articles", href: "/blog" })}${marquee(posts.map((b) => imgCard(`/blog/${b.slug}`, b.image, b.imageAlt ?? b.title, "Article", b.title)), dir, 58)}`) : "";
  const tools: [string, string, string, string][] = [
    ["/calculator/break-even", "Calculator", "Break-even", "Orders a month before you stop losing money."],
    ["/calculator/startup-cost", "Calculator", "Startup cost", "Every rupee you need before the first sale."],
    ["/calculator/funding-needed", "Calculator", "Funding needed", "How much to raise or borrow, and for how long."],
    ["/calculator/roi", "Calculator", "Return on investment", "Is your money and time coming back?"],
    ["/business-idea-risk-check", "Free tool", "Idea risk check", "The one guess that could sink your idea."],
    ["/business-demand-test-india", "Free tool", "Demand test", "A small paid test with real buyers."],
    ["/business-pricing-india", "Free tool", "First-price workbench", "A price that covers cost, GST and your time."],
    ["/startup-cash-flow-india", "Free tool", "Cash-flow calendar", "See the month money runs short."],
    ["/templates", "Templates", "Founder templates", "Plans and worksheets to fill in."],
    ["/founder-glossary", "Glossary", "Founder glossary", "Money and startup words in plain English."],
    ["/failed-startups/india", "Research", "Indian startup failures", "What went wrong, so you avoid it."],
  ];
  const toolRail = (dir: "left" | "right") => band(`${bandHead("Calculators and free tools", { label: "All calculators", href: "/calculator" })}${marquee(tools.map(([h, k, t, b]) => textCard(h, k, t, b)), dir, 50)}`);
  const all = [guideRail, blogRail, toolRail, ideas];
  const count = 2 + (seed % 3);
  const start = seed % all.length;
  return Array.from({ length: count }, (_, i) => all[(start + i) % all.length](i % 2 ? "right" : "left")).filter(Boolean);
}

/** Our existing Validate picker (Claude, Perplexity, ChatGPT, Grok), reused as-is and filled from the one topic prompt template. */
function validateBlock(p: TopicPage, id: string, title: string): string {
  const questions = p.sections.map((s) => ("heading" in s ? s.heading : "")).filter((h) => h && !/^(sources|explore|free|related|keep|deeper|popular|other|part of|calculators|find a business|business guides|from the founder)/i.test(h));
  const { prompt, prefillPrompt, state } = topicValidatePrompt({ title: p.hero.h1, questions, date: new Date() });
  const ui = renderToStaticMarkup(createElement(ProviderPromptActions, { prompt, prefillPrompt, title }))
    .replace(/Open (ChatGPT|Claude|Grok|Perplexity) with prepared prompt/g, "Ask $1")
    .replace(/<img src="https:\/\/grok\.com[^>]*>/, '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-size="16" font-weight="700" fill="currentColor">G</text></svg>')
    .replace(/The selected AI tool opens with a prepared question[^<]*/, "Opens in a new tab with your details filled in. We never see or store the answer.");
  const top = id === "validate";
  const groups = [...COMMON_INPUTS, ...(p.inputs ?? TOPIC_INPUTS[p.slug] ?? [])];
  const panel = top ? `<div class="topic-wiz" data-topic-inputs><div class="topic-wiz-head"><p class="topic-wiz-title">Get an answer made for you</p><p class="topic-wiz-sub">${groups.length} quick taps, no typing. The answer will fit you.</p><div class="topic-wiz-bar" aria-hidden="true"><span data-wiz-fill></span></div><p class="topic-wiz-count" data-wiz-count>Question 1 of ${groups.length}</p></div>${groups.map((g, gi) => `<div class="topic-wiz-step" role="group" aria-label="${esc(g.label)}" data-step="${gi}"><p class="topic-wiz-q">${esc(g.label)}</p><div class="topic-wiz-opts">${g.options.map((o) => `<button type="button" class="topic-chip" data-group="${esc(g.label)}" data-value="${esc(o)}" aria-pressed="false">${esc(o)}</button>`).join("")}</div></div>`).join("")}<div class="topic-wiz-done" data-wiz-done hidden><p class="topic-wiz-q">All set. Your answer will be made for you.</p><p class="topic-wiz-sub" data-wiz-summary></p></div><div class="topic-wiz-nav"><button type="button" class="topic-wiz-back" data-wiz-back>Back</button><button type="button" class="topic-wiz-skip" data-wiz-skip>Skip</button></div></div>` : "";
  const tray = top ? `<div id="topic-tray" class="topic-tray" hidden role="status" aria-live="polite"><p class="topic-tray-text" data-tray-text></p><a class="topic-tray-go" href="#validate-end">Validate</a><button type="button" class="topic-tray-x" aria-label="Hide">Hide</button></div>` : "";
  const data = top ? `<script type="application/json" id="topic-state">${JSON.stringify(state).replace(/</g, "\\u003c")}</script>` : "";
  return `<section id="${id}" class="topic-ask scroll-mt-24"><div class="topic-ask-in">${panel}<div data-topic-validate>${ui}</div>${data}${tray}</div></section>`;
}

function withBands(sections: string[], bands: string[]): string {
  const n = sections.length;
  if (n < 3 || !bands.length) return sections.join("") + bands.join("");
  const at = bands.map((_, k) => Math.min(n - 2, Math.max(0, Math.round(((k + 1) * n) / (bands.length + 1)) - 1)));
  return sections.map((html, i) => html + bands.filter((_, k) => at[k] === i).join("")).join("");
}

export async function renderTopicPage(input: TopicPage): Promise<Response> {
  const [resolved, bands] = await Promise.all([resolve(input.sections), exploreBands(input).catch(() => [] as string[])]);
  const p: TopicPage = { ...input, sections: resolved };
  faqId = 0;
  used = new Set();
  const url = canonicalUrl(`/${p.slug}`);
  const body = p.sections.map(section);
  const srcAt = p.sections.findIndex((x) => x.type === "sources");
  const endBlock = validateBlock(p, "validate-end", "Validate this for your city today");
  if (srcAt >= 0) body[srcAt] = endBlock + body[srcAt]; else body.push(endBlock);
  const main = `<main class="flex-1">${crumbs(p)}${hero(p)}${validateBlock(p, "validate", "Validate this for your city today")}${withBands(body, bands)}</main>`;
  const html = `<!DOCTYPE html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><title>${esc(p.seo.title)}</title><meta name="description" content="${esc(p.seo.description)}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(p.seo.title)}"><meta property="og:description" content="${esc(p.seo.description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:locale" content="en_IN"><meta property="og:site_name" content="bbusiness.online"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema(p)}</script><style>${STYLE}${MQ_CSS}${CHIP_CSS}${ASK_CSS}</style><link rel="stylesheet" href="/bought/topics/styles/index-BpDyUYDe.css"><style id="bbi-shared-header-styles">${sharedHeaderStyles}</style><style id="bbi-glass">${glassCss}</style><style id="bbi-ember">${emberCss}</style></head><body class="ember"><div id="root"><div class="min-h-screen flex flex-col">${menuPanels.header}${main}${menuPanels.footer}</div></div>${menuBindings}${SCRIPT}${keywordScript}</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
