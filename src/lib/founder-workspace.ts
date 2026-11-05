import { useEffect, useState } from "react";

export const FOUNDER_WORKSPACE_KEY = "bbi-founder-workspace-v1";
const WORKSPACE_EVENT = "bbi:founder-workspace-change";
export const MAX_SHORTLIST = 4;

export type WorkspaceIdea = {
  slug: string;
  title: string;
  source?: "published" | "blueprint";
  hook?: string;
  summary?: string;
  description?: string;
  categoryCode?: string;
  categoryName?: string;
  investmentBand?: string;
  timeNeeded?: string;
  skillLevel?: string;
  workMode?: string;
  targetCustomer?: string;
  revenueModel?: string;
  startupCost?: string;
  risks?: string;
  firstSteps?: string[];
};

export type FounderContext = {
  location: string;
  budgetINR: string;
  hoursPerWeek: string;
  skills: string;
  buyer: string;
  language: string;
  recentProblem: string;
  currentWorkaround: string;
  proposedOffer: string;
  additionalContext: string;
};

export type FounderWorkspace = {
  version: 1;
  shortlist: WorkspaceIdea[];
  context: FounderContext;
};

export const emptyFounderContext: FounderContext = {
  location: "",
  budgetINR: "",
  hoursPerWeek: "",
  skills: "",
  buyer: "",
  language: "English",
  recentProblem: "",
  currentWorkaround: "",
  proposedOffer: "",
  additionalContext: "",
};

const emptyWorkspace = (): FounderWorkspace => ({
  version: 1,
  shortlist: [],
  context: { ...emptyFounderContext },
});

function text(value: unknown, max = 1200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normaliseIdea(value: unknown): WorkspaceIdea | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const slug = text(raw.slug, 200);
  const title = text(raw.title, 200);
  if (!slug || !title) return null;
  const idea: WorkspaceIdea = { slug, title };
  if (raw.source === "published" || raw.source === "blueprint") idea.source = raw.source;
  const stringFields: (keyof WorkspaceIdea)[] = [
    "hook", "summary", "description", "categoryCode", "categoryName", "investmentBand",
    "timeNeeded", "skillLevel", "workMode", "targetCustomer", "revenueModel", "startupCost", "risks",
  ];
  for (const field of stringFields) {
    const valueAtField = raw[field];
    if (typeof valueAtField === "string" && valueAtField.trim()) {
      Object.assign(idea, { [field]: text(valueAtField, 1200) });
    }
  }
  if (Array.isArray(raw.firstSteps)) {
    idea.firstSteps = raw.firstSteps.filter((item): item is string => typeof item === "string").slice(0, 8).map(item => item.slice(0, 500));
  }
  return idea;
}

function normaliseContext(value: unknown): FounderContext {
  if (!value || typeof value !== "object") return { ...emptyFounderContext };
  const raw = value as Record<string, unknown>;
  return {
    location: text(raw.location, 120),
    budgetINR: text(raw.budgetINR, 60),
    hoursPerWeek: text(raw.hoursPerWeek, 40),
    skills: text(raw.skills, 500),
    buyer: text(raw.buyer, 500),
    language: text(raw.language, 60) || "English",
    recentProblem: text(raw.recentProblem, 800),
    currentWorkaround: text(raw.currentWorkaround, 800),
    proposedOffer: text(raw.proposedOffer, 800),
    additionalContext: text(raw.additionalContext, 1800),
  };
}

export function readFounderWorkspace(): FounderWorkspace {
  if (typeof window === "undefined") return emptyWorkspace();
  try {
    const raw = window.localStorage.getItem(FOUNDER_WORKSPACE_KEY);
    if (!raw) return emptyWorkspace();
    const parsed = JSON.parse(raw) as { shortlist?: unknown; context?: unknown };
    const shortlist = Array.isArray(parsed.shortlist)
      ? parsed.shortlist.map(normaliseIdea).filter((idea): idea is WorkspaceIdea => Boolean(idea))
          .filter((idea, index, all) => all.findIndex(item => item.slug === idea.slug) === index)
          .slice(0, MAX_SHORTLIST)
      : [];
    return { version: 1, shortlist, context: normaliseContext(parsed.context) };
  } catch {
    return emptyWorkspace();
  }
}

function writeWorkspace(workspace: FounderWorkspace): boolean {
  if (typeof window === "undefined") return false;
  const safe: FounderWorkspace = {
    version: 1,
    shortlist: workspace.shortlist.map(normaliseIdea).filter((idea): idea is WorkspaceIdea => Boolean(idea)).slice(0, MAX_SHORTLIST),
    context: normaliseContext(workspace.context),
  };
  try {
    window.localStorage.setItem(FOUNDER_WORKSPACE_KEY, JSON.stringify(safe));
    window.dispatchEvent(new Event(WORKSPACE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function toggleShortlistIdea(value: WorkspaceIdea): { ok: boolean; selected: boolean; message: string } {
  const idea = normaliseIdea(value);
  if (!idea) return { ok: false, selected: false, message: "This idea could not be saved." };
  const workspace = readFounderWorkspace();
  const index = workspace.shortlist.findIndex(item => item.slug === idea.slug);
  if (index >= 0) {
    workspace.shortlist = workspace.shortlist.filter(item => item.slug !== idea.slug);
    const ok = writeWorkspace(workspace);
    return { ok, selected: false, message: ok ? "Removed from your local shortlist." : "Browser storage is unavailable. Your idea was not saved." };
  }
  if (workspace.shortlist.length >= MAX_SHORTLIST) {
    return { ok: false, selected: false, message: "Your shortlist is full. Remove one idea before adding another." };
  }
  workspace.shortlist = [...workspace.shortlist, idea];
  const ok = writeWorkspace(workspace);
  return { ok, selected: ok, message: ok ? "Saved on this browser. It has not been sent to BusinessIdea.io." : "Browser storage is unavailable. Your idea was not saved." };
}

export function removeShortlistIdea(slug: string): boolean {
  const workspace = readFounderWorkspace();
  return writeWorkspace({ ...workspace, shortlist: workspace.shortlist.filter(item => item.slug !== slug) });
}

export function clearShortlist(): boolean {
  return writeWorkspace({ ...readFounderWorkspace(), shortlist: [] });
}

export function saveFounderContext(context: Partial<FounderContext>): boolean {
  const current = readFounderWorkspace();
  return writeWorkspace({ ...current, context: { ...current.context, ...context } });
}

export function useFounderWorkspace(): FounderWorkspace {
  const [workspace, setWorkspace] = useState<FounderWorkspace>(emptyWorkspace);
  useEffect(() => {
    const sync = () => setWorkspace(readFounderWorkspace());
    sync();
    window.addEventListener(WORKSPACE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WORKSPACE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return workspace;
}

export type FounderPromptTask = "validate" | "compare" | "red-team" | "field-test";

export function buildFounderPrompt(task: FounderPromptTask, ideas: WorkspaceIdea[], context: FounderContext): string {
  const contextEntries: [string, string][] = [
    ["Founder location/market", context.location],
    ["Maximum cash available in INR", context.budgetINR],
    ["Reliable hours per week", context.hoursPerWeek],
    ["Skills/experience", context.skills],
    ["Target buyer", context.buyer],
    ["Preferred output language", context.language],
    ["Recent problem or trigger", context.recentProblem],
    ["Current workaround/alternative", context.currentWorkaround],
    ["Proposed small offer", context.proposedOffer],
    ["Additional founder notes", context.additionalContext],
  ];
  const taskInstruction: Record<FounderPromptTask, string> = {
    validate: "Pressure-test the selected business idea for a first-time founder in India. Identify what must be verified before spending money.",
    compare: "Compare the selected business ideas fairly using the same evidence and constraints. Do not choose a winner from missing or guessed information.",
    "red-team": "Act as a skeptical reviewer. Make the strongest realistic case against the selected idea, list assumptions that could be wrong, and name the cheapest evidence that could change the decision.",
    "field-test": "Design a small, reversible field test for the selected idea. Give a specific buyer, offer, price to test, delivery boundary, question script, evidence to record and a review date; label any suggested price as a hypothesis.",
  };
  const ideaLines = ideas.slice(0, MAX_SHORTLIST).map((idea, index) => [
    `IDEA ${index + 1}: ${idea.title}`,
    idea.categoryName ? `Category: ${idea.categoryName}` : idea.categoryCode ? `Category code: ${idea.categoryCode}` : "",
    idea.description || idea.summary || idea.hook ? `Description: ${(idea.description || idea.summary || idea.hook || "").slice(0, 900)}` : "",
    idea.targetCustomer ? `Known target buyer from source: ${idea.targetCustomer}` : "",
    idea.revenueModel ? `Revenue model from source: ${idea.revenueModel}` : "",
    idea.startupCost ? `Stated starting cost from source: ${idea.startupCost}` : "",
    idea.investmentBand ? `Published investment band: ${idea.investmentBand}` : "",
    idea.timeNeeded ? `Published time requirement: ${idea.timeNeeded}` : "",
    idea.skillLevel ? `Published skill level: ${idea.skillLevel}` : "",
    idea.workMode ? `Published work setting: ${idea.workMode}` : "",
    idea.risks ? `Known risks in source: ${idea.risks}` : "",
    idea.firstSteps?.length ? `Source first steps: ${idea.firstSteps.join("; ").slice(0, 900)}` : "",
  ].filter(Boolean).join("\n")).join("\n\n");
  const contextLines = contextEntries.filter(([, value]) => value.trim()).map(([label, value]) => `- ${label}: ${value}`).join("\n") || "No personal constraints supplied yet.";
  return [
    "You are a skeptical, source-conscious startup research partner. Answer in the user's chosen language when specified.",
    taskInstruction[task],
    "Focus on India and the founder's stated city/market where supplied. Separate source facts, current sourced findings, and assumptions. Include working source URLs and dates for material factual claims. If evidence cannot be found, say so. Do not invent market sizes, startup failure counts, customer results, regulatory conclusions, or success probabilities.",
    "",
    "FOUNDER CONTEXT:",
    contextLines,
    "",
    "PUBLISHED IDEA RECORDS (treat these fields as source context, not proof of demand):",
    ideaLines || "No published idea selected; ask the user to define one clearly.",
    "",
    "REQUIRED OUTPUT:",
    "- Most important unknowns and evidence supporting each current claim.",
    "- Current alternatives and what would make a specific Indian buyer switch.",
    "- Cash required before collection, delivery workload, pricing assumptions and the cheapest responsible test.",
    "- Risks that could make the idea unsuitable, with a concrete next step.",
    "- Citations/links and dates for factual market or competitor claims. Label estimates and assumptions distinctly.",
    "- End with one action the founder can take next; do not present AI judgement as proof of real demand.",
  ].join("\n").slice(0, 12000);
}


/**
 * Compact URL handoff. Keeps the selected idea titles, essential source facts,
 * founder constraints and gaps while the full prompt remains reviewable/copyable.
 */
export function buildProviderHandoffPrompt(
  task: FounderPromptTask,
  ideas: WorkspaceIdea[],
  context: FounderContext,
  extraNotes = "",
): string {
  const clean = (value: string | undefined, max: number) =>
    (value || "").replace(/\s+/g, " ").trim().slice(0, max);
  const taskNames: Record<FounderPromptTask, string> = {
    validate: "validate this idea",
    compare: "compare all selected ideas fairly",
    "red-team": "challenge the selected idea",
    "field-test": "design a small, reversible field test",
  };
  const contextRows: [string, string][] = [
    ["Market/location", context.location],
    ["Budget in INR", context.budgetINR],
    ["Hours per week", context.hoursPerWeek],
    ["Skills", context.skills],
    ["Target buyer", context.buyer],
    ["Output language", context.language],
    ["Recent problem", context.recentProblem],
    ["Current workaround", context.currentWorkaround],
    ["Proposed offer", context.proposedOffer],
    ["Additional notes", context.additionalContext],
  ];
  const ideaRows = ideas.slice(0, MAX_SHORTLIST).map((idea, index) => [
    `IDEA ${index + 1}: ${clean(idea.title, 90)}`,
    `Category: ${clean(idea.categoryName || idea.categoryCode, 35) || "not specified"}`,
    `Description: ${clean(idea.description || idea.summary || idea.hook, 90) || "verify the published source"}`,
    `Cost/time/skill/work mode: ${[idea.startupCost || idea.investmentBand, idea.timeNeeded, idea.skillLevel, idea.workMode].map(v => clean(v, 24)).filter(Boolean).join(" / ") || "research"}`,
    `Buyer: ${clean(idea.targetCustomer, 48) || "not listed; research"}`,
    `Revenue: ${clean(idea.revenueModel, 48) || "not listed; research"}`,
    `Risks: ${clean(idea.risks, 48) || "not listed; research"}`,
    `First steps: ${clean(idea.firstSteps?.join("; "), 48) || "not listed; research"}`,
  ].join("\n")).join("\n\n");
  const contextText = contextRows.filter(([, value]) => value.trim())
    .map(([label, value]) => "- " + label + ": " + clean(value, 70)).join("\n") || "- No personal context supplied";
  return [
    "Act as a skeptical, source-conscious business researcher for an Indian founder. Task: " + taskNames[task] + ".",
    "Use current sources with URLs and dates. Separate published facts, current research and assumptions. Never invent demand, market size, buyers, costs, legal rules or success odds. Ask concise questions only when a missing answer materially changes the recommendation.",
    "FOUNDER CONTEXT:\n" + contextText,
    "SELECTED PUBLISHED IDEAS:\n" + (ideaRows || "No selected idea; ask the founder to define one."),
    extraNotes.trim() ? "FOUNDER NOTES / SOURCE GAPS:\n" + clean(extraNotes, 400) : "",
    "Compare buyer access, observed problem, cash before collection, revenue/pricing, delivery burden, risks and cheapest next test. Label unknowns and end with one practical action.",
  ].filter(Boolean).join("\n\n").slice(0, 3600);
}
