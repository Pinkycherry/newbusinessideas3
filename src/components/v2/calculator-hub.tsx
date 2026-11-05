import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, ChevronRight, CircleDollarSign, Clock3, Gauge, Search, ShoppingCart, Target, TrendingUp, Users, Wallet } from "lucide-react";
import { V2Frame } from "./frame";
import { SellerFaq } from "./faq";
import { READY_CALCULATORS, isVerifiedCalculator, defaultInputs, readValues, type Calculator } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { guideImage } from "@/config/guide-imagery";
import type { ListsHub } from "@/lib/lists.functions";
import type { BlogPostCard } from "@/lib/blog-shared";
import "./calculator-hub.css";

const stages = [
  { id:"plan-cost", name:"Plan & Cost", test:(c:Calculator)=>/cost|break.even|runway|expense|budget|cash|profit|price|margin|working.capital|revenue/i.test(`${c.slug} ${c.title}`) },
  { id:"growth-unit", name:"Growth & Unit Economics", test:(c:Calculator)=>/customer|acquisition|lifetime|ltv|cac|roi|return|conversion|sales|retention|marketing|payback|unit/i.test(`${c.slug} ${c.title}`) },
  { id:"market-funding", name:"Market & Funding", test:(_c:Calculator)=>true },
];
const path = (c:Calculator)=>`/calculator/${encodeURIComponent(c.slug)}`;
function toolIcon(tool:Calculator) {
  const label=`${tool.slug} ${tool.title}`;
  if(/customer|cac|ltv|churn|retention|user/i.test(label))return <Users size={27}/>;
  if(/time|runway|payback|cycle/i.test(label))return <Clock3 size={27}/>;
  if(/market|tam|share|ratio|conversion|velocity/i.test(label))return <Target size={27}/>;
  if(/price|markup|margin|discount|revenue|sales/i.test(label))return <TrendingUp size={27}/>;
  if(/cost|spend|expense|burn|cash|capital|funding/i.test(label))return <Wallet size={27}/>;
  if(/cart|inventory|order|merchandise/i.test(label))return <ShoppingCart size={27}/>;
  if(/roi|return|profit|ebitda/i.test(label))return <CircleDollarSign size={27}/>;
  if(/rate|percentage/i.test(label))return <Gauge size={27}/>;
  return <BarChart3 size={27}/>;
}
function groupCalculators(items: Calculator[]) {
  const buckets: Calculator[][] = stages.map(()=>[]);
  items.forEach(c=>{const i=stages.findIndex(s=>s.test(c));buckets[i]?.push(c)});
  return buckets;
}
function imageRail(items: {title:string;url:string;image:string}[], label:string) {
  return <div className="calc-rail-viewport" aria-label={label}><div className="calc-rail">
    {[...items,...items].map((item,i)=><a href={item.url} key={`${item.url}-${i}`} aria-hidden={i>=items.length ? true : undefined} tabIndex={i>=items.length ? -1 : undefined} className="calc-rail-item"><img src={item.image} alt="" loading="lazy" width="320" height="180"/><strong>{item.title}</strong></a>)}
  </div></div>;
}
export function CalculatorHub({hub,posts}:{hub:ListsHub;posts:BlogPostCard[]}) {
  const [query,setQuery]=useState("");
  const root=useRef<HTMLDivElement>(null);
  const matching=READY_CALCULATORS.filter(c=>`${c.title} ${c.answers}`.toLowerCase().includes(query.trim().toLowerCase()));
  const buckets=groupCalculators(matching);
  const guides=STARTUP_GUIDES.map(g=>({title:g.title,url:`/startup-guides/${encodeURIComponent(g.slug)}`,image:guideImage(g.slug)?.src})).filter((g):g is {title:string;url:string;image:string}=>Boolean(g.image));
  const articles=posts.map(p=>({title:p.title,url:`/blog/${encodeURIComponent(p.slug)}`,image:p.image})).filter((p):p is {title:string;url:string;image:string}=>Boolean(p.image));
  useEffect(()=>{
    const host=root.current;
    if(!host || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{rootMargin:"0px 0px -8% 0px"});
    host.querySelectorAll('.calc-reveal, .calc-tool-row').forEach(el=>{el.classList.add('motion-ready');observer.observe(el)});
    return ()=>observer.disconnect();
  },[query]);
  const featuredCategories=[...hub.categories].sort((a,b)=>a.name.localeCompare(b.name)).slice(0,9);
  return <V2Frame active="/tools"><div className="calc-hub" ref={root}>
    <div className="calc-crumb"><a href="/">Home</a><ChevronRight size={15}/><span>Calculators</span></div>
    <section className="calc-hero"><div className="calc-inner calc-hero-grid"><div><span className="calc-kicker">Founder calculators</span><h1>Startup calculators</h1><p>Enter your own numbers, see the calculation, then explore the next question for your business.</p><div className="calc-actions"><a className="calc-primary" href="/calculator/startup-cost">Start with startup cost <ArrowRight size={17}/></a><a className="calc-secondary" href="#all-calculators">Explore calculators</a></div></div><div className="calc-hero-art" aria-hidden="true"><img src="/images/calculators/founder-calculators-hero.webp" alt="" width="840" height="630" fetchPriority="high"/></div></div></section>
    <section className="calc-section calc-reveal"><div className="calc-inner"><div className="calc-section-head"><span>Methodology</span><h2>Formulas behind the calculators</h2><p>Open a checked model to inspect its formula and change the inputs.</p></div><div className="calc-formulas">{READY_CALCULATORS.filter(isVerifiedCalculator).map(tool=>{const read=readValues(tool.fields,defaultInputs(tool));const formula=read.issues.length?null:tool.compute(read.values).find(x=>x.primary)?.formula;return <a key={tool.slug} href={`${path(tool)}#formula`}><strong>{tool.title}</strong><span>{formula||tool.answers}</span><ArrowRight size={17}/></a>})}</div></div></section>
    <section className="calc-journey calc-reveal"><div className="calc-inner"><div className="calc-section-head"><span>Find your path</span><h2>Choose the question first</h2></div><div className="calc-stage-nav">{stages.map(s=><a key={s.id} href={`#${s.id}`}>{s.name}<ArrowRight size={16}/></a>)}</div></div></section>
    <section className="calc-section" id="all-calculators"><div className="calc-inner"><label className="calc-search"><Search size={19}/><span className="sr-only">Search calculators</span><input type="search" placeholder="Search every calculator" value={query} onChange={e=>setQuery(e.target.value)}/></label>{!matching.length&&<p>No calculator matches this search.</p>}</div></section>
    {stages.map((stage,index)=><div key={stage.id}><section id={stage.id} className={`calc-stage calc-reveal ${index%2?'calc-alt':''}`}><div className="calc-inner"><div className="calc-section-head"><span>{stage.name}</span><h2>{stage.name}</h2></div><div className="calc-stage-list">{(buckets[index]??[]).map(tool=><a href={path(tool)} className={`calc-tool-row ${tool.slug==='break-even'?'calc-tool-lead':''}`} key={tool.slug}><span className="calc-tool-mark" aria-hidden="true">{tool.slug==='break-even'?<img src="/images/calculators/break-even-crossing.webp" alt="" width="104" height="90" loading="lazy"/>:toolIcon(tool)}</span><span className="calc-tool-copy"><strong>{tool.title} {tool.highlight}</strong>{isVerifiedCalculator(tool)&&<span>{tool.answers}</span>}</span><ArrowRight className="calc-tool-arrow" size={21}/></a>)}</div></div></section>
    {index===0&&guides.length>0&&<section className="calc-section calc-alt calc-reveal"><div className="calc-inner"><div className="calc-section-head"><span>Read further</span><h2>Startup guides</h2></div>{imageRail(guides,'Startup guides')}</div></section>}
    {index===1&&articles.length>0&&<section className="calc-section calc-reveal"><div className="calc-inner"><div className="calc-section-head"><span>From the blog</span><h2>Business articles</h2></div>{imageRail(articles,'Business articles')}</div></section>}</div>)}
    <section className="calc-section calc-reveal"><div className="calc-inner"><div className="calc-section-head"><span>Choose with care</span><h2>How to choose a calculator</h2><p>Pick the decision you need to make, then check the assumptions behind your inputs.</p></div><div className="calc-stage-nav">{stages.map(s=><a href={`#${s.id}`} key={s.id}>{s.name}<ArrowRight size={16}/></a>)}</div></div></section>
    <section className="calc-note calc-reveal"><div className="calc-inner"><h2>What these results can tell you</h2><p>A calculator uses the figures you enter. Read the formula and test those assumptions with real buyers before committing money.</p><a className="calc-primary" href="/business-demand-test-india">Test demand <ArrowRight size={17}/></a></div></section>
    <section className="calc-section calc-reveal"><div className="calc-inner"><div className="calc-section-head"><span>Explore ideas</span><h2>Business idea lists</h2></div><div className="calc-list-columns">{featuredCategories.map(c=><div key={c.code} className="calc-list-group"><a href={`/category/${encodeURIComponent(c.slug)}`} className="calc-list-title">{c.name}<ArrowRight size={16}/></a><div>{c.subs.slice(0,3).map(s=><a key={s.code} href={`/lists/${encodeURIComponent(s.slug)}`}>{s.name}</a>)}</div></div>)}</div><a className="calc-directory-link" href="/all-business-ideas">Explore the full business idea directory <ArrowRight size={18}/></a></div></section>
    <section className="calc-note calc-reveal"><div className="calc-inner"><h2>Numbers, or a decision?</h2><p>Use a calculator to frame the question. Then read the related ideas and guides before you act.</p><a className="calc-primary" href="/browse">Browse ideas <ArrowRight size={17}/></a></div></section>
    <SellerFaq faq={READY_CALCULATORS.filter(isVerifiedCalculator).map(tool=>({q:`What does the ${tool.title.toLowerCase()} calculate?`,a:<>{tool.answers} <a href={path(tool)}>Open calculator</a></>}))}/>
  </div></V2Frame>;
}
