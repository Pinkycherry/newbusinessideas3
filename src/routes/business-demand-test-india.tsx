import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ShortlistToggle } from "@/components/founder-workspace/shortlist-toggle";
import { ProviderPromptActions } from "@/components/founder-workspace/provider-prompt-actions";
import { useFounderWorkspace, type WorkspaceIdea } from "@/lib/founder-workspace";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { getListsHub } from "@/lib/lists.functions";
import { getBrowseIdeas } from "@/lib/browse.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500";
const primary = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";

type DemandTest = {
  idea: string; audience: string; offer: string; price: string; channel: string;
  deadline: string; ask: string; success: string; reached: string; details: string;
  commitments: string; notes: string;
};
const DEMAND_TEST_KEY = "bbi-demand-test-india-v1";
const EMPTY_TEST: DemandTest = {
  idea: "", audience: "", offer: "", price: "", channel: "", deadline: "",
  ask: "", success: "", reached: "0", details: "0", commitments: "0", notes: "",
};
function ideaForShortlist(idea: { slug: string; title: string; hook?: string; summary?: string; category_code?: string; investment_band?: string; time_needed?: string; skill_level?: string; work_mode?: string }): WorkspaceIdea {
  return {
    slug: idea.slug, title: idea.title, source: "published", hook: idea.hook,
    summary: idea.summary, description: idea.summary || idea.hook,
    categoryCode: idea.category_code, investmentBand: idea.investment_band,
    timeNeeded: idea.time_needed, skillLevel: idea.skill_level, workMode: idea.work_mode,
  };
}

export const Route = createFileRoute("/business-demand-test-india")({
  head: () => ({ meta: [
    { title: "Test Demand for a Business Idea in India | BusinessIdea.io" },
    { name: "description", content: "Design a small, honest demand test for a startup idea in India. Define the offer, audience and action, then separate polite interest from a booking or payment." },
    { property: "og:title", content: "Test demand for a business idea in India | BusinessIdea.io" },
    { property: "og:type", content: "article" },
  ] }),
  loader: async () => {
    const hub = await getListsHub();
    const category = hub.categories.find(item => /local service|home service|online service/i.test(item.name));
    const result = await getBrowseIdeas({ data: { q: "", category: category?.code ?? "", investment: "", time: "", skill: "", page: 1 } });
    return { categories: hub.categories, ideas: result.ideas };
  },
  component: DemandPage,
});
function DemandPage() {
  const { categories, ideas } = Route.useLoaderData();
  const related = categories.filter(item => /local|service|online/i.test(item.name)).slice(0, 6);
  const workspace = useFounderWorkspace();
  const [test, setTest] = useState<DemandTest>(EMPTY_TEST);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(DEMAND_TEST_KEY) || "null") as Partial<DemandTest> | null;
      if (saved && typeof saved === "object") {
        const restored = { ...EMPTY_TEST };
        (Object.keys(EMPTY_TEST) as (keyof DemandTest)[]).forEach(key => {
          if (typeof saved[key] === "string") restored[key] = saved[key] as string;
        });
        setTest(restored);
      }
    } catch { /* Keep the blank test if browser storage is unavailable. */ }
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (!storageReady) return;
    try { window.localStorage.setItem(DEMAND_TEST_KEY, JSON.stringify(test)); }
    catch { /* The planner remains usable for this visit if storage is unavailable. */ }
  }, [test, storageReady]);
  function updateTest<K extends keyof DemandTest>(key: K, value: DemandTest[K]) {
    setTest(current => ({ ...current, [key]: value }));
  }
  const testPrompt = [
    "Help an Indian founder run a small, ethical demand test. Do not invent demand, conversion benchmarks or legal conclusions. Use the founder's own success condition rather than a generic pass/fail score. Separate observations from interpretation.",
    "Selected published ideas: " + (workspace.shortlist.map(item => item.title).join("; ") || "none selected"),
    "Idea / offer: " + test.idea,
    "Target buyer: " + test.audience,
    "Defined offer: " + test.offer,
    "Price and currency: " + (test.price ? "₹" + test.price : "not set"),
    "Reach channel: " + test.channel,
    "Test end date: " + test.deadline,
    "Specific action requested: " + test.ask,
    "Founder-defined success condition: " + test.success,
    "Observed people reached: " + test.reached,
    "Asked for details: " + test.details,
    "Took the requested action: " + test.commitments,
    "Notes / verbatim evidence: " + test.notes,
    "Create a one-page test run sheet, neutral outreach message, daily recording table, interpretation limits, and next decision options. Do not label polite interest as a sale. Include privacy-conscious recording advice."
  ].join("\n");
  const compactTestPrompt = "Plan a small Indian business demand test. Idea: " + test.idea + ". Buyer: " + test.audience + ". Offer: " + test.offer + ". Price: " + (test.price ? "₹" + test.price : "not set") + ". Channel: " + test.channel + ". Deadline: " + test.deadline + ". Ask: " + test.ask + ". Success condition: " + test.success + ". Observed: reached " + test.reached + ", details " + test.details + ", commitments " + test.commitments + ". Notes: " + test.notes + ". Build a practical run sheet and distinguish interest from commitment; invent no benchmarks.";
  const reached = Math.max(0, Number(test.reached) || 0);
  const details = Math.max(0, Number(test.details) || 0);
  const commitments = Math.max(0, Number(test.commitments) || 0);
  const detailRate = reached > 0 ? Math.round(details / reached * 100) : null;
  const commitmentRate = reached > 0 ? Math.round(commitments / reached * 100) : null;
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[
      webPageSchema({ path: "/business-demand-test-india", name: "Test demand for a business idea in India", description: "Define a small offer and record the difference between people approached, requests for details and meaningful commitments." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Business demand test in India", path: "/business-demand-test-india" }]),
    ]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>Business demand test in India</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={wrap}><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">The moment after “sounds good”</span><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Will anyone make a <span className="text-blue-700">real move?</span></h1><p className="mt-5 max-w-3xl text-lg text-slate-600">Your business idea deserves a fair test before it takes your savings and weekends. Put one useful offer in front of the right person, ask for a specific action, and record what happened without rounding a maybe up to a yes.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/browse" className={primary}>Browse ideas <ArrowRight size={17}/></a><a href="#design-test" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Design a small test</a></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">A busy conversation can test the wrong thing.</h2><p className="mt-3 max-w-3xl text-slate-600">Interest in the problem, interest in your proposed solution and willingness to pay are separate questions. Name one for this round. If you ask a cousin whether your logo looks good, you have learned about a logo, not a paying customer.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Problem", "Can the buyer describe a recent, costly workaround?"],
      ["Offer", "Do they choose your specific scope over that workaround?"],
      ["Commitment", "Will they take a suitable next step at a stated price and date?"],
    ].map(([title, copy]) => <article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><a href="/business-idea-research-india" className="mt-6 inline-flex font-semibold text-blue-700 hover:underline">First check the buyer and current alternatives <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section id="design-test" className="scroll-mt-28 py-10 lg:py-12"><div className={wrap}>
      <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wide text-blue-700">Practical demand-test planner</p><h2 className="mt-2 text-3xl font-bold">Set the test before you contact anyone.</h2><p className="mt-3 text-slate-600">Choose one buyer group, one defined offer and one action. Record what people actually do. Your plan and counts are saved in this browser only.</p></div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6">
          <label className="text-sm font-semibold sm:col-span-2">Which idea or offer are you testing?<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" value={test.idea} onChange={event=>updateTest("idea",event.target.value)} placeholder="Use a shortlisted idea or describe your offer"/></label>
          <label className="text-sm font-semibold sm:col-span-2">Who is the specific buyer?<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" value={test.audience} onChange={event=>updateTest("audience",event.target.value)} placeholder="Role, need and reachable location"/></label>
          <label className="text-sm font-semibold sm:col-span-2">What exactly will you offer?<textarea className="mt-2 block min-h-24 w-full rounded-xl border p-3 font-normal" rows={3} value={test.offer} onChange={event=>updateTest("offer",event.target.value)} placeholder="Scope, quantity, delivery and what is excluded"/></label>
          <label className="text-sm font-semibold">Price / pilot amount (₹)<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" type="number" min="0" inputMode="decimal" value={test.price} onChange={event=>updateTest("price",event.target.value)} placeholder="State the real amount"/></label>
          <label className="text-sm font-semibold">Where will you reach them?<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" value={test.channel} onChange={event=>updateTest("channel",event.target.value)} placeholder="Market, referral, calls, local group…"/></label>
          <label className="text-sm font-semibold">When will this test end?<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" type="date" value={test.deadline} onChange={event=>updateTest("deadline",event.target.value)}/></label>
          <label className="text-sm font-semibold">What action will you ask for?<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" value={test.ask} onChange={event=>updateTest("ask",event.target.value)} placeholder="Book, pay deposit, order sample, schedule…"/></label>
          <label className="text-sm font-semibold sm:col-span-2">What result would make you continue or change the offer?<textarea className="mt-2 block min-h-20 w-full rounded-xl border p-3 font-normal" rows={2} value={test.success} onChange={event=>updateTest("success",event.target.value)} placeholder="Set your own threshold before seeing the result"/></label>
          <div className="sm:col-span-2"><h3 className="text-lg font-bold">Record the response</h3><p className="mt-1 text-sm text-slate-600">Keep the stages separate. A person asking for details has not necessarily committed.</p></div>
          <label className="text-sm font-semibold">People who saw the offer<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" type="number" min="0" value={test.reached} onChange={event=>updateTest("reached",event.target.value)}/></label>
          <label className="text-sm font-semibold">Asked for details<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" type="number" min="0" value={test.details} onChange={event=>updateTest("details",event.target.value)}/></label>
          <label className="text-sm font-semibold">Took the requested action<input className="mt-2 block min-h-11 w-full rounded-xl border px-3 font-normal" type="number" min="0" value={test.commitments} onChange={event=>updateTest("commitments",event.target.value)}/></label>
          <label className="text-sm font-semibold sm:col-span-2">What did people actually say or do?<textarea className="mt-2 block min-h-24 w-full rounded-xl border p-3 font-normal" rows={3} value={test.notes} onChange={event=>updateTest("notes",event.target.value)} placeholder="Record direct observations; remove private identifiers"/></label>
          <p className="text-xs text-slate-500 sm:col-span-2">Saved locally in this browser. It is not sent to the BusinessIdea.io database. Avoid storing personal or confidential customer information.</p>
        </div>
        <aside className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-6" aria-live="polite"><h3 className="text-xl font-bold">Your test snapshot</h3><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white p-3"><span className="text-xs text-slate-600">Reached</span><strong className="mt-1 block text-2xl">{reached}</strong></div><div className="rounded-xl bg-white p-3"><span className="text-xs text-slate-600">Asked details</span><strong className="mt-1 block text-2xl">{details}</strong></div><div className="rounded-xl bg-white p-3"><span className="text-xs text-slate-600">Took action</span><strong className="mt-1 block text-2xl">{commitments}</strong></div><div className="rounded-xl bg-white p-3"><span className="text-xs text-slate-600">Action / reached</span><strong className="mt-1 block text-2xl">{commitmentRate === null ? "—" : commitmentRate + "%"}</strong></div></div><p className="mt-4 text-sm text-slate-700">Asked-for-details rate: <strong>{detailRate === null ? "—" : detailRate + "%"}</strong>. These are counts from your entries, not a market benchmark or proof of demand.</p><div className="mt-4 rounded-xl bg-white p-3"><span className="text-sm font-semibold">Your pre-set success condition</span><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{test.success || "Set your own condition before interpreting the responses."}</p></div><div className="mt-4 rounded-xl bg-white p-3"><span className="text-sm font-semibold">What happens next?</span><p className="mt-1 text-sm text-slate-700">If people show interest but do not act, inspect price, timing, trust and scope. If they act, fulfil the small promise and record the real cost and repeat choice.</p></div></aside>
      </div>
      <div className="mt-6"><ProviderPromptActions title="Prepare a test plan with AI" prompt={testPrompt} prefillPrompt={compactTestPrompt}/></div>
    </div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Make the decision easy to understand.</h2><p className="mt-3 max-w-3xl text-slate-600">A polished teaser may attract clicks that vanish when price, delivery or trust becomes real. Include the inconvenient details early enough that the answer means something.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Price", "State the amount.", "Include what is and is not covered. If you cannot quote it yet, use the first-price workbench."],
      ["Delivery", "Name the work and date.", "Promise only what you can serve in the first small version."],
      ["Trust", "Explain the terms.", "Show identity, contact, cancellation and refund conditions where relevant."],
    ].map(([label, title, copy], index) => <article className={card} key={label}><span className="text-sm font-bold uppercase text-blue-700">0{index + 1} · {label}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><a href="/business-pricing-india" className="mt-6 inline-flex font-semibold text-blue-700 hover:underline">Use the first-price workbench <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Count actions without inventing a verdict.</h2><p className="mt-3 text-slate-600">Keep these observations separate; a request for details is not a booking.</p><ol className="mt-6 grid gap-4 md:grid-cols-3">{["People who saw the offer", "Asked for details", "Took the agreed action"].map((question, index) => <li className={card} key={question}><span className="text-sm font-bold text-blue-700">0{index + 1}</span><p className="mt-3 font-semibold">{question}</p></li>)}</ol></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={`${wrap} grid items-center gap-8 lg:grid-cols-2`}><img className="w-full rounded-2xl object-cover" src="/images/blog/how-to-find-your-first-paying-customer-without-spending-on-ads.webp" alt="Original featured artwork for the first paying customer article" loading="lazy" /><div><h2 className="text-3xl font-bold">Check the route before blaming the idea.</h2><p className="mt-3 text-slate-600">Did the message reach the payer, or just the person who likes the concept? Could they understand the price and next step? Silence is evidence about this offer and route. Try a clearer or smaller version before buying more reach.</p><div className="mt-5 flex flex-col gap-3"><a href="/first-customer-india" className="font-semibold text-blue-700 hover:underline">Map the first payer and approach <ArrowRight className="inline" size={17}/></a><a href="/blog/find-first-paying-customer-without-ads" className="font-semibold text-blue-700 hover:underline">Read the original first-customer article <ArrowRight className="inline" size={17}/></a></div></div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">One yes is a beginning. One no is a clue.</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["No response", "Check the audience, channel and clarity. Do not pay for scale until the right person understands the ask."],
      ["Details, no action", "Ask what prevented a decision: price, timing, trust, scope or a weaker problem than expected."],
      ["Action", "Deliver the small promise, record all costs and follow up on whether they would choose it again. A first sale is evidence, not automatic repeat demand."],
    ].map(([title, copy]) => <article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Can you afford to fulfil the test?</h2><p className="mt-3 max-w-3xl text-slate-600">If a customer pays after delivery, the first order may still require cash you do not have. Check supplies, travel, refunds and payment timing before you invite a second order.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{[
      ["Upfront need", "Map cash before opening", "/startup-costs-india"],
      ["Payment timing", "Put due dates beside collections", "/startup-cash-flow-india"],
    ].map(([title, copy, href]) => <a className={card} href={href} key={href}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p><ArrowRight className="mt-4 text-blue-700" size={17}/></a>)}</div></div></section>
    <section className="py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Published ideas to inspect</h2><p className="mt-2 max-w-3xl text-slate-600">Start with a published idea, compare it with alternatives or take it into the demand-test planner.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5" key={idea.slug}><h3 className="break-words text-lg font-bold leading-snug text-slate-950">{idea.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{idea.hook || idea.summary}</p><div className="mt-4 grid gap-2"><a href={`/idea/${idea.slug}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">Read full idea <ArrowRight size={15}/></a><ShortlistToggle idea={ideaForShortlist(idea)} compact className="w-full [&>button]:w-full"/><a href={`/idea/${idea.slug}#idea-validate`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-blue-500 hover:bg-blue-50">Validate this idea <ArrowRight size={15}/></a></div></article>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Related categories</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(category => <a className={card} href={`/category/${category.slug}`} key={category.slug}><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Explore category <ArrowRight size={17}/></span></a>)}</div></div></section>
    <SellerFaq title="Questions a small test can answer" faq={[
      { q: "Is a waitlist enough to validate demand?", a: "It shows interest in a promise, not a purchase. State what happens next and compare later actions against those sign-ups." },
      { q: "Should I take money before the product exists?", a: "Only if you can describe the offer honestly, fulfil it, and meet the rules and obligations for your specific activity. A small real pilot is often clearer than a vague pre-order." },
      { q: "How many people should I ask?", a: "Choose a reachable buyer group and a stopping condition in advance. The goal is to learn the objection and behaviour, not hit an arbitrary universal interview count." },
    ]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Take the answer seriously.</h2><p className="mt-3 max-w-3xl text-blue-100">Record what the buyer actually did and what it cost you. If the result is uncertain, narrow the promise and test again before taking on fixed expense.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[
      ["Use the validation field guide", "/startup-idea-validation"], ["Check the countercase", "/business-idea-research-india"], ["Browse ideas", "/browse"],
    ].map(([label, href]) => <a href={href} key={href} className="flex min-h-11 items-center justify-between rounded-xl bg-white p-4 font-semibold text-blue-800 hover:bg-blue-50">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </V2Frame>;
}
