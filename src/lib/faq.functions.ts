import { createServerFn } from "@tanstack/react-start";
import { dbOrNull } from "./db";
import { faqEntries, normalizeFaqQuestion } from "./lists.functions";

export type FaqDirectoryItem = { q: string; a: string; href: string };
export type FaqDirectoryGroup = { code: string; name: string; slug: string; items: FaqDirectoryItem[] };

type CategoryRow = { code: string; name: string; slug: string };
type SubcategoryRow = { code: string; category_code: string; slug: string; faq: unknown };
type IdeaRow = { code: string; category_code: string; subcategory_code: string; slug: string; faq: unknown };

/** Read every published FAQ source in pages; keep the database as the only copy. */
export const getFaqDirectory = createServerFn({ method: "GET" }).handler(async (): Promise<FaqDirectoryGroup[]> => {
  const client = dbOrNull();
  if (!client) return [];
  const [{ data: categories, error: categoryError }] = await Promise.all([
    client.from("categories").select("code,name,slug").order("code"),
  ]);
  if (categoryError) throw categoryError;
  const subcategories: SubcategoryRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await client.from("subcategories")
      .select("code,category_code,slug,faq").order("code").range(from, from + 999);
    if (error) throw error;
    subcategories.push(...((data ?? []) as SubcategoryRow[]));
    if (!data || data.length < 1000) break;
  }

  const ideas: IdeaRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await client.from("ideas")
      .select("code,category_code,subcategory_code,slug,faq")
      .eq("status", "published").order("code").range(from, from + 999);
    if (error) throw error;
    ideas.push(...((data ?? []) as IdeaRow[]));
    if (!data || data.length < 1000) break;
  }

  const publishedSubcategories = new Set(ideas.map(idea => idea.subcategory_code));
  const groups = new Map<string, FaqDirectoryGroup>();
  for (const category of (categories ?? []) as CategoryRow[])
    groups.set(category.code, { code: category.code, name: category.name, slug: category.slug, items: [] });

  const seen = new Set<string>();
  const add = (categoryCode: string, faq: unknown, href: string) => {
    const group = groups.get(categoryCode);
    if (!group) return;
    for (const entry of faqEntries(faq)) {
      const normalized = normalizeFaqQuestion(entry.q);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      group.items.push({ ...entry, href });
    }
  };
  // List-level questions lead, followed by the next unique questions from published ideas.
  for (const sub of (subcategories ?? []) as SubcategoryRow[])
    if (publishedSubcategories.has(sub.code)) add(sub.category_code, sub.faq, `/lists/${encodeURIComponent(sub.slug)}`);
  for (const idea of ideas) add(idea.category_code, idea.faq, `/idea/${encodeURIComponent(idea.slug)}`);
  return [...groups.values()].filter(group => group.items.length > 0);
});
