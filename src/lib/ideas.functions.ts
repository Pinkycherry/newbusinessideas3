import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import {
  IDEA_CARD_COLUMNS,
  toIdeaCard,
  toIdeaDetail,
  type IdeaCard,
  type IdeaRow,
} from "./ideas-shared";

export function db() {
  const url = process.env["IDEAVAULT_DB_URL"];
  const key = process.env["IDEAVAULT_DB_ANON_KEY"];
  if (!url || !key) throw new Error("IdeaVault database credentials are not configured.");
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export type CategoryNode = {
  categoryName: string;
  categorySlug: string;
  ideaCount: number;
  subcategories: { name: string; slug: string; ideaCount: number }[];
};

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await db()
    .from("ideas")
    .select("category_name,category_slug,subcategory_name,subcategory_slug")
    .eq("status", "completed");
  if (error) throw new Error(error.message);

  const map = new Map<string, CategoryNode>();
  for (const row of (data ?? []) as Pick<
    IdeaRow,
    "category_name" | "category_slug" | "subcategory_name" | "subcategory_slug"
  >[]) {
    let node = map.get(row.category_slug);
    if (!node) {
      node = {
        categoryName: row.category_name,
        categorySlug: row.category_slug,
        ideaCount: 0,
        subcategories: [],
      };
      map.set(row.category_slug, node);
    }
    node.ideaCount += 1;
    const sub = node.subcategories.find((s) => s.slug === row.subcategory_slug);
    if (sub) sub.ideaCount += 1;
    else
      node.subcategories.push({
        name: row.subcategory_name,
        slug: row.subcategory_slug,
        ideaCount: 1,
      });
  }
  const categories = [...map.values()].sort((a, b) => b.ideaCount - a.ideaCount);
  for (const c of categories) c.subcategories.sort((a, b) => a.name.localeCompare(b.name));
  return {
    categories,
    totalIdeas: categories.reduce((sum, c) => sum + c.ideaCount, 0),
    totalSubcategories: categories.reduce((sum, c) => sum + c.subcategories.length, 0),
  };
});

export const getTrendingIdeas = createServerFn({ method: "GET" }).handler(
  async (): Promise<IdeaCard[]> => {
    const { data, error } = await db()
      .from("ideas")
      .select(IDEA_CARD_COLUMNS)
      .eq("status", "completed")
      .order("trend_score", { ascending: false, nullsFirst: false })
      .limit(6);
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as IdeaRow[]).map(toIdeaCard);
  },
);

export const getCategoryPage = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ categorySlug: z.string() }).parse(input))
  .handler(async ({ data: input }) => {
    const { data, error } = await db()
      .from("ideas")
      .select(IDEA_CARD_COLUMNS)
      .eq("status", "completed")
      .eq("category_slug", input.categorySlug)
      .order("trend_score", { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    const ideas = ((data ?? []) as unknown as IdeaRow[]).map(toIdeaCard);
    return {
      categoryName: ideas[0]?.categoryName ?? null,
      categorySlug: input.categorySlug,
      ideas,
    };
  });

export const getSubcategoryPage = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ categorySlug: z.string(), subcategorySlug: z.string() }).parse(input),
  )
  .handler(async ({ data: input }) => {
    const { data, error } = await db()
      .from("ideas")
      .select(IDEA_CARD_COLUMNS)
      .eq("status", "completed")
      .eq("category_slug", input.categorySlug)
      .eq("subcategory_slug", input.subcategorySlug)
      .order("trend_score", { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    const ideas = ((data ?? []) as unknown as IdeaRow[]).map(toIdeaCard);
    return {
      categoryName: ideas[0]?.categoryName ?? null,
      subcategoryName: ideas[0]?.subcategoryName ?? null,
      ideas,
    };
  });

export const getIdeaBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data: input }) => {
    const { data, error } = await db()
      .from("ideas")
      .select("*")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const detail = toIdeaDetail(data as IdeaRow);

    const { data: related } = await db()
      .from("ideas")
      .select(IDEA_CARD_COLUMNS)
      .eq("status", "completed")
      .eq("category_slug", detail.categorySlug)
      .neq("slug", detail.slug)
      .limit(3);

    return { idea: detail, related: ((related ?? []) as unknown as IdeaRow[]).map(toIdeaCard) };
  });

export const searchIdeas = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ q: z.string() }).parse(input))
  .handler(async ({ data: input }): Promise<IdeaCard[]> => {
    const term = input.q.trim();
    if (!term) return [];
    const escaped = term.replace(/[%,()]/g, " ");
    const { data, error } = await db()
      .from("ideas")
      .select(IDEA_CARD_COLUMNS)
      .eq("status", "completed")
      .or(
        [
          `title.ilike.%${escaped}%`,
          `summary.ilike.%${escaped}%`,
          `business_description.ilike.%${escaped}%`,
          `focus_keyword.ilike.%${escaped}%`,
          `subcategory_name.ilike.%${escaped}%`,
          `category_name.ilike.%${escaped}%`,
        ].join(","),
      )
      .limit(50);
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as IdeaRow[]).map(toIdeaCard);
  });

/**
 * Featured homepage picks. The ids come from src/config/featured.ts —
 * this function only resolves them against the live database.
 */
export const getFeaturedIdeas = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ ideaIds: z.array(z.string()).max(24) }).parse(input),
  )
  .handler(async ({ data: input }): Promise<IdeaCard[]> => {
    if (input.ideaIds.length === 0) return [];
    const { data, error } = await db()
      .from("ideas")
      .select(IDEA_CARD_COLUMNS)
      .eq("status", "completed")
      .in("idea_id", input.ideaIds);
    if (error) throw new Error(error.message);
    const cards = ((data ?? []) as unknown as IdeaRow[]).map(toIdeaCard);
    // Preserve the order declared in src/config/featured.ts.
    return input.ideaIds
      .map((id) => cards.find((c) => c.ideaId === id))
      .filter((c): c is IdeaCard => Boolean(c));
  });
