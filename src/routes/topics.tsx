import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, ChartNoAxesCombined, Compass, SearchCheck } from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { TOPIC_PAGES } from "@/data/topic-pages";
import { absoluteUrl } from "@/lib/schema";

/**
 * /topics: the hub for every "Answers for India" page (6 Nov 2026). Replaces the purchased
 * template whose links pointed at ./pages/*.html files that never existed on this site.
 */
export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Answers for India: starting, checking and funding a small business | bbusiness.online" },
      { name: "description", content: "Plain answers for Indian founders: how to check an idea, how much money you need, where funding comes from and which numbers to track. Free to read." },
      { property: "og:title", content: "Answers for India | bbusiness.online" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/topics") }],
  }),
  component: TopicsPage,
});

const GROUPS = [
  { I: SearchCheck, c: "pink", t: "Check your idea first", test: /validat|good|talk-to-customers|demand|competitor|product-market|mvp/ },
  { I: BadgeIndianRupee, c: "", t: "Money and funding", test: /fund|raise|money|investor|runway|government|bank-loan|co-founder/ },
  { I: ChartNoAxesCombined, c: "blue", t: "The numbers to track", test: /customer-acquisition|lifetime|tam-sam|numbers|coming-back/ },
  { I: Compass, c: "teal", t: "Starting right", test: /.*/ },
];

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

function TopicsPage() {
  const used = new Set<string>();
  const groups = GROUPS.map((g) => {
    const pages = TOPIC_PAGES.filter((p) => !used.has(p.slug) && g.test.test(p.slug));
    pages.forEach((p) => used.add(p.slug));
    return { ...g, pages };
  }).filter((g) => g.pages.length);

  return (
    <V2Frame>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f1efff,#faf9ff_60%,#fff)] pt-28 pb-10 sm:pt-32">
        <div className={wrap + " text-center"}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4643ba]">Answers for India</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">The questions people ask before they start.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{TOPIC_PAGES.length} plain answers on checking an idea, finding the money and reading your numbers. Written for Indian towns and cities, free to read, no sign-up.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="/startup-idea-validation" className="g-btn g-shine">Check your own idea <ArrowRight size={16} /></a>
            <Link to="/browse" className="g-btn-light">Browse business ideas</Link>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className={wrap + " grid gap-6 lg:grid-cols-2"}>
          {groups.map(({ I, c, t, pages }) => (
            <div key={t} className="g-tile p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className={"g-icon " + c}><I aria-hidden size={24} /></span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">{t}</h2>
                  <p className="text-xs text-slate-500">{pages.length} answers</p>
                </div>
              </div>
              <ul className="mt-5 grid gap-2.5">
                {pages.map((p) => (
                  <li key={p.slug}>
                    <a href={`/${p.slug}`} className="g-link">
                      <span>
                        <span className="block font-semibold">{p.seo.title.replace(/:.*$/, "")}</span>
                        <span className="mt-0.5 line-clamp-2 text-xs font-normal text-slate-500">{p.seo.description}</span>
                      </span>
                      <span className="g-arrow"><ArrowRight aria-hidden size={15} /></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <div className={wrap}>
          <div className="g-tile grid items-center gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Want the numbers for your own town?</h2>
              <p className="mt-2 text-slate-600">Every answer here points to the Validate button. It takes your town, budget and time into an AI tool you already use, so the figures fit your street, not an average.</p>
            </div>
            <a href="/startup-idea-validation" className="g-btn">Validate an idea free <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </V2Frame>
  );
}
