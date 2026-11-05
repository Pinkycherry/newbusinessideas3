import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { z } from "zod";
import { V2Frame } from "@/components/v2/frame";
import { searchTaxonomy } from "@/lib/catalog";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Search Business Idea Paths | BusinessIdea.io" },
    { name: "robots", content: "noindex,follow" },
    { name: "description", content: "Search approved business idea categories and subcategories for India." },
  ] }),
  component: SearchPage,
});

const wrap = "mx-auto w-full max-w-6xl px-4 md:px-6";
const card = "group flex h-full min-w-0 flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-400 hover:shadow-md";
function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [term, setTerm] = useState(q ?? "");
  const hits = useMemo(() => searchTaxonomy(q ?? "", 200), [q]);
  const submitted = Boolean(q?.trim());
  return <V2Frame active="/search">
    <div className="border-b bg-slate-50 pt-24 lg:pt-28">
      <nav aria-label="Breadcrumb" className={`${wrap} flex items-center gap-2 py-3 text-sm text-slate-600`}>
        <a href="/" className="hover:text-violet-700">Home</a><ChevronRight size={15}/><span>Search</span>
      </nav>
    </div>
    <main>
      <section className="border-b bg-gradient-to-b from-violet-50 to-white py-10 lg:py-14"><div className={wrap}>
        <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">Business idea directory</span>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">Search business ideas in India</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Search the published category map by topic, skill or type of work.</p>
        <div className="mt-5 flex flex-wrap gap-3"><a href="/browse" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800">Browse ideas <ArrowRight size={17}/></a><a href="/lists" className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-900">Explore lists</a></div>
      </div></section>
      <section className="py-12 lg:py-16"><div className={wrap}>
        <h2 className="text-2xl font-bold text-slate-950">Find a category or focused list</h2>
        <form role="search" className="mt-5 flex max-w-3xl flex-wrap gap-3" onSubmit={event=>{event.preventDefault();navigate({search:{q:term.trim()||undefined}});}}>
          <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4">
            <Search size={20} className="shrink-0 text-slate-500"/><span className="sr-only">Search categories and subcategories</span>
            <input type="search" value={term} onChange={event=>setTerm(event.target.value)} placeholder="Food, tuition, farming, repair..." className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none"/>
          </label>
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white hover:bg-violet-800">Search <ArrowRight size={17}/></button>
        </form>
        {submitted && <p className="mt-5 text-sm text-slate-600">Results for “{q}”</p>}
        {submitted && (hits.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hits.map(hit=> {
            const href=hit.kind==="category" ? `/category/${hit.categorySlug}` : `/category/${hit.categorySlug}/${hit.subcategorySlug}`;
            return <a key={href} href={href} className={card}><div><span className="text-xs font-bold uppercase tracking-wider text-violet-700">{hit.kind==="category"?"Category":hit.categoryName}</span><h3 className="mt-3 text-lg font-semibold text-slate-950 group-hover:text-violet-700">{hit.name}</h3></div><span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700">Explore <ArrowRight size={16}/></span></a>;
          })}
        </div> : <div className="mt-6 rounded-xl border bg-slate-50 p-6"><h3 className="font-semibold">No matching category found</h3><a href="/browse" className="mt-2 inline-flex text-violet-700 underline">Browse published categories</a></div>)}
        {!submitted && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[["Browse published ideas","/browse"],["Explore focused lists","/lists"],["Compare business ideas","/startup-idea-comparison"]].map(([title,href])=><a key={href} className={card} href={href}><h3 className="font-semibold text-slate-950">{title}</h3><span className="inline-flex items-center gap-1 text-violet-700">Open <ArrowRight size={16}/></span></a>)}
        </div>}
      </div></section>
      <section className="border-t bg-slate-50 py-12"><div className={wrap}><h2 className="text-2xl font-bold text-slate-950">Next step</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Explore lists","/lists"],["Test startup costs","/calculator/startup-cost"],["Read startup guides","/startup-guides"]].map(([title,href])=><a className={card} key={href} href={href}><h3 className="font-semibold">{title}</h3><span className="text-violet-700">Explore →</span></a>)}</div></div></section>
    </main>
  </V2Frame>;
}
