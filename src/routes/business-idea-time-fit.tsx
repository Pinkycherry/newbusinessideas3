import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { getListsHub } from "@/lib/lists.functions";
import { getBrowseIdeas } from "@/lib/browse.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

const situations = [
  { name: "Alongside a job", constraint: "Keep your employer's time, equipment and confidential information separate. Check your contract before overlapping work.", test: "One clearly scoped evening or weekend order with a delivery window you can keep." },
  { name: "Around care work", constraint: "Account for interrupted hours and the people who rely on you. A delivery promise needs a backup.", test: "One order with a flexible handoff and a written availability limit." },
  { name: "While studying", constraint: "Protect classes and exam weeks. A promise due during an exam is an operating risk.", test: "A small time-boxed service or pre-order outside your busiest study period." },
] as const;
const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500";
const primary = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";
export const Route = createFileRoute("/business-idea-time-fit")({
  head: () => ({ meta: [
    { title: "Business Idea Time Fit for Founders in India | BusinessIdea.io" },
    { name: "description", content: "Map the hours a first sale requires around a job, care or studies. A practical founder checklist for a delivery promise you can keep." },
    { property: "og:title", content: "Can this business idea fit your week? | BusinessIdea.io" },
  ] }),
  loader: async () => {
    const hub = await getListsHub();
    const category = hub.categories.find(item => /part time|side hustle|student/i.test(item.name));
    const result = await getBrowseIdeas({ data: { q: "", category: category?.code ?? "", investment: "", time: "", skill: "", page: 1 } });
    return { categories: hub.categories, ideas: result.ideas };
  },
  component: TimeFitPage,
});
function TimeFitPage() {
  const { categories, ideas } = Route.useLoaderData();
  const related = categories.filter(item => /part time|side hustle|student|work from home/i.test(item.name)).slice(0, 6);
  const [situation, setSituation] = useState(0);
  const current = situations[situation] ?? situations[0];
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[
      webPageSchema({ path: "/business-idea-time-fit", name: "Business idea time fit in India", description: "Compare actual weekly capacity with setup, delivery and buffer hours for a first business test." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Business idea time fit", path: "/business-idea-time-fit" }]),
    ]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>Business idea time fit</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={wrap}><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">The hours behind the idea · India</span><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Can this business fit <span className="text-blue-700">the week you have?</span></h1><p className="mt-5 max-w-3xl text-lg text-slate-600">An idea can be cheap in rupees and expensive in evenings. Count setup, delivery and the hours that disappear when life happens before promising a first order.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/browse" className={primary}>Browse ideas <ArrowRight size={17}/></a><a href="#time-ledger" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Map one first sale</a></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">What cannot be moved?</h2><p className="mt-3 max-w-3xl text-slate-600">The right startup idea must survive your obligations. Choose a situation to see the first promise differently.</p><div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Starting situation">{situations.map((item, index) => <button type="button" key={item.name} aria-pressed={situation === index} onClick={() => setSituation(index)} className={`min-h-11 rounded-xl border px-5 py-3 font-semibold ${situation === index ? "border-blue-600 bg-blue-600 text-white" : "bg-white hover:border-blue-500"}`}>{item.name}</button>)}</div><article className={`${card} mt-5`} aria-live="polite"><h3 className="text-xl font-bold">{current.name}</h3><p className="mt-3 text-slate-600">{current.constraint}</p><strong className="mt-4 block text-blue-700">First test</strong><p className="mt-2 text-slate-600">{current.test}</p></article><a href="/business-idea-risk-check" className="mt-5 inline-flex font-semibold text-blue-700 hover:underline">Count the cash exposure alongside these hours <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section id="time-ledger" className="scroll-mt-28 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Put the delivery work inside your calendar.</h2><p className="mt-3 max-w-3xl text-slate-600">Begin with protected work, study, care, commute and rest. Use hours you can repeat without borrowing from those commitments.</p><ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{["Reliable hours each week", "Weeks in the first test", "First orders to attempt", "Work hours for each order", "One-time setup hours", "Buffer hours"].map((question, index) => <li className={card} key={question}><span className="text-sm font-bold text-blue-700">0{index + 1}</span><p className="mt-3 font-semibold">{question}</p></li>)}</ol></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">The sale includes work nobody sees.</h2><p className="mt-3 text-slate-600">Making the product is only part of the job. These tasks may recur for every order.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Before", "Prospecting, explaining, travel, quote and confirmation."],
      ["During", "Sourcing, production, coordination, quality and handoff."],
      ["After", "Collection, support, corrections and repeat contact."],
    ].map(([title, copy]) => <article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><a href="/first-customer-india" className="mt-6 inline-flex font-semibold text-blue-700 hover:underline">Map who pays and how to approach them <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section className="py-12 lg:py-16"><div className={`${wrap} grid items-center gap-8 lg:grid-cols-2`}><img className="w-full rounded-2xl object-cover" src="/images/categories/side-hustle-business-ideas-young-creators-income-streams.webp" alt="Original side hustle business ideas artwork showing young creators building income streams" loading="lazy" /><div><h2 className="text-3xl font-bold">Find work you can finish before promising scale.</h2><p className="mt-3 text-slate-600">Browse real published blueprints. Compare the first buyer, cash cost and delivery window with the hours you have. The featured category image is a route into the library, not proof that an idea fits.</p><a href="/blueprints" className="mt-5 inline-flex font-semibold text-blue-700 hover:underline">Browse published business idea blueprints <ArrowRight className="ml-2" size={17}/></a></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Write your boundary before taking an order.</h2><p className="mt-3 max-w-3xl text-slate-600">A smaller clear offer can teach you more than a broad promise that consumes every weekend.</p><ol className="mt-6 grid gap-4 md:grid-cols-3"><li className={card}><span className="text-sm font-bold text-blue-700">01</span><p className="mt-3 font-semibold">My first delivery boundary</p></li></ol></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">A yes can create a capacity problem.</h2><p className="mt-3 max-w-3xl text-slate-600">If several people want the same delivery slot, count the missing hours before accepting more work. Change price, waitlist, scope or support before promising work you cannot fulfil.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{[
      ["Cash: can bills wait until collection?", "Check the dated cash gap", "/startup-cash-flow-india"],
      ["Price: does one sale pay for its delivery effort?", "Price an honest order", "/business-pricing-india"],
    ].map(([title, action, href]) => <a className={card} href={href} key={href}><h3 className="text-xl font-bold">{title}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">{action}<ArrowRight size={17}/></span></a>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Published ideas to inspect</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <a className={card} href={`/idea/${idea.slug}`} key={idea.slug}><h3 className="text-xl font-bold">{idea.title}</h3><p className="mt-3 line-clamp-3 text-slate-600">{idea.hook || idea.summary}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Read idea <ArrowRight size={17}/></span></a>)}</div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Related categories</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(category => <a className={card} href={`/category/${category.slug}`} key={category.slug}><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Explore category <ArrowRight size={17}/></span></a>)}</div></div></section>
    <SellerFaq title="Questions from a crowded calendar" faq={[
      { q: "Should I count all free time?", a: "Start with repeatable hours after essential obligations and rest. Keep a buffer." },
      { q: "What if the first order takes longer?", a: "Record actual time, update your plan and narrow the next offer." },
      { q: "Does fitting my week mean the idea will sell?", a: "No. Capacity and demand are different questions. Speak to a buyer and test a defined priced offer." },
    ]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Make one promise your week can carry.</h2><p className="mt-3 max-w-3xl text-blue-100">Take the smallest deliverable version to one real buyer. Then check the cash, not just the calendar.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[
      ["Design a demand test", "/business-demand-test-india"], ["Set a loss boundary", "/business-idea-risk-check"], ["Browse ideas", "/browse"],
    ].map(([label, href]) => <a href={href} key={href} className="flex min-h-11 items-center justify-between rounded-xl bg-white p-4 font-semibold text-blue-800 hover:bg-blue-50">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </V2Frame>;
}
