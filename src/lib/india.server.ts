/**
 * India Idea Atlas data adapter (server only).
 *
 * The ONLY place that knows how India data is stored. Pages talk to
 * india.functions.ts, which talks to this file, so a change in the n8n
 * workflow or the schema never rewrites a component.
 *
 * Reads go through the public anon key, so Row Level Security decides what is
 * visible: published sets, eligible ideas, and memberships where both ends are
 * public (supabase/india/001_india_atlas.sql). Drafts cannot leak from here
 * even by mistake. Every query selects named columns and a bounded range.
 *
 * Until the india_* tables exist and hold at least one published set, the
 * adapter returns the DRAFT fixtures in india-fixtures.ts, marked
 * `source: "fixture"` so pages can label them and stay out of search.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { FIXTURE_IDEAS, FIXTURE_SETS } from "./india-fixtures";
import {
  BUDGET_CEILINGS,
  INDIA_FAMILIES,
  INDIA_IDEAS_PER_PAGE,
  INDIA_SETS_PER_PAGE,
  ideaMatches,
  setMatches,
  type DirectorySearch,
  type HeroVariant,
  type IndiaDirectory,
  type IndiaEvidence,
  type IndiaFamily,
  type IndiaIdea,
  type IndiaSetItem,
  type IndiaSetPage,
  type IndiaSetSummary,
  type SelectionRules,
  type SetSearch,
  type WorkMode,
} from "./india-shared";

let client: SupabaseClient | null = null;
function indiaDb(): SupabaseClient {
  const url = process.env["IDEAVAULT_DB_URL"];
  const key = process.env["IDEAVAULT_DB_ANON_KEY"];
  if (!url || !key) throw new Error("BBI database credentials are not configured.");
  client ??= createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return client;
}

// ------------------------------------------------------------------ cache
// Public content only. A short TTL, and on a failed refresh the last good
// snapshot keeps being served rather than an error page.
const TTL_MS = 60_000;
const cache = new Map<string, { at: number; value: unknown }>();
async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  try {
    const value = await load();
    cache.set(key, { at: Date.now(), value });
    if (cache.size > 500) cache.delete(cache.keys().next().value as string);
    return value;
  } catch (error) {
    if (hit) return hit.value as T;
    throw error;
  }
}

// ---------------------------------------------------------------- columns
const SET_COLUMNS =
  "slug,title,introduction,selection_criterion,family,audience,selection_rules,hero_variant,reviewed_at,published_version";
const IDEA_COLUMNS =
  "id,concept_key,title,customer,problem,offer,customer_reach,revenue_model,first_test,main_risk,assumptions,skill_tags,work_mode,weekly_hours_min,weekly_hours_max,budget_lower_inr,budget_upper_inr,budget_basis,budget_excludes,budget_estimate_date";

type SetRow = {
  slug: string;
  title: string;
  introduction: string;
  selection_criterion: string;
  family: string;
  audience: string | null;
  selection_rules: SelectionRules | null;
  hero_variant: string;
  reviewed_at: string | null;
  published_version: number;
  india_set_items?: { count: number }[];
};

type IdeaRow = {
  id: string;
  concept_key: string;
  title: string;
  customer: string;
  problem: string;
  offer: string;
  customer_reach: string;
  revenue_model: string;
  first_test: string;
  main_risk: string;
  assumptions: string | null;
  skill_tags: string[] | null;
  work_mode: string;
  weekly_hours_min: number | null;
  weekly_hours_max: number | null;
  budget_lower_inr: number | null;
  budget_upper_inr: number | null;
  budget_basis: string | null;
  budget_excludes: string | null;
  budget_estimate_date: string | null;
};

function toSet(row: SetRow, ideaCount?: number): IndiaSetSummary {
  return {
    slug: row.slug,
    title: row.title,
    introduction: row.introduction,
    selectionCriterion: row.selection_criterion,
    family: (row.family in INDIA_FAMILIES ? row.family : "business-operations") as IndiaFamily,
    audience: row.audience,
    rules: row.selection_rules ?? {},
    heroVariant: row.hero_variant as HeroVariant,
    ideaCount: ideaCount ?? Number(row.india_set_items?.[0]?.count ?? 0),
    reviewedAt: row.reviewed_at,
  };
}

function toIdea(row: IdeaRow): IndiaIdea {
  return {
    key: row.concept_key,
    title: row.title,
    customer: row.customer,
    problem: row.problem,
    offer: row.offer,
    customerReach: row.customer_reach,
    revenueModel: row.revenue_model,
    firstTest: row.first_test,
    mainRisk: row.main_risk,
    assumptions: row.assumptions,
    skillTags: row.skill_tags ?? [],
    workMode: row.work_mode as WorkMode,
    weeklyHoursMin: row.weekly_hours_min,
    weeklyHoursMax: row.weekly_hours_max,
    budgetLowerInr: row.budget_lower_inr,
    budgetUpperInr: row.budget_upper_inr,
    budgetBasis: row.budget_basis,
    budgetExcludes: row.budget_excludes,
    budgetEstimateDate: row.budget_estimate_date,
  };
}

/** PostgREST `or()` syntax treats these as operators; strip them from free text. */
function safeTerm(q: string): string {
  return q
    .replace(/[,()*%\\:."']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ------------------------------------------------------------- live check
/** True when the tables exist AND at least one set is published. */
async function databaseLive(): Promise<boolean> {
  return cached("india:live", async () => {
    const { count, error } = await indiaDb()
      .from("india_sets")
      .select("slug", { count: "exact", head: true });
    // Missing table (not yet applied) reads as "not live"; anything else is a real error.
    if (error) {
      if (/PGRST205|42P01|does not exist|schema cache/i.test(`${error.code} ${error.message}`)) {
        return false;
      }
      throw new Error(error.message);
    }
    return (count ?? 0) > 0;
  });
}

// ---------------------------------------------------------------- fixtures
function fixtureDirectory(search: DirectorySearch): IndiaDirectory {
  const all = FIXTURE_SETS.map(({ ideaKeys: _unused, ...set }) => set);
  const matched = all.filter((s) => setMatches(s, search));
  return paginateDirectory("fixture", matched, all, search.page ?? 1);
}

function paginateDirectory(
  source: IndiaDirectory["source"],
  matched: IndiaSetSummary[],
  all: IndiaSetSummary[],
  page: number,
): IndiaDirectory {
  const pageCount = Math.max(1, Math.ceil(matched.length / INDIA_SETS_PER_PAGE));
  const current = Math.min(page, pageCount);
  const counts = new Map<IndiaFamily, number>();
  for (const s of all) counts.set(s.family, (counts.get(s.family) ?? 0) + 1);
  return {
    source,
    sets: matched.slice((current - 1) * INDIA_SETS_PER_PAGE, current * INDIA_SETS_PER_PAGE),
    total: matched.length,
    page: current,
    pageCount,
    families: [...counts].map(([family, count]) => ({ family, count })),
  };
}

function relatedFrom(all: IndiaSetSummary[], set: IndiaSetSummary): IndiaSetSummary[] {
  const others = all.filter((s) => s.slug !== set.slug && s.ideaCount > 0);
  const modes = new Set(set.rules.work_modes ?? []);
  const score = (s: IndiaSetSummary) =>
    (s.family === set.family ? 2 : 0) +
    ((s.rules.work_modes ?? []).some((m) => modes.has(m)) ? 1 : 0);
  return others
    .map((s) => ({ s, score: score(s) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.s.title.localeCompare(b.s.title))
    .slice(0, 6)
    .map((x) => x.s);
}

function fixtureSetPage(slug: string, search: SetSearch): IndiaSetPage | null {
  const found = FIXTURE_SETS.find((s) => s.slug === slug);
  if (!found) return null;
  const { ideaKeys, ...set } = found;
  const items: IndiaSetItem[] = ideaKeys.map((key, index) => ({
    rank: index + 1,
    fitReason: set.selectionCriterion,
    idea: FIXTURE_IDEAS.find((i) => i.key === key)!,
  }));
  const filtered = items.filter((it) => ideaMatches(it.idea, search));
  const pageCount = Math.max(1, Math.ceil(filtered.length / INDIA_IDEAS_PER_PAGE));
  const page = Math.min(search.page ?? 1, pageCount);
  const all = FIXTURE_SETS.map(({ ideaKeys: _unused, ...s }) => s);
  return {
    source: "fixture",
    set,
    items: filtered.slice((page - 1) * INDIA_IDEAS_PER_PAGE, page * INDIA_IDEAS_PER_PAGE),
    totalItems: filtered.length,
    page,
    pageCount,
    evidence: [],
    related: relatedFrom(all, set),
  };
}

// ---------------------------------------------------------------- database
async function databaseDirectory(search: DirectorySearch): Promise<IndiaDirectory> {
  const page = search.page ?? 1;
  let query = indiaDb()
    .from("india_sets")
    .select(`${SET_COLUMNS},india_set_items(count)`, { count: "exact" })
    .eq("status", "published");
  if (search.family) query = query.eq("family", search.family);
  if (search.budget) {
    query = query.filter(
      "selection_rules->max_budget_inr",
      "lte",
      BUDGET_CEILINGS[search.budget].max,
    );
  }
  if (search.setting) {
    query = query.filter("selection_rules->work_modes", "cs", JSON.stringify([search.setting]));
  }
  if (search.time) query = query.filter("selection_rules->>time_pattern", "eq", search.time);
  const term = search.q ? safeTerm(search.q) : "";
  if (term) {
    query = query.or(
      `title.ilike.*${term}*,introduction.ilike.*${term}*,selection_criterion.ilike.*${term}*`,
    );
  }
  const from = (page - 1) * INDIA_SETS_PER_PAGE;
  const { data, error, count } = await query
    .order("family")
    .order("title")
    .range(from, from + INDIA_SETS_PER_PAGE - 1);
  if (error) throw new Error(error.message);

  // Family index: one bounded column over published sets.
  const fam = await indiaDb()
    .from("india_sets")
    .select("family")
    .eq("status", "published")
    .limit(1000);
  if (fam.error) throw new Error(fam.error.message);
  const counts = new Map<IndiaFamily, number>();
  for (const row of (fam.data ?? []) as { family: IndiaFamily }[]) {
    counts.set(row.family, (counts.get(row.family) ?? 0) + 1);
  }

  const total = count ?? 0;
  return {
    source: "database",
    // A published set whose ideas are all withdrawn shows no ideas; hide it.
    sets: ((data ?? []) as SetRow[]).map((r) => toSet(r)).filter((s) => s.ideaCount > 0),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / INDIA_SETS_PER_PAGE)),
    families: [...counts].map(([family, c]) => ({ family, count: c })),
  };
}

async function databaseSetPage(slug: string, search: SetSearch): Promise<IndiaSetPage | null> {
  const sb = indiaDb();
  const setRes = await sb
    .from("india_sets")
    .select(`id,${SET_COLUMNS},india_set_items(count)`)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (setRes.error) throw new Error(setRes.error.message);
  if (!setRes.data) return null;
  const row = setRes.data as SetRow & { id: string };
  const set = toSet(row);
  if (set.ideaCount === 0) return null;

  const page = search.page ?? 1;
  let itemsQuery = sb
    .from("india_set_items")
    .select(`rank,fit_reason,india_ideas!inner(${IDEA_COLUMNS})`, { count: "exact" })
    .eq("set_id", row.id);
  if (search.mode) itemsQuery = itemsQuery.eq("india_ideas.work_mode", search.mode);
  if (search.budget) {
    itemsQuery = itemsQuery.lte("india_ideas.budget_upper_inr", BUDGET_CEILINGS[search.budget].max);
  }
  const from = (page - 1) * INDIA_IDEAS_PER_PAGE;
  const itemsRes = await itemsQuery.order("rank").range(from, from + INDIA_IDEAS_PER_PAGE - 1);
  if (itemsRes.error) throw new Error(itemsRes.error.message);

  const rows = (itemsRes.data ?? []) as unknown as {
    rank: number;
    fit_reason: string;
    india_ideas: IdeaRow;
  }[];
  const items: IndiaSetItem[] = rows.map((r) => ({
    rank: r.rank,
    fitReason: r.fit_reason,
    idea: toIdea(r.india_ideas),
  }));

  let evidence: IndiaEvidence[] = [];
  const ideaIds = rows.map((r) => r.india_ideas.id);
  if (ideaIds.length) {
    const evRes = await sb
      .from("india_evidence")
      .select("claim_key,source_url,finding,india_ideas!inner(concept_key)")
      .in("idea_id", ideaIds)
      .eq("verification_status", "verified")
      .limit(200);
    if (evRes.error) throw new Error(evRes.error.message);
    evidence = (
      (evRes.data ?? []) as unknown as {
        claim_key: string;
        source_url: string;
        finding: string;
        india_ideas: { concept_key: string };
      }[]
    ).map((e) => ({
      ideaKey: e.india_ideas.concept_key,
      claimKey: e.claim_key,
      url: e.source_url,
      finding: e.finding,
    }));
  }

  const relRes = await sb
    .from("india_sets")
    .select(`${SET_COLUMNS},india_set_items(count)`)
    .eq("status", "published")
    .neq("slug", slug)
    .order("title")
    .limit(60);
  if (relRes.error) throw new Error(relRes.error.message);
  const related = relatedFrom(
    ((relRes.data ?? []) as SetRow[]).map((r) => toSet(r)),
    set,
  );

  const totalItems = itemsRes.count ?? items.length;
  return {
    source: "database",
    set,
    items,
    totalItems,
    page,
    pageCount: Math.max(1, Math.ceil(totalItems / INDIA_IDEAS_PER_PAGE)),
    evidence,
    related,
  };
}

// ------------------------------------------------------------------ public
export async function loadIndiaDirectory(search: DirectorySearch): Promise<IndiaDirectory> {
  if (!(await databaseLive())) return fixtureDirectory(search);
  return cached(`india:dir:${JSON.stringify(search)}`, () => databaseDirectory(search));
}

export async function loadIndiaSet(slug: string, search: SetSearch): Promise<IndiaSetPage | null> {
  if (!(await databaseLive())) return fixtureSetPage(slug, search);
  return cached(`india:set:${slug}:${JSON.stringify(search)}`, () => databaseSetPage(slug, search));
}

/** Up to three ideas by public key, for the comparison view. */
export async function loadIndiaIdeas(keys: string[]): Promise<IndiaIdea[]> {
  const wanted = [...new Set(keys)].slice(0, 3);
  if (!wanted.length) return [];
  if (!(await databaseLive())) return FIXTURE_IDEAS.filter((i) => wanted.includes(i.key));
  const { data, error } = await indiaDb()
    .from("india_ideas")
    .select(IDEA_COLUMNS)
    .in("concept_key", wanted)
    .limit(3);
  if (error) throw new Error(error.message);
  return ((data ?? []) as IdeaRow[]).map(toIdea);
}

/** Published sets for the India sitemap. Never lists fixtures. */
export async function loadIndiaSitemap(): Promise<{ slug: string; lastmod: string | null }[]> {
  if (!(await databaseLive())) return [];
  const { data, error } = await indiaDb()
    .from("india_sets")
    .select("slug,published_at,updated_at")
    .eq("status", "published")
    .order("slug")
    .limit(1000);
  if (error) throw new Error(error.message);
  return ((data ?? []) as { slug: string; published_at: string | null; updated_at: string }[]).map(
    (r) => ({ slug: r.slug, lastmod: r.published_at ?? r.updated_at }),
  );
}
