/**
 * BBI India Idea Atlas: types and pure helpers shared by the server
 * functions and the components. See BBI_EXPANSION.md.
 *
 * Nothing here imports or reads the existing idea library. The India
 * namespace is separate by design (BUTTERFLY_EFFECT.md).
 */
import { z } from "zod";

export const INDIA_SETS_PER_PAGE = 24;
export const INDIA_IDEAS_PER_PAGE = 20;
export const INDIA_SHORTLIST_MAX = 3;

export const INDIA_FAMILIES = {
  budget: "Budget",
  time: "Time",
  setting: "Setting",
  "ai-digital": "AI and digital",
  gaming: "Gaming",
  "retail-support": "Retail support",
  education: "Education",
  "food-ecosystem": "Food ecosystem",
  "repair-reuse": "Repair and reuse",
  "agriculture-support": "Agriculture support",
  "creative-services": "Creative services",
  "business-operations": "Business operations",
} as const;
export type IndiaFamily = keyof typeof INDIA_FAMILIES;

export const WORK_MODES = {
  home: "From home",
  local: "In my area",
  online: "Online",
  hybrid: "Home and local",
} as const;
export type WorkMode = keyof typeof WORK_MODES;

/** Budget filters are ceilings on the UPPER estimate. Unknown budgets never match. */
export const BUDGET_CEILINGS = {
  "under-10k": { label: "Under ₹10,000", max: 10_000 },
  "under-50k": { label: "Under ₹50,000", max: 50_000 },
  "under-2l": { label: "Under ₹2 lakh", max: 200_000 },
} as const;
export type BudgetCeiling = keyof typeof BUDGET_CEILINGS;

export const TIME_PATTERNS = {
  weekend: "Weekends",
  evening: "Evenings",
  seasonal: "Seasonal",
  "part-time": "Part-time",
} as const;
export type TimePattern = keyof typeof TIME_PATTERNS;

export const HERO_VARIANTS = ["ledger", "wiring", "console", "route"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

/** Typed selection rules stored on each set (india_sets.selection_rules). */
export type SelectionRules = {
  max_budget_inr?: number;
  work_modes?: WorkMode[];
  time_pattern?: TimePattern;
  min_items?: number;
  max_items?: number;
};

export type IndiaIdea = {
  key: string; // concept_key: stable, used for #idea-{key}
  title: string;
  customer: string;
  problem: string;
  offer: string;
  customerReach: string;
  revenueModel: string;
  firstTest: string;
  mainRisk: string;
  assumptions: string | null;
  skillTags: string[];
  workMode: WorkMode;
  weeklyHoursMin: number | null;
  weeklyHoursMax: number | null;
  budgetLowerInr: number | null;
  budgetUpperInr: number | null;
  budgetBasis: string | null;
  budgetExcludes: string | null;
  budgetEstimateDate: string | null;
};

export type IndiaSetItem = { rank: number; fitReason: string; idea: IndiaIdea };

export type IndiaEvidence = { ideaKey: string; claimKey: string; url: string; finding: string };

export type IndiaSetSummary = {
  slug: string;
  title: string;
  introduction: string;
  selectionCriterion: string;
  family: IndiaFamily;
  audience: string | null;
  rules: SelectionRules;
  heroVariant: HeroVariant;
  ideaCount: number;
  reviewedAt: string | null;
};

/** Where the data came from. "fixture" is DRAFT preview content, never real research. */
export type IndiaSource = "database" | "fixture";

export type IndiaDirectory = {
  source: IndiaSource;
  sets: IndiaSetSummary[];
  total: number;
  page: number;
  pageCount: number;
  families: { family: IndiaFamily; count: number }[];
};

export type IndiaSetPage = {
  source: IndiaSource;
  set: IndiaSetSummary;
  items: IndiaSetItem[];
  totalItems: number;
  page: number;
  pageCount: number;
  evidence: IndiaEvidence[];
  related: IndiaSetSummary[];
};

// ------------------------------------------------------------------ search

const opt = <T extends z.ZodTypeAny>(schema: T) => schema.optional().catch(undefined);

export const directorySearchSchema = z.object({
  q: opt(z.string().trim().max(80)),
  family: opt(z.enum(Object.keys(INDIA_FAMILIES) as [IndiaFamily, ...IndiaFamily[]])),
  budget: opt(z.enum(Object.keys(BUDGET_CEILINGS) as [BudgetCeiling, ...BudgetCeiling[]])),
  setting: opt(z.enum(Object.keys(WORK_MODES) as [WorkMode, ...WorkMode[]])),
  time: opt(z.enum(Object.keys(TIME_PATTERNS) as [TimePattern, ...TimePattern[]])),
  page: opt(z.coerce.number().int().min(1).max(500)),
});
export type DirectorySearch = z.infer<typeof directorySearchSchema>;

export const setSearchSchema = z.object({
  mode: opt(z.enum(Object.keys(WORK_MODES) as [WorkMode, ...WorkMode[]])),
  budget: opt(z.enum(Object.keys(BUDGET_CEILINGS) as [BudgetCeiling, ...BudgetCeiling[]])),
  page: opt(z.coerce.number().int().min(1).max(500)),
});
export type SetSearch = z.infer<typeof setSearchSchema>;

/** True when a filter (not just a page number) narrows the view. Filtered views are noindex. */
export function isFiltered(search: Record<string, unknown>): boolean {
  return Object.entries(search).some(
    ([key, value]) => key !== "page" && value !== undefined && value !== "",
  );
}

// --------------------------------------------------------------- matching

export function setMatches(set: IndiaSetSummary, search: DirectorySearch): boolean {
  if (search.family && set.family !== search.family) return false;
  if (search.budget) {
    const max = set.rules.max_budget_inr;
    if (max === undefined || max > BUDGET_CEILINGS[search.budget].max) return false;
  }
  if (search.setting && !(set.rules.work_modes ?? []).includes(search.setting)) return false;
  if (search.time && set.rules.time_pattern !== search.time) return false;
  if (search.q) {
    const hay =
      `${set.title} ${set.introduction} ${set.selectionCriterion} ${set.audience ?? ""}`.toLowerCase();
    if (!hay.includes(search.q.toLowerCase())) return false;
  }
  return true;
}

export function ideaMatches(idea: IndiaIdea, search: SetSearch): boolean {
  if (search.mode && idea.workMode !== search.mode) return false;
  if (search.budget) {
    if (idea.budgetUpperInr === null || idea.budgetUpperInr > BUDGET_CEILINGS[search.budget].max) {
      return false;
    }
  }
  return true;
}

// ------------------------------------------------------------- formatting

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(value: number): string {
  return inr.format(value);
}

/** "₹2,000 to ₹8,000" / "Up to ₹8,000" / "Not estimated". */
export function budgetLabel(idea: Pick<IndiaIdea, "budgetLowerInr" | "budgetUpperInr">): string {
  const { budgetLowerInr: lo, budgetUpperInr: hi } = idea;
  if (hi === null) return "Not estimated";
  if (lo === null) return `Up to ${formatInr(hi)}`;
  if (lo === hi) return formatInr(hi);
  return `${formatInr(lo)} to ${formatInr(hi)}`;
}

export function hoursLabel(idea: Pick<IndiaIdea, "weeklyHoursMin" | "weeklyHoursMax">): string {
  const { weeklyHoursMin: lo, weeklyHoursMax: hi } = idea;
  if (lo === null && hi === null) return "Not estimated";
  if (lo !== null && hi !== null && lo !== hi) return `${lo} to ${hi} hours a week (assumed)`;
  return `About ${lo ?? hi} hours a week (assumed)`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function eligibilityLabels(set: IndiaSetSummary): string[] {
  const labels: string[] = [];
  const max = set.rules.max_budget_inr;
  if (max !== undefined) labels.push(`Budget estimate up to ${formatInr(max)}`);
  for (const mode of set.rules.work_modes ?? []) labels.push(WORK_MODES[mode]);
  if (set.rules.time_pattern) labels.push(TIME_PATTERNS[set.rules.time_pattern]);
  return labels;
}
