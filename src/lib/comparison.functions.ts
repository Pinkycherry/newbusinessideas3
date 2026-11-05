import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getIdea } from "@/lib/ideas.functions";
import { getLegacyIdea } from "@/lib/legacy-ideas.functions";
import type { WorkspaceIdea } from "@/lib/founder-workspace";

const selectionSchema = z.object({
  items: z.array(z.object({
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    source: z.enum(["published", "blueprint"]).optional(),
  })).min(2).max(4),
});

function publishedRecord(idea: NonNullable<Awaited<ReturnType<typeof getIdea>>>): WorkspaceIdea {
  return {
    slug: idea.slug,
    title: idea.title,
    source: "published",
    hook: idea.hook,
    summary: idea.summary,
    description: idea.what_it_is || idea.summary,
    categoryCode: idea.category_code,
    investmentBand: idea.investment_band,
    timeNeeded: idea.time_needed,
    skillLevel: idea.skill_level,
    workMode: idea.work_mode,
    targetCustomer: idea.who_pays_you,
    revenueModel: idea.how_money_comes,
    risks: idea.what_hurts,
    firstSteps: idea.first_30_days ?? [],
  };
}

function blueprintRecord(idea: NonNullable<Awaited<ReturnType<typeof getLegacyIdea>>>): WorkspaceIdea {
  return {
    slug: idea.slug,
    title: idea.title,
    source: "blueprint",
    summary: idea.summary,
    description: idea.description || idea.summary,
    categoryName: idea.categoryName,
    categoryCode: idea.categorySlug,
    startupCost: idea.startupCost,
    targetCustomer: idea.targetCustomer,
    revenueModel: idea.howMakeMoney,
    risks: idea.cons.join("; "),
    firstSteps: idea.steps,
  };
}

/** Rehydrate selected IDs from existing read-only sources; never guess missing fields. */
export const getComparisonRecords = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => selectionSchema.parse(input))
  .handler(async ({ data }) => {
    return Promise.all(data.items.map(async (item) => {
      if (item.source === "blueprint") {
        const blueprint = await getLegacyIdea({ data: { slug: item.slug } });
        if (blueprint) return blueprintRecord(blueprint);
        const published = await getIdea({ data: { slug: item.slug } });
        return published ? publishedRecord(published) : null;
      }
      const published = await getIdea({ data: { slug: item.slug } });
      if (published) return publishedRecord(published);
      const blueprint = await getLegacyIdea({ data: { slug: item.slug } });
      return blueprint ? blueprintRecord(blueprint) : null;
    }));
  });
