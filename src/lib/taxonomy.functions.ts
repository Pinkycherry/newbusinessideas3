import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { SubcategoryDetail } from "./taxonomy.server";
import { findCategory } from "./catalog";

/** Details for every subcategory of one category, in sheet order. */
export const getCategoryDetails = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ categorySlug: z.string() }).parse(input))
  .handler(async ({ data }): Promise<Record<string, SubcategoryDetail>> => {
    const category = findCategory(data.categorySlug);
    if (!category) return {};
    const { subcategoryDetail } = await import("./taxonomy.server");
    const out: Record<string, SubcategoryDetail> = {};
    for (const s of category.subcategories) {
      const d = subcategoryDetail(s.slug);
      if (d && d.categorySlug === category.slug) out[s.slug] = d;
    }
    return out;
  });

/** Details for one subcategory, or null when the pair does not exist. */
export const getSubcategoryDetail = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ categorySlug: z.string(), subcategorySlug: z.string() }).parse(input),
  )
  .handler(async ({ data }): Promise<SubcategoryDetail | null> => {
    const { subcategoryDetail } = await import("./taxonomy.server");
    const d = subcategoryDetail(data.subcategorySlug);
    return d && d.categorySlug === data.categorySlug ? d : null;
  });
