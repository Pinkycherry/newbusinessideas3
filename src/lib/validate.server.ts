import { db } from "./ideas.functions";
import { toIdeaDetail, type IdeaDetail, type IdeaRow } from "./ideas-shared";
import type { ValidatePlatform } from "./validate-shared";

/**
 * SINGLE SOURCE OF TRUTH for the Validate-for-Free prompt (PROJECT_BRIEF.md
 * Section 8). One template, substituted per idea from the real record — never
 * hand-written per idea, never rendered as visible or copyable text in our
 * own UI. The user spends one of their own daily uses on their own AI
 * account running this, so it asks for a complete structured report, not a
 * one-liner.
 */
function buildValidationPrompt(idea: IdeaDetail): string {
  const lines = [
    "Act as a blunt, operator-grade startup analyst. Produce a complete, structured, markdown-formatted validation report for the business idea below. Be specific to this idea and its actual market — no generic startup platitudes, no hedging, no marketing language.",
    "",
    `Idea: ${idea.title}`,
    `Category: ${idea.categoryName} / ${idea.subcategoryName}`,
    `Business description: ${idea.businessDescription || idea.summary}`,
  ];
  if (idea.pros.length > 0) lines.push(`Claimed strengths on file: ${idea.pros.join("; ")}`);
  if (idea.cons.length > 0) lines.push(`Claimed risks on file: ${idea.cons.join("; ")}`);
  lines.push(
    "",
    "Structure the report with these sections, each with real substance:",
    "1. Market analysis — real demand signals, market size context, competitive density and timing for this specific niche.",
    "2. Target buyer — the exact customer, what they do today instead, and what would make them switch.",
    "3. Revenue model — how this makes money, realistic pricing, and the path to first revenue.",
    "4. Key risks — the 3-4 things most likely to kill this, stated plainly.",
    "5. Launch roadmap — a concrete plan from zero to first paying customer.",
    "",
    "If your platform can generate an accompanying chart, diagram or other visual (market sizing, a roadmap timeline, competitive positioning), generate one alongside the written report rather than plain paragraphs only.",
  );
  return lines.join("\n");
}

function platformUrl(platform: ValidatePlatform, prompt: string): string {
  const encoded = encodeURIComponent(prompt);
  if (platform === "claude") return `https://claude.ai/new?q=${encoded}`;
  return `https://www.perplexity.ai/search?q=${encoded}`;
}

export async function buildValidateUrl(platform: ValidatePlatform, slug: string): Promise<string> {
  const { data, error } = await db().from("ideas").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("That idea does not exist in the library.");
  const idea = toIdeaDetail(data as IdeaRow);
  return platformUrl(platform, buildValidationPrompt(idea));
}
