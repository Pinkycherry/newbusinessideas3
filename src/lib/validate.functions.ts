import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getIdea, type Idea } from "@/lib/ideas.functions";
import { getLegacyIdea, type LegacyIdea } from "@/lib/legacy-ideas.functions";

export const VALIDATE_PLATFORMS = [
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "grok", label: "Grok" },
] as const;
export type ValidatePlatform = (typeof VALIDATE_PLATFORMS)[number]["id"];
export const VALIDATE_CONTEXT_MAX_LENGTH = 1800;

export const VALIDATE_OUTPUTS = [
  { id: "report", label: "Detailed report", helper: "Market, buyer, price, risks and evidence.", instruction: "Write a structured validation report covering the specific market, reachable buyer, current alternatives, realistic pricing and revenue, operating costs, risks, missing evidence and the smallest responsible next test." },
  { id: "roadmap", label: "Action roadmap", helper: "A practical sequence with checkpoints.", instruction: "Create a phased roadmap with concrete actions, owners/roles, time estimates, dependencies and observable checkpoints. Separate tasks that can be done now from tasks that require evidence or spending." },
  { id: "html", label: "HTML prototype", helper: "A self-contained page or prototype where supported.", instruction: "If your current interface can create files, generate a self-contained HTML artifact or prototype. Otherwise provide the complete, runnable HTML/CSS/JavaScript in a single code block. Do not claim a file was created unless it is attached or downloadable." },
  { id: "infographic", label: "Chart or infographic", helper: "A useful visual, with data sources or clear assumptions.", instruction: "Create a chart, diagram or infographic if supported. Label its data and sources; do not turn assumptions into measured numbers. If image output is not available, provide a clear visual specification and Mermaid or SVG/code where useful." },
  { id: "image", label: "Generate images", helper: "Only shown for ChatGPT and Grok handoffs.", instruction: "Generate original image concepts for this specific business, such as a realistic product/service mock-up or customer-facing visual, if image generation is available in this session. Do not reuse another company's protected artwork. If the selected session cannot generate images, say so and provide a precise image brief instead." },
] as const;
export type ValidateOutput = (typeof VALIDATE_OUTPUTS)[number]["id"];

export type ValidatePromptRequest = {
  slug: string;
  location: string;
  budgetINR: string;
  hoursPerWeek: string;
  skills: string;
  language: string;
  buyer: string;
  recentProblem: string;
  currentWorkaround: string;
  proposedOffer: string;
  context: string;
  outputs: ValidateOutput[];
};

type IdeaFacts = {
  title: string;
  category: string;
  description: string;
  buyer: string;
  revenue: string;
  startingCost: string;
  risks: string;
  steps: string;
  summary: string;
};

function factsFor(idea: Idea | LegacyIdea): IdeaFacts {
  if ("what_it_is" in idea) {
    return {
      title: idea.title,
      category: idea.category_code + " / " + idea.subcategory_code,
      description: idea.what_it_is || idea.summary,
      buyer: idea.who_pays_you,
      revenue: idea.how_money_comes,
      startingCost: idea.investment_band,
      risks: idea.what_hurts,
      steps: (idea.first_30_days || []).join("; "),
      summary: idea.summary,
    };
  }
  return {
    title: idea.title,
    category: idea.categoryName + " / " + idea.subcategoryName,
    description: idea.description || idea.summary,
    buyer: idea.targetCustomer,
    revenue: idea.howMakeMoney,
    startingCost: idea.startupCost,
    risks: idea.cons.join("; "),
    steps: idea.steps.join("; "),
    summary: idea.summary,
  };
}

function clean(value: string, limit: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, limit);
}

function contextLines(data: ValidatePromptRequest): string[] {
  return [
    ["Location and market (as supplied)", data.location],
    ["Cash budget in INR (as supplied)", data.budgetINR],
    ["Reliable hours available per week", data.hoursPerWeek],
    ["Skills and experience", data.skills],
    ["Target buyer", data.buyer],
    ["Preferred response language", data.language],
    ["Recent buyer problem or trigger", data.recentProblem],
    ["Current workaround or alternative", data.currentWorkaround],
    ["Offer the founder could test", data.proposedOffer],
  ].filter((entry): entry is [string, string] => Boolean(entry[1].trim()))
    .map(([label, value]) => "- " + label + ": " + clean(value, 500));
}

function fullPrompt(facts: IdeaFacts, data: ValidatePromptRequest): string {
  const selectedOutputs = VALIDATE_OUTPUTS.filter(output => data.outputs.includes(output.id));
  const lines = [
    "ROLE",
    "Act as a skeptical, source-conscious startup research partner for an Indian founder. Help them decide what to test before they spend money. This is a research handoff, not a claim that BusinessIdea.io has validated market demand.",
    "",
    "PUBLISHED IDEA RECORD — SOURCE CONTEXT, NOT PROOF",
    "Idea: " + facts.title,
    "Category: " + facts.category,
    "Description: " + facts.description,
    facts.summary ? "Published summary: " + facts.summary : "",
    facts.buyer ? "Buyer field on file: " + facts.buyer : "Buyer: not clearly specified in the published fields; investigate.",
    facts.revenue ? "Revenue field on file: " + facts.revenue : "Revenue model: not clearly specified in the published fields; investigate.",
    facts.startingCost ? "Published starting-cost/investment field: " + facts.startingCost : "Starting cost: not clearly specified in the published fields; investigate.",
    facts.risks ? "Risks on file: " + facts.risks : "Risks: not clearly specified in the published fields; investigate.",
    facts.steps ? "Existing first-step guidance: " + facts.steps : "",
    "",
    "FOUNDER CONSTRAINTS",
    contextLines(data).join("\n") || "No structured founder constraints were supplied.",
    data.context.trim() ? "\nADDITIONAL FOUNDER NOTES (preserve the meaning; may contain mixed-language or comma-separated details)\n" + data.context.trim() : "",
    "",
    "REQUESTED OUTPUTS",
    selectedOutputs.map(output => "- " + output.label + ": " + output.instruction).join("\n"),
    "",
    "RESEARCH RULES",
    "- Respond in " + (data.language || "English") + ". Preserve local names and phrases where useful.",
    "- Interpret clear constraints in the founder's free text, but do not claim this website has independently verified them. If a city, state, budget, time limit or output request is ambiguous and materially changes the recommendation, ask up to three short questions. Otherwise state assumptions and continue.",
    "- Focus on the supplied Indian town/city/state when present. Research current local alternatives, buyer behaviour, competitor offerings, realistic costs and rules that actually apply. Cite working URLs and dates for material factual claims.",
    "- Separate the published record, current researched facts, estimates and assumptions. Never invent demand, market size, customer results, startup costs, legal permissions or success probabilities. When reliable evidence is missing, say so.",
    "- Do not recommend irreversible spending as the first proof. Give a low-cost test with a specific buyer, offer, observable commitment, evidence log and review/stop condition.",
    "- Finish with the next action the founder can complete in the real world. If an artifact cannot be generated in this session, provide the best useful alternative and be explicit.",
  ];
  return lines.filter(Boolean).join("\n").slice(0, 16000);
}

function compactPrefill(facts: IdeaFacts, data: ValidatePromptRequest): string {
  let location = clean(data.location, 70);
  let budget = clean(data.budgetINR, 45);
  let hours = clean(data.hoursPerWeek, 24);
  let buyer = clean(data.buyer, 70);
  let language = clean(data.language || "English", 30);
  let notes = clean(data.context, 110);
  let description = clean(facts.description || facts.summary, 140);
  const outputNames = VALIDATE_OUTPUTS.filter(output => data.outputs.includes(output.id)).map(output => output.label).join(", ");
  const compose = () => [
    "Research this published business idea for an Indian founder. Use current dated sources; cite URLs; separate facts, estimates and assumptions. Never invent demand, costs, laws or success odds. Ask up to three critical questions if needed, then continue with clearly labelled assumptions.",
    "IDEA: " + clean(facts.title, 100),
    "CATEGORY: " + clean(facts.category, 60),
    "DESCRIPTION: " + description,
    "SOURCE BUYER: " + clean(facts.buyer, 70),
    "REVENUE: " + clean(facts.revenue, 70),
    "STARTING COST: " + clean(facts.startingCost, 40),
    "RISKS: " + clean(facts.risks, 70),
    "FOUNDER: location=" + location + "; INR budget=" + budget + "; hours/week=" + hours + "; buyer=" + buyer + "; language=" + language,
    "OUTPUTS: " + outputNames,
    "OTHER NOTES: " + notes,
    "Assess reachable buyers, real alternatives, likely costs, the smallest reversible test, and a stop condition. End with one practical next action.",
  ].join("\n");
  let prompt = compose();
  while (encodeURIComponent(prompt).length > 6500 && notes.length > 8) {
    notes = notes.slice(0, Math.max(8, Math.floor(notes.length * 0.65)));
    prompt = compose();
  }
  while (encodeURIComponent(prompt).length > 6500 && description.length > 35) {
    description = description.slice(0, Math.max(35, Math.floor(description.length * 0.75)));
    prompt = compose();
  }
  while (encodeURIComponent(prompt).length > 6500 && buyer.length > 15) {
    buyer = buyer.slice(0, Math.max(15, Math.floor(buyer.length * 0.75)));
    prompt = compose();
  }
  while (encodeURIComponent(prompt).length > 6500 && location.length > 15) {
    location = location.slice(0, Math.max(15, Math.floor(location.length * 0.75)));
    prompt = compose();
  }
  return prompt;
}

const validateRequest = z.object({
  slug: z.string().min(1).max(200),
  location: z.string().trim().max(120).default(""),
  budgetINR: z.string().trim().max(60).default(""),
  hoursPerWeek: z.string().trim().max(40).default(""),
  skills: z.string().trim().max(300).default(""),
  language: z.string().trim().max(60).default("English"),
  buyer: z.string().trim().max(300).default(""),
  recentProblem: z.string().trim().max(300).default(""),
  currentWorkaround: z.string().trim().max(300).default(""),
  proposedOffer: z.string().trim().max(300).default(""),
  context: z.string().trim().max(VALIDATE_CONTEXT_MAX_LENGTH).default(""),
  outputs: z.array(z.enum(["report", "roadmap", "html", "infographic", "image"])).min(1).max(5).default(["report"]),
});

export const getValidatePrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => validateRequest.parse(input))
  .handler(async ({ data }) => {
    const idea = await getIdea({ data: { slug: data.slug } });
    if (idea) {
      const facts = factsFor(idea);
      return { prompt: fullPrompt(facts, data), prefillPrompt: compactPrefill(facts, data) };
    }
    const legacy = await getLegacyIdea({ data: { slug: data.slug } });
    if (!legacy) throw new Error("That published idea could not be found.");
    const facts = factsFor(legacy);
    return { prompt: fullPrompt(facts, data), prefillPrompt: compactPrefill(facts, data) };
  });
