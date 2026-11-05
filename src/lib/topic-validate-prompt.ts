/**
 * The ONE backend prompt template behind the Validate button on every India topic page (founder rules, 5 Nov 2026).
 * Filled from the page (title, key questions), today's date, the visitor's one-tap answers (language, place,
 * online or offline, budget band, social following, stage, page add-ons) and the tick boxes on the page.
 * Two lengths from the same template: "full" for ChatGPT, Claude and Perplexity; "short" for Grok, which fails on long prompts.
 * No padded words. The same function runs on the server (default prompt) and in the browser (after every tap or tick).
 */
export type TopicPromptState = {
  title: string;
  questions: string[];
  date: string;
  answers: Record<string, string>;
  ticked: string[];
  notYet: string[];
};

export function buildTopicPrompt(s: TopicPromptState, short: boolean): string {
  const lang = s.answers["Language"] || "English";
  const me = Object.keys(s.answers).filter((k) => k !== "Language" && s.answers[k]).map((k) => k + ": " + s.answers[k]).join("; ");
  const cut = (a: string[], n: number) => a.slice(0, n).map((t) => t.replace(/\*\*/g, "").slice(0, 90).replace(/[.;,\s]+$/, "")).join("; ");
  if (short) {
    return [
      s.date + '. Help me with "' + s.title + (/india/i.test(s.title) ? '".' : '" in India.'),
      me ? "Me: " + me + "." : "",
      s.ticked.length ? "True for me: " + cut(s.ticked, 4) + "." : "",
      "Ask me 3 short questions first, one at a time. Then answer for my case: steps, today's ₹ figures with official Indian sources.",
      "Reply in everyday spoken " + lang + ", short sentences, not textbook. End with a 7-day plan.",
    ].filter(Boolean).join("\n");
  }
  return [
    "Today is " + s.date + '. I am a first-time founder in India. Topic: "' + s.title + '".',
    me ? "About me: " + me + "." : "About me: not shared yet.",
    s.ticked.length ? "From the page checklist, true for me: " + cut(s.ticked, 8) + "." : "",
    s.notYet.length ? "Not done yet: " + cut(s.notYet, 8) + "." : "",
    "Before answering, ask me 3 to 5 short questions about what is missing (my town, the exact business, my timeline). Ask one at a time and wait for each reply.",
    "Then answer only for my situation: practical steps, today's figures in ₹ with the date and an official Indian source (.gov.in, RBI, PIB, the scheme's portal), state or city differences, and say plainly when you are unsure.",
    "Write in " + lang + " the way people in my area speak every day: short, simple, friendly. No textbook or formal words; keep words people really use, like UPI, GST, loan, shop.",
    s.questions.length ? "Cover: " + s.questions.slice(0, 6).join("; ") + "." : "",
    "End with my next 7 days, one task per day.",
  ].filter(Boolean).join("\n");
}

/** Server-side default (before the visitor taps anything). */
export function topicValidatePrompt({ title, questions, date }: { title: string; topic?: string; questions: string[]; date: Date }): { prompt: string; prefillPrompt: string; state: TopicPromptState } {
  const today = date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  const state: TopicPromptState = { title, questions: questions.filter(Boolean), date: today, answers: {}, ticked: [], notYet: [] };
  return { prompt: buildTopicPrompt(state, false), prefillPrompt: buildTopicPrompt(state, false), state };
}

/** One-tap questions shown above the Validate button on every topic page. Pages may add their own groups. */
export const COMMON_INPUTS: { label: string; options: string[] }[] = [
  { label: "Language", options: ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Odia", "Punjabi"] },
  { label: "Where I live", options: ["Metro city", "Tier 2 city", "Small town", "Village"] },
  { label: "How I want to sell", options: ["Online", "Offline (shop or local)", "Both"] },
  { label: "Budget", options: ["Under ₹10,000", "₹10,000–50,000", "₹50,000–1 lakh", "₹1–5 lakh", "Above ₹5 lakh"] },
  { label: "Social media following", options: ["None", "Under 1,000", "1,000–10,000", "Above 10,000"] },
  { label: "Stage", options: ["Just an idea", "Testing with buyers", "Already selling"] },
];
