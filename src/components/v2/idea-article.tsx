import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, Check, ShieldCheck, ThumbsUp, TriangleAlert } from 'lucide-react';
import { V2Frame } from './frame';
import { SellerFaq } from './faq';
import { ValidateButton } from '@/components/validate-button';
import { ShortlistToggle } from '@/components/founder-workspace/shortlist-toggle';
import { useFounderWorkspace, type WorkspaceIdea } from '@/lib/founder-workspace';
import { IDEA_PAGE as copy } from '@/config/idea-page';
import type { ContentLink } from './content-page';
import './idea-article.css';

export type IdeaArticleField = { id: string; title: string; text?: string; items?: string[] };
export type IdeaArticleData = {
  slug: string; title: string; hook: string; summary: string; verdict: string;
  breadcrumbs: ContentLink[]; fields: IdeaArticleField[]; fit: IdeaArticleField[];
  opportunities: string[]; risks: string[]; steps: string[]; tools: string[];
  faq: { q: string; a: string }[]; related: ContentLink[]; lists: ContentLink[];
  prompt?: string; categoryName?: string; published?: string | null;
};

/** Full source text is preserved, including paragraph and list breaks. */
function Prose({ text }: { text: string }) {
  return <div className="seller-idea-prose">{text.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>;
}
function ArticleSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="seller-idea-section"><h2>{title}</h2>{children}</section>;
}
function Field({ field }: { field: IdeaArticleField }) {
  if (!field.text && !field.items?.length) return null;
  return <ArticleSection id={field.id} title={field.title}>{field.text && <Prose text={field.text}/ >}{field.items?.length ? <ul className="seller-idea-bullets">{field.items.map((item, index) => <li key={index}>{item}</li>)}</ul> : null}</ArticleSection>;
}
function LinkGroup({ title, links }: { title: string; links: ContentLink[] }) {
  return <div><h3>{title}</h3><ul>{links.map(link => <li key={link.href}><a href={link.href}>{link.label}<ArrowRight size={15}/></a>{link.note && <p>{link.note}</p>}</li>)}</ul></div>;
}

export function IdeaArticle({ data }: { data: IdeaArticleData }) {
  const browseList = data.lists[0]?.href ?? '/lists';
  const { shortlist } = useFounderWorkspace();
  const workspaceIdea: WorkspaceIdea = {
    slug: data.slug,
    title: data.title,
    hook: data.hook,
    summary: data.summary,
    description: data.summary,
    categoryName: data.categoryName,
    targetCustomer: data.fields.find(field => /buyer|customer|who pays/i.test(field.title))?.text,
    revenueModel: data.fields.find(field => /revenue|money|pricing/i.test(field.title))?.text,
    startupCost: data.fields.find(field => /cost|capital|investment/i.test(field.title))?.text,
    risks: data.risks.join('; ').slice(0, 1200),
    firstSteps: data.steps.slice(0, 8),
  };
  return <V2Frame>
    <div className="seller-idea">
      <nav className="seller-idea-breadcrumb" aria-label="Breadcrumb">{data.breadcrumbs.map(link => <span key={link.href}><a href={link.href}>{link.label}</a><ChevronRight size={14}/></span>)}<span aria-current="page">{data.title}</span></nav>
      <article className="seller-idea-body">
        <header className="seller-idea-header">
          <div className="seller-idea-badges"><span>{copy.badge}</span>{data.categoryName && <span>{data.categoryName}</span>}</div>
          <h1>{data.title}</h1>
          {data.hook && <Prose text={data.hook}/>}
          <div className="seller-idea-actions"><a className="seller-idea-primary" href="#idea-validate">{copy.validate}<ArrowRight size={17}/></a><a className="seller-idea-secondary" href={browseList}>Browse related ideas</a></div>
          <div className="mt-4 flex flex-wrap items-center gap-3"><ShortlistToggle idea={workspaceIdea}/><a href={shortlist.length>=2?"/startup-idea-comparison":"/browse"} className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-500">{shortlist.length>=2?`Compare saved ideas (${shortlist.length}/4)`:"Find ideas to compare"}</a></div>
          <div className="seller-idea-source"><ShieldCheck size={18}/><div><a href="/about">BusinessIdea.io</a>{data.published && <span> · Published {new Date(data.published).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</span>}<p>Read the business, buyer, costs and risks before deciding what to test.</p></div></div>
        </header>
        <section id="idea-summary" className="seller-idea-summary"><h2>{copy.summary}</h2><Prose text={data.summary}/></section>
        {data.verdict && <ArticleSection id="idea-verdict" title={copy.verdict}><div className="seller-idea-callout"><Prose text={data.verdict}/></div></ArticleSection>}
        <nav className="seller-idea-jump-grid" aria-label="Read this idea">{[...data.fields, ...data.fit].filter(field=>field.text||field.items?.length).map(field=><a key={field.id} href={`#${field.id}`}>{field.title}<ArrowRight size={14}/></a>)}</nav>
        {data.fields.map(field=><Field key={field.id} field={field}/>)}
        <ArticleSection id="idea-assessment" title={copy.score}><p className="seller-idea-intro">The score is a screening signal for a business model in general, not a verdict on your specific version of it in your market.</p><div className="seller-idea-assessment">{[
          ['Capital efficiency', '#idea-needs', 'Check startup costs'],
          ['Speed to first revenue', '#idea-first-customer', 'Find your first customer'],
          ['Execution difficulty', '#idea-skills', 'Check skills and experience'],
          ['Margin quality', '#idea-revenue', 'Examine the money model'],
          ['Time load', '#idea-time', 'Check the work involved'],
        ].map(([label, target, action])=><div key={label}><h3>{label}</h3><a href={data.fields.some(f=>`#${f.id}`===target)||data.fit.some(f=>`#${f.id}`===target) ? target : label==='Speed to first revenue'?'/first-customer-india':label==='Execution difficulty'?'/business-idea-risk-check':'/business-idea-time-fit'}>{action}<ArrowRight size={15}/></a></div>)}</div></ArticleSection>
        <section id="idea-opportunities-risks" className="seller-idea-section seller-idea-risk-columns"><div><h2><ThumbsUp size={21}/>{copy.opportunities}</h2>{data.opportunities.length ? <ul className="seller-idea-icon-list">{data.opportunities.map((text,i)=><li key={i}><Check size={18}/><Prose text={text}/></li>)}</ul> : <a href="/business-demand-test-india">Test the demand for your offer <ArrowRight size={15}/></a>}</div><div><h2><TriangleAlert size={21}/>{copy.risks}</h2><ul className="seller-idea-icon-list">{data.risks.map((text,i)=><li key={i}><TriangleAlert size={18}/><Prose text={text}/></li>)}</ul></div></section>
        {data.steps.length > 0 && <ArticleSection id="idea-first-steps" title={copy.steps}><ol className="seller-idea-steps">{data.steps.map((step,i)=><li key={i}><Prose text={step}/></li>)}</ol><aside className="seller-idea-callout"><h3>Decide your stopping point in advance</h3><a href="/business-idea-pivot-or-stop">Work through the pivot or stop guide <ArrowRight size={16}/></a></aside></ArticleSection>}
        {data.tools.length > 0 && <Field field={{id:'idea-tools', title:copy.tools, items:data.tools}}/>}
        <ArticleSection id="idea-fit" title={copy.fit}>{data.fit.map(field=><Field key={field.id} field={field}/>)}</ArticleSection>
        <section id="idea-validate" className="seller-idea-section seller-idea-validation"><h2>{copy.validate}</h2><ValidateButton slug={data.slug}/><a className="seller-idea-guide" href="/startup-guides">Read a startup guide for your next step <ArrowRight size={16}/></a></section>
        {data.prompt && <ArticleSection id="idea-research-prompt" title={copy.prompt}><Prose text={data.prompt}/></ArticleSection>}
        <SellerFaq title={copy.faq} faq={data.faq} id="idea-faq"/>
        <ArticleSection id="idea-related" title={copy.similar}><div className="seller-idea-related">{(data.related.length ? data.related : data.lists).map(link=><a key={link.href} href={link.href}><h3>{link.label}</h3>{link.note && <p>{link.note}</p>}<span>Read more <ArrowRight size={15}/></span></a>)}</div></ArticleSection>
        <section id="idea-failure-research" className="seller-idea-section seller-idea-callout"><h2>{copy.failure}</h2>{data.risks.map((risk,i)=><Prose key={i} text={risk}/>)}<a href="/failed-startups/india">Read the startup failure research <ArrowRight size={16}/></a></section>
        <nav className="seller-idea-backlinks" aria-label="Continue browsing"><a href="/browse"><ArrowLeft size={16}/>All business ideas</a><a href={browseList}>Deeper list for this category<ArrowRight size={16}/></a></nav>
        <section id="idea-resources" className="seller-idea-section seller-idea-resources"><h2>{copy.onward}</h2><div className="seller-idea-resource-grid"><LinkGroup title="Start from the hub" links={[{label:'All business ideas',href:'/all-business-ideas'},{label:'Business idea lists',href:'/lists'},...data.lists.slice(0,2)]}/><LinkGroup title="Compare your options" links={[{label:'Compare business models',href:'/business-models-india'},{label:'Compare business ideas',href:'/startup-idea-comparison'},{label:'Check unit economics',href:'/unit-economics-india'},{label:'Check startup costs',href:'/startup-costs-india'}]}/><LinkGroup title="Go deeper" links={[{label:'Startup guides',href:'/startup-guides'},{label:'Startup failure research',href:'/failed-startups/india'},{label:'Founder glossary',href:'/founder-glossary'},{label:'Founder tools',href:'/tools'}]}/></div></section>
      </article>
    </div>
  </V2Frame>;
}
