import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { getListsHub } from "@/lib/lists.functions";
import { getBrowseIdeas } from "@/lib/browse.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

const gates = [
  { week: "01", title: "Buyer before name", decision: "Who has this problem now, and what do they do instead?", evidence: "At least one actual buyer conversation and a dated workaround you observed.", miss: "A friend saying the idea sounds good is encouragement, not a buyer.", link: "/first-customer-india", action: "Map the first payer" },
  { week: "02", title: "An offer with edges", decision: "What is the smallest deliverable someone could accept and pay for?", evidence: "A clear scope, price, delivery time and exclusion shown to a prospective buyer.", miss: "A broad business category gives the buyer nothing concrete to accept.", link: "/business-demand-test-india", action: "Test a priced commitment" },
  { week: "03", title: "The money boundary", decision: "What cash must leave before payment comes back?", evidence: "Setup, direct costs and payment date written on one page, with a limit you can bear.", miss: "A positive per-sale remainder cannot pay a bill due before the sale.", link: "/startup-costs-india", action: "Count the first cost" },
  { week: "04", title: "One fulfilled promise", decision: "Can you deliver safely, on time and at the cost you expected?", evidence: "One small real or ethically arranged trial, the result, buyer response and the next change.", miss: "A paid booking without workable delivery is not a repeatable operation.", link: "/unit-economics-india", action: "Check one order" },
] as const;
const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500";
const primary = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";
export const Route = createFileRoute("/startup-launch-plan-india")({
  head: () => ({ meta: [
    { title: "Startup Launch Plan in India: Four Evidence Gates | BusinessIdea.io" },
    { name: "description", content: "A practical startup launch plan for India: buyer, offer, cash and fulfilment gates with evidence questions and working founder tools." },
    { property: "og:title", content: "Startup launch plan for Indian founders | BusinessIdea.io" },
  ] }),
  loader: async () => {
    const hub = await getListsHub();
    const category = hub.categories.find(item => /video and reel|service|freelance/i.test(item.name));
    const result = await getBrowseIdeas({ data: { q: "", category: category?.code ?? "", investment: "", time: "", skill: "", page: 1 } });
    return { categories: hub.categories, ideas: result.ideas };
  },
  component: LaunchPlanPage,
});
function LaunchPlanPage() {
  const { categories, ideas } = Route.useLoaderData();
  const related = categories.filter(item => /service|freelance|video and reel|part time/i.test(item.name)).slice(0, 6);
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[
      webPageSchema({ path: "/startup-launch-plan-india", name: "Startup launch plan in India", description: "Evidence gates for testing a buyer, offer, cash boundary and fulfilled promise before expanding a startup idea." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Startup launch plan in India", path: "/startup-launch-plan-india" }]),
    ]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>Startup launch plan in India</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={`${wrap} grid items-center gap-8 lg:grid-cols-2`}><div><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">A field plan · India</span><h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">Do not launch a whole company <span className="text-blue-700">to answer one question.</span></h1><p className="mt-5 text-lg text-slate-600">A startup launch plan is useful when it makes the next commitment smaller. Use weekly gates to learn whether a real buyer, a priced offer, a cash boundary and a fulfilled promise can stand together. Weeks are a sequence of decisions, not a guarantee of a launch date.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/browse" className={primary}>Browse ideas <ArrowRight size={17}/></a><a href="#four-gates" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Open the evidence gates</a></div></div><img className="w-full rounded-2xl object-cover" src="/images/guides/business-idea-validation-framework-test-before-you-build.webp" alt="Original business idea validation guide artwork about testing before building" /></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Your calendar is already full of obligations.</h2><p className="mt-3 max-w-3xl text-slate-600">A job, studies, caregiving, a supplier's terms or rent can make a fashionable launch checklist harmful. Choose one bounded test that fits the time and cash you can actually spare. If a gate takes longer than a week, carry it forward; the number on the calendar is not evidence.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{[
      ["If time is tight", "Protect a repeatable work window before agreeing to the first order.", "Map available hours against the full first sale", "/business-idea-time-fit"],
      ["If cash is tight", "Decide what you can risk before paying a deposit or buying stock.", "Write a reversible boundary", "/business-idea-risk-check"],
    ].map(([title, copy, action, href]) => <a href={href} className={card} key={href}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">{action}<ArrowRight size={17}/></span></a>)}</div></div></section>
    <section id="four-gates" className="scroll-mt-28 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">What must be true before you move on?</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{gates.map(gate => <article className={card} key={gate.week}><span className="text-sm font-bold text-blue-700">{gate.week}</span><h3 className="mt-3 text-xl font-bold">{gate.title}</h3><p className="mt-3 font-semibold">{gate.decision}</p><p className="mt-3 text-slate-600">{gate.evidence}</p><p className="mt-3 text-sm text-slate-600">{gate.miss}</p><a href={gate.link} className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline">{gate.action}<ArrowRight size={17}/></a></article>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">The answer may be “wait”.</h2><p className="mt-3 max-w-3xl text-slate-600">If the buyer needs a different scope, a safer delivery method or more time to pay, pause the next spend. Revising a small offer is often cheaper than defending a large setup. Write the condition that would change your mind.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["I need better buyer evidence", "Record a claim, source, date and countercase from your own setting.", "/business-idea-research-india"],
      ["I have two plausible directions", "Compare the same buyer and cash questions fairly.", "/startup-idea-comparison"],
      ["The money comes too late", "Put collection and obligations on one dated calendar.", "/startup-cash-flow-india"],
    ].map(([title, copy, href]) => <a className={card} href={href} key={href}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p><ArrowRight className="mt-4 text-blue-700" size={17}/></a>)}</div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">From an idea to one delivered order.</h2><p className="mt-3 max-w-3xl text-slate-600">Imagine a founder who can offer a bounded editing job after work. These are example actions, not invented market results or a promise that a buyer will agree.</p><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
      "Ask a creator what happened the last time footage waited unedited. Record the workaround, payer and deadline.",
      "Offer one short edit with one revision, a clear fee, delivery date and excluded work.",
      "Count software, chosen hours and any deposit or fee before agreeing to the price.",
      "Complete one accepted job, note the actual hours and ask whether the outcome met the brief.",
    ].map((copy, index) => <article className={card} key={copy}><span className="text-sm font-bold text-blue-700">0{index + 1}</span><p className="mt-3 text-slate-600">{copy}</p></article>)}</div>{ideas[0] && <a href={`/idea/${ideas[0].slug}`} className="mt-6 inline-flex font-semibold text-blue-700 hover:underline">Open a published blueprint <ArrowRight className="ml-2" size={17}/></a>}</div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={`${wrap} grid items-center gap-8 lg:grid-cols-2`}><img className="w-full rounded-2xl object-cover" src="/images/blog/how-to-find-your-first-paying-customer-without-spending-on-ads.webp" alt="Original featured artwork for finding the first paying customer" loading="lazy" /><div><h2 className="text-3xl font-bold">Keep the buyer in the frame.</h2><p className="mt-3 text-slate-600">The original customer article follows specific ways to reach and learn from a first payer without buying ads. The source validation guide explains the broader test-before-build method; interpret its startup language for the smaller offer you can actually make.</p><div className="mt-5 flex flex-col gap-3"><a href="/blog/find-first-paying-customer-without-ads" className="font-semibold text-blue-700 hover:underline">Read the first-paying-customer article <ArrowRight className="inline" size={17}/></a><a href="/startup-guides/business-idea-validation-framework" className="font-semibold text-blue-700 hover:underline">Read the full validation guide <ArrowRight className="inline" size={17}/></a></div></div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Published ideas to inspect</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <a className={card} href={`/idea/${idea.slug}`} key={idea.slug}><h3 className="text-xl font-bold">{idea.title}</h3><p className="mt-3 line-clamp-3 text-slate-600">{idea.hook || idea.summary}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Read idea <ArrowRight size={17}/></span></a>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Related categories</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(category => <a className={card} href={`/category/${category.slug}`} key={category.slug}><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Explore category <ArrowRight size={17}/></span></a>)}</div></div></section>
    <SellerFaq title="Questions to keep on the desk" faq={[
      { q: "What if I cannot finish a gate in one week?", a: "Carry the question forward. The weeks are an order of work, not a deadline or an automated verdict. Do not spend at the next gate merely to keep the calendar tidy." },
      { q: "Does one paid order prove the whole business?", a: "No. It can show that one buyer accepted one offer. Repeatability, delivery quality, cash timing and other buyers still need testing." },
      { q: "Are positive comments enough to pass a gate?", a: "Praise is not the same as a booking, payment or delivered outcome. The evidence gap still needs a real test." },
    ]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">One question. One test. One cost boundary.</h2><p className="mt-3 max-w-3xl text-blue-100">Take the earliest unanswered gate and do the smallest field action that would change a decision. Return to your source idea when you have something to add.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[
      ["Open the validation field guide", "/startup-idea-validation"], ["Browse real idea blueprints", "/blueprints"], ["Explore guides", "/startup-guides"],
    ].map(([label, href]) => <a href={href} key={href} className="flex min-h-11 items-center justify-between rounded-xl bg-white p-4 font-semibold text-blue-800 hover:bg-blue-50">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </V2Frame>;
}
