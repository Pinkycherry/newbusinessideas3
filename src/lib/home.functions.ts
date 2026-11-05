import { createServerFn } from "@tanstack/react-start";
import { dbOrNull } from "./db";

export type RecentIdea = {
  slug: string; title: string; hook: string | null; summary: string | null;
  who_pays_you: string | null; how_money_comes: string | null; what_hurts: string | null;
};

/** Recently updated published ideas for the home page. */
export const getRecentIdeas = createServerFn({ method: "GET" }).handler(async (): Promise<RecentIdea[]> => {
  const client = dbOrNull();
  if (!client) return [];
  const { data, error } = await client.from("ideas").select("slug,title,hook,summary,who_pays_you,how_money_comes,what_hurts")
    .eq("status", "published").order("updated_at", { ascending: false }).limit(6);
  return error ? [] : (data ?? []) as RecentIdea[];
});
