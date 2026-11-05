import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { getListsHub } from "@/lib/lists.functions";
import { getBrowseIdeas } from "@/lib/browse.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const num = (s: string) => Math.max(0, Number(s) || 0);
const patterns = [
  { name: "Service", unit: "One bounded job or appointment", hidden: "Travel, prep, revisions and collection time can repeat with each job.", check: "Does the quote still work when the client needs one correction?" },
  { name: "Product", unit: "One fulfilled order", hidden: "Packaging, damage, payment fees, delivery and returns may sit outside the supplier invoice.", check: "What happens to contribution when one parcel returns?" },
  { name: "Repeat offer", unit: "One paid period", hidden: "Support, renewal and customer acquisition recur even when the charge repeats.", check: "What work remains after a customer pays this month?" },
] as const;
const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500";
const button = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";
const input = "mt-2 block min-h-11 w-full rounded-xl border bg-white px-3 outline-none focus:border-blue-600";
export const Route = createFileRoute("/unit-economics-india")({
  head: () => ({ meta: [
    { title: "Unit Economics in India: Is One Business Sale Worth Repeating? | BusinessIdea.io" },
    { name: "description", content: "Calculate contribution per sale, owner work, monthly commitments and transparent break-even for a startup idea in India." },
    { property: "og:title", content: "One sale under pressure | BusinessIdea.io" },
  ] }),
  loader: async () => {
    const hub = await getListsHub();
    const category = hub.categories.find(item => /service|food processing|e-commerce/i.test(item.name));
    const result = await getBrowseIdeas({ data: { q: "", category: category?.code ?? "", investment: "", time: "", skill: "", page: 1 } });
    return { categories: hub.categories, ideas: result.ideas };
  },
  component: UnitEconomicsPage,
});
function UnitEconomicsPage() {
  const { categories, ideas } = Route.useLoaderData();
  const related = categories.filter(item => /service|food processing|e-commerce/i.test(item.name)).slice(0, 6);
  const [pattern, setPattern] = useState(0), [price, setPrice] = useState(""), [materials, setMaterials] = useState(""), [fulfilment, setFulfilment] = useState("");
  const [hours, setHours] = useState(""), [hourRate, setHourRate] = useState(""), [fixed, setFixed] = useState(""), [orders, setOrders] = useState("");
  const direct = num(materials) + num(fulfilment), owner = num(hours) * num(hourRate), cashContribution = num(price) - direct, afterTime = cashContribution - owner, monthly = afterTime * num(orders) - num(fixed);
  const breakEven = afterTime > 0 ? Math.ceil(num(fixed) / afterTime) : null;
  const ready = [price, materials, fulfilment, hours, hourRate, fixed, orders].every(value => value !== "");
  const current = patterns[pattern] ?? patterns[0];
  const fields = [
    { label: "Price collected per order (₹)", state: price, update: setPrice },
    { label: "Materials or direct service spend (₹)", state: materials, update: setMaterials },
    { label: "Fees, packing and fulfilment (₹)", state: fulfilment, update: setFulfilment },
    { label: "Your delivery hours per order", state: hours, update: setHours },
    { label: "Planning value of an hour (₹)", state: hourRate, update: setHourRate },
    { label: "Monthly fixed commitments (₹)", state: fixed, update: setFixed },
    { label: "Orders you can actually deliver monthly", state: orders, update: setOrders },
  ];
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[
      webPageSchema({ path: "/unit-economics-india", name: "Unit economics for a startup idea in India", description: "A transparent per-order contribution and capacity worksheet for founders." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Unit economics in India", path: "/unit-economics-india" }]),
    ]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>Unit economics in India</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={wrap}><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">One sale under pressure · India</span><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Would you want to repeat <span className="text-blue-700">this sale?</span></h1><p className="mt-5 max-w-3xl text-lg text-slate-600">A full order book can still drain your time and cash. Work backward from one delivery before calling a business idea profitable.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/browse" className={button}>Browse ideas <ArrowRight size={17}/></a><a href="#one-order" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Check one order</a></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">What exactly is one sale?</h2><p className="mt-3 max-w-3xl text-slate-600">A unit can mean a fulfilled parcel, a finished service job or one paid month. The calculation is useful only when the cost lines cover the same unit as the price.</p><div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Business pattern">{patterns.map((item, index) => <button type="button" key={item.name} aria-pressed={pattern === index} onClick={() => setPattern(index)} className={`min-h-11 rounded-xl border px-5 py-3 font-semibold ${pattern === index ? "border-blue-600 bg-blue-600 text-white" : "bg-white hover:border-blue-500"}`}>{item.name}</button>)}</div><article className={`${card} mt-5`} aria-live="polite"><h3 className="text-xl font-bold">{current.unit}</h3><p className="mt-3 text-slate-600">{current.hidden}</p><strong className="mt-4 block text-blue-700">Ask before you scale</strong><p className="mt-2 text-slate-600">{current.check}</p></article><a href="/business-models-india" className="mt-5 inline-flex font-semibold text-blue-700 hover:underline">Compare the obligation behind each business model <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section id="one-order" className="scroll-mt-28 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Build the unit from inputs you can check.</h2><p className="mt-3 max-w-3xl text-slate-600">Enter your own scenario. Direct costs leave as each order is fulfilled. Your chosen time value is a planning assumption, not a wage the business has paid you. Zero is valid only when you have checked the line.</p><div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div className={`${card} grid gap-4 sm:grid-cols-2`}>{fields.map(field => <label className="text-sm font-semibold" key={field.label}>{field.label}<input className={input} type="number" min="0" inputMode="decimal" value={field.state} onChange={event => field.update(event.target.value)} /></label>)}</div><aside className={`${card} bg-blue-50`} aria-live="polite"><h3 className="text-xl font-bold">One order, then one month</h3>{ready ? <><dl className="mt-5 grid gap-4">{[
      ["Cash contribution", money(cashContribution)],
      ["After your chosen work value", money(afterTime)],
      ["After fixed bills at your monthly order assumption", money(monthly)],
    ].map(([label, result]) => <div className="flex flex-wrap justify-between gap-2" key={label}><dt>{label}</dt><dd className="font-bold text-blue-700">{result}</dd></div>)}</dl><p className="mt-5 text-sm text-slate-600">{breakEven === null ? "Each additional order does not cover its full variable and chosen time cost on these inputs. Change the offer or price before considering fixed-cost break-even." : num(fixed) === 0 ? "No fixed commitment entered. Check other obligations before interpreting this." : `About ${breakEven} orders to cover entered fixed bills at this per-order contribution; confirm you can deliver and collect that many.`}</p></> : <p className="mt-5 font-semibold">Complete the input lines to see the arithmetic.</p>}<p className="mt-5 text-sm text-slate-600">Tax, refunds, delays and customer acquisition are outside this simple worksheet unless included in your inputs. Nothing is stored.</p></aside></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Why a busy month can still fall short.</h2><p className="mt-3 max-w-3xl text-slate-600">A sale can leave cash after direct spending and still fail to cover your work and fixed commitments. Use the calculator above with your own amounts, then compare the result with a buyer's actual willingness to pay.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Direct spending", "Materials, delivery and fees leave with each order."],
      ["Owner work", "Hours spent finding, serving and following up do not disappear."],
      ["Fixed bills", "Rent and ongoing tools still need paying if sales are slower than expected."],
    ].map(([title, copy]) => <article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><a href="/business-pricing-india" className="mt-6 inline-flex font-semibold text-blue-700 hover:underline">Rework a first quote and its scope <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section className="py-12 lg:py-16"><div className={`${wrap} grid items-center gap-8 lg:grid-cols-2`}><img className="w-full rounded-2xl object-cover" src="/images/categories/ecommerce-retail-business-ideas-online-store-dropshipping-d2c-small-business.webp" alt="Original ecommerce and retail business ideas category artwork" loading="lazy" /><div><h2 className="text-3xl font-bold">Stock can be profitable and still trap cash.</h2><p className="mt-3 text-slate-600">Unsold inventory, a return or a late collection do not appear in an ideal one-order result. If the model uses stock, put supplier payment dates beside expected collections before increasing the order count.</p><a href="/startup-cash-flow-india" className="mt-5 inline-flex font-semibold text-blue-700 hover:underline">Put the bills on a dated cash calendar <ArrowRight className="ml-2" size={17}/></a></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">What changes if one order goes wrong?</h2><p className="mt-3 max-w-3xl text-slate-600">Subtract a real refund, remake or extra trip from the next sale's contribution. If a single correction absorbs the margin, define a smaller scope or a price that can carry a normal imperfect delivery.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Product", "Supplier minimum, returns and packaging that does not come back."],
      ["Service", "Quote revisions, unpaid travel and the hours between client replies."],
      ["Repeat offer", "Support work and customers who stop paying."],
    ].map(([title, copy]) => <article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Order count is not buyer demand.</h2><p className="mt-3 max-w-3xl text-slate-600">A calculated break-even quantity is a question to test, not a sales prediction. Put the work hours for that many orders beside your week, then ask an actual buyer to choose the priced offer.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Check whether the orders fit your week", "/business-idea-time-fit"],
      ["Test a buyer's action on the offer", "/business-demand-test-india"],
      ["Find the person who pays first", "/first-customer-india"],
    ].map(([title, href]) => <a className={card} href={href} key={href}><h3 className="font-bold">{title}</h3><ArrowRight className="mt-4 text-blue-700" size={17}/></a>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Published ideas to inspect</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <a className={card} href={`/idea/${idea.slug}`} key={idea.slug}><h3 className="text-xl font-bold">{idea.title}</h3><p className="mt-3 line-clamp-3 text-slate-600">{idea.hook || idea.summary}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Read idea <ArrowRight size={17}/></span></a>)}</div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Related categories</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(category => <a className={card} href={`/category/${category.slug}`} key={category.slug}><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Explore category <ArrowRight size={17}/></span></a>)}</div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">What cost still needs a real quote?</h2><p className="mt-3 max-w-3xl text-slate-600">Record the line you guessed, then find the actual supplier, platform or delivery terms before making a bigger commitment.</p><ol className="mt-6 grid gap-4 md:grid-cols-3"><li className={card}><span className="text-sm font-bold text-blue-700">01</span><p className="mt-3 font-semibold">My uncertain cost or capacity assumption</p></li></ol></div></section>
    <SellerFaq title="Questions behind the result" faq={[
      { q: "Is cash contribution the same as profit?", a: "No. It is the price left after the direct spending entered here. Fixed bills, your work value and omitted costs still matter." },
      { q: "Why put a value on my own time?", a: "It makes a hidden cost visible. Choose a value for planning; it does not claim you already paid yourself that amount." },
      { q: "Does break-even mean I should launch?", a: "No. It describes arithmetic under your assumptions. Buyer demand, delivery capacity, cash timing and risk need separate tests." },
    ]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Find a sale worth repeating.</h2><p className="mt-3 max-w-3xl text-blue-100">Ask a buyer to accept a defined offer, record its actual costs and hours, then recalculate before scaling.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[
      ["Test the first offer", "/business-demand-test-india"], ["Check the cash timing", "/startup-cash-flow-india"], ["Browse ideas", "/browse"],
    ].map(([label, href]) => <a href={href} key={href} className="flex min-h-11 items-center justify-between rounded-xl bg-white p-4 font-semibold text-blue-800 hover:bg-blue-50">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </V2Frame>;
}
