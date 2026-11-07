import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronRight, Lightbulb, Search, Star, Wallet } from "lucide-react";
import { z } from "zod";
import { V2Frame } from "@/components/v2/frame";
import { subcategoryIcon } from "@/config/subcategory-icons";
import { getLegacyIdeaCards } from "@/lib/legacy-ideas.functions";
import { ShortlistToggle } from "@/components/founder-workspace/shortlist-toggle";
import { useFounderWorkspace, type WorkspaceIdea } from "@/lib/founder-workspace";

export const Route = createFileRoute("/blueprints/")({
  validateSearch: z.object({ q:z.string().optional(), page:z.coerce.number().int().min(1).default(1) }),
  loaderDeps: ({search}) => ({q:search.q??"",page:search.page}),
  loader: ({deps}) => getLegacyIdeaCards({data:{q:deps.q,page:deps.page}}),
  head: () => ({meta:[{title:"Published Business Idea Blueprints | bbusiness.online"},{name:"robots",content:"noindex,follow"},{name:"description",content:"Published Indian business ideas with buyer, revenue and risk details."}]}),
  component: BlueprintLibrary,
});
const wrap="mx-auto w-full max-w-6xl px-4 md:px-6";
function BlueprintLibrary(){
 const {q,page}=Route.useSearch();const {items,total}=Route.useLoaderData();
 const navigate=useNavigate({from:"/blueprints/"});const [term,setTerm]=useState(q??"");
 const pages=Math.ceil(total/24);
 const {shortlist}=useFounderWorkspace();
 const asWorkspaceIdea=(item:typeof items[number]):WorkspaceIdea=>({slug:item.slug,title:item.title,source:"blueprint",description:item.description,categoryName:item.categoryName,categoryCode:item.categorySlug});
 return <V2Frame active="/lists">
  <div className="border-b bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/browse">Browse</a><ChevronRight size={15}/><span>Blueprints</span></nav></div>
  <main><section className="border-b bg-gradient-to-b from-violet-50 to-white py-10 lg:py-14"><div className={wrap}>
   <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">Published idea library</span>
   <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">Published business idea blueprints</h1>
   <p className="mt-3 max-w-2xl text-slate-600">Examine published ideas, their buyers, money model and practical challenges.</p>
   <div className="mt-5 flex flex-wrap gap-3"><a href="/browse" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800">Browse categories <ArrowRight size={17}/></a><a href="/lists" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-5 py-3 font-semibold">Explore lists</a><a href={shortlist.length>=2?"/startup-idea-comparison":"/product"} className="inline-flex min-h-11 items-center rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 font-semibold text-violet-900">{shortlist.length>=2?`Compare selected (${shortlist.length}/4)`:`Your shortlist (${shortlist.length}/4)`}</a></div>
  </div></section>
  <section className="py-12 lg:py-16"><div className={wrap}>
   <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl font-bold text-slate-950">Find an idea</h2></div>
   <form role="search" onSubmit={e=>{e.preventDefault();navigate({search:{q:term.trim()||undefined,page:1}});}} className="mt-5 flex max-w-3xl flex-wrap gap-3">
    <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4"><Search size={19} className="shrink-0 text-slate-500"/><span className="sr-only">Search published blueprint titles</span><input type="search" maxLength={80} value={term} onChange={e=>setTerm(e.target.value)} placeholder="Try farming, repair or tuition" className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none"/></label>
    <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white hover:bg-violet-800">Search <ArrowRight size={17}/></button>
   </form>
   {items.length?<div className="mt-7 grid gap-4 lg:grid-cols-2">{items.map(item=>{const icon=subcategoryIcon(item.subcategorySlug??"");return <article key={item.slug} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-300 hover:shadow-md sm:p-5">
    <div className="flex min-w-0 flex-1 gap-4"><a href={`/idea/${item.slug}`} aria-hidden="true" tabIndex={-1} className="icon-tile h-24 w-20 shrink-0 !rounded-2xl !p-1.5 sm:h-28 sm:w-24">{icon?<img src={icon} alt="" width={96} height={130} loading="lazy" decoding="async"/>:<Lightbulb size={34} className="text-orange-200 drop-shadow-[0_4px_10px_rgba(255,60,30,.5)]"/>}</a>
    <div className="flex min-w-0 flex-1 flex-col">
     {item.subcategoryName?<a href={`/lists/${item.subcategorySlug}`} className="w-fit text-[11px] font-bold uppercase tracking-wider text-violet-700 hover:underline">{item.subcategoryName}</a>:<span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">{item.categoryName}</span>}
     <h3 className="mt-1 text-base font-semibold leading-snug text-slate-950 sm:text-lg"><a href={`/idea/${item.slug}`} className="hover:text-violet-700">{item.title}</a></h3>
     {item.whoPays&&<p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-800">Who pays you: </span>{item.whoPays}</p>}
     {item.moneyToStart&&<div className="mt-2.5 flex flex-wrap gap-1.5"><span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200"><Wallet size={13}/>{item.moneyToStart} to start</span></div>}
     </div></div>
    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3"><a href={`/idea/${item.slug}`} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800">Read idea <ArrowRight size={15}/></a><ShortlistToggle compact className="shrink-0 [&>button]:whitespace-nowrap" idea={asWorkspaceIdea(item)}/><a href={`/idea/${item.slug}#idea-validate`} aria-label={`Validate ${item.title}`} title="Validate this idea" className="ml-auto inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:border-violet-500"><Star size={14}/><span className="hidden sm:inline">Validate</span></a></div>
   </article>})}</div>:<div className="mt-7 rounded-xl border p-6"><h3 className="font-semibold">No published ideas matched this search.</h3><a className="mt-3 inline-block text-violet-700 underline" href="/browse">Explore categories</a></div>}
   {pages>1&&<nav className="mt-8 flex items-center justify-center gap-4" aria-label="Blueprint pages">{page>1&&<a className="rounded-xl border px-4 py-3" href={`/blueprints?page=${page-1}&q=${encodeURIComponent(q??"")}`}>Previous</a>}<span className="text-sm">Page {page} of {pages}</span>{page<pages&&<a className="rounded-xl border px-4 py-3" href={`/blueprints?page=${page+1}&q=${encodeURIComponent(q??"")}`}>Next →</a>}</nav>}
  </div></section>
  <section className="border-t bg-slate-50 py-12"><div className={wrap}><h2 className="text-2xl font-bold">Next step</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Browse categories","/browse"],["Compare idea lists","/lists"],["Calculate startup costs","/calculator/startup-cost"]].map(([label,href])=><a key={href} href={href} className="flex min-h-24 items-center justify-between rounded-xl border bg-white p-5 font-semibold text-slate-900 hover:border-violet-400">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </main></V2Frame>;
}
