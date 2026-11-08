import { subcategoryIcon } from "@/config/subcategory-icons";
import { SellerFaq as Faq } from "@/components/v2/faq";
export { SellerFaq as Faq } from "@/components/v2/faq";
import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  CircleCheck,
  House,
  Lightbulb,
  Star,
  TriangleAlert,
  Wallet,
  Zap,
} from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { ShortlistToggle } from "@/components/founder-workspace/shortlist-toggle";
import type { WorkspaceIdea } from "@/lib/founder-workspace";
import { ListReportPromo, ListCitation, ListDeeperAnswers, ListBeforeBuild, ListRelatedResources, ListRecentResearch } from "@/components/v2/list-detail-sections";
import { getListPage, type ListIdea, type ListPage } from "@/lib/lists.functions";

export const Route = createFileRoute("/lists/$slug")({
  loader: async ({ params }) => {
    const page = await getListPage({ data: { slug: params.slug } });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} | bbusiness.online` : "Business idea list | bbusiness.online" },
      { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
    ],
  }),
  component: ListPageView,
});

/** First n sentences of a text. */
function sentences(text: string | null | undefined, n: number): string {
  if (!text) return "";
  const parts = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  return parts.slice(0, n).join("").trim();
}
function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
function points(text: string | null | undefined, n: number): string[] {
  if (!text) return [];
  return (text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim()).filter(Boolean).slice(0, n);
}
const COST_LEVEL: Record<string, string> = { zero: "Almost no money", under_25k: "Lower startup cost", "25k_1l": "Moderate startup cost", "1l_5l": "Higher startup cost", above_5l: "Significant startup cost" };
const band = (i: ListIdea) => (i.investment_band ? COST_LEVEL[i.investment_band] ?? "" : "");
const lower = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const BTN =
  "inline-flex items-center justify-center whitespace-nowrap font-medium duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation active:scale-[0.98] active:opacity-90";

function Head({ p, title, words, updated }: { p: ListPage; title: string; words: number; updated: string }) {
  return (
    <div className="text-center mb-6">
      {subcategoryIcon(p.slug) && <span className="icon-tile mx-auto mb-5 h-60 w-48 sm:h-72 sm:w-56"><img src={subcategoryIcon(p.slug)!} alt={`${p.name} icon`} width={154} height={208} fetchPriority="high" decoding="async" /></span>}
      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 standard-badge-primary mb-3">
        {lower(p.name)}
      </div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-sm md:text-base text-muted-foreground mb-3 max-w-2xl mx-auto">{sentences(p.intro, 1)}</p>
      <div className="flex items-center justify-center mb-3">
        <a href="/product" className={`${BTN} rounded-lg hover:bg-slate-700 h-11 py-2 gap-2 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all min-h-[44px] px-5 text-sm font-semibold`}>
          <Lightbulb className="h-4 w-4" />
          Validate your idea
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mt-2 text-xs text-muted-foreground/80">Updated {updated}</p>
    </div>
  );
}

function Tldr({ p, title, month }: { p: ListPage; title: string; month: string }) {
  return (
    <div className="tldr-section mb-6 rounded-2xl border-l-4 border-primary bg-primary/5 p-5 lg:p-6" data-featured-snippet="true">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          TL;DR • {p.name.toLowerCase()} • as of {month}
        </span>
      </div>
      <p className="text-base lg:text-lg leading-relaxed text-foreground/90">
        As of {month}, this page presents published entries for {title}. Each entry lists the opportunity, who it is for, the money
        needed to start and the main risk, using the live bbusiness.online library.
      </p>
    </div>
  );
}

function Intro({ p }: { p: ListPage }) {
  return (
    <section className="mb-6">
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {p.intro && <p>{p.intro}</p>}
        {p.howToChoose && <p>{p.howToChoose}</p>}
      </div>
    </section>
  );
}

function Comparison({ ideas }: { ideas: ListIdea[] }) {
  // 7 Nov 2026: one compact card per idea instead of a wide table with a sticky label column.
  // Phones swipe through the cards; tablets and desktops see them side by side. No text is cut.
  if (!ideas.length) return null;
  return (
    <section className="mb-8" aria-labelledby="quick-compare">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 id="quick-compare" className="flex items-center gap-2 text-lg font-bold text-foreground"><Star className="h-4 w-4 fill-primary text-primary" />Quick comparison</h2>
          <p className="mt-1 text-sm text-muted-foreground">The top ideas side by side. Swipe on a phone.</p>
        </div>
      </div>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
        {ideas.map((i) => (
          <li key={i.slug} className="g-tile flex w-[78%] shrink-0 snap-start flex-col p-4 sm:w-[46%] md:w-auto">
            <a href={`/idea/${i.slug}`} className="font-display text-[15px] font-semibold leading-snug text-slate-900 hover:text-[#4643ba]">{i.title}</a>
            <dl className="mt-3 grid gap-2 text-sm">
              <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">Money to start</dt><dd className="mt-0.5 font-medium text-slate-800">{band(i) || "See the idea"}</dd></div>
              <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">Best for</dt><dd className="mt-0.5 line-clamp-3 text-slate-600">{sentences(i.who_pays_you, 1)}</dd></div>
            </dl>
            <a href={`/idea/${i.slug}`} className="g-link mt-auto !min-h-10 !py-2 text-sm whitespace-nowrap" style={{ marginTop: "0.9rem" }}><span>Read this idea</span><span className="g-arrow"><ArrowRight aria-hidden size={14} /></span></a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function asWorkspaceIdea(idea: ListIdea): WorkspaceIdea {
  return {
    slug: idea.slug,
    title: idea.title,
    source: "published",
    hook: idea.hook || undefined,
    summary: idea.summary || undefined,
    description: idea.summary || idea.hook || undefined,
    investmentBand: idea.investment_band || undefined,
    timeNeeded: idea.time_needed || undefined,
    skillLevel: idea.skill_level || undefined,
    targetCustomer: idea.who_pays_you || undefined,
    revenueModel: idea.how_money_comes || undefined,
    risks: idea.what_hurts || undefined,
  };
}

function ListIdeaActions({ idea, readHref }: { idea: ListIdea; readHref?: string }) {
  return <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
    <a href={readHref || ("/idea/" + idea.slug)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><Lightbulb size={15}/>Read full idea</a>
    <ShortlistToggle idea={asWorkspaceIdea(idea)} compact className="w-full [&>button]:w-full"/>
    <a href={"/idea/" + idea.slug + "#idea-validate"} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><Star size={15}/>Validate this idea</a>
  </div>;
}

export function TopCard({ idea, actionHref, showAction = true }: { idea: ListIdea; n?: number; actionHref?: string; showAction?: boolean }) {
  const need = points(idea.what_you_need, 4);
  const hurts = points(idea.what_hurts, 3);
  const summary = idea.summary || idea.hook || "";
  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
    <header className="flex min-w-0 flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="min-w-0 flex-1">
        <h3 className="break-words text-lg font-bold leading-snug text-slate-950 sm:text-xl">{idea.title}</h3>
        {idea.who_pays_you && <p className="mt-2 text-sm leading-5 text-slate-600"><strong className="e-kw font-semibold text-slate-800">Best for:</strong> {sentences(idea.who_pays_you, 1)}</p>}
      </div>
      {band(idea) && <span className="inline-flex max-w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-sm font-semibold leading-snug text-slate-700 sm:max-w-[220px] sm:flex-none sm:break-words"><span className="e-kw">Money to start:</span>&nbsp;{band(idea)}</span>}
    </header>
    <div className="p-4 sm:p-5">
      {summary && <p className="break-words text-sm leading-6 text-slate-600 sm:text-base">{summary}</p>}
      {idea.how_money_comes && <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-800"><Wallet size={14}/>Revenue model</div><p className="mt-1 text-sm leading-5 text-slate-700">{sentences(idea.how_money_comes, 1)}</p></div>}
      {(need.length > 0 || hurts.length > 0) && <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {need.length > 0 && <section className="rounded-xl border border-slate-200 bg-slate-50 p-3"><h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><CircleCheck size={15} className="text-blue-700"/>What you need</h4><ul className="space-y-1.5 text-sm leading-5 text-slate-600">{need.map((text,index) => <li key={index} className="flex items-start gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"/><span>{text}</span></li>)}</ul></section>}
        {hurts.length > 0 && <section className="rounded-xl border border-slate-200 bg-slate-50 p-3"><h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><TriangleAlert size={15} className="text-amber-700"/>What can go wrong</h4><ul className="space-y-1.5 text-sm leading-5 text-slate-600">{hurts.map((text,index) => <li key={index} className="flex items-start gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600"/><span>{text}</span></li>)}</ul></section>}
      </div>}
      {idea.verdict && <div className="mt-3 rounded-xl border-l-4 border-blue-500 bg-blue-50/60 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wide text-blue-800">Editorial view</p><p className="mt-1 text-sm leading-5 text-slate-700">{sentences(idea.verdict, 2)}</p></div>}
      {showAction && <ListIdeaActions idea={idea} readHref={actionHref}/>}
    </div>
  </article>;
}

function MoreCard({ idea }: { idea: ListIdea; n?: number }) {
  const summary = idea.summary || idea.hook || "";
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5">
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <h3 className="min-w-0 break-words text-base font-bold leading-snug text-slate-950 sm:text-lg">{idea.title}</h3>
      {band(idea) && <span className="max-w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold leading-snug text-slate-700 sm:flex-none">{band(idea)}</span>}
    </div>
    {summary && <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>}
    {idea.how_money_comes && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-5 text-slate-600"><strong className="text-slate-800">Revenue:</strong> {sentences(idea.how_money_comes, 1)}</p>}
    <ListIdeaActions idea={idea}/>
  </article>;
}

function RelatedLists({ p }: { p: ListPage }) {
  if (p.siblings.length === 0) return null;
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm premium-card mb-12">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-2">Related Business Idea Lists</h2>
        <p className="text-muted-foreground mb-6">Explore more curated lists that might interest you</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.siblings.map((s) => (
            <a key={s.slug} href={`/lists/${s.slug}`} className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card/50 px-4 py-3 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors">
              <span>{s.name}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Explore <ChevronRight className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Conclusion({ p }: { p: ListPage }) {
  const last = p.ideas[0];
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm premium-card mb-12">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">{p.howToChoose ?? sentences(last?.verdict, 3)}</p>
      </div>
    </div>
  );
}

function ListPageView() {
  return <ListPageBody p={Route.useLoaderData()} />;
}

export function ListPageBody({ p, categorySlug, canonicalPath, parent, directory }: { p: ListPage; categorySlug?: string; canonicalPath?: string; parent?:{label:string;href:string}; directory?:{name:string;slug:string}[] }) {
  const latest = p.ideas.map((i) => i.updated_at ?? "").sort().pop() ?? "";
  const d = latest ? new Date(latest) : new Date();
  const updated = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone:'Asia/Kolkata' });
  const month = d.toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone:'Asia/Kolkata' });
  const title = p.name;
  const words = p.ideas.reduce((n, i) => n + [i.summary, i.who_pays_you, i.how_money_comes, i.verdict].join(" ").split(/\s+/).length, 0);
  const top = p.ideas.slice(0, 5);
  const more = p.ideas.slice(5);

  return (
    <V2Frame active="/lists">
      <div className="bg-muted/30 border-b pt-24 lg:pt-28">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              <li className="inline-flex items-center gap-1.5">
                <a href="/" aria-label="Home" className="transition-colors flex items-center text-muted-foreground hover:text-primary">
                  <House className="h-4 w-4" />
                </a>
              </li>
              <li aria-hidden="true" className="mx-1 text-muted-foreground"><ChevronRight className="h-4 w-4" /></li>
              <li className="inline-flex items-center gap-1.5">
                <a href={parent?.href ?? (categorySlug ? `/category/${categorySlug}` : "/lists")} className="flex items-center transition-colors text-muted-foreground hover:text-primary">{parent?.label ?? (categorySlug ? p.categoryName : "Lists")}</a>
              </li>
              <li aria-hidden="true" className="mx-1 text-muted-foreground"><ChevronRight className="h-4 w-4" /></li>
              <li className="inline-flex items-center gap-1.5">
                <span aria-current="page" className="flex items-center font-medium text-foreground">{title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <article className="pt-6 pb-8 px-4 hover:!translate-y-0 hover:!shadow-none">
        <div className="container mx-auto max-w-5xl">
          <Head p={p} title={title} words={words} updated={updated} />
          <Tldr p={p} title={title} month={month} />
          <Intro p={p} />
          {directory && directory.length>0 && <section id="focused-lists" className="mb-12 scroll-mt-28"><h2 className="mb-5 text-2xl font-bold">Focused lists</h2><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{directory.map(sub=><a key={sub.slug} href={`/lists/${sub.slug}`} className="group flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"><span className="flex min-w-0 items-center gap-3">{subcategoryIcon(sub.slug) && <span className="icon-tile h-16 w-14 shrink-0 !rounded-xl !p-1"><img src={subcategoryIcon(sub.slug)!} alt="" width={40} height={54} loading="lazy" decoding="async" /></span>}<span className="min-w-0 break-words">{sub.name}</span></span><ArrowRight className="shrink-0 text-primary" size={16}/></a>)}</div></section>}
          <ListReportPromo p={p}/>
          <Comparison ideas={top} />
          <section className="space-y-8 mb-12">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Featured {p.name.toLowerCase()}
            </h2>
            {top.map((i, n) => (
              <TopCard key={i.slug} idea={i} n={n + 1} />
            ))}
          </section>
          {more.length > 0 && (
            <section className="space-y-6 mb-12">
              <h2 className="text-2xl font-bold">More Options</h2>
              {more.map((i, n) => (
                <MoreCard key={i.slug} idea={i} n={n + 6} />
              ))}
            </section>
          )}
          <ListCitation p={p} updated={updated} path={canonicalPath}/>
          <Faq faq={p.faq} />
          <ListDeeperAnswers p={p}/>
          <RelatedLists p={p} />
          <ListBeforeBuild p={p}/>
          <Conclusion p={p} />
        </div>
      </article>
      <ListRelatedResources p={p}/>
      <div className="sr-only">
        <h2>Quick Answer: {title}</h2>
        <p>{p.intro}</p>
      </div>
      <ListRecentResearch p={p}/>
    </V2Frame>
  );
}
