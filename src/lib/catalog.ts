import { queryOptions } from "@tanstack/react-query";

import { TAXONOMY, type TaxonomyCategory, type TaxonomySubcategory } from "@/data/taxonomy";

/**
 * The site catalogue: the approved 100 main categories, each with exactly ten
 * subcategories. Static by design. Only category and subcategory pages are
 * indexed; ideas will be added inside subcategories later, at which point
 * `ideaCount` starts carrying real numbers.
 */
export type CategoryNode = {
  categoryName: string;
  categorySlug: string;
  /** Short nav label: the name without the trailing "Business Ideas". */
  shortName: string;
  /** Position in the approved sheet, 1 to 100. */
  position: number;
  subcategoryCount: number;
  /** Published ideas in this category. Zero until ideas are filled in. */
  ideaCount: number;
};

export type Catalog = {
  categories: CategoryNode[];
  totalCategories: number;
  totalSubcategories: number;
  totalIdeas: number;
};

const CATEGORIES: CategoryNode[] = TAXONOMY.map((c) => ({
  categoryName: c.name,
  categorySlug: c.slug,
  shortName: c.short,
  position: c.n,
  subcategoryCount: c.subcategories.length,
  ideaCount: 0,
}));

export const CATALOG: Catalog = {
  categories: CATEGORIES,
  totalCategories: CATEGORIES.length,
  totalSubcategories: TAXONOMY.reduce((sum, c) => sum + c.subcategories.length, 0),
  totalIdeas: 0,
};

/** Kept as a query so every existing `useSuspenseQuery(catalogQuery)` works unchanged. */
export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: async () => CATALOG,
  staleTime: Infinity,
});

const BY_SLUG = new Map(TAXONOMY.map((c) => [c.slug, c]));

export function findCategory(slug: string): TaxonomyCategory | undefined {
  return BY_SLUG.get(slug);
}

export function findSubcategory(
  categorySlug: string,
  subcategorySlug: string,
): { category: TaxonomyCategory; subcategory: TaxonomySubcategory; index: number } | undefined {
  const category = BY_SLUG.get(categorySlug);
  if (!category) return undefined;
  const index = category.subcategories.findIndex((s) => s.slug === subcategorySlug);
  if (index < 0) return undefined;
  return { category, subcategory: category.subcategories[index]!, index };
}

/** Neighbouring categories in sheet order, for "related" rails. */
export function neighbourCategories(slug: string, count = 6): TaxonomyCategory[] {
  const i = TAXONOMY.findIndex((c) => c.slug === slug);
  if (i < 0) return TAXONOMY.slice(0, count);
  const out: TaxonomyCategory[] = [];
  for (let step = 1; out.length < count && step < TAXONOMY.length; step += 1) {
    out.push(TAXONOMY[(i + step) % TAXONOMY.length]!);
  }
  return out;
}

export type TaxonomySearchHit =
  | { kind: "category"; name: string; categorySlug: string }
  | {
      kind: "subcategory";
      name: string;
      categoryName: string;
      categorySlug: string;
      subcategorySlug: string;
    };

/** Plain word match over category and subcategory names. Runs in the browser. */
export function searchTaxonomy(query: string, limit = 40): TaxonomySearchHit[] {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 1 && w !== "business" && w !== "ideas");
  if (words.length === 0) return [];
  const matches = (text: string) => {
    const t = text.toLowerCase();
    return words.every((w) => t.includes(w));
  };
  const hits: TaxonomySearchHit[] = [];
  for (const c of TAXONOMY) {
    if (matches(c.name)) hits.push({ kind: "category", name: c.name, categorySlug: c.slug });
  }
  for (const c of TAXONOMY) {
    for (const s of c.subcategories) {
      if (matches(`${s.name} ${c.short}`)) {
        hits.push({
          kind: "subcategory",
          name: s.name,
          categoryName: c.name,
          categorySlug: c.slug,
          subcategorySlug: s.slug,
        });
      }
    }
  }
  return hits.slice(0, limit);
}
