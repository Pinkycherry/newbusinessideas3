import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "./ideas.functions";

/**
 * PROJECT_BRIEF.md Section 6.5 — the category FAQ pool.
 *
 * Why a pool per category rather than FAQs per idea: `ideas.faq_json` is
 * unusable across the whole library. Checked against the live database on
 * 2026-08-25, it is NULL on 283 of 290 completed rows and holds a bare string
 * rather than an array on the other 7 — so the FAQ block on every idea page
 * renders empty today. Writing 290 bespoke sets is exactly what Section 6.5
 * rules out as too slow; filling 14 category pools covers all 290 at once,
 * and every future idea inherits its category's pool with no extra work.
 *
 * The random pick happens at the query level via `get_random_category_faqs`
 * (ORDER BY random() LIMIT n), per Section 9, rather than fetching the pool
 * and shuffling in JavaScript.
 *
 * The pool is filled by the FAQ branch of `n8n-idea-pipeline-v2.json`. See
 * `docs/FAQ_POOL_PIPELINE.md`. Until that runs, these functions correctly
 * return nothing and the pages say so plainly.
 */

export type CategoryFaq = {
  id: string;
  categorySlug: string;
  question: string;
  answer: string;
};

type FaqRow = {
  id: string;
  category_slug: string;
  question: string;
  answer: string;
};

function toFaq(row: FaqRow): CategoryFaq {
  return {
    id: row.id,
    categorySlug: row.category_slug,
    question: row.question,
    answer: row.answer,
  };
}

/** Random draw from one category's pool, or from every pool when slug is null. */
export const getRandomCategoryFaqs = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        categorySlug: z.string().nullable().default(null),
        count: z.number().min(1).max(20).default(10),
      })
      .parse(input),
  )
  .handler(async ({ data: input }): Promise<CategoryFaq[]> => {
    const { data, error } = await db().rpc("get_random_category_faqs", {
      cat_slug: input.categorySlug,
      lim: input.count,
    });
    if (error) throw new Error(error.message);
    return ((data ?? []) as FaqRow[]).map(toFaq);
  });

/**
 * How many questions each category actually holds. Lets a page tell "this
 * pool has not been generated yet" apart from "the query failed" — the two
 * look identical from an empty array alone, and they need different copy.
 */
export const getCategoryFaqCounts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, number>> => {
    const { data, error } = await db().rpc("get_category_faq_counts");
    if (error) throw new Error(error.message);
    const out: Record<string, number> = {};
    for (const row of (data ?? []) as { category_slug: string; faq_count: number }[]) {
      out[row.category_slug] = Number(row.faq_count) || 0;
    }
    return out;
  },
);
