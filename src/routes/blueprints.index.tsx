import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronRight, Search, Star } from "lucide-react";
import { z } from "zod";
import { V2Frame } from "@/components/v2/frame";
import { categoryImage } from "@/config/category-imagery";
import { getLegacyIdeaCards } from "@/lib/legacy-ideas.functions";
import { ShortlistToggle } from "@/components/founder-workspace/shortlist-toggle";
import { useFounderWorkspace, type WorkspaceIdea } from "@/lib/founder-workspace";

export const Route = createFileRoute("/blueprints/")({
  validateSearch: z.object({ q:z.string().optional(), page:z.coerce.number().int().min(1).default(1) }),
  loaderDeps: ({search}) => ({q:search.q??"",page:search.page}),
  loader: ({deps}) => getLegacyIdeaCards({data:{q:deps.q,page:deps.page}}),
  head: () => ({meta:[{title:"Published Business Idea Blueprints | BusinessIdea.io"},{name:"robots",content:"noindex,follow"},{name:"description",content:"Published Indian business ideas with buyer, revenue and risk details."}]}),
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
   {items.length?<div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=>{const image=categoryImage(item.categorySlug);return <article key={item.slug} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <a href={`/idea/${item.slug}`} className="block aspect-[16/9] overflow-hidden"><img src={image.src} alt={image.alt} loading="lazy" width={1280} height={720} className="h-full w-full object-cover"/></a>
    <div className="flex flex-1 flex-col p-5"><span className="text-xs font-bold uppercase tracking-wider text-violet-700">{item.categoryName}</span><h3 className="mt-3 text-lg font-semibold leading-snug text-slate-950"><a href={`/idea/${item.slug}`} className="hover:text-violet-700">{item.title}</a></h3><p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-slate-600">{item.description}</p>
    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3"><a href={`/idea/${item.slug}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"><ArrowRight size={15}/>Read full idea</a><ShortlistToggle compact className="w-full [&>button]:w-full" idea={asWorkspaceIdea(item)}/><a href={`/idea/${item.slug}#idea-validate`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 hover:border-blue-500 hover:bg-blue-50"><Star size={15}/>Validate this idea</a></div></div>
   </article>})}</div>:<div className="mt-7 rounded-xl border p-6"><h3 className="font-semibold">No published ideas matched this search.</h3><a className="mt-3 inline-block text-violet-700 underline" href="/browse">Explore categories</a></div>}
   {pages>1&&<nav className="mt-8 flex items-center justify-center gap-4" aria-label="Blueprint pages">{page>1&&<a className="rounded-xl border px-4 py-3" href={`/blueprints?page=${page-1}&q=${encodeURIComponent(q??"")}`}>Previous</a>}<span className="text-sm">Page {page} of {pages}</span>{page<pages&&<a className="rounded-xl border px-4 py-3" href={`/blueprints?page=${page+1}&q=${encodeURIComponent(q??"")}`}>Next →</a>}</nav>}
  </div></section>
  <section className="border-t bg-slate-50 py-12"><div className={wrap}><h2 className="text-2xl font-bold">Next step</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Browse categories","/browse"],["Compare idea lists","/lists"],["Calculate startup costs","/calculator/startup-cost"]].map(([label,href])=><a key={href} href={href} className="flex min-h-24 items-center justify-between rounded-xl border bg-white p-5 font-semibold text-slate-900 hover:border-violet-400">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </main></V2Frame>;
}
