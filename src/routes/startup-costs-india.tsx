import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calculator, ChevronRight, Download } from "lucide-react";
import { ProviderPromptActions } from "@/components/founder-workspace/provider-prompt-actions";
import { useFounderWorkspace } from "@/lib/founder-workspace";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

const costLines = [
  { key:"deposit", label:"Refundable deposit", group:"before", hint:"Cash locked up even if the deposit may later return." },
  { key:"equipment", label:"Equipment and setup", group:"before", hint:"Purchase, repair, fit-out, device or basic tools." },
  { key:"stock", label:"Initial stock or materials", group:"before", hint:"Only the smallest quantity needed for a real first offer." },
  { key:"registration", label:"Registration and permissions", group:"before", hint:"Include only obligations that apply to your actual activity and location." },
  { key:"launch", label:"Launch and first customer test", group:"before", hint:"Samples, local outreach, transport or a small experiment." },
  { key:"rent", label:"Rent or workspace", group:"monthly", hint:"Count this separately from a refundable deposit." },
  { key:"people", label:"People and owner draw", group:"monthly", hint:"Include the cash you need to live, even if you take no formal salary." },
  { key:"supplies", label:"Replenishment and delivery", group:"monthly", hint:"Regular supplies, packaging and the trips you make to fulfil." },
  { key:"software", label:"Utilities, software and fees", group:"monthly", hint:"Electricity, data, subscriptions, platform or payment fees." },
] as const;
type CostKey = (typeof costLines)[number]["key"];
type Scenario = "service" | "product" | "local";
const STARTUP_COSTS_KEY = "bbi-startup-costs-india-v1";
function csvCell(value: string | number) { return `"${String(value).replace(/"/g, '""')}"`; }
const scenarios: Record<Scenario,{ title:string; question:string; before:string; repeat:string; proof:string }> = {
  service:{title:"A service from your skills",question:"Can a buyer commit before you pay for tools or a workspace?",before:"Equipment, travel to a first client, any required permission.",repeat:"Your working hours, travel, data, subcontracting and rework.",proof:"Offer one tightly scoped job, name the price and count every hour."},
  product:{title:"A small physical product",question:"How little stock can you test without losing the buyer's trust?",before:"Sample, initial materials, packaging, supplier minimum, deposit.",repeat:"Replenishment, delivery, returns, damaged units and storage.",proof:"Sell one limited batch at the actual delivered price; track leftovers."},
  local:{title:"A neighbourhood operation",question:"Will the local repeat demand cover a fixed place and schedule?",before:"Premises deposit, basic setup, permission and opening stock.",repeat:"Rent, power, staff, replenishment and local delivery.",proof:"Observe the catchment and collect specific buyer commitments before a long lease."}
};
const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const amount=(s:string)=>Math.max(0,Number(s)||0);

export const Route=createFileRoute("/startup-costs-india")({
  head:()=>({meta:[
    {title:"Startup Costs in India: Plan the Cash Before Your First Sale | BusinessIdea.io"},
    {name:"description",content:"Build a transparent startup cost ledger in rupees. Separate one-time setup, recurring commitments, deposits, owner needs and your first-month cash gap before starting a business in India."},
    {property:"og:title",content:"Startup costs in India | BusinessIdea.io"},
    {property:"og:description",content:"What must leave your pocket before money comes back? Make your own first-sale cost map."},
    {property:"og:type",content:"article"},
  ]}),
  component:StartupCostsPage,
});

const wrap="mx-auto max-w-6xl px-4 md:px-6";
const card="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6";
const action="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";
function StartupCostsPage(){
  const workspace = useFounderWorkspace();
  const [values,setValues]=useState<Record<CostKey,string>>({deposit:"",equipment:"",stock:"",registration:"",launch:"",rent:"",people:"",supplies:"",software:""});
  const [months,setMonths]=useState("3");
  const [buffer,setBuffer]=useState("");
  const [receipts,setReceipts]=useState("");
  const [scenario,setScenario]=useState<Scenario>("service");
  const [storageReady,setStorageReady]=useState(false);
  useEffect(()=>{
    try {
      const saved=JSON.parse(window.localStorage.getItem(STARTUP_COSTS_KEY)||"null") as {values?:Record<string,unknown>;months?:unknown;buffer?:unknown;receipts?:unknown;scenario?:unknown}|null;
      if(saved){
        const restored={deposit:"",equipment:"",stock:"",registration:"",launch:"",rent:"",people:"",supplies:"",software:""};
        (Object.keys(restored) as CostKey[]).forEach(key=>{if(typeof saved.values?.[key]==="string") restored[key]=saved.values[key] as string;});
        setValues(restored);
        if(typeof saved.months==="string") setMonths(saved.months);
        if(typeof saved.buffer==="string") setBuffer(saved.buffer);
        if(typeof saved.receipts==="string") setReceipts(saved.receipts);
        if(saved.scenario==="service"||saved.scenario==="product"||saved.scenario==="local") setScenario(saved.scenario);
      }
    } catch { /* Keep the empty worksheet if browser storage is unavailable. */ }
    setStorageReady(true);
  },[]);
  useEffect(()=>{
    if(!storageReady) return;
    try { window.localStorage.setItem(STARTUP_COSTS_KEY,JSON.stringify({values,months,buffer,receipts,scenario})); }
    catch { /* The worksheet remains usable for this visit if storage is unavailable. */ }
  },[values,months,buffer,receipts,scenario,storageReady]);
  const before=costLines.filter(line=>line.group==="before").reduce((n,line)=>n+amount(values[line.key]),0);
  const monthly=costLines.filter(line=>line.group==="monthly").reduce((n,line)=>n+amount(values[line.key]),0);
  const planned=before+monthly*amount(months)+amount(buffer);
  const gap=Math.max(0,planned-amount(receipts));
  const filled=Object.values(values).some(Boolean)||Boolean(buffer)||Boolean(receipts);
  const current=scenarios[scenario];
  const workspaceContext = workspace.context;
  const costPrompt = [
    "Help an Indian founder review a startup's first-sale cash requirements. Do not invent local prices, legal permissions, taxes or market benchmarks. Separate quotes, estimates and unknowns. Identify double-counting and timing risks; do not treat a refundable deposit as an ordinary expense.",
    "Selected idea(s): " + (workspace.shortlist.map(item=>item.title).join("; ") || "none selected"),
    "Business pattern: " + current.title,
    ...costLines.map(line=>line.label + ": ₹" + (values[line.key] || "not entered") + " — " + line.group),
    "Operating months planned: " + months,
    "Extra cash buffer: ₹" + (buffer || "not entered"),
    "Expected collections in this window: ₹" + (receipts || "not entered"),
    "Calculated one-time setup cash: ₹" + before,
    "Calculated monthly cash commitments: ₹" + monthly,
    "Calculated planned cash requirement: ₹" + planned,
    "Calculated uncovered cash gap: ₹" + gap,
    "Founder context: location " + workspaceContext.location + "; budget " + workspaceContext.budget + "; language " + workspaceContext.language,
    "Review the plan, point out missing cost lines, distinguish cash tied up from expense, suggest a lower-risk first test, and list quotes or evidence the founder should collect. Do not make a launch decision on the founder's behalf."
  ].join("\n");
  const compactCostPrompt = "Review this Indian startup cash plan; do not invent market prices or legal advice. Pattern: " + current.title + ". Setup ₹" + before + ", monthly ₹" + monthly + ", months " + months + ", buffer ₹" + buffer + ", collections ₹" + receipts + ", uncovered gap ₹" + gap + ". Items: " + costLines.map(line=>line.label+" ₹"+(values[line.key]||"?")).join("; ") + ". Identify missing costs, cash timing risks and a reversible first test.";
  function exportCostPlan(){
    const rows=[["Type","Cost line","Amount (INR)"],...costLines.map(line=>[line.group==="before"?"Before opening":"Monthly",line.label,amount(values[line.key])]),["Planning","Months of operating cash",amount(months)],["Planning","Extra cash buffer",amount(buffer)],["Planning","Expected collections",amount(receipts)],["Summary","One-time setup cash",before],["Summary","Monthly commitments",monthly],["Summary","Planned cash requirement",planned],["Summary","Uncovered cash gap",gap]];
    const csv=rows.map(row=>row.map(csvCell).join(",")).join("\n");
    const blob=new Blob(["\\uFEFF",csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");link.href=url;link.download="businessidea-startup-cost-plan.csv";
    document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
  }
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[webPageSchema({path:"/startup-costs-india",name:"Startup costs in India before the first sale",description:"An editable cash ledger and practical guide for separating one-time setup, recurring commitments and timing risk."}),breadcrumbSchema([{name:"Home",path:"/"},{name:"Startup costs in India",path:"/startup-costs-india"}])]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav aria-label="Breadcrumb" className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`}><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>Startup costs in India</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={`${wrap} grid items-center gap-8 lg:grid-cols-2`}><div><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">The first rupee · India</span><h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">Know the cost <span className="text-blue-700">before</span> the courage.</h1><p className="mt-5 text-lg text-slate-600">A new business idea can ask for money long before it earns any. Put the awkward payments on one page: the deposit, the first delivery, the month your customer pays late, and the amount you still need at home.</p><div className="mt-7 flex flex-wrap gap-3"><a href="#cost-ledger" className={action}>Open your cost ledger <ArrowRight size={17}/></a><a href="/browse" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Browse ideas</a></div></div><aside className={card}><h2 className="text-xl font-bold">The timing is part of the startup cost.</h2><dl className="mt-5 grid gap-4">{[["Before opening","Cash leaves."],["While working","Cash keeps leaving."],["After selling","Cash may arrive later."]].map(([label,copy])=><div key={label}><dt className="text-sm font-bold uppercase text-blue-700">{label}</dt><dd className="mt-1 font-semibold">{copy}</dd></div>)}</dl></aside></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">“How much to start?” is three questions.</h2><p className="mt-3 max-w-3xl text-slate-600">Most founders hear a setup number. That number does not tell you how many weeks you can keep the promise you have made to customers.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[["What must be paid first?","Deposit, essentials, a small test batch, permissions that apply, and the cost of finding the first buyer."],["What repeats before collection?","Rent, data, ingredients, transport, people and the cash your household needs each month."],["When does money return?","Advance, delivery payment, invoice terms and refunds make a different cash picture for the same sales total."]].map(([title,copy])=><article key={title} className={card}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section id="cost-ledger" className="scroll-mt-28 py-12 lg:py-16"><div className={wrap}><span className="text-sm font-bold uppercase text-blue-700">Your numbers, not a guess</span><h2 className="mt-2 text-3xl font-bold">Make the first-sale cash map.</h2><p className="mt-3 max-w-3xl text-slate-600">Enter rupees you can defend with a quote, a bill or a careful estimate. Blank fields count as zero for arithmetic, but they do not mean the true cost is zero. Your entries are saved in this browser only; they are not sent to the BusinessIdea.io database.</p><div className="mt-7 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div className={card}>{[["Cash needed before opening","before"],["Cash needed each month","monthly"]].map(([title,group])=><fieldset key={group} className="mb-7 last:mb-0"><legend className="mb-4 text-xl font-bold">{title}</legend><div className="grid gap-4 sm:grid-cols-2">{costLines.filter(line=>line.group===group).map(line=><label key={line.key} className="block"><span className="block text-sm font-semibold">{line.label}</span><span className="mt-2 flex min-h-11 items-center rounded-xl border bg-white px-3"><span className="text-slate-500">₹</span><input className="w-full min-w-0 bg-transparent p-2 outline-none" type="number" min="0" inputMode="decimal" aria-label={line.label+" in rupees"} placeholder="0" value={values[line.key]} onChange={event=>setValues(previous=>({...previous,[line.key]:event.target.value}))}/></span><small className="mt-1 block text-slate-500">{line.hint}</small></label>)}</div></fieldset>)}</div><aside className={`${card} bg-blue-50`} aria-live="polite"><h3 className="text-xl font-bold">Cash readout</h3><dl className="mt-5 grid gap-4">{[["Before opening",money(before)],["Each month",money(monthly)]].map(([label,value])=><div key={label} className="flex flex-wrap justify-between gap-2"><dt>{label}</dt><dd className="font-bold">{value}</dd></div>)}</dl><div className="mt-6 grid gap-4">{[["Months of operating cash to plan for",months,setMonths],["Extra cash buffer (₹)",buffer,setBuffer],["Cash you expect to collect during this window (₹)",receipts,setReceipts]] .map(([label,value,update])=><label className="block text-sm font-semibold" key={label as string}>{label as string}<input type="number" min="0" max={label==="Months of operating cash to plan for"?36:undefined} inputMode="decimal" className="mt-2 block min-h-11 w-full rounded-xl border bg-white px-3 outline-none" value={value as string} onChange={event=>(update as (next:string)=>void)(event.target.value)}/></label>)}</div><div className="mt-6 rounded-xl bg-blue-600 p-5 text-white"><span className="text-sm font-semibold">Uncovered cash in this plan</span><strong className="mt-2 block break-words text-3xl">{money(gap)}</strong><small className="mt-3 block text-blue-100">Before opening + ({amount(months)} × monthly) + buffer − expected collections, floored at zero.</small></div><p className="mt-4 text-sm text-slate-600">{filled?"This is only as reliable as the amounts and collection dates you enter.":"Start with your own numbers. The all-zero readout is an empty worksheet, not a zero-cost business."} Taxes, interest, inflation and unexpected losses are outside this simple ledger. A deposit is cash tied up, not necessarily an expense.</p></aside></div><div className="mt-6 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-lg font-bold">Take the numbers with you</h3><p className="mt-2 text-sm text-slate-600">Download the entered cost lines and the calculated totals as a CSV you can keep or edit.</p><button type="button" onClick={exportCostPlan} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-800 hover:bg-blue-100"><Download size={17}/>Download cost plan CSV</button></div><ProviderPromptActions title="Review your cost plan with AI" prompt={costPrompt} prefillPrompt={compactCostPrompt}/></div></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">The model changes what you pay for first.</h2><p className="mt-3 text-slate-600">Choose a working pattern. The amounts stay yours; these questions change because the actual obligations change.</p><div role="group" aria-label="Business pattern" className="mt-6 flex flex-wrap gap-2">{(Object.keys(scenarios) as Scenario[]).map(key=><button key={key} type="button" aria-pressed={scenario===key} onClick={()=>setScenario(key)} className={`min-h-11 rounded-xl border px-5 py-3 font-semibold ${scenario===key?"border-blue-600 bg-blue-600 text-white":"bg-white hover:border-blue-500"}`}>{scenarios[key].title}</button>)}</div><article className={`${card} mt-5`} aria-live="polite"><h3 className="text-xl font-bold">{current.question}</h3><dl className="mt-5 grid gap-4 md:grid-cols-3">{[["Before opening",current.before],["While operating",current.repeat],["Cheapest useful proof",current.proof]].map(([label,copy])=><div key={label}><dt className="font-bold text-blue-700">{label}</dt><dd className="mt-2 text-slate-600">{copy}</dd></div>)}</dl><a href="/business-models-india" className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline">Compare the full business models <ArrowRight size={17}/></a></article></div></section>
    <section className="py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">A sale can happen before the payment does.</h2><p className="mt-3 max-w-3xl text-slate-600">Consider a local service: the founder pays to travel, delivers the work, sends an invoice and waits for the client’s payment date. Even if the job earns more than it costs, the founder needs cash during that gap.</p><div className="mt-6 grid gap-4 md:grid-cols-4">{[["Day 0","Promise","Agree on scope, date, deposit and what triggers final payment."],["Before delivery","Spend","Buy materials or travel. Keep the receipt and record the date."],["After delivery","Collect","Record the due date and actual date, including deductions or rework."],["Next cycle","Repeat?","Could you fund another order if this buyer paid a week later?"]].map(([time,title,copy])=><article key={time} className={card}><span className="text-sm font-bold text-blue-700">{time}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-2 text-slate-600">{copy}</p></article>)}</div><a href="/startup-cash-flow-india" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline">Put those dates into the cash-flow calendar <ArrowRight size={17}/></a></div></section>
    <section className="bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Lower the fixed promise, not the quality.</h2><p className="mt-3 max-w-3xl text-slate-600">If the ledger feels heavy, revise the first version of the business. A smaller test should still deliver a real outcome to a real buyer.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{[["Delay the permanent space.","Can you serve the first buyer from a permitted home setup, a rented slot, or the customer’s location? Check local rules and suitability before assuming any option is allowed."],["Buy for a named first order.","Ask suppliers about small quantities, lead times and return terms. A bulk discount is not a saving if cash sits on a shelf."],["Ask for a fair deposit where appropriate.","Put scope, payment milestones and cancellation terms in writing. Do not treat a promise to pay as collected cash."],["Count your own breathing room.","The business does not get to borrow indefinitely from rent, food or family obligations. Put a realistic owner draw in the monthly line."]].map(([title,copy])=><article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><div className={`${card} mt-6`}><h3 className="text-xl font-bold">Which number needs a real quote?</h3><ol className="mt-3 list-decimal pl-5 text-slate-600"><li>My first cost question</li></ol></div></div></section>
    <SellerFaq title="Questions founders ask too late" faq={[{q:"Is the cheapest startup idea automatically safer?",a:"No. Low initial spending can still leave you with unpaid time, difficult customers or a model that cannot earn enough per sale. Compare cash at risk, buyer evidence and your ability to deliver."},{q:"Should I count a refundable security deposit?",a:"Yes, in cash needed before opening. It may be recoverable later, but you cannot use it to pay a current bill while it is held elsewhere. Read the actual agreement and conditions."},{q:"Can I use estimated sales to reduce the cash gap?",a:"You can enter a collection scenario, but keep it separate from committed orders or money received. Run the ledger again with zero collections and with a later payment date."},{q:"Where do taxes and registrations fit?",a:"Requirements depend on the activity, entity, location and scale. Verify the obligations for your exact case with current official sources or qualified advice, then enter the actual expected cash amount. This worksheet does not determine legal obligations."}]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Can one sale carry its share?</h2><p className="mt-3 max-w-3xl text-blue-100">The cash map shows what must be funded. Now test the price, direct cost and repeat work of one real offer; then speak to the first buyer before spending on a polished launch.</p><a href="/business-models-india" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-800 hover:bg-blue-50">Test the money model <Calculator size={17}/></a></div></section>
  </V2Frame>;
}
