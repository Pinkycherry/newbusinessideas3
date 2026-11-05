import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { dbOrNull } from './db';
import { faqEntries, uniqueFaqBySource, getListResources, type ListIdea, type ListPage } from './lists.functions';

type CategoryPageData=ListPage & {short:string;subs:{name:string;slug:string;count:number}[];total:number};

/** Database labels, slugs, published ideas and FAQs; category renames require no page edits. */
export const getCategoryPage=createServerFn({method:'GET'})
 .inputValidator((input:unknown)=>z.object({slug:z.string().min(1).max(200)}).parse(input))
 .handler(async({data}):Promise<CategoryPageData|null>=>{
  const db=dbOrNull();if(!db)return null;
  const {data:category,error}=await db.from('categories').select('code,name,short_name,slug').eq('slug',data.slug).maybeSingle();
  if(error)throw error;if(!category)return null;
  const cat=category as {code:string;name:string;short_name:string;slug:string};
  type Sub={code:string;name:string;slug:string;intro:string|null;how_to_choose:string|null;faq:unknown};
  const subRows:Sub[]=[];
  for(let from=0;;from+=1000){const r=await db.from('subcategories').select('code,name,slug,intro,how_to_choose,faq').eq('category_code',cat.code).order('position').range(from,from+999);if(r.error)throw r.error;subRows.push(...(r.data??[]) as Sub[]);if(!r.data||r.data.length<1000)break;}
  const rows:(ListIdea&{subcategory_code:string})[]=[];
  for(let from=0;;from+=1000){const r=await db.from('ideas').select('slug,title,hook,summary,who_pays_you,how_money_comes,what_you_need,what_hurts,verdict,investment_band,time_needed,skill_level,updated_at,subcategory_code,faq').eq('category_code',cat.code).eq('status','published').order('position').order('code').range(from,from+999);if(r.error)throw r.error;rows.push(...(r.data??[]) as (ListIdea&{subcategory_code:string})[]);if(!r.data||r.data.length<1000)break;}
  const counts=new Map<string,number>();for(const idea of rows)counts.set(idea.subcategory_code,(counts.get(idea.subcategory_code)??0)+1);
  const subs=subRows.filter(sub=>counts.has(sub.code)).map(sub=>({name:sub.name,slug:sub.slug,count:counts.get(sub.code)??0}));
  const primary=subRows.flatMap(sub=>faqEntries(sub.faq).map(entry=>({...entry,href:`/lists/${sub.slug}`})));
  return {code:cat.code,name:cat.name,short:cat.short_name||cat.name,slug:cat.slug,categoryName:cat.name,categorySlug:cat.slug,
    intro:'Choose a focused path, then read each idea’s buyer, work and risks before testing a small next step.',
    howToChoose:'Compare a focused list, then test the costs and demand in your setting.',
    ideas:rows,subs,siblings:subs,total:rows.length,totalIdeas:rows.length,
    faq:uniqueFaqBySource(primary,rows.map(idea=>faqEntries(idea.faq).map(entry=>({...entry,href:`/idea/${idea.slug}`})))),
    resources:await getListResources(cat.name,cat.name),
  };
 });
