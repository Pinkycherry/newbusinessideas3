import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Search } from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { getListsHub } from "@/lib/lists.functions";

export const Route = createFileRoute("/all-business-ideas")({
  loader: () => getListsHub(),
  head: () => ({ meta: [
    { title: "All Business Idea Lists | BusinessIdea.io" },
    { name: "description", content: "Search every published business idea list and filter the library by category." },
  ] }),
  component: AllBusinessIdeasPage,
});

const wrap = "mx-auto max-w-6xl px-4 md:px-6";

function AllBusinessIdeasPage() {
  const hub = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const needle = query.trim().toLocaleLowerCase();
  const groups = useMemo(() => hub.categories.map(group => ({
    ...group,
    subs: group.subs.filter(item => !needle || `${item.name} ${group.name}`.toLocaleLowerCase().includes(needle)),
  })).filter(group => (category === "all" || group.code === category) && group.subs.length), [hub.categories, category, needle]);

  return <V2Frame active="/lists">
    <div className="bg-muted/30 pt-24 lg:pt-28"><nav aria-label="Breadcrumb" className={`${wrap} flex items-center gap-2 py-3 text-sm`}><a href="/" className="text-muted-foreground hover:text-primary">Home</a><ChevronRight size={15}/><a href="/lists" className="text-muted-foreground hover:text-primary">Lists</a><ChevronRight size={15}/><span>All business ideas</span></nav></div>
    <section className="bg-gradient-to-b from-amber-500/10 to-background py-10 lg:py-14"><div className={wrap}><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide">Complete index</span><h1 className="mt-4 max-w-3xl text-3xl font-bold md:text-5xl">All business idea lists</h1><p className="mt-4 max-w-2xl text-muted-foreground">Search the complete published list library or narrow it by category.</p></div></section>
    <section className="py-8 lg:py-10"><div className={wrap}><label className="flex min-h-12 items-center gap-3 rounded-xl border bg-card px-4 shadow-sm"><Search size={20} className="shrink-0 text-muted-foreground"/><span className="sr-only">Search all business idea lists</span><input className="min-w-0 flex-1 bg-transparent py-3 outline-none" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search lists or categories"/></label><div className="mt-5 flex flex-wrap gap-2" aria-label="Filter lists by category"><button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/60 ${category === "all" ? "bg-slate-900 text-white" : "bg-card"}`}>All categories</button>{hub.categories.map(group => <button type="button" key={group.code} onClick={() => setCategory(group.code)} aria-pressed={category === group.code} className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/60 ${category === group.code ? "bg-slate-900 text-white" : "bg-card"}`}>{group.name}</button>)}</div></div></section>
    <main className="pb-12 lg:pb-16"><div className={wrap}>{groups.map(group => <section key={group.code} className="scroll-mt-28 py-8"><h2 className="text-2xl font-bold">{group.name}</h2><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{group.subs.map(item => <a key={item.code} href={`/lists/${item.slug}`} className="group flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 font-semibold leading-snug shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-md"><span className="min-w-0 break-words">{item.name}</span><ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5"/></a>)}</div></section>)}{groups.length === 0 && <div className="rounded-xl border bg-muted/30 p-6"><h2 className="font-semibold">No matching list</h2><p className="mt-2 text-sm text-muted-foreground">Try another search or choose a different category.</p></div>}</div></main>
  </V2Frame>;
}
