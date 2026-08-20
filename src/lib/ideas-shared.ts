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
  /* Enrichment columns (nullable). Present only on ideas the v2 pipeline has
     processed; older rows leave these null and simply render the base page. */
  seo_title?: string | null;
  meta_description?: string | null;
  market_opportunity?: string | null;
  target_customer?: string | null;
  how_you_make_money?: string | null;
  startup_cost?: string | null;
  income_potential?: string | null;
  competition_edge?: string | null;
  time_to_first_customer?: string | null;
  getting_started_steps?: unknown;
  tools_needed?: unknown;
  faq_json?: unknown;
  external_links?: unknown;
  internal_link_anchors?: unknown;
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

export type ExternalLink = { label: string; url: string };
export type FaqItem = { q: string; a: string };

export type IdeaDetail = IdeaCard & {
  businessDescription: string;
  pros: string[];
  cons: string[];
  verdict: string;
  keywords: string[];
  createdAt: string | null;
  /* Enrichment — empty string / empty array when the idea has not been
     processed by the v2 pipeline, so every section can render conditionally. */
  seoTitle: string;
  metaDescription: string;
  marketOpportunity: string;
  targetCustomer: string;
  howYouMakeMoney: string;
  startupCost: string;
  incomePotential: string;
  competitionEdge: string;
  timeToFirstCustomer: string;
  gettingStartedSteps: string[];
  toolsNeeded: string[];
  faq: FaqItem[];
  externalLinks: ExternalLink[];
};

/** jsonb arrays of objects (faq, external links) — parsed defensively like toStringList. */
function toObjectList<T>(value: unknown, pick: (o: Record<string, unknown>) => T | null): T[] {
  let current: unknown = value;
  for (let i = 0; i < 3; i += 1) {
    if (Array.isArray(current)) {
      return current
        .map((item) => (item && typeof item === "object" ? pick(item as Record<string, unknown>) : null))
        .filter((item): item is T => item !== null);
    }
    if (typeof current !== "string") return [];
    try {
      current = JSON.parse(current);
    } catch {
      return [];
    }
  }
  return [];
}

/** jsonb columns in this dataset hold JSON-encoded strings, so parse defensively. */
export function toStringList(value: unknown): string[] {
  let current: unknown = value;
  for (let i = 0; i < 3; i += 1) {
    if (Array.isArray(current)) {
      return current.filter((item): item is string => typeof item === "string");
    }
    if (typeof current !== "string") return [];
    const text: string = current;
    try {
      current = JSON.parse(text);
    } catch {
      return text.trim() ? [text] : [];
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
    createdAt: row.created_at,
    seoTitle: row.seo_title ?? "",
    metaDescription: row.meta_description ?? "",
    marketOpportunity: row.market_opportunity ?? "",
    targetCustomer: row.target_customer ?? "",
    howYouMakeMoney: row.how_you_make_money ?? "",
    startupCost: row.startup_cost ?? "",
    incomePotential: row.income_potential ?? "",
    competitionEdge: row.competition_edge ?? "",
    timeToFirstCustomer: row.time_to_first_customer ?? "",
    gettingStartedSteps: toStringList(row.getting_started_steps),
    toolsNeeded: toStringList(row.tools_needed),
    faq: toObjectList(row.faq_json, (o) =>
      typeof o["q"] === "string" && typeof o["a"] === "string" ? { q: o["q"], a: o["a"] } : null,
    ),
    externalLinks: toObjectList(row.external_links, (o) =>
      typeof o["url"] === "string"
        ? { label: typeof o["label"] === "string" && o["label"] ? o["label"] : o["url"], url: o["url"] }
        : null,
    ),
  };
}
