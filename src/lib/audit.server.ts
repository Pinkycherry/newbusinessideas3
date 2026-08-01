import { createClient } from "@supabase/supabase-js";

import type { AuditResult } from "./audit-shared";
import { toIdeaDetail, type IdeaRow } from "./ideas-shared";

const MODEL = "google/gemini-3.6-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    viabilityScore: { type: "integer" },
    headline: { type: "string" },
    capitalIntensity: { type: "string" },
    timeToFirstRevenue: { type: "string" },
    moat: { type: "string" },
    distribution: { type: "string" },
    biggestRisk: { type: "string" },
    killCriteria: { type: "string" },
    firstMove: { type: "string" },
    bestFitFounder: { type: "string" },
  },
  required: [
    "viabilityScore",
    "headline",
    "capitalIntensity",
    "timeToFirstRevenue",
    "moat",
    "distribution",
    "biggestRisk",
    "killCriteria",
    "firstMove",
    "bestFitFounder",
  ],
} as const;

export async function runAudit(slug: string): Promise<AuditResult> {
  const url = process.env["IDEAVAULT_DB_URL"];
  const key = process.env["IDEAVAULT_DB_ANON_KEY"];
  if (!url || !key) throw new Error("IdeaVault database credentials are not configured.");

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("slug", slug)
    .eq("status", "completed")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("That idea does not exist in the library.");
  const idea = toIdeaDetail(data as IdeaRow);

  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured: LOVABLE_API_KEY is missing.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a blunt operator-grade business analyst auditing a single business idea. Be specific to THIS idea and its market. No generic startup platitudes, no hedging, no marketing language. Where you are uncertain, say what would resolve the uncertainty. Every field must be 1-3 sentences except viabilityScore (0-100 integer).",
        },
        {
          role: "user",
          content: [
            `Idea ID: ${idea.ideaId}`,
            `Title: ${idea.title}`,
            `Category: ${idea.categoryName} / ${idea.subcategoryName}`,
            `Trend score on file: ${idea.trendScore ?? "n/a"}`,
            `Business description: ${idea.businessDescription}`,
            `Summary: ${idea.summary}`,
            `Pros on file: ${idea.pros.join(" | ") || "none"}`,
            `Cons on file: ${idea.cons.join(" | ") || "none"}`,
            `Existing verdict: ${idea.verdict || "none"}`,
            "",
            "Audit this idea. Do not simply restate the pros and cons above — pressure-test them.",
          ].join("\n"),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "idea_audit", strict: true, schema: SCHEMA },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("AI rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
    throw new Error(`AI audit failed [${res.status}]: ${body}`);
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("The AI returned an empty audit.");

  const parsed = JSON.parse(content) as Omit<AuditResult, "ideaId" | "title" | "model" | "generatedAt">;

  return {
    ideaId: idea.ideaId,
    title: idea.title,
    model: MODEL,
    generatedAt: new Date().toISOString(),
    ...parsed,
  };
}