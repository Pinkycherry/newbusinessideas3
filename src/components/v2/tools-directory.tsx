import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight, ExternalLink, Globe2, Search, Sparkles, Wrench } from "lucide-react";
import externalData from "@/data/external-tools.json";
import { V2Frame } from "./frame";
import { SellerFaq } from "./faq";
import { READY_CALCULATORS } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { guideImage } from "@/config/guide-imagery";
import type { ListsHub } from "@/lib/lists.functions";
import type { BlogPostCard } from "@/lib/blog-shared";
import "./tools-directory.css";

type Tool = (typeof externalData.tools)[number];
type Category = (typeof externalData.categories)[number];
const stages = [
  { id: "stage-validate", title: "Validate", intro: "Test the idea before you build it." },
  { id: "stage-design", title: "Design", intro: "Brand, visuals and product UI." },
  { id: "stage-build", title: "Build", intro: "Ship the product without a big team." },
  { id: "stage-launch", title: "Launch", intro: "Get the first users and press." },
  { id: "stage-grow", title: "Grow", intro: "Acquire, convert and retain." },
  { id: "stage-operate", title: "Operate", intro: "Run the business and raise capital." },
] as const;
const retired = new Set(["alexa.com", "edgewebfonts.adobe.com", "console.appfog.com", "aerobatic.com"]);
const toolList = externalData.tools.filter(tool => !retired.has(new URL(tool.url).hostname.replace(/^www\./, "")));
const byCategory = new Map<string, Tool[]>();
for (const tool of toolList) {
  const items = byCategory.get(tool.category) ?? [];
  items.push(tool);
  byCategory.set(tool.category, items);
}
for (const items of byCategory.values()) items.sort((a, b) => b.name.localeCompare(a.name));
const featuredCalculators = READY_CALCULATORS.filter(c => ["startup-cost", "break-even", "roi", "funding-needed"].includes(c.slug));

function ToolCard({ tool }: { tool: Tool }) {
  const host = new URL(tool.url).hostname.replace(/^www\./, "");
  return <a className="td-tool" href={tool.url} target="_blank" rel="noopener noreferrer nofollow" aria-label={`Visit ${tool.name} (external site)`}>
    <span className="td-tool-top"><span className="td-logo"><Globe2 size={20} aria-hidden="true" /><img src={tool.logo} alt="" loading="lazy" width="32" height="32" onError={e => { e.currentTarget.style.display = "none"; }} /></span>
      <span className="td-tool-identity"><strong>{tool.name}</strong><small>{host}</small></span><ExternalLink size={15} className="td-external" aria-hidden="true" /></span>
    <span className="td-tool-desc">{tool.description}</span><span className="td-tier">Free tier</span>
  </a>;
}
function CategoryBlock({ category, query }: { category: Category; query: string }) {
  const [expanded, setExpanded] = useState(false);
  const items = (byCategory.get(category.id) ?? []).filter(tool => !query || `${tool.name} ${tool.description} ${category.title}`.toLowerCase().includes(query));
  if (!items.length) return null;
  const shown = query || expanded ? items : items.slice(0, 6);
  return <div id={category.id} className="td-category td-reveal">
    <div className="td-category-head"><div><h3>{category.title}</h3><p>{category.intro}</p></div></div>
    <div className="td-grid">{shown.map(tool => <ToolCard key={tool.url} tool={tool} />)}</div>
    {!query && items.length > 6 && <button type="button" className="td-more" onClick={() => setExpanded(!expanded)}>{expanded ? `Show fewer ${category.title} tools` : `Show all ${category.title} tools`} <ArrowRight size={16} /></button>}
  </div>;
}
function ImageRail({ items, title }: { items: { title: string; href: string; image: string }[]; title: string }) {
  if (!items.length) return null;
  return <div className="td-rail-wrap" aria-label={title}><div className="td-rail">
    {[...items, ...items].map((item, i) => <a href={item.href} key={`${item.href}-${i}`} className="td-rail-card" aria-hidden={i >= items.length ? true : undefined} tabIndex={i >= items.length ? -1 : undefined}>
      <img src={item.image} alt="" loading="lazy" width="340" height="190" /><strong>{item.title}</strong>
    </a>)}
  </div></div>;
}

export function ToolsDirectory({ hub, posts }: { hub: ListsHub; posts: BlogPostCard[] }) {
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const search = query.trim().toLowerCase();
  const guides = STARTUP_GUIDES.map(g => ({ title: g.title, href: `/startup-guides/${encodeURIComponent(g.slug)}`, image: guideImage(g.slug)?.src })).filter((g): g is { title: string; href: string; image: string } => Boolean(g.image));
  const articles = posts.map(p => ({ title: p.title, href: `/blog/${encodeURIComponent(p.slug)}`, image: p.image })).filter((p): p is { title: string; href: string; image: string } => Boolean(p.image));
  useEffect(() => {
    const host = root.current;
    if (!host || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { rootMargin: "0px 0px -5% 0px" });
    host.querySelectorAll(".td-reveal").forEach(el => { el.classList.add("motion-ready"); observer.observe(el); });
    return () => observer.disconnect();
  }, [query]);
  const categories = externalData.categories;
  const faq = [
    { q: "Where do these external tools go?", a: "The tool cards open their providers' sites in a new tab. Their features, free tiers and availability can change, so check the provider before relying on one." },
    { q: "Which tools are part of bbusiness.online?", a: "Our business calculators are linked in their own section. The external directory cards belong to their respective providers." },
    { q: "How should I choose a tool?", a: "Start with the decision you need to make. Read the relevant idea list or guide, then choose a tool that helps test that question." },
  ];
  return <V2Frame active="/tools"><div className="td-page" ref={root}>
    <nav className="td-crumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15} /><span>Tools</span></nav>
    <section className="td-hero"><div className="td-inner td-hero-grid"><div><span className="td-kicker">Founder resources</span><h1>Tools for the question in front of you</h1><p>Find a tool for the work you need to do today. Explore providers, then use our calculators, idea lists and guides to decide what is worth trying.</p><div className="td-actions"><a className="td-primary" href="#tool-search">Explore tools <ArrowRight size={17} /></a><a className="td-secondary" href="/business-demand-test-india">Validate your idea</a></div></div><div className="td-hero-art"><img src="/images/tools/founder-tools-hero.webp" alt="Two Indian founders working with a laptop, notebook and calculator" width="1448" height="1086" fetchPriority="high" /></div></div></section>
    <section className="td-section td-reveal" id="tool-search"><div className="td-inner"><label className="td-search"><Search size={19} /><span className="sr-only">Search tools</span><input type="search" placeholder="Search tools by name or use" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="td-summary"><strong>Start with the need.</strong><p>Search by tool or task, or choose the stage you are in. External services set their own features and prices, so check the provider before you commit.</p></div></div></section>
    <section className="td-section td-reveal"><div className="td-inner"><div className="td-heading"><span>Founder journey</span><h2>Choose your stage</h2><p>Find the kind of work you are doing now.</p></div><div className="td-stage-nav">{stages.map(s => <a href={`#${s.id}`} key={s.id}><strong>{s.title}</strong><small>{s.intro}</small><ArrowRight size={18} /></a>)}</div></div></section>
    <section className="td-section td-reveal"><div className="td-inner"><div className="td-heading"><span>Find a category</span><h2>Browse tool categories</h2></div><nav className="td-chips" aria-label="Tool categories">{categories.map(c => <a href={`#${c.id}`} key={c.id}>{c.title}</a>)}</nav></div></section>
    <section className="td-feature td-reveal"><div className="td-inner td-feature-grid"><div><span className="td-kicker">Explore ideas</span><h2>Choose a business direction before choosing a stack.</h2><p>Our category and subcategory pages connect the question to real published idea lists.</p><a className="td-primary" href="/all-business-ideas">Explore business ideas <ArrowRight size={17} /></a></div><div className="td-taxonomy">{hub.categories.slice(0, 8).map(c => <a href={`/category/${encodeURIComponent(c.slug)}`} key={c.slug}>{c.name}<ArrowRight size={16} /></a>)}</div></div></section>
    <section className="td-section td-reveal"><div className="td-inner"><div className="td-heading"><span>Our tools</span><h2>Run the numbers on bbusiness.online</h2><p>Use working calculators with your own figures and inspect the formula on the result page.</p></div><div className="td-native">{featuredCalculators.map(c => <a href={`/calculator/${encodeURIComponent(c.slug)}`} key={c.slug}><Wrench size={25} /><strong>{c.title}</strong><span>{c.answers}</span><ArrowRight size={17} /></a>)}</div><a href="/calculator" className="td-text-link">Explore every calculator <ArrowRight size={16} /></a></div></section>
    <div className="td-directory">{stages.map((stage, index) => <div key={stage.id}>
      <section className="td-stage td-reveal" id={stage.id}><div className="td-inner"><div className="td-heading"><span>Founder stage</span><h2>{stage.title}</h2><p>{stage.intro}</p></div>{categories.filter(c => c.stage === stage.id).map(c => <CategoryBlock key={c.id} category={c} query={search} />)}</div></section>
      {index === 1 && <section className="td-interlude td-reveal"><div className="td-inner"><div className="td-heading"><span>Read further</span><h2>Startup guides</h2></div><ImageRail title="Startup guides" items={guides} /><a href="/startup-guides" className="td-text-link">Explore guides <ArrowRight size={16} /></a></div></section>}
      {index === 3 && <section className="td-interlude td-reveal"><div className="td-inner"><div className="td-heading"><span>Published articles</span><h2>From the blog</h2></div><ImageRail title="Business articles" items={articles} /><a href="/blog" className="td-text-link">Explore articles <ArrowRight size={16} /></a></div></section>}
    </div>)}</div>
    <section className="td-section td-reveal"><div className="td-inner"><div className="td-heading"><span>Choose with care</span><h2>Use a tool for a real question</h2></div><div className="td-editorial"><p>Start with what you need to learn about buyers, cost or demand. Try the tool that answers that question and read its provider terms before investing time in it.</p><a href="/business-demand-test-india">Test demand first <ArrowRight size={16} /></a></div></div></section>
    <section className="td-section td-reveal"><div className="td-inner"><div className="td-heading"><span>How this directory works</span><h2>External tools and our resources</h2></div><p className="td-copy">The directory groups external services by the job they help with. Our calculators, articles, guides, categories and idea lists sit alongside them to help you make a decision. Check a provider's current status and pricing before you use its service.</p></div></section>
    <SellerFaq faq={faq} />
    <section className="td-cta td-reveal"><div className="td-inner"><Sparkles size={28} /><h2>Ready to test the idea behind your tool stack?</h2><p>Use our demand test, then compare ideas and numbers before you commit.</p><a href="/business-demand-test-india" className="td-primary">Validate your idea <ArrowRight size={17} /></a></div></section>
  </div></V2Frame>;
}
