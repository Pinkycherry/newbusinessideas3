import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { founderTemplateBySlug, FOUNDER_TEMPLATES } from "@/data/template-library";
import { TEMPLATE_ARTICLES } from "@/data/template-articles";
import { getListsHub, getListPage, type ListPage } from "@/lib/lists.functions";
import { CustomerPersonaPage } from "@/components/v2/customer-persona-page";
import { CustomerInterviewPage } from "@/components/v2/customer-interview-page";
import { LeanCanvasPage } from "@/components/v2/lean-canvas-page";
import { OnePagePlanPage } from "@/components/v2/one-page-plan-page";
import { SaasPlanPage } from "@/components/v2/saas-plan-page";
import { CompetitiveAnalysisPage } from "@/components/v2/competitive-analysis-page";
import "@/components/v2/templates-directory.css";

export const Route = createFileRoute("/templates/$slug")({
  loader: async ({ params }) => {
    const template = founderTemplateBySlug(params.slug);
    const article = TEMPLATE_ARTICLES[params.slug];
    if (!template || (!article && params.slug !== "competitive-analysis")) throw notFound();
    let examples: { list: ListPage; idea: ListPage["ideas"][number] }[] = [];
    if (["customer-persona", "customer-interview", "lean-canvas", "one-page-business-plan", "saas-business-plan", "competitive-analysis"].includes(params.slug)) {
      const hub = await getListsHub();
      const categories = hub.categories;
      const softwareCategory = categories.find(category => /software|saas|tech|digital/i.test(category.name));
      const picks = params.slug === "saas-business-plan"
        ? [softwareCategory, categories[0], categories[Math.floor(categories.length / 2)]]
        : [categories[0], categories[Math.floor(categories.length / 2)], categories[categories.length - 1]];
      const uniquePicks = picks
        .filter((category): category is (typeof categories)[number] => Boolean(category))
        .filter((category, index, selected) => selected.findIndex(item => item.code === category.code) === index);
      const pages = await Promise.all(uniquePicks.map(category => getListPage({ data: { slug: category.subs[0]!.slug } })));
      examples = pages.filter((page): page is ListPage => Boolean(page)).flatMap(list => {
        const idea = list.ideas.find(item => item.who_pays_you && item.summary) || list.ideas[0];
        return idea ? [{ list, idea }] : [];
      });
    }
    return { template, article, examples };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.template.title ?? "Template"} Guide for Indian Founders | BusinessIdea.io` },
    { name: "description", content: loaderData?.template.short ?? "Practical founder template guide for India." },
    { property: "og:image", content: loaderData?.template.image.src ?? "/images/templates/indian-founder-business-planning-template-lean-canvas-businessidea.webp" },
    { property: "og:image:alt", content: loaderData?.template.image.alt ?? "Indian business planning templates help founders examine buyers and costs." },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: loaderData?.template.image.src ?? "/images/templates/indian-founder-business-planning-template-lean-canvas-businessidea.webp" },
  ] }),
  component: TemplateArticlePage,
});

function TemplateArticlePage() {
  const { template, article, examples } = Route.useLoaderData();
  if (template.slug === "customer-persona") return <CustomerPersonaPage examples={examples} />;
  if (template.slug === "customer-interview") return <CustomerInterviewPage examples={examples} />;
  if (template.slug === "lean-canvas") return <LeanCanvasPage examples={examples} />;
  if (template.slug === "one-page-business-plan") return <OnePagePlanPage examples={examples} />;
  if (template.slug === "saas-business-plan") return <SaasPlanPage examples={examples} />;
  if (template.slug === "competitive-analysis") return <CompetitiveAnalysisPage examples={examples} />;
  if (!article) return null;
  const related = FOUNDER_TEMPLATES.filter(item => item.slug !== template.slug).slice(0, 3);
  return <V2Frame active="/templates"><main className="tm-page tm-detail tm-article">
    <div className="tm-wrap"><nav className="tm-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={14}/><a href="/templates">Templates</a><ChevronRight size={14}/><span>{template.title}</span></nav></div>
    <section className="tm-wrap tm-detail-hero"><div><p className="tm-eyebrow">{template.group}</p><h1>{template.title}</h1><p className="tm-lead">{template.short} {template.outcome}</p><div className="tm-actions"><a className="tm-button tm-button-dark" href="#structure">Explore the template <ArrowRight size={17}/></a><a className="tm-button tm-button-light" href="/lists">Browse business ideas <ArrowRight size={17}/></a></div></div><img src={template.image.src} alt={template.image.alt} title={template.image.description} width={template.image.width} height={template.image.height} loading="eager" fetchPriority="high" /></section>
    <nav className="tm-article-nav" aria-label="On this page"><div className="tm-wrap">{[["overview","What it means"],["structure","Template sections"],["example","Indian example"],["method","How to check it"],["faq","Questions"]].map(([id,label])=><a href={`#${id}`} key={id}>{label}</a>)}</div></nav>
    <section id="overview" className="tm-detail-intro"><div className="tm-wrap tm-readable"><p className="tm-eyebrow">Understand the framework</p><h2>{template.title}: what it is for</h2><p>{article.definition}</p><p>{article.use}</p></div></section>
    <section id="structure" className="tm-article-structure"><div className="tm-wrap"><div className="tm-section-title"><p className="tm-eyebrow">Inside the template</p><h2>Follow the questions that matter.</h2><p>Each part comes from the framework's structure, adapted for a founder working in India. Check the question against an actual buyer or cost.</p></div>
      {article.chapters.map((chapter,index)=><article className="tm-article-chapter" key={chapter.title} id={`part-${index+1}`}><div className="tm-chapter-index">{String(index+1).padStart(2,"0")}</div><div><h3>{chapter.title}</h3><p>{chapter.explanation}</p><p className="tm-chapter-question"><strong>Ask yourself:</strong> {chapter.question}</p></div></article>)}
    </div></section>
    <section id="example" className="tm-article-example"><div className="tm-wrap tm-readable"><p className="tm-eyebrow">Put it in context</p><h2>What this looks like in a business decision</h2><p>{article.example}</p><a href="/lists" className="tm-text-link">Explore published business idea lists <ArrowRight size={18}/></a></div></section>
    <section id="method" className="tm-article-method"><div className="tm-wrap"><div className="tm-section-title"><p className="tm-eyebrow">Research playbook</p><h2>Move from a page to evidence.</h2></div><ol>{article.method.map(step=><li key={step}>{step}</li>)}</ol></div></section>
    <section className="tm-article-practice"><div className="tm-wrap"><p className="tm-eyebrow">Best practices</p><h2>Keep the useful part. Avoid the false confidence.</h2><div className="tm-practice-columns"><div><h3>Do this</h3><ul>{article.do.map(item=><li key={item}>{item}</li>)}</ul></div><div><h3>Avoid this</h3><ul>{article.avoid.map(item=><li key={item}>{item}</li>)}</ul></div></div></div></section>
    <section id="faq" className="tm-article-faq"><SellerFaq faq={article.faq} title="Common questions" /></section>
    <section className="tm-detail-next"><div className="tm-wrap"><p className="tm-eyebrow">Related templates</p><h2>Choose the next framework</h2><div className="tm-detail-related">{related.map(item=><a key={item.slug} href={`/templates/${item.slug}`}><span>{item.group}</span><strong>{item.title}</strong><small>{item.short}</small><ArrowRight size={19}/></a>)}</div></div></section>
    <section className="tm-article-resources"><div className="tm-wrap"><p className="tm-eyebrow">Related resources</p><h2>Keep the next decision close to the facts.</h2><div><a href="/lists">Business idea lists <ArrowRight size={18}/></a><a href="/calculator">Business calculators <ArrowRight size={18}/></a><a href="/startup-guides">Startup guides <ArrowRight size={18}/></a></div></div></section>
    <section className="tm-end"><div className="tm-wrap"><p className="tm-eyebrow">From framework to fieldwork</p><h2>A clearer question is your next move.</h2><p>Take the uncertainty you found here into a buyer conversation or a small, real-world test.</p><a className="tm-button tm-button-dark" href={template.slug === "customer-interview" ? "/lists" : "/templates/customer-interview"}>{template.slug === "customer-interview" ? "Explore business idea lists" : "Read the customer interview guide"} <ArrowRight size={17}/></a></div></section>
  </main></V2Frame>;
}
