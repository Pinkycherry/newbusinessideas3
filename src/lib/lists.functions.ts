import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { dbOrNull } from "./db";

/** One idea as shown on a list page. */
export type ListIdea = {
  slug: string;
  title: string;
  hook: string | null;
  summary: string | null;
  who_pays_you: string | null;
  how_money_comes: string | null;
  what_you_need: string | null;
  what_hurts: string | null;
  verdict: string | null;
  investment_band: string | null;
  time_needed: string | null;
  skill_level: string | null;
  updated_at: string | null;
  faq?: { q: string; a: string }[] | null;
};

export type ListPage = {
  code: string;
  name: string;
  slug: string;
  intro: string | null;
  howToChoose: string | null;
  faq: { q: string; a: string; href?: string }[];
  categoryName: string;
  categorySlug?: string;
  resources?: { guides: { label: string; href: string; note: string }[]; calculators: { label: string; href: string; note: string }[] };
  ideas: ListIdea[];
  siblings: { name: string; slug: string; count: number }[];
  totalIdeas: number;
};

export type ListsHub = {
  total: number;
  categories: { code: string; name: string; slug: string; subs: { code: string; name: string; slug: string; count: number }[] }[];
};

const IDEA_COLUMNS =
  "slug,title,hook,summary,who_pays_you,how_money_comes,what_you_need,what_hurts,verdict,investment_band,time_needed,skill_level,updated_at,faq";

export function firstFaq(value: unknown): { q: string; a: string } | null {
  if (!Array.isArray(value)) return null;
  const item = value.find((f) => f && typeof f.q === "string" && typeof f.a === "string");
  return item ? { q: item.q, a: item.a } : null;
}

export function faqEntries(value: unknown): { q: string; a: string }[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item.q === "string" && typeof item.a === "string" && item.q.trim() && item.a.trim())
    .map((item) => ({ q: item.q as string, a: item.a as string }));
}

export function normalizeFaqQuestion(question: string): string {
  return question.normalize("NFKC").toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

/** Keep source order while taking the next unused question from each idea. */
export function uniqueFaqBySource(primary: { q: string; a: string; href?: string }[], sources: { q: string; a: string; href?: string }[][], max = 8) {
  const used = new Set<string>();
  const result: { q: string; a: string; href?: string }[] = [];
  const add = (item: { q: string; a: string; href?: string }) => {
    const key = normalizeFaqQuestion(item.q);
    if (!key || used.has(key) || result.length >= max) return false;
    used.add(key); result.push(item); return true;
  };
  primary.forEach(add);
  for (const source of sources) {
    if (result.length >= max) break;
    for (const item of source) if (add(item)) break;
  }
  return result;
}

/** Published idea counts per subcategory code, read in pages of 1,000. */
async function subcategoryCounts(client: NonNullable<ReturnType<typeof dbOrNull>>) {
  const counts: Record<string, number> = {};
  for (let from = 0; ; from += 1000) {
    const { data, error } = await client
      .from("ideas")
      .select("subcategory_code")
      .eq("status", "published")
      .order("code", { ascending: true })
      .range(from, from + 999);
    if (error) throw error;
    if (!data) break;
    for (const r of data as { subcategory_code: string }[]) counts[r.subcategory_code] = (counts[r.subcategory_code] ?? 0) + 1;
    if (data.length < 1000) break;
  }
  return counts;
}

async function catalogPages<T>(client: NonNullable<ReturnType<typeof dbOrNull>>, table: string, columns: string): Promise<T[]> {
  const rows: T[] = [];
  for (let from=0;;from+=1000) {
    const {data,error}=await client.from(table).select(columns).order('code').range(from,from+999);
    if(error)throw error;
    rows.push(...((data??[]) as unknown as T[]));
    if(!data || data.length<1000)return rows;
  }
}

/** Every category that has published ideas, with its subcategories and counts. */
export const getListsHub = createServerFn({ method: "GET" }).handler(async (): Promise<ListsHub> => {
  const client = dbOrNull();
  if (!client) return { total: 0, categories: [] };
  const counts = await subcategoryCounts(client);
  const [cats, subs] = await Promise.all([
    catalogPages<{code:string;name:string;slug:string}>(client,'categories','code,name,slug'),
    catalogPages<{code:string;category_code:string;name:string;slug:string}>(client,'subcategories','code,category_code,name,slug'),
  ]);
  const byCat = new Map<string, ListsHub["categories"][number]>();
  for (const c of cats) byCat.set(c.code, { code: c.code, name: c.name, slug: c.slug, subs: [] });
  for (const s of (subs ?? []) as { code: string; category_code: string; name: string; slug: string }[]) {
    const n = counts[s.code] ?? 0;
    if (n > 0) byCat.get(s.category_code)?.subs.push({ code: s.code, name: s.name, slug: s.slug, count: n });
  }
  return {
    total: Object.values(counts).reduce((a, b) => a + b, 0),
    categories: [...byCat.values()].filter((c) => c.subs.length > 0),
  };
});

export async function getListResources(name: string, categoryName: string) {
  const [{ STARTUP_GUIDES }, { READY_CALCULATORS }] = await Promise.all([import('./guides-data'), import('./calculators')]);
  const terms = `${name} ${categoryName}`.toLocaleLowerCase().split(/\W+/).filter(term=>term.length>3 && !['ideas','business'].includes(term));
  const relevance = (guide: typeof STARTUP_GUIDES[number]) => {
    const text = `${guide.title} ${guide.description}`.toLocaleLowerCase();
    const general = guide.category === 'Validation' ? 4 : guide.category === 'Launch & Ops' ? 3 : guide.category === 'Bootstrapping' ? 2 : 0;
    const softwareSpecific = /b2b|saas/i.test(guide.title) && !/software|saas|digital|online/.test(`${name} ${terms.join(' ')}`.toLowerCase());
    return terms.reduce((score,term)=>score+(text.includes(term)?3:0),general) - (softwareSpecific ? 50 : 0);
  };
  return {
    guides:[...STARTUP_GUIDES].sort((a,b)=>relevance(b)-relevance(a)).slice(0,4).map(guide=>({label:guide.title,href:`/startup-guides/${guide.slug}`,note:guide.description})),
    calculators:READY_CALCULATORS.slice(0,4).map(tool=>({label:tool.title,href:`/calculator/${tool.slug}`,note:tool.answers})),
  };
}

async function publishedListIdeas(client:NonNullable<ReturnType<typeof dbOrNull>>,code:string) {
  const rows:ListIdea[]=[];
  for(let from=0;;from+=1000){
    const {data,error}=await client.from('ideas').select(IDEA_COLUMNS).eq('subcategory_code',code).eq('status','published').order('position').order('code').range(from,from+999);
    if(error)throw error;
    rows.push(...((data??[]) as ListIdea[]));
    if(!data||data.length<1000)return {data:rows};
  }
}

/** One subcategory list page by its slug, or null. */
export const getListPage = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }): Promise<ListPage | null> => {
    const client = dbOrNull();
    if (!client) return null;
    const { data: sub } = await client
      .from("subcategories")
      .select("code,category_code,name,slug,intro,how_to_choose,faq")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!sub) return null;
    const s = sub as { code: string; category_code: string; name: string; slug: string; intro: string | null; how_to_choose: string | null; faq: unknown };
    const [{ data: ideas }, { data: cat }, { data: sibs }, { count: total }] = await Promise.all([
      publishedListIdeas(client,s.code),
      client.from("categories").select("name,slug").eq("code", s.category_code).maybeSingle(),
      client.from("subcategories").select("code,name,slug").eq("category_code", s.category_code).order("code"),
      client.from("ideas").select("code", { count: "exact", head: true }).eq("status", "published"),
    ]);
    const list = (ideas ?? []) as ListIdea[];
    if (list.length === 0) return null;
    const sibCodes = ((sibs ?? []) as { code: string }[]).map((x) => x.code).filter((c) => c !== s.code);
    const sibCounts: Record<string, number> = {};
    if (sibCodes.length) {
      for(let from=0;;from+=1000){
        const { data: rows,error } = await client.from("ideas").select("subcategory_code").in("subcategory_code", sibCodes).eq("status", "published").order('code').range(from,from+999);
        if(error)throw error;
        for (const r of (rows ?? []) as { subcategory_code: string }[]) sibCounts[r.subcategory_code] = (sibCounts[r.subcategory_code] ?? 0) + 1;
        if(!rows||rows.length<1000)break;
      }
    }
    const faq = faqEntries(s.faq);
    const resources = await getListResources(s.name,(cat as {name:string}|null)?.name ?? '');
    return {
      code: s.code,
      name: s.name,
      slug: s.slug,
      intro: s.intro,
      howToChoose: s.how_to_choose,
      faq: uniqueFaqBySource(faq, list.map((idea) => faqEntries(idea.faq).map((entry) => ({ ...entry, href: `/idea/${idea.slug}` })))),
      categoryName: (cat as { name: string } | null)?.name ?? "",
      categorySlug: (cat as { slug: string } | null)?.slug,
      resources,
      ideas: list,
      siblings: ((sibs ?? []) as { code: string; name: string; slug: string }[])
        .filter((x) => x.code !== s.code && (sibCounts[x.code] ?? 0) > 0)
        .map((x) => ({ name: x.name, slug: x.slug, count: sibCounts[x.code] ?? 0 })),
      totalIdeas: total ?? 0,
    };
  });
