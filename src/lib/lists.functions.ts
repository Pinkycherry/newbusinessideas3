import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "./ideas.functions";
import {
  toIdeaCard,
  toIdeaDetail,
  type IdeaCard,
  type IdeaDetail,
  type IdeaRow,
} from "./ideas-shared";

/**
 * LISTICLE TEMPLATE DATA — PROJECT_BRIEF.md Section 6.3.
 *
 * One listicle per category, keyed on the real `category_slug`, so the set of
 * listicles grows with the database and never with a hand-maintained list.
 * Ordering is `trend_score DESC` throughout, matching every other listing
 * loader in `ideas.functions.ts`, and every query is filtered to
 * `status = 'completed'`.
 *
 * Nothing on the rendered page is written here. Each of the top-ten entries is
 * assembled ONLY from columns that already exist on the row — summary,
 * business_description, the enrichment prose columns, pros/cons, verdict,
 * trend_score. Where a column is empty the slot is simply not produced, so a
 * thin row renders shorter rather than padded.
 */

/** Brief 6.3 — "top 10 get 200-300 words each ... remaining ideas display as clickable cards". */
export const DETAILED_ENTRY_COUNT = 10;

/**
 * The depth target for one entry, in words of REAL text. It is a floor used to
 * decide how many additional real columns to surface for a given idea — never
 * a target to write toward. 74 of the 290 completed rows carry a
 * `business_description` under 200 characters; for those the floor is not met
 * by summary + description alone, so the composer keeps pulling in whichever
 * researched columns the row actually has (opportunity, buyer, money
 * mechanics, edge) until either the floor is reached or the row runs out of
 * real content. A row that runs out simply renders a shorter entry.
 */
const ENTRY_WORD_FLOOR = 200;

/** Long-form columns, in the order they are pulled in when an entry is thin. */
const SUPPLEMENTS: { label: string; read: (idea: IdeaDetail) => string }[] = [
  { label: "The opportunity", read: (idea) => idea.marketOpportunity },
  { label: "Who actually pays you", read: (idea) => idea.targetCustomer },
  { label: "How the money works", read: (idea) => idea.howYouMakeMoney },
  { label: "Your edge", read: (idea) => idea.competitionEdge },
];

/** Short-form columns, rendered as a fact strip rather than prose. */
const FACTS: { label: string; read: (idea: IdeaDetail) => string }[] = [
  { label: "Cost to start", read: (idea) => idea.startupCost },
  { label: "What you can earn", read: (idea) => idea.incomePotential },
  { label: "Time to first customer", read: (idea) => idea.timeToFirstCustomer },
];

export type ListicleSection = { label: string; body: string };
export type ListicleFact = { label: string; value: string };

/**
 * One fully-written entry in the top ten. Deliberately NOT an `IdeaDetail`:
 * only the fields this template renders travel to the client, so a ten-entry
 * page does not ship ten FAQ arrays and ten link lists it never shows.
 */
export type ListicleEntry = {
  rank: number;
  ideaId: string;
  title: string;
  slug: string;
  subcategoryName: string;
  subcategorySlug: string;
  trendScore: number | null;
  tags: string[];
  /** Unlabelled opening prose: `summary`, then `business_description`. */
  lead: string[];
  /** Labelled researched prose, present only where the row has it. */
  sections: ListicleSection[];
  facts: ListicleFact[];
  pros: string[];
  cons: string[];
  verdict: string;
};

export type ListicleSummary = {
  categoryName: string;
  categorySlug: string;
  ideaCount: number;
  /** "50 Side Hustle Ideas" — the count is the live row count, always. */
  title: string;
  topIdeaTitle: string | null;
  topIdeaSlug: string | null;
  topTrendScore: number | null;
};

export type ListiclePage = {
  categoryName: string;
  categorySlug: string;
  title: string;
  totalIdeas: number;
  entries: ListicleEntry[];
  rest: IdeaCard[];
  subcategories: { name: string; slug: string; ideaCount: number }[];
  /** Every other category's listicle, for cross-linking. */
  otherLists: ListicleSummary[];
};

function words(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/**
 * The headline. The number is the real completed-row count for the category
 * and the name is the real `category_name`, so nothing here can drift from the
 * database. Names that already carry the word "idea(s)" anywhere are left
 * alone — "Side Hustle Ideas" becomes "50 Side Hustle Ideas", and "Business
 * Ideas That Never Go Out of Style" does not gain a second "Ideas" on the end.
 */
export function listicleTitle(categoryName: string, ideaCount: number): string {
  const name = categoryName.trim();
  const noun = /\bideas?\b/i.test(name) ? name : `${name} Ideas`;
  return `${ideaCount} ${noun}`;
}

function toEntry(row: IdeaRow, rank: number): ListicleEntry {
  const idea = toIdeaDetail(row);

  const lead: string[] = [];
  const summary = idea.summary.trim();
  const description = idea.businessDescription.trim();
  if (summary) lead.push(summary);
  // Some rows repeat the summary as the opening of the description; printing
  // it twice would read as padding, so the duplicate is dropped.
  if (description && description !== summary && !summary.includes(description)) {
    lead.push(description);
  }

  let depth = lead.reduce((total, paragraph) => total + words(paragraph), 0);
  const sections: ListicleSection[] = [];
  for (const supplement of SUPPLEMENTS) {
    if (depth >= ENTRY_WORD_FLOOR) break;
    const body = supplement.read(idea).trim();
    if (!body) continue;
    if (lead.some((paragraph) => paragraph.includes(body))) continue;
    sections.push({ label: supplement.label, body });
    depth += words(body);
  }

  const facts: ListicleFact[] = [];
  for (const fact of FACTS) {
    const value = fact.read(idea).trim();
    if (value) facts.push({ label: fact.label, value });
  }

  return {
    rank,
    ideaId: idea.ideaId,
    title: idea.title,
    slug: idea.slug,
    subcategoryName: idea.subcategoryName,
    subcategorySlug: idea.subcategorySlug,
    trendScore: idea.trendScore,
    tags: idea.tags.slice(0, 3),
    lead,
    sections,
    facts,
    pros: idea.pros.slice(0, 3),
    cons: idea.cons.slice(0, 3),
    verdict: idea.verdict.trim(),
  };
}

type IndexRow = Pick<IdeaRow, "category_name" | "category_slug" | "title" | "slug" | "trend_score">;

/**
 * Every category that has completed ideas, with its live count and its
 * highest-trending idea. Shared by the index route and the cross-link rail at
 * the foot of a single listicle, so both read one query shape.
 */
async function loadListicleIndex(): Promise<ListicleSummary[]> {
  const { data, error } = await db()
    .from("ideas")
    .select("category_name,category_slug,title,slug,trend_score")
    .eq("status", "completed")
    .order("trend_score", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);

  const map = new Map<string, ListicleSummary>();
  for (const row of (data ?? []) as IndexRow[]) {
    const existing = map.get(row.category_slug);
    if (existing) {
      existing.ideaCount += 1;
      continue;
    }
    // Rows arrive trend_score DESC, so the first row seen for a category is
    // that category's top idea. No second query needed.
    map.set(row.category_slug, {
      categoryName: row.category_name,
      categorySlug: row.category_slug,
      ideaCount: 1,
      title: "",
      topIdeaTitle: row.title,
      topIdeaSlug: row.slug,
      topTrendScore: row.trend_score,
    });
  }

  const lists = [...map.values()];
  for (const list of lists) list.title = listicleTitle(list.categoryName, list.ideaCount);
  return lists.sort((a, b) => b.ideaCount - a.ideaCount);
}

export const getListicleIndex = createServerFn({ method: "GET" }).handler(
  async (): Promise<ListicleSummary[]> => loadListicleIndex(),
);

export const getListicle = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ categorySlug: z.string() }).parse(input))
  .handler(async ({ data: input }): Promise<ListiclePage | null> => {
    const [ideasRes, lists] = await Promise.all([
      db()
        .from("ideas")
        .select("*")
        .eq("status", "completed")
        .eq("category_slug", input.categorySlug)
        .order("trend_score", { ascending: false, nullsFirst: false }),
      loadListicleIndex(),
    ]);
    if (ideasRes.error) throw new Error(ideasRes.error.message);

    const rows = (ideasRes.data ?? []) as unknown as IdeaRow[];
    if (rows.length === 0) return null;

    const categoryName = rows[0]?.category_name ?? input.categorySlug;
    const entries = rows.slice(0, DETAILED_ENTRY_COUNT).map((row, i) => toEntry(row, i + 1));
    const rest = rows.slice(DETAILED_ENTRY_COUNT).map(toIdeaCard);

    const subcategories: { name: string; slug: string; ideaCount: number }[] = [];
    for (const row of rows) {
      const found = subcategories.find((s) => s.slug === row.subcategory_slug);
      if (found) found.ideaCount += 1;
      else
        subcategories.push({
          name: row.subcategory_name,
          slug: row.subcategory_slug,
          ideaCount: 1,
        });
    }
    subcategories.sort((a, b) => b.ideaCount - a.ideaCount);

    return {
      categoryName,
      categorySlug: input.categorySlug,
      title: listicleTitle(categoryName, rows.length),
      totalIdeas: rows.length,
      entries,
      rest,
      subcategories,
      otherLists: lists.filter((list) => list.categorySlug !== input.categorySlug).slice(0, 6),
    };
  });
