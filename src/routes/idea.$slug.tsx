import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { SellerHero } from "@/components/v2/content-page";
import { IdeaArticle, type IdeaArticleField } from "@/components/v2/idea-article";
import { IDEA_PAGE as copy } from "@/config/idea-page";
import { LegacyIdeaPage } from "@/components/legacy-idea";
import { categoryImage } from "@/config/category-imagery";
import { getLegacyIdea, getLegacyIdeaCards } from "@/lib/legacy-ideas.functions";
import { getBrowseIdeas } from "@/lib/browse.functions";
import type { IdeaCard } from "@/lib/ideas.functions";
import { absoluteUrl } from "@/lib/schema";
import { BAND_LABEL, MODE_LABEL, SKILL_LABEL, TIME_LABEL, getIdea, getIdeaPlace, getSubcategoryIdeas } from "@/lib/ideas.functions";

const ideaQuery = (slug: string) => queryOptions({
  queryKey: ["idea", slug],
  queryFn: () => getIdea({ data: { slug } }),
  staleTime: 60_000,
});

const legacyQuery = (slug: string) => queryOptions({
  queryKey: ["legacy-idea", slug],
  queryFn: () => getLegacyIdea({ data: { slug } }),
  staleTime: 60_000,
});

export const Route = createFileRoute("/idea/$slug")({
  loader: async ({ context, params }) => {
    const idea = await context.queryClient.ensureQueryData(ideaQuery(params.slug));
    if (idea) {
      const [related, place] = await Promise.all([getSubcategoryIdeas({ data: { code: idea.subcategory_code } }), getIdeaPlace({data:{category:idea.category_code,subcategory:idea.subcategory_code}})]);
      return { kind: "new" as const, idea, place, related: related.filter(item => item.slug !== idea.slug).slice(0,4), title: idea.title, summary: idea.summary, image: categoryImage(place.category?.slug ?? "") };
    }
    const legacy = await context.queryClient.ensureQueryData(legacyQuery(params.slug));
    if (!legacy) {
      const result = await getBrowseIdeas({ data: { q: "", category: "", investment: "", time: "", skill: "", page: 1 } });
      return { kind: "missing" as const, ideas: result.ideas.slice(0, 6), title: "Idea not published", summary: "Explore recently published ideas from the library.", image: undefined };
    }
    const related = await getLegacyIdeaCards({data:{q:'',page:1}});
    return { kind: "legacy" as const, idea: legacy, related: related.items.filter(item=>item.slug!==legacy.slug).slice(0,4), title: legacy.seoTitle || legacy.title, summary: legacy.metaDescription || legacy.summary, image: categoryImage(legacy.categorySlug) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Business idea"} | BusinessIdea.io` },
      { name: "description", content: loaderData?.summary ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:image", content: loaderData?.image ? absoluteUrl(loaderData.image.src) : undefined },
      { property: "og:image:alt", content: loaderData?.image?.alt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: loaderData?.image ? absoluteUrl(loaderData.image.src) : undefined },
    ],
  }),
  component: IdeaPage,
  notFoundComponent: () => <V2Frame><SellerHero breadcrumbs={[{label:"Home",href:"/"}]} badge="IDEA LIBRARY" title="This idea could not load." intro="Browse the published library." primary={{label:"Browse ideas",href:"/browse"}} /></V2Frame>,
  errorComponent: () => <V2Frame><SellerHero breadcrumbs={[{label:"Home",href:"/"}]} badge="IDEA LIBRARY" title="This idea could not load." intro="Please try again shortly." primary={{label:"Browse ideas",href:"/browse"}} /></V2Frame>,
});

function UnavailableIdea({ ideas }: { ideas: IdeaCard[] }) {
  return <V2Frame active="/browse">
    <div className="pt-24 lg:pt-28"><SellerHero breadcrumbs={[{label:"Home",href:"/"},{label:"Browse",href:"/browse"}]} badge="IDEA LIBRARY" title="This idea is not published." intro="Explore published ideas from the library." primary={{label:"Browse ideas",href:"/browse"}} /></div>
    <section className="bg-slate-50 py-12 lg:py-16"><div className="mx-auto max-w-6xl px-4 md:px-6"><h2 className="text-3xl font-bold">Recently published ideas</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <a key={idea.slug} href={`/idea/${idea.slug}`} className="rounded-2xl border bg-white p-6 shadow-sm transition hover:border-blue-500"><h3 className="text-xl font-bold">{idea.title}</h3><p className="mt-3 line-clamp-3 text-slate-600">{idea.hook || idea.summary}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Read idea <ArrowRight size={17}/></span></a>)}</div></div></section>
  </V2Frame>;
}

function IdeaPage() {
  const data = Route.useLoaderData();
  if (data.kind === "missing") return <UnavailableIdea ideas={data.ideas} />;
  if (data.kind === "legacy") return <LegacyIdeaPage idea={data.idea} related={data.related} />;
  const { idea, related } = data;
  const where = data.place;
  const breadcrumbs = [{label:"Home",href:"/"},{label:"Browse",href:"/browse"},...(where.category ? [{label:where.category.name,href:`/category/${where.category.slug}`}] : []),...(where.subcategory ? [{label:where.subcategory.name,href:`/lists/${where.subcategory.slug}`}] : [])];
  const fields = [
    {id:'idea-description',title:copy.description,text:idea.what_it_is},
    {id:'idea-customer',title:copy.customer,text:idea.who_pays_you},
    {id:'idea-revenue',title:copy.revenue,text:idea.how_money_comes},
    {id:'idea-needs',title:copy.needs,text:idea.what_you_need},
  ].filter(field=>field.text);
  const fit: IdeaArticleField[] = [
    {id:'idea-investment',title:copy.investment,text:BAND_LABEL[idea.investment_band] || idea.investment_band},
    {id:'idea-time',title:copy.time,text:TIME_LABEL[idea.time_needed] || idea.time_needed},
    {id:'idea-skills',title:copy.skill,text:SKILL_LABEL[idea.skill_level] || idea.skill_level},
    {id:'idea-work-mode',title:copy.mode,text:MODE_LABEL[idea.work_mode] || idea.work_mode},
    {id:'idea-gender-fit',title:copy.gender,text:idea.gender_fit?.replaceAll('_',' ')},
    {id:'idea-life-stage',title:copy.lifeStage,items:idea.life_stage},
    {id:'idea-places',title:copy.place,items:idea.place},
  ];
  const lists = where.subcategory ? [{label:where.subcategory.name,href:`/lists/${where.subcategory.slug}`}] : [];
  return <IdeaArticle data={{slug:idea.slug,title:idea.title,hook:idea.hook,summary:idea.summary,verdict:idea.verdict,breadcrumbs,fields,fit,opportunities:[],risks:[idea.what_hurts].filter(Boolean),steps:idea.first_30_days ?? [],tools:[],faq:idea.faq ?? [],related:related.map(item=>({label:item.title,href:`/idea/${item.slug}`,note:item.hook})),lists,prompt:idea.validate_prompt,categoryName:where.category?.name,published:idea.created_at}}/>;
}
