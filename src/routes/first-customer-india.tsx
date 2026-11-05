import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Trash2, Download } from "lucide-react";
import { ShortlistToggle } from "@/components/founder-workspace/shortlist-toggle";
import { ProviderPromptActions } from "@/components/founder-workspace/provider-prompt-actions";
import { buildFounderPrompt, buildProviderHandoffPrompt, saveFounderContext, useFounderWorkspace, type WorkspaceIdea } from "@/lib/founder-workspace";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { getListsHub } from "@/lib/lists.functions";
import { getBrowseIdeas } from "@/lib/browse.functions";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

const contexts = [
  { key: "neighbourhood", title: "A neighbourhood buyer", where: "Observe the street, market, apartment group or service queue where the problem already appears.", ask: "What did you pay for the last time this happened?", risk: "A friend who likes you may praise the idea without needing the offer." },
  { key: "work", title: "A business buyer", where: "Find the person who owns the budget, not only the person who uses the service.", ask: "Who approved the last purchase, and when did it become urgent?", risk: "A meeting is not a purchase order; procurement and payment timing matter." },
  { key: "online", title: "An online buyer", where: "Watch existing searches, product reviews and questions; then speak with people in a narrow group.", ask: "Which option did you almost buy, and what stopped you?", risk: "Views and followers do not prove that a defined offer will sell." },
] as const;
const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500";
const primary = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700";
const OBSERVATION_KEY = "bbi-first-customer-observations-v1";
type CustomerObservation = {
  id: string; date: string; buyer: string; location: string; trigger: string;
  workaround: string; offer: string; outcome: string; amount: string; notes: string;
};
function readCustomerObservations(): CustomerObservation[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(OBSERVATION_KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is CustomerObservation =>
      Boolean(item) && typeof item.id === "string" && typeof item.buyer === "string"
    ).slice(0, 30);
  } catch { return []; }
}
function ideaForShortlist(idea: { slug:string; title:string; hook?:string; summary?:string; category_code?:string; investment_band?:string; time_needed?:string; skill_level?:string; work_mode?:string }): WorkspaceIdea {
  return {
    slug: idea.slug, title: idea.title, source: "published", hook: idea.hook,
    summary: idea.summary, description: idea.summary || idea.hook,
    categoryCode: idea.category_code, investmentBand: idea.investment_band,
    timeNeeded: idea.time_needed, skillLevel: idea.skill_level, workMode: idea.work_mode,
  };
}

export const Route = createFileRoute("/first-customer-india")({
  head: () => ({ meta: [
    { title: "Find Your First Customer in India: A Practical Business Idea Field Map | BusinessIdea.io" },
    { name: "description", content: "Locate a first customer for a business idea in India. Map the trigger, current alternative, payer and evidence of a real commitment." },
    { property: "og:title", content: "Find your first customer in India | BusinessIdea.io" },
    { property: "og:type", content: "article" },
  ] }),
  loader: async () => {
    const hub = await getListsHub();
    const category = hub.categories.find(item => /local service|home service|online service/i.test(item.name));
    const result = await getBrowseIdeas({ data: { q: "", category: category?.code ?? "", investment: "", time: "", skill: "", page: 1 } });
    return { categories: hub.categories, ideas: result.ideas };
  },
  component: FirstCustomerPage,
});

function FirstCustomerPage() {
  const { categories, ideas } = Route.useLoaderData();
  const [context, setContext] = useState(0);
  const current = contexts[context] ?? contexts[0];
  const workspace = useFounderWorkspace();
  const [ideaTitle, setIdeaTitle] = useState("");
  const [buyerGroup, setBuyerGroup] = useState(workspace.context.buyer);
  const [marketLocation, setMarketLocation] = useState(workspace.context.location);
  const [trigger, setTrigger] = useState(workspace.context.recentProblem);
  const [workaround, setWorkaround] = useState(workspace.context.currentWorkaround);
  const [offer, setOffer] = useState(workspace.context.proposedOffer);
  const [trialPrice, setTrialPrice] = useState("");
  const [responseLanguage, setResponseLanguage] = useState(workspace.context.language || "English");
  const [visitDate, setVisitDate] = useState("");
  const [outcome, setOutcome] = useState("not-contacted");
  const [observationNotes, setObservationNotes] = useState("");
  const [observations, setObservations] = useState<CustomerObservation[]>([]);
  const [observationsLoaded, setObservationsLoaded] = useState(false);
  const [logMessage, setLogMessage] = useState("");
  const [logError, setLogError] = useState("");

  useEffect(() => {
    setObservations(readCustomerObservations());
    setObservationsLoaded(true);
  }, []);
  useEffect(() => {
    if (!observationsLoaded) return;
    try {
      window.localStorage.setItem(OBSERVATION_KEY, JSON.stringify(observations.slice(0, 30)));
    } catch {
      setLogError("Browser storage is unavailable; this observation was not saved.");
    }
  }, [observations, observationsLoaded]);
  useEffect(() => {
    if (!ideaTitle && workspace.shortlist.length) setIdeaTitle(workspace.shortlist[0].title);
  }, [workspace.shortlist, ideaTitle]);
  useEffect(() => {
    setBuyerGroup(workspace.context.buyer);
    setMarketLocation(workspace.context.location);
    setTrigger(workspace.context.recentProblem);
    setWorkaround(workspace.context.currentWorkaround);
    setOffer(workspace.context.proposedOffer);
    setResponseLanguage(workspace.context.language || "English");
  }, [workspace.context]);
  const exportObservations = () => {
    const body = observations.map((item,index) => [
      "## Conversation " + (index+1),
      "- Date: " + (item.date || "Not recorded"),
      "- Buyer / role: " + (item.buyer || "Not recorded"),
      "- Market / location: " + (item.location || "Not recorded"),
      "- Recent trigger: " + (item.trigger || "Not recorded"),
      "- Current workaround: " + (item.workaround || "Not recorded"),
      "- Offer tested: " + (item.offer || "Not recorded"),
      "- Response: " + item.outcome,
      "- Amount discussed (INR): " + (item.amount || "Not recorded"),
      "- Observation: " + (item.notes || "Not recorded"),
    ].join("\n")).join("\n\n");
    const content = "# BusinessIdea.io first-customer conversation log\n\n" + body + "\n\nThese are founder-entered observations, not independently verified customer commitments.";
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "businessidea-first-customer-observations.md";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const clearObservations = () => {
    if (!window.confirm("Clear all saved conversation observations from this browser?")) return;
    setObservations([]);
    setLogMessage("The local conversation log was cleared.");
    setLogError("");
  };

  const saveCurrentContext = () => saveFounderContext({
    buyer: buyerGroup, location: marketLocation, recentProblem: trigger,
    currentWorkaround: workaround, proposedOffer: offer, language: responseLanguage,
  });
  const promptContext = {
    ...workspace.context,
    location: marketLocation || workspace.context.location,
    buyer: buyerGroup || workspace.context.buyer,
    recentProblem: trigger || workspace.context.recentProblem,
    currentWorkaround: workaround || workspace.context.currentWorkaround,
    proposedOffer: offer || workspace.context.proposedOffer,
    language: responseLanguage,
    additionalContext: [
      workspace.context.additionalContext,
      "Idea or offer to test: " + ideaTitle,
      "Town/market: " + marketLocation,
      "Buyer group: " + buyerGroup,
      "Recent problem: " + trigger,
      "Current workaround: " + workaround,
      "Offer: " + offer,
      "Price/amount discussed in INR: " + trialPrice,
      "Response outcome: " + outcome,
      "Observation notes: " + observationNotes,
    ].filter(Boolean).join("\n"),
  };
  const firstCustomerPrompt = buildFounderPrompt("field-test", workspace.shortlist, promptContext);
  const firstCustomerPrefill = buildProviderHandoffPrompt("field-test", workspace.shortlist, promptContext, [
    "Idea or offer: " + ideaTitle, "Town/market: " + marketLocation,
    "Buyer: " + buyerGroup, "Recent problem: " + trigger, "Workaround: " + workaround,
    "Offer: " + offer, "Price: " + trialPrice, "Response: " + outcome, "Observation: " + observationNotes,
  ].join("\n"));
  const related = categories.filter(item => /local|service|online/i.test(item.name)).slice(0, 6);
  return <V2Frame active="/startup-guides">
    <JsonLd schema={[
      webPageSchema({ path: "/first-customer-india", name: "Find a first customer for a business idea in India", description: "A field map for identifying the buyer, their existing alternative and a specific commitment." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "First customer in India", path: "/first-customer-india" }]),
    ]} />
    <div className="bg-slate-50 pt-24 lg:pt-28"><nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/startup-guides">Guides</a><ChevronRight size={15}/><span>First customer in India</span></nav></div>
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16"><div className={wrap}>
      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">The person before the plan · India</span>
      <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Your first customer has a <span className="text-blue-700">Tuesday.</span></h1>
      <p className="mt-5 max-w-3xl text-lg text-slate-600">They are already fixing the problem somehow, between work, family and the rest of their day. Find that moment before you buy a logo, a lease or a month of ads.</p>
      <div className="mt-7 flex flex-wrap gap-3"><a href="/browse" className={primary}>Browse ideas <ArrowRight size={17}/></a><a href="#buyer-map" className="inline-flex min-h-11 items-center rounded-xl border bg-white px-6 py-3 font-semibold hover:border-blue-500">Map one buyer</a></div>
    </div></section>
    <section id="buyer-map" className="scroll-mt-28 bg-slate-50 py-12 lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Look for a moment, not a demographic.</h2><p className="mt-3 max-w-3xl text-slate-600">“Everyone in my city” is too broad for a first sale. Name the situation that makes someone act, where it occurs and who can actually pay.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Trigger", "What broke, ran out or became urgent?", "A leaking tap, a delayed order, a missed deadline, a training gap. Look for a repeated moment rather than a vague preference."],
      ["Workaround", "What do they do today?", "Ask about the last purchase, person they called, app they used or task they postponed. That is the alternative you have to beat."],
      ["Payment", "Who decides and who transfers money?", "For a household or a company, the user and payer may differ. Know the approval step and collection date."],
    ].map(([label, title, copy]) => <article className={card} key={label}><span className="text-sm font-bold uppercase text-blue-700">{label}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section className="py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Where can you meet that moment?</h2><p className="mt-3 max-w-3xl text-slate-600">The first conversation depends on the buying setting. Choose a lens; these are prompts, not a claim that any channel will work for your idea.</p><div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Buyer setting">{contexts.map((item, index) => <button type="button" className={`min-h-11 rounded-xl border px-5 py-3 font-semibold ${context === index ? "border-blue-600 bg-blue-600 text-white" : "bg-white hover:border-blue-500"}`} key={item.key} aria-pressed={context === index} onClick={() => setContext(index)}>{item.title}</button>)}</div><article className={`${card} mt-5`} aria-live="polite"><h3 className="text-xl font-bold">{current.title}</h3><dl className="mt-4 grid gap-4 md:grid-cols-3"><div><dt className="font-semibold text-blue-700">Where to look</dt><dd className="mt-2 text-slate-600">{current.where}</dd></div><div><dt className="font-semibold text-blue-700">What to ask</dt><dd className="mt-2 text-slate-600">“{current.ask}”</dd></div><div><dt className="font-semibold text-blue-700">What can fool you</dt><dd className="mt-2 text-slate-600">{current.risk}</dd></div></dl></article></div></section>
    <section className="bg-slate-50 py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Ask about their life, then your offer.</h2><p className="mt-3 max-w-3xl text-slate-600">A sales pitch too early teaches you what people say to be polite. Start with a specific past situation. Let them explain the trade-off they already make.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{[
      ["When did this last happen?", "Hear the date, setting and consequence. A remembered incident is more useful than “it happens sometimes.”"],
      ["What did you do?", "Find the existing provider, price, delay and effort. Do not argue against their workaround."],
      ["What would change the choice?", "Ask about quality, trust, timing, proximity and the real payer."],
      ["Will you try a defined offer?", "State scope, date and price. Listen for a payment, booking, introduction or concrete refusal."],
    ].map(([title, copy], index) => <article className={card} key={title}><span className="text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><a href="/business-idea-research-india" className="mt-6 inline-flex font-semibold text-blue-700 hover:underline">Use the business idea evidence desk <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section className="py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Interest is a door. Commitment is a step through it.</h2><p className="mt-3 max-w-3xl text-slate-600">Do not turn polite responses into a market-size number. Separate what someone said from what they spent, booked or introduced.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Heard", "“That sounds useful.”", "A conversation starter. Ask about the last incident and current alternative."],
      ["Asked", "“Can you send the details?”", "More specific interest. Send exact scope and price; watch what happens next."],
      ["Committed", "“I will book or pay.”", "Record the agreed amount, date and conditions. A verbal plan can still change before collection."],
    ].map(([label, quote, copy]) => <article className={card} key={label}><span className="text-sm font-bold uppercase text-blue-700">{label}</span><h3 className="mt-3 text-xl font-bold">{quote}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div><a href="/business-demand-test-india" className="mt-6 inline-flex font-semibold text-blue-700 hover:underline">Choose a commitment and record the reply <ArrowRight className="ml-2" size={17}/></a></div></section>
    <section id="conversation-worksheet" className="scroll-mt-28 bg-slate-50 py-8 lg:py-10"><div className={wrap}>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wide text-blue-700">Use it in the real world</p><h2 className="mt-2 text-3xl font-bold">Prepare one useful conversation.</h2><p className="mt-3 max-w-3xl text-slate-600">Describe one idea and a reachable buyer. Carry the brief into AI, then record what actually happened after speaking to someone.</p></div><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">Saved in this browser only</span></div>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_0.85fr]">
        <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" onSubmit={event => { event.preventDefault(); saveCurrentContext(); const added: CustomerObservation = { id: String(Date.now()), date: visitDate, buyer: buyerGroup, location: marketLocation, trigger, workaround, offer, outcome, amount: trialPrice, notes: observationNotes }; if (!buyerGroup.trim() && !trigger.trim() && !observationNotes.trim()) { setLogError("Add a buyer, a real problem or an observation before saving."); return; } setObservations(items => [added, ...items].slice(0, 30)); setLogMessage("Observation saved in this browser."); setLogError(""); }}>
          <h3 className="text-xl font-bold text-slate-950">Your field brief</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold sm:col-span-2">Business idea or offer<input className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" maxLength={220} value={ideaTitle} onChange={event => setIdeaTitle(event.target.value)} placeholder="Name the idea you want to test" /></label>
            <label className="block text-sm font-semibold">Buyer group / role<input className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" maxLength={220} value={buyerGroup} onChange={event => setBuyerGroup(event.target.value)} onBlur={saveCurrentContext} placeholder="e.g. PG owners or tuition centres" /></label>
            <label className="block text-sm font-semibold">Town / market<input className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" maxLength={120} value={marketLocation} onChange={event => setMarketLocation(event.target.value)} onBlur={saveCurrentContext} placeholder="Town, district, state" /></label>
            <label className="block text-sm font-semibold sm:col-span-2">What happened recently?<textarea className="mt-2 block min-h-20 w-full rounded-xl border border-slate-300 p-3 font-normal" maxLength={500} rows={2} value={trigger} onChange={event => setTrigger(event.target.value)} onBlur={saveCurrentContext} placeholder="One recent incident, delay, shortage, expense or workaround" /></label>
            <label className="block text-sm font-semibold sm:col-span-2">What do they use today instead?<textarea className="mt-2 block min-h-20 w-full rounded-xl border border-slate-300 p-3 font-normal" maxLength={500} rows={2} value={workaround} onChange={event => setWorkaround(event.target.value)} onBlur={saveCurrentContext} placeholder="Existing provider, app, shop, informal help or doing it themselves" /></label>
            <label className="block text-sm font-semibold sm:col-span-2">Small offer to test<input className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" maxLength={300} value={offer} onChange={event => setOffer(event.target.value)} onBlur={saveCurrentContext} placeholder="One delivery, paid trial, booking, sample or scoped service" /></label>
            <label className="block text-sm font-semibold">Price / amount discussed (₹)<input className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" maxLength={80} value={trialPrice} onChange={event => setTrialPrice(event.target.value)} placeholder="Amount or range; leave blank if unknown" /></label>
            <label className="block text-sm font-semibold">Response language<select className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal" value={responseLanguage} onChange={event => { setResponseLanguage(event.target.value); saveFounderContext({ language: event.target.value }); }}>{["English","Hindi","Telugu","Tamil","Marathi","Bengali","Kannada","Malayalam","Gujarati","Punjabi","Other Indian language"].map(item => <option value={item} key={item}>{item}</option>)}</select></label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3"><a href="#first-customer-script" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Build AI conversation plan <ArrowRight size={16}/></a><button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-blue-500"><Check size={16}/>Record this conversation</button></div>
          <label className="mt-4 block text-sm font-semibold">What did the person actually say or do?<textarea className="mt-2 block min-h-24 w-full rounded-xl border border-slate-300 p-3 font-normal" maxLength={1000} rows={3} value={observationNotes} onChange={event => setObservationNotes(event.target.value)} placeholder="Quote only what matters. Separate what they said from what they booked, paid or refused." /></label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Conversation date<input className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" type="date" value={visitDate} onChange={event => setVisitDate(event.target.value)} /></label>
            <label className="block text-sm font-semibold">Strongest response so far<select className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal" value={outcome} onChange={event => setOutcome(event.target.value)}>{[["not-contacted","Not contacted yet"],["heard","Said it sounds useful"],["asked","Asked for details"],["booked","Booked a trial / specific next step"],["paid","Paid or left a deposit"],["declined","Declined or chose another option"]].map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Do not store private customer identifiers or confidential company details. These notes stay in this browser; clearing browser data can remove them.</p>
          {logMessage && <p className="mt-3 text-sm text-blue-800" role="status">{logMessage}</p>}
          {logError && <p className="mt-3 text-sm text-red-700" role="alert">{logError}</p>}
        </form>
        <div className="space-y-4">
          <article id="first-customer-script" className="scroll-mt-28 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-800">AI handoff</p><h3 className="mt-2 text-xl font-bold text-slate-950">Turn the brief into questions and a small offer.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">The prompt asks the selected AI for neutral interview questions, a suitable outreach message, a simple evidence log and a reversible next test. This website does not send an AI request.</p>
            <ProviderPromptActions title="Continue with AI" prompt={firstCustomerPrompt} prefillPrompt={firstCustomerPrefill}/>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-slate-950">Your local conversation log</h3><p className="mt-1 text-sm text-slate-600">{observations.length} saved observation(s) in this browser.</p></div>{observations.length>0&&<div className="flex shrink-0 flex-wrap gap-2"><button type="button" onClick={exportObservations} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-500"><Download size={14}/> Export</button><button type="button" onClick={clearObservations} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-red-400"><Trash2 size={14}/> Clear all</button></div>}</div>
            {observations.length===0 ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">No conversations recorded yet. After speaking with a buyer, record the date, problem and strongest action they took.</p> : <ul className="mt-4 space-y-3">{observations.map(item=><li key={item.id} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words font-semibold text-slate-950">{item.buyer || "Buyer not labelled"}{item.date ? " · " + item.date : ""}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">{({ "not-contacted":"Not contacted",heard:"Heard interest",asked:"Asked for details",booked:"Trial / next step",paid:"Paid / deposit",declined:"Declined" } as Record<string,string>)[item.outcome] || item.outcome}</p></div><button type="button" aria-label="Delete this observation" onClick={()=>setObservations(all=>all.filter(saved=>saved.id!==item.id))} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-950"><Trash2 size={15}/></button></div>{item.trigger && <p className="mt-2 text-sm text-slate-700"><strong>Problem:</strong> {item.trigger}</p>}{item.workaround && <p className="mt-1 text-sm text-slate-700"><strong>Alternative:</strong> {item.workaround}</p>}{item.offer && <p className="mt-1 text-sm text-slate-700"><strong>Offer:</strong> {item.offer}</p>}{item.amount && <p className="mt-1 text-sm text-slate-700"><strong>Price:</strong> ₹ {item.amount}</p>}{item.notes && <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-2 text-sm text-slate-700">{item.notes}</p>}</li>)}</ul>}
          </article>
        </div>
      </div>
    </div></section>    <section className="py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Make the first promise small enough to keep.</h2><p className="mt-3 max-w-3xl text-slate-600">Distance, timing, trust, language, payment method and a local referral can change a first sale. Use what you learned to define an offer you can actually deliver.</p><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
      ["Place", "Can you reach the buyer or fulfil the order reliably in their area?"],
      ["Trust", "What proof, sample or clear terms would make a stranger comfortable trying you?"],
      ["Cash", "Will you pay to deliver before the customer pays you? Count that gap."],
      ["Repeat", "Is the need occasional or recurring, and would they choose you again?"],
    ].map(([title, copy]) => <article className={card} key={title}><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-slate-600">{copy}</p></article>)}</div></div></section>
    <section className="bg-slate-50 py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Published ideas to inspect</h2><p className="mt-2 max-w-3xl text-slate-600">These are starting points, not evidence that a buyer in your area already wants them.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea => <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5" key={idea.slug}><h3 className="break-words text-lg font-bold leading-snug text-slate-950">{idea.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{idea.hook || idea.summary}</p><div className="mt-4 grid gap-2"><a href={"/idea/" + idea.slug} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">Read full idea <ArrowRight size={15}/></a><ShortlistToggle idea={ideaForShortlist(idea)} compact className="w-full [&>button]:w-full"/><a href={"/idea/" + idea.slug + "#idea-validate"} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-blue-500 hover:bg-blue-50">Validate this idea <ArrowRight size={15}/></a></div></article>)}</div></div></section>    <section className="py-8 lg:py-10"><div className={wrap}><h2 className="text-3xl font-bold">Related categories</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(category => <a className={card} href={`/category/${category.slug}`} key={category.slug}><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700">Explore category <ArrowRight size={17}/></span></a>)}</div></div></section>
    <SellerFaq title="Common first-customer questions" faq={[
      { q: "Should I run ads to find the first buyer?", a: "Ads can reach people, but a small founder can often learn more from direct conversations first. Choose the channel that can reach the actual payer and measure a defined offer, not only clicks." },
      { q: "Can friends and family be customers?", a: "They can buy, but separate support for you from repeatable demand. Ask whether the same offer would make sense to someone who does not know you." },
      { q: "How many interviews prove the idea?", a: "No fixed count proves a business. Look for patterns in real past behaviour, specific commitments, delivery cost and repeated objections. Keep testing until you understand the risk you are about to pay for." },
    ]} />
    <section className="bg-blue-700 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">Take one offer into the world.</h2><p className="mt-3 max-w-3xl text-blue-100">Use the conversation to name the smallest useful delivery, price it with your own costs, and validate what could make you stop.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[
      ["Work out the first price", "/business-pricing-india"], ["Plan a field test", "/startup-idea-validation"], ["Read the original first-customer article", "/blog/find-first-paying-customer-without-ads"],
    ].map(([label, href]) => <a href={href} key={href} className="flex min-h-11 items-center justify-between rounded-xl bg-white p-4 font-semibold text-blue-800 hover:bg-blue-50">{label}<ArrowRight size={17}/></a>)}</div></div></section>
  </V2Frame>;
}
