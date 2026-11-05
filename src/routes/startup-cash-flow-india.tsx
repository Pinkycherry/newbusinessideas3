import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Download, Plus, Trash2 } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { getListsHub } from "@/lib/lists.functions";
import { getBrowseIdeas } from "@/lib/browse.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

type CashEvent = { id: number; date: string; label: string; incoming: string; outgoing: string };
type EventField = "date" | "label" | "incoming" | "outgoing";
const CASH_FLOW_STORAGE_KEY = "bbi-startup-cash-flow-v1";
function shiftDate(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}
function csvCell(value: string | number) { return `"${String(value).replace(/"/g, '""')}"`; }
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const amount = (s: string) => Math.max(0, Number(s) || 0);
const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500";
const primary = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";
const input = "mt-2 block min-h-11 w-full rounded-xl border bg-white px-3 outline-none focus:border-blue-600";

export const Route = createFileRoute("/startup-cash-flow-india")({
  head: () => ({ meta: [
    { title: "Startup Cash Flow in India: See the Payment Gap | BusinessIdea.io" },
    { name: "description", content: "Make a dated rupee cash flow map for a startup idea in India. Enter money expected in, bills due out and opening cash to see when a shortfall appears." },
    { property: "og:title", content: "Startup cash flow in India | BusinessIdea.io" },
    { property: "og:type", content: "article" },
  ] }),
  loader: async () => {
    const hub = await getListsHub();
    const category = hub.categories.find(item => /local service|food processing|home service/i.test(item.name));
    const result = await getBrowseIdeas({ data: { q: "", category: category?.code ?? "", investment: "", time: "", skill: "", page: 1 } });
    return { categories: hub.categories, ideas: result.ideas };
  },
  component: CashFlowPage,
});

function CashFlowPage() {
  const { categories, ideas } = Route.useLoaderData();
  const related = categories.filter(item => /service|food processing|e-commerce/i.test(item.name)).slice(0, 6);
  const [opening, setOpening] = useState("");
  const [events, setEvents] = useState<CashEvent[]>([{ id: 1, date: "", label: "", incoming: "", outgoing: "" }]);
  const [late, setLate] = useState(false);
  const [delayDays, setDelayDays] = useState("14");
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CASH_FLOW_STORAGE_KEY) || "null") as { opening?: unknown; events?: unknown } | null;
      if (saved && typeof saved === "object") {
        if (typeof saved.opening === "string") setOpening(saved.opening);
        if (Array.isArray(saved.events)) {
          const valid = saved.events.filter((item): item is CashEvent =>
            Boolean(item) && typeof item.id === "number" && typeof item.date === "string" &&
            typeof item.label === "string" && typeof item.incoming === "string" && typeof item.outgoing === "string"
          ).slice(0, 100);
          if (valid.length) setEvents(valid);
        }
      }
    } catch { /* Keep the empty worksheet if browser storage is unavailable. */ }
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (!storageReady) return;
    try { window.localStorage.setItem(CASH_FLOW_STORAGE_KEY, JSON.stringify({ opening, events })); }
    catch { /* The worksheet remains usable for this visit if storage is full or blocked. */ }
  }, [opening, events, storageReady]);
  const ordered = events.filter(event => event.date && event.label.trim()).slice().sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
  let running = amount(opening), lowest = running;
  const rows = ordered.map(event => {
    const before = running;
    running += amount(event.incoming) - amount(event.outgoing);
    lowest = Math.min(lowest, running);
    return { ...event, before, balance: running };
  });
  const delay = Number(delayDays) || 0;
  const delayedEvents = ordered.flatMap(event => {
    const outgoing = amount(event.outgoing), incoming = amount(event.incoming);
    return [
      ...(outgoing > 0 ? [{ date: event.date, label: event.label + " — payment due", change: -outgoing, id: event.id * 2 }] : []),
      ...(incoming > 0 ? [{ date: shiftDate(event.date, delay), label: event.label + " — delayed collection", change: incoming, id: event.id * 2 + 1 }] : []),
    ];
  }).sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
  let delayedBalance = amount(opening), delayedLow = delayedBalance;
  const delayedRows = delayedEvents.map(event => {
    delayedBalance += event.change;
    delayedLow = Math.min(delayedLow, delayedBalance);
    return { ...event, balance: delayedBalance };
  });
  const fundingGap = Math.max(0, -lowest);
  const delayedFundingGap = Math.max(0, -delayedLow);
  const totalIn = ordered.reduce((sum, event) => sum + amount(event.incoming), 0);
  const totalOut = ordered.reduce((sum, event) => sum + amount(event.outgoing), 0);
  function update(id: number, key: EventField, text: string) { setEvents(all => all.map(event => event.id === id ? { ...event, [key]: text } : event)); }
  function add() { setEvents(all => [...all, { id: Date.now(), date: "", label: "", incoming: "", outgoing: "" }]); }
  function exportForecast() {
    const header = ["Date", "Event", "Opening balance before event (INR)", "Money collected (INR)", "Money paid (INR)", "Closing balance (INR)"];
    const data = rows.map(row => [row.date, row.label, row.before, amount(row.incoming), amount(row.outgoing), row.balance]);
    const csv = [header, ...data].map(row => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob(["\\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "businessidea-startup-cash-flow-forecast.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[
      webPageSchema({ path: "/startup-cash-flow-india", name: "Startup cash flow in India", description: "A dated event ledger to distinguish sales from money actually available when bills are due." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Startup cash flow in India", path: "/startup-cash-flow-india" }]),
    ]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>Startup cash flow in India</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={wrap}><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">The days between · India</span><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">The bill has a date. <span className="text-blue-700">Does the payment?</span></h1><p className="mt-5 max-w-3xl text-lg text-slate-600">A business idea can earn on paper and still run short of cash on Thursday. Put expected collections beside actual due dates before you promise a delivery or sign a fixed commitment.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/browse" className={primary}>Browse ideas <ArrowRight size={17}/></a><a href="#cash-calendar" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Open the cash calendar</a></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Three dates can belong to one sale.</h2><p className="mt-3 max-w-3xl text-slate-600">A client agrees to pay. You deliver. The money clears later. The invoice amount is not a balance in your account while you are buying materials, travelling or paying rent.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Order agreed", "Record any deposit actually collected, not just a promise."],
      ["Work delivered", "List each bill that comes due before the full payment arrives."],
      ["Cash collected", "Use the amount and date you realistically expect; mark uncertainty separately."],
    ].map(([title, copy], index) => <article className={card} key={title}><span className="text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section id="cash-calendar" className="scroll-mt-28 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Build a cash calendar.</h2><p className="mt-3 max-w-3xl text-slate-600">Enter an opening balance and dated events in the order you expect. The calculation sorts valid rows by date. Blank or undated rows do not enter the totals. Your opening balance and dated events are saved in this browser only. They are not sent to the BusinessIdea.io database.</p><div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className={card}><label className="block font-semibold">Opening cash available (₹)<input className={input} type="number" min="0" inputMode="decimal" value={opening} onChange={event => setOpening(event.target.value)} /></label><h3 className="mt-6 text-xl font-bold">Expected events</h3><p className="mt-2 text-slate-600">Use separate rows when money leaves and returns on different dates.</p><div className="mt-4 grid gap-4">{events.map((event, index) => <div className="rounded-xl border bg-slate-50 p-4" key={event.id}><div className="flex items-center justify-between"><strong>Event {index + 1}</strong><button type="button" onClick={() => setEvents(all => all.filter(item => item.id !== event.id))} aria-label={`Remove event ${index + 1}`} className="rounded-lg p-2 text-slate-600 hover:bg-white hover:text-red-700"><Trash2 size={17}/></button></div><div className="mt-3 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Date<input className={input} type="date" value={event.date} onChange={e => update(event.id, "date", e.target.value)} /></label><label className="text-sm font-semibold">What happens?<input className={input} value={event.label} onChange={e => update(event.id, "label", e.target.value)} /></label><label className="text-sm font-semibold">Money collected (₹)<input className={input} type="number" min="0" inputMode="decimal" value={event.incoming} onChange={e => update(event.id, "incoming", e.target.value)} /></label><label className="text-sm font-semibold">Money paid (₹)<input className={input} type="number" min="0" inputMode="decimal" value={event.outgoing} onChange={e => update(event.id, "outgoing", e.target.value)} /></label></div></div>)}</div><div className="mt-4 flex flex-wrap gap-3"><button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:border-blue-500" onClick={add}><Plus size={17}/>Add another dated event</button><button type="button" disabled={!rows.length} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-800 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50" onClick={exportForecast}><Download size={17}/>Download forecast CSV</button></div></div>
      <aside className={`${card} bg-blue-50`} aria-live="polite"><h3 className="text-xl font-bold">After each event</h3><dl className="mt-5 grid gap-3 sm:grid-cols-2"><div><dt>Expected in</dt><dd className="font-bold text-blue-700">{money(totalIn)}</dd></div><div><dt>Expected out</dt><dd className="font-bold text-blue-700">{money(totalOut)}</dd></div></dl>{rows.length ? <ol className="mt-5 grid gap-3">{rows.map(row => <li className="rounded-xl bg-white p-3" key={row.id}><span className="block break-words">{row.date} · {row.label}</span><strong className={`mt-1 block ${row.balance < 0 ? "text-red-700" : "text-blue-700"}`}>{money(row.balance)}</strong><small className="break-words text-slate-600">{money(row.before)} + {money(amount(row.incoming))} − {money(amount(row.outgoing))}</small></li>)}</ol> : <p className="mt-5 text-slate-600">Add a date and description to an event to see the running balance. Zero is an empty worksheet, not proof that the business has no cash need.</p>}<div className="mt-5 rounded-xl bg-white p-4"><span className="block">Lowest cash balance in this sequence</span><strong className="mt-1 block text-xl text-blue-700">{rows.length ? money(lowest) : "—"}</strong><small className="text-slate-600">A negative balance shows an amount that must be funded or rescheduled under these assumptions.</small><div className="mt-3 border-t border-blue-100 pt-3"><span className="block text-sm text-slate-700">Extra cash needed to avoid a negative balance</span><strong className="mt-1 block text-xl text-blue-800">{money(fundingGap)}</strong></div></div><label className="mt-5 flex items-start gap-3 text-sm font-semibold"><input className="mt-1" type="checkbox" checked={late} onChange={event => setLate(event.target.checked)} />Test delayed customer collections</label>{late && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><label className="block text-sm font-semibold">Delay incoming payments by<select className={input} value={delayDays} onChange={event => setDelayDays(event.target.value)}><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label><p className="mt-3 text-sm text-slate-700">Bills stay on their original dates; each expected collection moves by {delayDays} days.</p><p className="mt-2 text-sm">Lowest balance in this delayed scenario: <strong>{money(delayedLow)}</strong></p><p className="mt-1 text-sm">Extra cash needed to cover the delayed-payment gap: <strong>{money(delayedFundingGap)}</strong></p>{delayedRows.length>0&&<ol className="mt-3 grid gap-2">{delayedRows.map(row=><li className="flex flex-wrap justify-between gap-2 rounded-lg bg-white p-2 text-sm" key={row.id}><span>{row.date} · {row.label}</span><strong className={row.balance<0?"text-red-700":"text-blue-700"}>{money(row.balance)}</strong></li>)}</ol>}</div>}</aside>
    </div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Look beyond the invoice.</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
      ["Deposit", "Cash tied to a place", "A refundable premises deposit may return later, but it cannot pay today's supplier while held elsewhere."],
      ["Stock", "Cash sitting on a shelf", "A bulk purchase may reduce unit cost but delay the next useful purchase if demand is slower than expected."],
      ["Credit", "Work done before collection", "Write the actual customer payment terms beside supplier due dates."],
      ["Returns", "Cash that may reverse", "Leave room for rework, refunds and payment failures where they apply."],
    ].map(([label, title, copy]) => <article className={card} key={label}><span className="text-sm font-bold uppercase text-blue-700">{label}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Change the first promise.</h2><p className="mt-3 max-w-3xl text-slate-600">The shortfall is information. Before borrowing or accepting a long lease, ask what can be tested at a smaller scale while still serving a buyer well.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{[
      ["Move the money in.", "For suitable work, agree a fair deposit or milestone payment in writing; only enter it as cash when collected."],
      ["Move the money out.", "Ask about a smaller supplier batch or a rental slot instead of an upfront permanent setup."],
      ["Move the promise.", "Offer a narrower delivery window, scope or geography that your current cash can support."],
      ["Keep household needs visible.", "Business timing cannot quietly consume the money needed for living obligations."],
    ].map(([title, copy], index) => <article className={card} key={title}><span className="text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><p className="mt-6 text-slate-600">The calendar tells you what happens if those listed payments occur. It cannot confirm a sale, collection date, taxes, financing, future price or return rate. Keep a separate version with only money already received and bills contractually due.</p></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Published ideas to inspect</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <a className={card} href={`/idea/${idea.slug}`} key={idea.slug}><h3 className="text-xl font-bold">{idea.title}</h3><p className="mt-3 line-clamp-3 text-slate-600">{idea.hook || idea.summary}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Read idea <ArrowRight size={17}/></span></a>)}</div></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Related categories</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(category => <a className={card} href={`/category/${category.slug}`} key={category.slug}><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Explore category <ArrowRight size={17}/></span></a>)}</div></div></section>
    <SellerFaq title="Cash questions worth asking" faq={[
      { q: "Is revenue the same as cash flow?", a: "No. A sale may be recorded before the money reaches your account. The dated balance matters when a bill is due." },
      { q: "Should I include a promised advance?", a: "Make one scenario with the advance on the expected date and another without it. Until collected, it is an assumption, not available cash." },
      { q: "Does this replace a formal forecast or accounting advice?", a: "No. It is a simple event map for a first decision. It omits taxes, financing, obligations not entered and complex accounting treatment. Use qualified advice for your actual business." },
    ]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Can you fund the first useful promise?</h2><p className="mt-3 max-w-3xl text-blue-100">Map your full startup commitments, then ask a real buyer to commit to a defined offer before expanding the fixed costs.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[
      ["Map all startup costs", "/startup-costs-india"], ["Find the first buyer", "/first-customer-india"], ["Browse published ideas", "/browse"],
    ].map(([label, href]) => <a href={href} key={href} className="flex min-h-11 items-center justify-between rounded-xl bg-white p-4 font-semibold text-blue-800 hover:bg-blue-50">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </V2Frame>;
}
