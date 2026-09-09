import type { CategoryNode } from "./ideas.functions";

/**
 * How many categories a surface shows, and how many it is hiding.
 *
 * Every category list in this app used to render every category with no cap and
 * no scroll container. Measured at the time: a footer row is ~33px in a
 * two-column grid, so 14 categories is 230px, 60 is 990px, and 200 is 3,300px
 * of footer on every page of the site. The Categories dropdown was worse — three
 * columns, no `max-height`, no `overflow-y`, so at 200 categories it became a
 * 2,600px panel taller than the viewport with no way to scroll it.
 *
 * The catalogue is meant to reach 10,000+ pages, and categories grow with it.
 * A navigation surface has to have ONE shape at 14 categories and at 1,400, so
 * these lists are capped by design and the overflow becomes a link rather than
 * more rows.
 *
 * Ordering is by depth. `get_category_summary()` already returns rows sorted by
 * count descending, but this does not assume that — a caller passing an
 * arbitrarily ordered array still gets the deepest categories.
 */
export type CategorySelection = {
  /** The categories to render, at most `limit` of them, deepest first. */
  shown: CategoryNode[];
  /** How many were left out. Zero means the list is complete as shown. */
  hiddenCount: number;
  /** True when anything was left out — the "and N more" link's condition. */
  hasMore: boolean;
};

export function topCategories(categories: CategoryNode[], limit: number): CategorySelection {
  const safeLimit = Math.max(0, Math.floor(limit));
  const sorted = [...categories].sort(
    (a, b) => b.ideaCount - a.ideaCount || a.categoryName.localeCompare(b.categoryName),
  );
  const shown = sorted.slice(0, safeLimit);
  const hiddenCount = Math.max(0, sorted.length - shown.length);
  return { shown, hiddenCount, hasMore: hiddenCount > 0 };
}

/**
 * Groups for the "Browse by type" menu, derived from live data.
 *
 * The previous version was fourteen hand-typed slugs. Two of them were wrong —
 * `e-commerce-retail` for `ecommerce-retail`, and
 * `business-ideas-that-never-go-out-of-style` for `timeless-business-ideas` —
 * so two columns silently rendered short on every page, and a third hardcoded
 * list elsewhere in the codebase disagreed with it about the same slug.
 *
 * Matching on the words a slug contains means a new category lands in a group
 * automatically, a renamed one does not vanish, and no slug is ever typed by
 * hand. Anything unmatched falls into the last group rather than disappearing,
 * so every category is always reachable from the menu.
 */
export type TypeGroup = { title: string; categories: CategoryNode[] };

const GROUP_RULES: { title: string; match: (slug: string) => boolean }[] = [
  {
    title: "By investment",
    match: (s) => /zero-investment|low-investment|passive-income|no-investment/.test(s),
  },
  {
    title: "By how you work",
    match: (s) => /side-hustle|work-from-home|home-based|part-time|timeless/.test(s),
  },
];

export function typeGroups(categories: CategoryNode[]): TypeGroup[] {
  const claimed = new Set<string>();
  const groups: TypeGroup[] = [];

  for (const rule of GROUP_RULES) {
    const matched = categories.filter(
      (c) => !claimed.has(c.categorySlug) && rule.match(c.categorySlug),
    );
    matched.forEach((c) => claimed.add(c.categorySlug));
    if (matched.length > 0) groups.push({ title: rule.title, categories: matched });
  }

  // Everything not claimed above. Never dropped — a category the rules do not
  // recognise still has to be reachable.
  const rest = categories.filter((c) => !claimed.has(c.categorySlug));
  if (rest.length > 0) groups.push({ title: "By industry", categories: rest });

  return groups;
}
