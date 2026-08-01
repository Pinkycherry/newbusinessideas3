export type IdeaRow = {
  idea_id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  subcategory_id: string;
  subcategory_name: string;
  subcategory_slug: string;
  collection_id: string | null;
  status: string | null;
  focus_keyword: string | null;
  additional_keyword_1: string | null;
  additional_keyword_2: string | null;
  business_description: string | null;
  title: string;
  slug: string;
  summary: string | null;
  tags: unknown;
  pros_json: unknown;
  cons_json: unknown;
  verdict: string | null;
  trend_score: number | null;
  tier: string | null;
  created_at: string | null;
};

export type IdeaCard = {
  ideaId: string;
  title: string;
  slug: string;
  summary: string;
  categoryName: string;
  categorySlug: string;
  subcategoryName: string;
  subcategorySlug: string;
  tags: string[];
  trendScore: number | null;
  tier: string;
  locked: boolean;
};

export type IdeaDetail = IdeaCard & {
  businessDescription: string;
  pros: string[];
  cons: string[];
  verdict: string;
  keywords: string[];
};

/** jsonb columns in this dataset hold JSON-encoded strings, so parse defensively. */
export function toStringList(value: unknown): string[] {
  let current: unknown = value;
  for (let i = 0; i < 3; i += 1) {
    if (Array.isArray(current)) {
      return current.filter((item): item is string => typeof item === "string");
    }
    if (typeof current !== "string") return [];
    try {
      current = JSON.parse(current);
    } catch {
      return current.trim() ? [current] : [];
    }
  }
  return [];
}

export const IDEA_CARD_COLUMNS =
  "idea_id,title,slug,summary,category_name,category_slug,subcategory_name,subcategory_slug,tags,trend_score,tier";

export function toIdeaCard(row: IdeaRow): IdeaCard {
  const tier = (row.tier ?? "free").toLowerCase();
  return {
    ideaId: row.idea_id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? "",
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    subcategoryName: row.subcategory_name,
    subcategorySlug: row.subcategory_slug,
    tags: toStringList(row.tags),
    trendScore: row.trend_score,
    tier,
    locked: tier !== "free",
  };
}

export function toIdeaDetail(row: IdeaRow): IdeaDetail {
  return {
    ...toIdeaCard(row),
    businessDescription: row.business_description ?? "",
    pros: toStringList(row.pros_json),
    cons: toStringList(row.cons_json),
    verdict: row.verdict ?? "",
    keywords: [row.focus_keyword, row.additional_keyword_1, row.additional_keyword_2].filter(
      (k): k is string => Boolean(k && k.trim()),
    ),
  };
}