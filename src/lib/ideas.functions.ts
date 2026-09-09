import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
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
  if (!url || !key) throw new Error("BBI database credentials are not configured.");
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export type CategoryNode = {
  categoryName: string;
  categorySlug: string;
  ideaCount: number;
};

export type Catalog = {
  categories: CategoryNode[];
  totalIdeas: number;
  totalCategories: number;
};

/**
 * The catalogue, aggregated by Postgres.
 *
 * This used to select every completed row with no LIMIT and count them in
 * JavaScript. Because it is prefetched by the ROOT route loader it ran on every
 * page of the site, and because `getRouter()` builds a fresh QueryClient per
 * request there was no server-side cache, so every request refetched the whole
 * table.
 *
 * That was merely wasteful at 290 rows. What made it dangerous is that
 * PostgREST caps responses at 1000 rows and does NOT error when it truncates:
 * at 1,001 completed ideas the site would have quietly begun under-reporting
 * its own size on every page, with nothing failing and no way to notice except
 * by counting by hand. Against a stated target of 10,000+ pages that was a
 * matter of time, not of risk.
 *
 * Now two aggregate RPCs return one row per category and one row of totals, so
 * the response is bounded by the number of CATEGORIES rather than by the number
 * of IDEAS.
 *
 * `subcategories` is deliberately no longer part of the catalogue.
 * `subcategory_name` is byte-identical to `title` in this table — 290 ideas,
 * 290 distinct subcategory slugs, at most one idea in any of them — so it is
 * not a grouping level, and shipping every idea's subcategory to every page
 * bought nothing. The one page that wants them fetches them scoped, through
 * `getSubcategoriesForCategory` below.
 *
 * `totalSubcategories` is gone rather than recomputed, for the same reason: it
 * was the idea count under a different label, presented as a separate figure.
 */
export const getCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Catalog> => {
  const [summaryRes, totalsRes] = await Promise.all([
    db().rpc("get_category_summary"),
    db().rpc("get_catalog_totals"),
  ]);
  if (summaryRes.error) throw new Error(summaryRes.error.message);
  if (totalsRes.error) throw new Error(totalsRes.error.message);

  const categories: CategoryNode[] = (
    (summaryRes.data ?? []) as {
      category_name: string;
      category_slug: string;
      idea_count: number;
    }[]
  ).map((r) => ({
    categoryName: r.category_name,
    categorySlug: r.category_slug,
    ideaCount: Number(r.idea_count) || 0,
  }));

  const totals = ((totalsRes.data ?? []) as { total_ideas: number; total_categories: number }[])[0];

  return {
    categories,
    totalIdeas: Number(totals?.total_ideas) || 0,
    totalCategories: Number(totals?.total_categories) || categories.length,
  };
});

export type SubcategoryNode = { name: string; slug: string; ideaCount: number };

/**
 * Subcategories for ONE category. Scoped on purpose — see the note above about
 * why these are not part of the global catalogue.
 */
export const getSubcategoriesForCategory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ categorySlug: z.string() }).parse(input))
  .handler(async ({ data: input }): Promise<SubcategoryNode[]> => {
    const { data, error } = await db().rpc("get_subcategories_for_category", {
      cat_slug: input.categorySlug,
    });
    if (error) throw new Error(error.message);
    return (
      (data ?? []) as { subcategory_name: string; subcategory_slug: string; idea_count: number }[]
    ).map((r) => ({
      name: r.subcategory_name,
      slug: r.subcategory_slug,
      ideaCount: Number(r.idea_count) || 0,
    }));
  });

/**
 * SINGLE SOURCE OF TRUTH for the catalog query. Prefetched once in the root
 * route's loader (see __root.tsx) so the header's category dropdown reads
 * from an already-warm cache on every page, not a fresh client-only fetch
 * per visit — that per-page-visit fetch was the "slow dropdown" complaint.
 */
export const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });

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

export type RelatedCategory = { categoryName: string; categorySlug: string; ideaCount: number };

/**
 * PROJECT_BRIEF.md Section 6.1 — 3-4 visual layout variants plus a gradient
 * treatment, chosen per render so refreshing an idea page visibly changes it
 * ("nothing static"). Section 12.2 constrains the colour side to gradient
 * shifts within the brand family, never an unrelated palette.
 *
 * The pick happens on the server and travels with the loader data, so the
 * SSR markup and the client agree — picking it during render would cause a
 * hydration mismatch.
 */
export const IDEA_VARIANTS = ["hero-left", "hero-banner", "stat-forward", "editorial"] as const;
export type IdeaVariant = (typeof IDEA_VARIANTS)[number];
export const IDEA_GRADIENTS = ["dawn", "dusk", "ember", "deep"] as const;
export type IdeaGradient = (typeof IDEA_GRADIENTS)[number];

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

    /* Section 9 — every one of these is ORDER BY random() LIMIT n at the query
       level (via Postgres functions), recomputed on every page load. */
    const [relatedRes, categoriesRes, trendingRes] = await Promise.all([
      // pull one extra so we can drop the current idea and still show 3
      db().rpc("get_random_ideas", { cat_slug: detail.categorySlug, lim: 4 }),
      db().rpc("get_random_categories", { exclude_slug: detail.categorySlug, lim: 5 }),
      db().rpc("get_random_ideas", { cat_slug: null, lim: 8 }),
    ]);

    const related = ((relatedRes.data ?? []) as unknown as IdeaRow[])
      .filter((r) => r.slug !== detail.slug)
      .slice(0, 3)
      .map(toIdeaCard);

    const relatedCategories: RelatedCategory[] = (
      (categoriesRes.data ?? []) as {
        category_name: string;
        category_slug: string;
        idea_count: number;
      }[]
    ).map((c) => ({
      categoryName: c.category_name,
      categorySlug: c.category_slug,
      ideaCount: Number(c.idea_count) || 0,
    }));

    const trending = ((trendingRes.data ?? []) as unknown as IdeaRow[])
      .filter((r) => r.slug !== detail.slug)
      .slice(0, 6)
      .map(toIdeaCard);

    const variant = IDEA_VARIANTS[Math.floor(Math.random() * IDEA_VARIANTS.length)]!;
    const gradient = IDEA_GRADIENTS[Math.floor(Math.random() * IDEA_GRADIENTS.length)]!;

    return { idea: detail, related, relatedCategories, trending, variant, gradient };
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
 * PROJECT_BRIEF.md Section 8.1 — "Surprise Me". Uses the get_random_ideas
 * Postgres function (ORDER BY random() LIMIT n at the query level, per
 * Section 9) rather than fetching everything and shuffling client-side.
 */
export const getSurpriseIdeas = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({ categorySlug: z.string().optional(), count: z.number().min(1).max(5).default(5) })
      .parse(input),
  )
  .handler(async ({ data: input }): Promise<IdeaCard[]> => {
    const { data, error } = await db().rpc("get_random_ideas", {
      cat_slug: input.categorySlug ?? null,
      lim: input.count,
    });
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
