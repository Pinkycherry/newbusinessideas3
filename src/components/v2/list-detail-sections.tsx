import { ArrowRight, BookOpen, Calculator, Compass, ShieldCheck } from 'lucide-react';
import { SellerFaq } from './faq';
import type { ListPage } from '@/lib/lists.functions';
import type { ContentLink } from './content-page';

const linkClass='group flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5';
function Links({items}:{items:ContentLink[]}) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><a key={item.href} className={linkClass} href={item.href}><span className="min-w-0 break-words">{item.label}{item.note&&<span className="mt-2 block text-xs font-normal leading-relaxed text-muted-foreground">{item.note}</span>}</span><ArrowRight className="shrink-0 text-primary" size={16}/></a>)}</div>;
}
const section='mt-12 scroll-mt-28';
const heading='mb-5 text-2xl font-bold';

export function ListReportPromo({p}:{p:ListPage}) {
  const guide=p.resources?.guides[0];
  if(!guide)return null;
  return <aside className="mb-8 flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center"><BookOpen className="shrink-0 text-primary" size={26}/><div className="min-w-0 flex-1"><h2 className="font-bold">{guide.label}</h2><p className="mt-1 text-sm text-muted-foreground">{guide.note}</p></div><a className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white" href={guide.href}>Read guide<ArrowRight size={16}/></a></aside>;
}

export function ListCitation({p,updated,path=`/lists/${p.slug}`}:{p:ListPage;updated:string;path?:string}) {
  return <section id="cite-this-page" className="mt-10 rounded-xl border bg-muted/20 p-5"><h2 className="text-base font-semibold">Cite this page</h2><p className="mt-2 break-words text-sm leading-7 text-muted-foreground">BusinessIdea.io. “{p.name}.” Updated {updated}. <a className="text-primary underline" href={path}>bbinewcopy.vercel.app{path}</a></p></section>;
}

export function ListDeeperAnswers({p}:{p:ListPage}) {
  const answers=[
    {q:'How do you pick an idea from this list?',a:p.howToChoose || p.intro,href:'/startup-idea-comparison'},
    {q:'What does it take to start?',a:p.ideas[0]?.what_you_need,href:'/startup-costs-india'},
    {q:'How does the business make money?',a:p.ideas[0]?.how_money_comes,href:'/business-demand-test-india'},
  ].filter(item=>item.a);
  return <><SellerFaq id="deeper-answers" title="Deeper answers founders ask for" faq={answers}/><section className={section}><h2 className={heading}>People also search for</h2><div className="flex flex-wrap gap-2">{p.siblings.map(item=><a key={item.slug} href={`/lists/${item.slug}`} className="rounded-full border bg-muted/30 px-4 py-2 text-sm transition hover:border-primary/50 hover:bg-primary/5">{item.name}</a>)}</div></section><aside className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-muted/30 p-5"><h2 className="text-lg font-bold">Explore tools for the next decision</h2><a className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white" href="/tools">Explore founder tools<ArrowRight size={16}/></a></aside><section className={section}><h2 className={heading}>For founders in India</h2><div className="grid gap-6 md:grid-cols-2"><div className="rounded-xl border bg-card p-5"><h3 className="mb-4 flex items-center gap-2 font-bold"><ShieldCheck size={19} className="text-primary"/>Practical founder resources</h3><Links items={[{label:'Startup costs in India',href:'/startup-costs-india'},{label:'Your first customer',href:'/first-customer-india'},{label:'Business models in India',href:'/business-models-india'}]}/></div><div className="rounded-xl border bg-card p-5"><h3 className="mb-4 font-bold">Learn before committing</h3><Links items={[{label:'Startup failure research',href:'/failed-startups/india'},{label:'Business idea risk check',href:'/business-idea-risk-check'},{label:'When to pivot or stop',href:'/business-idea-pivot-or-stop'}]}/></div></div></section></>;
}

export function ListBeforeBuild({p}:{p:ListPage}) {
  return <><section className={section}><h2 className={heading}>Before you build: check the data</h2><Links items={[{label:'Is it already being solved?',href:'/business-idea-research-india'},{label:'What should you charge?',href:'/business-pricing-india'},{label:'Where to find buyers',href:'/first-customer-india'},{label:'Compare business ideas',href:'/blueprints'}]}/></section>{p.ideas[0]&&<aside className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-6"><span className="text-xs font-semibold uppercase text-primary">Read the complete idea</span><h2 className="mt-2 text-xl font-bold">{p.ideas[0].title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.ideas[0].hook}</p><a href={`/idea/${p.ideas[0].slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Read idea<ArrowRight size={16}/></a></aside>}</>;
}

export function ListRelatedResources({p}:{p:ListPage}) {
  const groups=[
    {title:'Related guides',icon:BookOpen,items:p.resources?.guides ?? []},
    {title:'Related questions',icon:Compass,items:[{label:'How do you validate an idea?',href:'/startup-idea-validation'},{label:'How do you find a customer?',href:'/first-customer-india'},{label:'What can go wrong?',href:'/business-idea-risk-check'}]},
    {title:'Helpful tools and calculators',icon:Calculator,items:p.resources?.calculators ?? []},
    {title:'Compare options',icon:Compass,items:[{label:'Business models',href:'/business-models-india'},{label:'Compare ideas',href:'/startup-idea-comparison'},{label:'Founder frameworks',href:'/frameworks-comparison'}]},
    {title:'Related lists',icon:BookOpen,items:p.siblings.slice(0,4).map(s=>({label:s.name,href:`/lists/${s.slug}`}))},
  ];
  return <section className="bg-muted/30 py-12"><div className="mx-auto max-w-5xl px-4 md:px-6"><h2 className={heading}>Related resources</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{groups.filter(g=>g.items.length).map(group=><div key={group.title}><h3 className="mb-4 flex items-center gap-2 font-bold"><group.icon size={18} className="text-primary"/>{group.title}</h3><ul className="space-y-3">{group.items.map(item=><li key={item.href}><a className="text-sm leading-relaxed text-muted-foreground hover:text-primary hover:underline" href={item.href}>{item.label}</a></li>)}</ul></div>)}</div></div></section>;
}

export function ListRecentResearch({p}:{p:ListPage}) {
  const ideas=[...p.ideas].sort((a,b)=>(b.updated_at??'').localeCompare(a.updated_at??'')).slice(0,4);
  return <section className="mx-auto max-w-5xl px-4 py-12 md:px-6"><h2 className={heading}>Explore the latest published research</h2><Links items={ideas.map(idea=>({label:idea.title,href:`/idea/${idea.slug}`,note:idea.summary || idea.hook || ''}))}/><div className="mt-8 grid gap-6 md:grid-cols-2"><div className="rounded-xl border bg-card p-5"><h3 className="mb-3 font-bold">What to weigh before starting</h3><p className="text-sm leading-relaxed text-muted-foreground">{p.howToChoose || p.intro}</p></div><div className="rounded-xl border bg-card p-5"><h3 className="mb-3 font-bold">The idea's verdict</h3><p className="text-sm leading-relaxed text-muted-foreground">{p.ideas[0]?.verdict}</p></div></div><aside className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-primary/5 p-6"><div><h2 className="text-xl font-bold">Have a business idea?</h2><p className="mt-2 text-sm text-muted-foreground">{p.ideas[0]?.who_pays_you}</p></div><a className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white" href="/product">Validate your idea<ArrowRight size={16}/></a></aside></section>;
}
