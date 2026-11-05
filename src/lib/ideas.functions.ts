import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/**
 * Ideas live in the Supabase `ideas` table (row level security: the public
 * can read only status = 'published'). Read with the public key only.
 *
 * The URL and publishable key are public by design. They are the fallback
 * when the deployment has no IDEAVAULT_DB_* variables set.
 */
const PUBLIC_URL = "https://ubuavzcuwvvedojsrmux.supabase.co";
const PUBLIC_KEY = "sb_publishable_jjA0oFdaqraLaCTY_AqUIw_hKOVV8mD";

function client() {
  const url = process.env["IDEAVAULT_DB_URL"] || PUBLIC_URL;
  const key = process.env["IDEAVAULT_DB_ANON_KEY"] || PUBLIC_KEY;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export type IdeaCard = {
  code: string;
  slug: string;
  title: string;
  hook: string;
  summary: string;
  investment_band: string;
  time_needed: string;
  skill_level: string;
  work_mode: string;
};

export type Idea = IdeaCard & {
  subcategory_code: string;
  category_code: string;
  what_it_is: string;
  who_pays_you: string;
  how_money_comes: string;
  what_you_need: string;
  first_30_days: string[];
  what_hurts: string;
  verdict: string;
  faq: { q: string; a: string }[];
  validate_prompt: string;
  gender_fit: string;
  life_stage: string[];
  place: string[];
  created_at?: string;
  updated_at?: string;
};

const CARD_COLUMNS =
  "code,slug,title,hook,summary,investment_band,time_needed,skill_level,work_mode";

/** The published ideas of one subcategory (code like C012-S03), in order. */
export const getSubcategoryIdeas = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ code: z.string().regex(/^C\d{3}-S\d{2}$/) }).parse(input),
  )
  .handler(async ({ data }): Promise<IdeaCard[]> => {
    const { data: rows, error } = await client()
      .from("ideas")
      .select(CARD_COLUMNS)
      .eq("subcategory_code", data.code)
      .eq("status", "published")
      .order("position", { ascending: true });
    if (error) return [];
    return (rows ?? []) as IdeaCard[];
  });

/** One published idea by its slug, or null. */
export const getIdea = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }): Promise<Idea | null> => {
    const { data: row, error } = await client()
      .from("ideas")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !row) return null;
    return row as Idea;
  });

/** Route labels and slugs come from the same database as the idea. */
export const getIdeaPlace = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ category: z.string(), subcategory: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const db = client();
    const [category, subcategory] = await Promise.all([
      db.from('categories').select('code,name,slug').eq('code', data.category).maybeSingle(),
      db.from('subcategories').select('code,name,slug').eq('code', data.subcategory).maybeSingle(),
    ]);
    return { category: category.data as {code:string;name:string;slug:string}|null, subcategory: subcategory.data as {code:string;name:string;slug:string}|null };
  });

/** Readable labels for the fixed tag values. */
export const BAND_LABEL: Record<string, string> = {
  zero: "Almost no money",
  under_25k: "Under ₹25,000",
  "25k_1l": "₹25,000 to ₹1,00,000",
  "1l_5l": "₹1,00,000 to ₹5,00,000",
  above_5l: "Above ₹5,00,000",
};
export const TIME_LABEL: Record<string, string> = {
  part_time: "Part time",
  full_time: "Full time",
  weekends: "Weekends",
};
export const SKILL_LABEL: Record<string, string> = {
  none: "No skill needed",
  basic: "Basic skill",
  trained: "Trained skill",
};
export const MODE_LABEL: Record<string, string> = {
  home: "From home",
  shop: "Shop",
  online: "Online",
  field: "On the move",
  mixed: "Mixed",
};
