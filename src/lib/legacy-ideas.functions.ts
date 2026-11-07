import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { cleanFetch } from "@/lib/clean-fetch";

/** Published source blueprints remain read-only until their editorial migration is complete. */
const SOURCE_URL = "https://jqzadwobnfypmytcbpkw.supabase.co";
const SOURCE_PUBLIC_KEY = "sb_publishable_3gLu1JHF--npnOfAH4j4Sw_EYP10mOQ";
const source = () => createClient(SOURCE_URL, SOURCE_PUBLIC_KEY, {
  auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: cleanFetch },
});

export type LegacyIdea = {
  slug: string; title: string; summary: string; description: string;
  categoryName: string; categorySlug: string; subcategoryName: string; subcategorySlug: string;
  seoTitle: string; metaDescription: string; createdAt: string | null;
  marketOpportunity: string; targetCustomer: string; howMakeMoney: string;
  startupCost: string; incomePotential: string; competitionEdge: string; firstCustomer: string;
  pros: string[]; cons: string[]; verdict: string; steps: string[]; tools: string[];
  faq: { q: string; a: string }[];
};
function strings(value: unknown): string[] {
  let current = value;
  for (let i = 0; i < 3; i++) {
    if (Array.isArray(current)) return current.filter((v): v is string => typeof v === "string");
    if (typeof current !== "string") return [];
    try { current = JSON.parse(current); } catch { return current.trim() ? [current] : []; }
  }
  return [];
}
function questions(value: unknown): { q: string; a: string }[] {
  let current = value;
  for (let i = 0; i < 3; i++) {
    if (Array.isArray(current)) return current.filter((v): v is { q: string; a: string } => Boolean(v) && typeof v.q === "string" && typeof v.a === "string");
    if (typeof current !== "string") return [];
    try { current = JSON.parse(current); } catch { return []; }
  }
  return [];
}
const columns = "slug,title,summary,business_description,category_name,category_slug,subcategory_name,subcategory_slug,seo_title,meta_description,created_at,market_opportunity,target_customer,how_you_make_money,startup_cost,income_potential,competition_edge,time_to_first_customer,pros_json,cons_json,verdict,getting_started_steps,tools_needed,faq_json";
export const getLegacyIdea = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/) }).parse(input))
  .handler(async ({ data }): Promise<LegacyIdea | null> => {
    const { data: row, error } = await source().from("ideas").select(columns)
      .eq("slug", data.slug).eq("status", "completed").maybeSingle();
    if (error || !row) return null;
    return {
      slug: row.slug, title: row.title, summary: row.summary ?? "",
      description: row.business_description ?? "",
      categoryName: row.category_name ?? "", categorySlug: row.category_slug ?? "",
      subcategoryName: row.subcategory_name ?? "", subcategorySlug: row.subcategory_slug ?? "",
      seoTitle: row.seo_title ?? "", metaDescription: row.meta_description ?? "",
      createdAt: row.created_at ?? null, marketOpportunity: row.market_opportunity ?? "",
      targetCustomer: row.target_customer ?? "", howMakeMoney: row.how_you_make_money ?? "",
      startupCost: row.startup_cost ?? "", incomePotential: row.income_potential ?? "",
      competitionEdge: row.competition_edge ?? "", firstCustomer: row.time_to_first_customer ?? "",
      pros: strings(row.pros_json), cons: strings(row.cons_json), verdict: row.verdict ?? "",
      steps: strings(row.getting_started_steps), tools: strings(row.tools_needed),
      faq: questions(row.faq_json),
    };
  });


export type LegacyIdeaCard = {
  slug: string; title: string; description: string; categoryName: string; categorySlug: string;
};

/** Homepage source pool until the editorial `published` table is populated.
 * This is the same completed blueprint source already served by /idea and
 * /blueprints. The category links open a real idea in that category rather
 * than an empty category route.
 */
export const getHomeLegacyContent = createServerFn({ method: "GET" }).handler(async () => {
  const client = source();
  const { data: recent, error } = await client.from("ideas")
    .select("slug,title,summary,business_description,target_customer,how_you_make_money,cons_json,category_name,category_slug")
    .eq("status", "completed").order("created_at", { ascending: false }).limit(6);
  if (error) return { ideas: [], categories: [] };
  const categories: { name: string; slug: string; ideaSlug: string }[] = [];
  const seen = new Set<string>();
  for (let from = 0; categories.length < 16; from += 1000) {
    const { data: rows, error: categoryError } = await client.from("ideas")
      .select("slug,category_name,category_slug").eq("status", "completed")
      .order("created_at", { ascending: false }).range(from, from + 999);
    if (categoryError || !rows?.length) break;
    for (const row of rows) {
      if (!row.category_slug || seen.has(row.category_slug)) continue;
      seen.add(row.category_slug);
      categories.push({ name: row.category_name || row.category_slug, slug: row.category_slug, ideaSlug: row.slug });
      if (categories.length === 16) break;
    }
    if (rows.length < 1000) break;
  }
  return {
    ideas: (recent ?? []).map(row => ({
      slug: row.slug, title: row.title, summary: row.summary || row.business_description || "",
      buyer: row.target_customer || "", money: row.how_you_make_money || "",
      risk: strings(row.cons_json)[0] || "", categorySlug: row.category_slug || "",
    })), categories,
  };
});
export const getLegacyIdeaCards = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({
    q: z.string().trim().max(80).default(""),
    page: z.number().int().min(1).max(100).default(1),
  }).parse(input))
  .handler(async ({ data }): Promise<{ items: LegacyIdeaCard[]; total: number; page: number }> => {
    const perPage = 24;
    let query = source().from("ideas")
      .select("slug,title,business_description,category_name,category_slug", { count: "exact" })
      .eq("status", "completed");
    const term = data.q.replace(/[%_,()]/g, "").trim();
    if (term) query = query.ilike("title", "%" + term + "%");
    const { data: rows, count, error } = await query.order("title", { ascending: true })
      .range((data.page - 1) * perPage, data.page * perPage - 1);
    if (error) throw new Error("The published blueprint library could not load.");
    return {
      items: (rows ?? []).map((row) => ({
        slug: row.slug, title: row.title,
        description: (row.business_description ?? "").split(/(?<=[.!?])\s+/)[0]?.slice(0, 210) ?? "",
        categoryName: row.category_name ?? "", categorySlug: row.category_slug ?? "",
      })),
      total: count ?? 0, page: data.page,
    };
  });
