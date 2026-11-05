import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { dbOrNull } from './db';
import type { IdeaCard } from './ideas.functions';

const filters=z.object({q:z.string().trim().max(100).default(''),category:z.string().max(30).default(''),investment:z.string().max(30).default(''),time:z.string().max(30).default(''),skill:z.string().max(30).default(''),page:z.number().int().min(1).default(1)});
export type BrowseFilters=z.infer<typeof filters>;
export const getBrowseIdeas=createServerFn({method:'GET'}).inputValidator((input:unknown)=>filters.parse(input)).handler(async({data})=>{
  const db=dbOrNull();
  if(!db)throw new Error('The idea library is unavailable right now. Please try again.');
  const perPage=24;
  let query=db.from('ideas').select('code,slug,title,hook,summary,investment_band,time_needed,skill_level,work_mode,category_code').eq('status','published');
  if(data.q)query=query.ilike('title','%'+data.q.replace(/[%_,()]/g,'')+'%');
  if(data.category)query=query.eq('category_code',data.category);
  if(data.investment)query=query.eq('investment_band',data.investment);
  if(data.time)query=query.eq('time_needed',data.time);
  if(data.skill)query=query.eq('skill_level',data.skill);
  const {data:rows,error}=await query.order('updated_at',{ascending:false}).order('code').range((data.page-1)*perPage,data.page*perPage);
  if(error)throw new Error('The idea library could not load. Please try again.');
  return {ideas:(rows??[]).slice(0,perPage) as (IdeaCard & {category_code:string})[],hasMore:(rows??[]).length>perPage};
});
