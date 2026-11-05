import { IdeaArticle, type IdeaArticleField } from '@/components/v2/idea-article';
import { IDEA_PAGE as copy } from '@/config/idea-page';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/lib/schema';
import type { LegacyIdea, LegacyIdeaCard } from '@/lib/legacy-ideas.functions';

/** Both published catalogs share the seller article composition. No text is clipped. */
export function LegacyIdeaPage({ idea, related = [] }: { idea: LegacyIdea; related?: LegacyIdeaCard[] }) {
  const fields: IdeaArticleField[] = [
    {id:'idea-description',title:copy.description,text:idea.description},
    {id:'idea-market',title:copy.market,text:idea.marketOpportunity},
    {id:'idea-customer',title:copy.customer,text:idea.targetCustomer},
    {id:'idea-revenue',title:copy.revenue,text:idea.howMakeMoney},
    {id:'idea-needs',title:copy.cost,text:idea.startupCost},
    {id:'idea-income',title:copy.income,text:idea.incomePotential},
    {id:'idea-first-customer',title:copy.firstCustomer,text:idea.firstCustomer},
    {id:'idea-edge',title:copy.edge,text:idea.competitionEdge},
  ].filter(field=>field.text);
  const lists = [{label:'Business idea lists',href:'/lists'}];
  const breadcrumbs = [{label:'Home',href:'/'},{label:'Business ideas',href:'/blueprints'}];
  return <>
    <JsonLd schema={[articleSchema({path:'/idea/'+idea.slug,headline:idea.title,description:idea.summary || idea.description,datePublished:idea.createdAt,categoryName:idea.categoryName}),breadcrumbSchema([...breadcrumbs.map(item=>({name:item.label,path:item.href})),{name:idea.title,path:'/idea/'+idea.slug}])]} />
    <IdeaArticle data={{slug:idea.slug,title:idea.title,hook:'',summary:idea.summary,verdict:idea.verdict,breadcrumbs,fields,fit:[{id:'idea-founder-fit',title:copy.customer,text:idea.targetCustomer}],opportunities:idea.pros,risks:idea.cons,steps:idea.steps,tools:idea.tools,faq:idea.faq,related:related.map(item=>({label:item.title,href:`/idea/${item.slug}`,note:item.description})),lists,categoryName:idea.categoryName,published:idea.createdAt}}/>
  </>;
}
