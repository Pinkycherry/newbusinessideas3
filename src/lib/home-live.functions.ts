import { createServerFn } from "@tanstack/react-start";
import { db } from "./live-ideas.functions";

export type HomeIdea = {
  slug: string;
  title: string;
  summary: string | null;
  category_name: string | null;
  category_slug: string | null;
  target_customer: string | null;
  how_you_make_money: string | null;
  cons_json: unknown;
  verdict: string | null;
  updated_at: string | null;
};

export type HomeLive = { recent: HomeIdea[]; weekCount: number; street: HomeIdea[] };

/** Hand-picked first reads: small, Indian, start-from-home ideas. The first is the hero example. */
const PICKS = [
  "pg-student-tiffin-plan",
  "neighbourhood-school-subject-tuition",
  "tailoring-skills-classes-home",
  "night-shift-dinner-tiffin",
  "mathematics-doubt-solving-evening-tuition",
  "blouse-kurti-pattern-pdfs-home-tailors",
  "home-cook-tiffin-relay",
  "boutique-tailor-page-handling",
  "school-tiffin-savoury-bake-orders",
];

const STREET_CATS = ["home-kitchen-food-business-ideas", "street-food-business-ideas", "home-based-business-ideas", "work-from-home-business-ideas", "tuition-and-coaching-business-ideas", "tailoring-and-boutique-business-ideas"];

/** Real, recently updated blueprints and how many changed in the last seven days. */
export const getHomeLive = createServerFn({ method: "GET" }).handler(async (): Promise<HomeLive> => {
  try {
    const client = db();
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const [recent, week, street] = await Promise.all([
      client
        .from("ideas")
        .select("slug,title,summary,category_name,category_slug,target_customer,how_you_make_money,cons_json,verdict,updated_at")
        .eq("status", "completed")
        .in("slug", PICKS),
      client.from("ideas").select("slug", { count: "exact", head: true }).eq("status", "completed").gte("updated_at", since),
      // Home row "start from home or your own street" (founder, 10 Nov 2026): 24 real ideas from the home and street categories.
      // One small query per category, so one busy category cannot fill the row.
      Promise.all(STREET_CATS.map((c) => client.from("ideas").select("slug,title,summary,category_name,category_slug,updated_at").eq("status", "completed").eq("category_slug", c).order("updated_at", { ascending: false }).limit(5))),
    ]);
    const rows = (recent.data ?? []) as HomeIdea[];
    const ordered = PICKS.map((slug) => rows.find((r) => r.slug === slug)).filter((r): r is HomeIdea => Boolean(r));
    // Spread across the categories: take turns, so one category never fills the row.
    const byCat = street.map((q) => ((q.data ?? []) as HomeIdea[]).filter((r) => !PICKS.includes(r.slug)));
    const mixed: HomeIdea[] = [];
    for (let i = 0; mixed.length < 24 && i < 5; i++) for (const list of byCat) { const r = list[i]; if (r && mixed.length < 24) mixed.push(r); }
    return { recent: ordered, weekCount: week.count ?? 0, street: mixed };
  } catch (e) {
    console.error("home live", e);
    return { recent: [], weekCount: 0, street: [] };
  }
});
