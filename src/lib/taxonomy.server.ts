import details from "@/data/taxonomy-details.json";

/**
 * Per-subcategory detail from the approved architecture sheet: the audience,
 * ten focus keywords, the search intent and what later ideas will cover.
 * Server only: the file is 1.4 MB and the browser never needs all of it.
 * Reached through `taxonomy.functions.ts` with a dynamic import.
 */
export type SubcategoryDetail = {
  categorySlug: string;
  position: number;
  targetPeople: string[];
  keywords: string[];
  searchIntent: string;
  scope: string;
};

const DETAILS = details as Record<string, SubcategoryDetail>;

export function subcategoryDetail(slug: string): SubcategoryDetail | null {
  return DETAILS[slug] ?? null;
}
