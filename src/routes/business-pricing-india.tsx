import { useState } from "react";
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

const rupees = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const value = (s: string) => Math.max(0, Number(s) || 0);
const offers = [
  { name: "Service", question: "What exactly is included?", detail: "Quote the outcome, revision limit, date and travel. Count finding the client and following up, not only the delivery hour." },
  { name: "Product", question: "What reaches the buyer?", detail: "Count packaging, damage, delivery, payment fees and returns. A supplier's price is only one line of the sale." },
  { name: "Repeat offer", question: "What happens next month?", detail: "Define the renewal, support and stopping terms. A repeated charge needs repeated value and delivery work." },
] as const;
const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500";
const primary = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";
const input = "mt-2 block min-h-11 w-full rounded-xl border bg-white px-3 outline-none focus:border-blue-600";


function ideaForShortlist(idea: { slug: string; title: string; hook?: string; summary?: string; category_code?: string; investment_band?: string; time_needed?: string; skill_level?: string; work_mode?: string }): WorkspaceIdea {
  return {
    slug: idea.slug, title: idea.title, source: "published", hook: idea.hook,
    summary: idea.summary, description: idea.summary || idea.hook,
    categoryCode: idea.category_code, investmentBand: idea.investment_band,
    timeNeeded: idea.time_needed, skillLevel: idea.skill_level, workMode: idea.work_mode,
  };
}

export const Route = createFileRoute("/business-pricing-india")({
  head: () => ({ meta: [
    { title: "Business Pricing in India: Quote a First Sale with Real Costs | BusinessIdea.io" },
    { name: "description", content: "Build a transparent first-price worksheet for a business idea in India. Compare direct cost, owner time, monthly commitments and realistic sales capacity." },
    { property: "og:title", content: "Business pricing in India | BusinessIdea.io" },
    { property: "og:type", content: "article" },
  ] }),
  loader: async () => {
    const hub = await getListsHub();
    const category = hub.categories.find(item => /service|food processing|e-commerce/i.test(item.name));
    const result = await getBrowseIdeas({ data: { q: "", category: category?.code ?? "", investment: "", time: "", skill: "", page: 1 } });
    return { categories: hub.categories, ideas: result.ideas };
  },
  component: PricingPage,
});

function PricingPage() {
  const { categories, ideas } = Route.useLoaderData();
  const related = categories.filter(item => /service|food processing|e-commerce/i.test(item.name)).slice(0, 6);
  const workspace = useFounderWorkspace();
  const [quoteBuyer, setQuoteBuyer] = useState(workspace.context.buyer);
  const [quoteOutcome, setQuoteOutcome] = useState("");
  const [quoteIncluded, setQuoteIncluded] = useState("");
  const [quoteExcluded, setQuoteExcluded] = useState("");
  const [quoteDelivery, setQuoteDelivery] = useState("");
  const [quotePayment, setQuotePayment] = useState("");
  const selectedIdeaText = workspace.shortlist.length
    ? workspace.shortlist.map((idea, index) => `${index + 1}. ${idea.title} — ${idea.summary || idea.description || "Use only verified published details"}`).join("\n")
    : "No idea selected in the comparison shortlist.";
  const quotePrompt = [
    "Help an Indian founder prepare a clear, commercially realistic first quote. Do not invent customer demand, legal requirements, GST treatment or market prices. Ask concise questions where essential details are missing. Separate entered facts, estimates and assumptions.",
    "Selected published ideas:",
    selectedIdeaText,
    "Calculator inputs (INR unless stated):",
    `Proposed price per sale: ${price || "not entered"}`,
    `Materials / stock / subcontracting per sale: ${materials || "not entered"}`,
    `Delivery, fees and returns allowance per sale: ${fees || "not entered"}`,
    `Hours per sale: ${hours || "not entered"}`,
    `Founder time value per hour: ${hourValue || "not entered"}`,
    `Fixed monthly costs: ${fixed || "not entered"}`,
    `Sales capacity per month: ${units || "not entered"}`,
    `Calculated direct cash per sale: ₹${direct}`,
    `Calculated founder time value per sale: ₹${time}`,
    `Calculated fixed-cost share per sale: ${capacity > 0 ? "₹" + Math.round(share) : "not available"}`,
    `Calculated cost-covering price at entered volume: ${capacity > 0 ? "₹" + Math.round(floor) : "not available"}`,
    `Calculated monthly result after entered costs: ${ready ? "₹" + Math.round(month) : "not available"}`,
    "Founder quote brief:",
    `Buyer: ${quoteBuyer || "not specified"}`,
    `Promised outcome: ${quoteOutcome || "not specified"}`,
    `Included scope: ${quoteIncluded || "not specified"}`,
    `Excluded scope: ${quoteExcluded || "not specified"}`,
    `Delivery / completion terms: ${quoteDelivery || "not specified"}`,
    `Payment / collection terms: ${quotePayment || "not specified"}`,
    "Produce: (1) a buyer-facing quote draft, (2) clear scope and exclusions, (3) a transparent cost/price explanation using only the figures above, (4) questions to resolve before sending, and (5) a short negotiation boundary. Do not present the worksheet as tax or legal advice."
  ].join("\n");
  const compactQuotePrompt = [
    "Prepare an Indian founder's first quote. Use only supplied facts; label assumptions; do not invent demand, market prices or tax/legal advice.",
    `Idea(s): ${workspace.shortlist.map(idea => idea.title).join(", ") || "not selected"}`,
    `Price ₹${price || "?"}; direct cash ₹${direct}; time ₹${time}; fixed share ${capacity > 0 ? "₹" + Math.round(share) : "unknown"}; cost-covering price ${capacity > 0 ? "₹" + Math.round(floor) : "unknown"}; monthly result ${ready ? "₹" + Math.round(month) : "unknown"}.`,
    `Buyer: ${quoteBuyer}; outcome: ${quoteOutcome}; included: ${quoteIncluded}; excluded: ${quoteExcluded}; delivery: ${quoteDelivery}; payment: ${quotePayment}.`,
    "Draft a buyer-ready quote, scope boundaries, assumptions and questions to resolve."
  ].join(" ");
  const [price, setPrice] = useState(""), [materials, setMaterials] = useState(""), [fees, setFees] = useState("");
  const [hours, setHours] = useState(""), [hourValue, setHourValue] = useState(""), [fixed, setFixed] = useState(""), [units, setUnits] = useState("");
  const [offer, setOffer] = useState(0);
  const direct = value(materials) + value(fees), time = value(hours) * value(hourValue), contribution = value(price) - direct - time;
  const capacity = value(units), share = capacity > 0 ? value(fixed) / capacity : 0, floor = direct + time + share;
  const month = contribution * capacity - value(fixed), breakEven = contribution > 0 ? Math.ceil(value(fixed) / contribution) : null;
  const ready = price !== "" && capacity > 0;
  const fields = [
    { label: "Proposed price (₹)", hint: "Compare actual scope, not only another shop's number.", state: price, setter: setPrice },
    { label: "Materials, stock or subcontracting (₹)", hint: "Cash you spend because this sale happens.", state: materials, setter: setMaterials },
    { label: "Delivery, fees and returns allowance (₹)", hint: "Packaging, trips, payment or platform charges.", state: fees, setter: setFees },
    { label: "Hours spent per sale", hint: "Include finding, serving and following up.", state: hours, setter: setHours },
    { label: "Value needed per hour (₹)", hint: "Your planning value for the work, not a legal wage calculation.", state: hourValue, setter: setHourValue },
    { label: "Other fixed costs per month (₹)", hint: "Rent, software and bills not charged to one sale.", state: fixed, setter: setFixed },
    { label: "Sales you can deliver per month", hint: "Check hours, stock and real buyer conversations.", state: units, setter: setUnits },
  ];
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[
      webPageSchema({ path: "/business-pricing-india", name: "Business pricing in India for a first sale", description: "A first-price workbench with direct costs, owner time, fixed commitments and buyer evidence." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Business pricing in India", path: "/business-pricing-india" }]),
    ]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>Business pricing in India</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={wrap}><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">The first quote · India</span><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Put a price on the <span className="text-blue-700">whole promise.</span></h1><p className="mt-5 max-w-3xl text-lg text-slate-600">You are quoting a real buyer, not filling a blank in a business plan. The number has to carry what you buy, the hours you give, the bills that repeat and an outcome the customer understands.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/browse" className={primary}>Browse ideas <ArrowRight size={17}/></a><a href="#pricing-workbench" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Work through a first price</a></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">What does one sale include?</h2><p className="mt-3 max-w-3xl text-slate-600">A founder can lose money while the invoice looks good. The unspoken second visit, packaging and two hours of follow-up still belong to the offer.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Output", "One unit, one project or one month of access. Say exactly what arrives."],
      ["Boundary", "State quantity, revisions, timing and what costs extra."],
      ["Collection", "Agree when the buyer pays and what happens if the work changes."],
    ].map(([title, copy], index) => <article className={card} key={title}><span className="text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section id="pricing-workbench" className="scroll-mt-28 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Can this price carry the work?</h2><p className="mt-3 max-w-3xl text-slate-600">Enter assumptions for one sale and one month. Blank fields count as zero in the arithmetic but are still missing evidence. The readout is a planning check, not a demand forecast or tax calculation.</p><div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className={`${card} grid gap-4 sm:grid-cols-2`}>{fields.map(field => <label className="text-sm font-semibold" key={field.label}>{field.label}<input className={input} type="number" min="0" inputMode="decimal" value={field.state} onChange={event => field.setter(event.target.value)} /><small className="mt-2 block font-normal text-slate-600">{field.hint}</small></label>)}</div>
      <aside className={`${card} bg-blue-50`} aria-live="polite"><h3 className="text-xl font-bold">The math, visible</h3><dl className="mt-5 grid gap-4">{[
        ["Direct cash per sale", rupees(direct)], ["Your time value per sale", rupees(time)],
        ["Fixed cost share per sale", capacity > 0 ? rupees(share) : "Enter sales capacity"],
        ["Cost-covering price at this volume", capacity > 0 ? rupees(floor) : "—"],
        ["After these costs for a month", ready ? rupees(month) : "—"],
        ["Sales to cover fixed costs", price !== "" && breakEven !== null ? String(breakEven) : "—"],
      ].map(([label, reading]) => <div className="flex flex-wrap justify-between gap-2" key={label}><dt>{label}</dt><dd className="font-bold text-blue-700">{reading}</dd></div>)}</dl><p className="mt-5 text-sm text-slate-600">{ready ? "The result uses your proposed price and sales capacity. A positive number does not prove those buyers exist." : "Enter your own price and a realistic sales capacity to interpret the result."} Taxes, financing, losses beyond your allowance and collection delays are excluded.</p><a className="mt-4 inline-flex font-semibold text-blue-700 hover:underline" href="/startup-cash-flow-india">Check collection dates against bills <ArrowRight className="ml-2" size={17}/></a></aside>
    </div></div></section>
    <section id="first-quote-brief" className="bg-slate-50 py-10 lg:py-12"><div className={wrap}>
      <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wide text-blue-700">Turn the calculation into a quote</p><h2 className="mt-2 text-3xl font-bold">Make the offer clear before you send a price.</h2><p className="mt-3 text-slate-600">Describe the buyer, result, boundaries and payment terms. The prepared prompt carries your entered calculator figures and selected ideas into ChatGPT, Claude, Grok or Perplexity. Review it before continuing.</p></div>
      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6">
        <label className="text-sm font-semibold">Who is receiving this quote?<input className={input} value={quoteBuyer} onChange={event => setQuoteBuyer(event.target.value)} placeholder="Buyer type, business or customer group" /></label>
        <label className="text-sm font-semibold">What outcome are you promising?<input className={input} value={quoteOutcome} onChange={event => setQuoteOutcome(event.target.value)} placeholder="The result the buyer should receive" /></label>
        <label className="text-sm font-semibold sm:col-span-2">What is included?<textarea className={input + " min-h-24 py-3"} rows={3} value={quoteIncluded} onChange={event => setQuoteIncluded(event.target.value)} placeholder="Quantity, deliverables, revisions, support or service scope" /></label>
        <label className="text-sm font-semibold sm:col-span-2">What is not included?<textarea className={input + " min-h-24 py-3"} rows={3} value={quoteExcluded} onChange={event => setQuoteExcluded(event.target.value)} placeholder="Extra visits, materials, travel, revisions or optional work" /></label>
        <label className="text-sm font-semibold">Delivery / completion terms<input className={input} value={quoteDelivery} onChange={event => setQuoteDelivery(event.target.value)} placeholder="Start date, delivery window or milestones" /></label>
        <label className="text-sm font-semibold">Payment / collection terms<input className={input} value={quotePayment} onChange={event => setQuotePayment(event.target.value)} placeholder="Advance, milestone, balance or due date" /></label>
      </div>
      <div className="mt-5"><ProviderPromptActions title="Prepare and review your first quote" prompt={quotePrompt} prefillPrompt={compactQuotePrompt}/></div>
    </div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">What are you really selling?</h2><p className="mt-3 max-w-3xl text-slate-600">Change the pattern to see the question your quote must answer. The worksheet amounts remain yours.</p><div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Offer type">{offers.map((item, index) => <button type="button" key={item.name} aria-pressed={offer === index} onClick={() => setOffer(index)} className={`min-h-11 rounded-xl border px-5 py-3 font-semibold ${offer === index ? "border-blue-600 bg-blue-600 text-white" : "bg-white hover:border-blue-500"}`}>{item.name}</button>)}</div><article className={`${card} mt-5`} aria-live="polite"><span className="font-bold text-blue-700">{offers[offer]?.name}</span><h3 className="mt-2 text-xl font-bold">{offers[offer]?.question}</h3><p className="mt-3 text-slate-600">{offers[offer]?.detail}</p><a href="/business-models-india" className="mt-4 inline-flex font-semibold text-blue-700 hover:underline">Compare delivery models <ArrowRight className="ml-2" size={17}/></a></article></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">The buyer already has an alternative.</h2><p className="mt-3 max-w-3xl text-slate-600">The workbench shows what a price needs to cover. It cannot tell you whether this person will buy. Walk the local options: another provider, doing it themselves or postponing the problem.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Ask what they paid before", "Find the actual scope, quality and date. “Too expensive” needs context."],
      ["Show one defined offer", "Give a price, delivery date and boundary. Ask for a decision or a specific objection."],
      ["Record what changed", "Adjust the offer when evidence says so. Do not quietly omit work to make it look cheaper."],
    ].map(([title, copy]) => <article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Reduce the scope before you cut the price.</h2><p className="mt-3 max-w-3xl text-slate-600">Offer fewer revisions, a smaller batch or a simpler delivery window. Name what changes. Keep the promise you can deliver without shifting hidden cost to yourself.</p><p className={`${card} mt-6 font-semibold`}>A useful quote makes the trade-off clear.</p></div></section>
    <section className="py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Published ideas to inspect</h2><p className="mt-2 max-w-3xl text-slate-600">Use a published idea as a starting point, then add it to your comparison or prepare a validation brief.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5" key={idea.slug}><h3 className="break-words text-lg font-bold leading-snug text-slate-950">{idea.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{idea.hook || idea.summary}</p><div className="mt-4 grid gap-2"><a href={`/idea/${idea.slug}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">Read full idea <ArrowRight size={15}/></a><ShortlistToggle idea={ideaForShortlist(idea)} compact className="w-full [&>button]:w-full"/><a href={`/idea/${idea.slug}#idea-validate`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-blue-500 hover:bg-blue-50">Validate this idea <ArrowRight size={15}/></a></div></article>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Related categories</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(category => <a className={card} href={`/category/${category.slug}`} key={category.slug}><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Explore category <ArrowRight size={17}/></span></a>)}</div></div></section>
    <SellerFaq title="A few useful distinctions" faq={[
      { q: "Is the cost-covering price the final selling price?", a: "No. It checks your assumptions at the chosen volume. The buyer's alternative, value and ability to pay need separate research." },
      { q: "What if I cannot estimate sales yet?", a: "Keep the field blank and test small. Direct cash and time still matter. Do not spread rent across an optimistic sales count to make the quote look affordable." },
      { q: "Should owner time count if I pay myself later?", a: "Yes for this planning view. Unpaid time remains a constraint. Enter the value needed to make the work sustainable." },
      { q: "Does this calculate GST or pricing rules?", a: "No. Requirements depend on the activity and current rules. Check official sources or qualified advice for your case before quoting or invoicing." },
    ]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Test the quote with a real buyer.</h2><p className="mt-3 max-w-3xl text-blue-100">If the price works in your ledger, ask whether someone will commit to the defined offer. If cash needed first is high, revise the first version.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[
      ["Plan a buyer test", "/startup-idea-validation"], ["Map startup cash", "/startup-costs-india"], ["Browse ideas", "/browse"],
    ].map(([label, href]) => <a href={href} key={href} className="flex min-h-11 items-center justify-between rounded-xl bg-white p-4 font-semibold text-blue-800 hover:bg-blue-50">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </V2Frame>;
}
