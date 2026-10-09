import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "./ideas.functions";
import type { IdeaCard } from "./ideas-shared";

/**
 * New category pages need ten grouped counts, not every idea card in the
 * category. The old category query remains untouched for indexed legacy pages.
 */
export const getExpansionCategoryPage = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ categorySlug: z.string() }).parse(input))
  .handler(async ({ data: input }) => {
    const client = db();
    const [categoryResult, countsResult] = await Promise.all([
      client
        .from("bbi_expansion_categories")
        .select("name")
        .eq("slug", input.categorySlug)
        .maybeSingle(),
      client.rpc("get_subcategories_for_category", { cat_slug: input.categorySlug }),
    ]);
    if (categoryResult.error) throw new Error(categoryResult.error.message);
    if (countsResult.error) throw new Error(countsResult.error.message);

    const subcategoryCounts = (
      (countsResult.data ?? []) as { subcategory_slug: string; idea_count: number }[]
    ).map((row) => ({ slug: row.subcategory_slug, ideaCount: Number(row.idea_count) || 0 }));

    return {
      categoryName: categoryResult.data?.name ?? null,
      categorySlug: input.categorySlug,
      ideas: [] as IdeaCard[],
      totalIdeas: subcategoryCounts.reduce((sum, item) => sum + item.ideaCount, 0),
      subcategoryCounts,
    };
  });
