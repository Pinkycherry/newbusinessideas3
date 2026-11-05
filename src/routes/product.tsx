import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Star, X } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { ShortlistToggle } from "@/components/founder-workspace/shortlist-toggle";
import { ProviderPromptActions } from "@/components/founder-workspace/provider-prompt-actions";
import {
  buildFounderPrompt,
  buildProviderHandoffPrompt,
  clearShortlist,
  removeShortlistIdea,
  saveFounderContext,
  useFounderWorkspace,
  type FounderContext,
  type FounderPromptTask,
  type WorkspaceIdea,
} from "@/lib/founder-workspace";
import { getBrowseIdeas } from "@/lib/browse.functions";

export const Route = createFileRoute("/product")({
  head: () => ({ meta: [
    { title: "Business Idea Validation Workbench in India | BusinessIdea.io" },
    { name: "description", content: "Build a practical, India-focused validation prompt from published business ideas, local constraints and the output you need. Continue in ChatGPT, Claude, Grok or Perplexity without BBI AI credits." },
    { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
  ] }),
  loader: async () => {
    const result = await getBrowseIdeas({ data: { q: "", category: "", investment: "", time: "", skill: "", page: 1 } });
    return { ideas: result.ideas.slice(0, 6) };
  },
  component: ProductPage,
});

const wrap = "mx-auto max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6";
const input = "mt-2 block min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

const tasks: { value: FounderPromptTask; label: string; description: string }[] = [
  { value: "validate", label: "Pressure-test one idea", description: "Find the strongest assumptions to verify before spending." },
  { value: "compare", label: "Compare saved ideas", description: "Assess two to four ideas using the same evidence and constraints." },
  { value: "red-team", label: "Make the strongest case against it", description: "Expose the reasons the current idea might not work." },
  { value: "field-test", label: "Prepare a small field test", description: "Create a buyer question script and a reversible next experiment." },
];

type RequestedOutput = "report" | "roadmap" | "html" | "infographic" | "image";
const outputs: { value: RequestedOutput; label: string; description: string }[] = [
  { value: "report", label: "Detailed report", description: "Structured findings, unknowns, sources and risks." },
  { value: "roadmap", label: "Action roadmap", description: "A sequenced plan with practical checkpoints and review dates." },
  { value: "html", label: "HTML prototype", description: "A standalone responsive HTML file or complete code block." },
  { value: "infographic", label: "Charts or infographic", description: "A visual summary or chart; label estimates and use real source data." },
  { value: "image", label: "Generate an image", description: "Request an original image or visual concept in ChatGPT or Grok." },
];
const outputInstructions: Record<RequestedOutput, string> = {
  report: "Return a detailed report with findings, source links and dates, key unknowns, constraints, risks and the next practical action.",
  roadmap: "Return a sequenced roadmap with specific tasks, dependencies, estimated time, evidence to collect, checkpoints and a review date. Mark estimates as estimates.",
  html: "Create a self-contained responsive HTML prototype in one complete HTML code block. Make it usable, accessible and suitable for the stated Indian market; do not fabricate testimonials, metrics or customer results.",
  infographic: "Create a visual summary, chart or infographic if supported. Use only sourced data for factual charts, label assumptions, and if visual rendering is unavailable provide a clear Mermaid diagram or structured data specification.",
  image: "Generate an original image or visual concept if image generation is available. Do not substitute fabricated market data or claims. If image generation is not available in this session, state that clearly.",
};

function ProductPage() {
  const { ideas } = Route.useLoaderData();
  const workspace = useFounderWorkspace();
  const [task, setTask] = useState<FounderPromptTask>("validate");
  const [output, setOutput] = useState<RequestedOutput>("report");
  const [activeIdeaSlug, setActiveIdeaSlug] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const asWorkspaceIdea = (idea: (typeof ideas)[number]): WorkspaceIdea => ({
    slug: idea.slug,
    title: idea.title,
    source: "published",
    hook: idea.hook,
    summary: idea.summary,
    description: idea.summary || idea.hook,
    categoryCode: idea.category_code,
    investmentBand: idea.investment_band,
    timeNeeded: idea.time_needed,
    skillLevel: idea.skill_level,
    workMode: idea.work_mode,
  });

  const activeIdea = workspace.shortlist.find(idea => idea.slug === activeIdeaSlug) || workspace.shortlist[0];
  const promptIdeas = task === "compare" ? workspace.shortlist : activeIdea ? [activeIdea] : [];
  const needed = task === "compare" ? 2 : 1;
  const promptReady = promptIdeas.length >= needed;
  const updateContext = (key: keyof FounderContext, value: string) => {
    saveFounderContext({ [key]: value } as Partial<FounderContext>);
  };
  const prompt = buildFounderPrompt(task, promptIdeas, workspace.context) +
    "\n\nREQUESTED OUTPUT:\n" + outputInstructions[output] +
    (extraNotes.trim() ? "\n\nEXTRA FOUNDER CONTEXT (user-written):\n" + extraNotes.trim().slice(0, 1600) : "");
  const selectedOutput = outputs.find(item => item.value === output)!;
  const prefillPrompt = buildProviderHandoffPrompt(task, promptIdeas, workspace.context,
    "Requested output: " + selectedOutput.label + ". " + outputInstructions[output].slice(0, 180) +
    (extraNotes.trim() ? " Extra context: " + extraNotes.trim().slice(0, 140) : ""));

  return <V2Frame active="/product" showShortlistTray={false}>
    <div className="bg-slate-50 pt-24 lg:pt-28">
      <nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb">
        <a href="/" className="hover:text-blue-700">Home</a><ChevronRight size={15}/><span>Validation workbench</span>
      </nav>
    </div>
    <main className="text-slate-900">
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16">
        <div className={wrap}>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">Your founder workspace</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">Turn your idea and real constraints into the next decision.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Choose a published idea, add your own location, budget and available time, then prepare a specific prompt for ChatGPT, Claude, Grok or Perplexity. BusinessIdea.io does not run the AI request.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#my-ideas" className={button}>Use my saved ideas <ArrowRight size={17}/></a>
            <a href="#founder-context" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:border-blue-500">Set my constraints</a>
          </div>
          <p className="mt-4 text-sm text-slate-500">Your shortlist and context stay in this browser. They are not uploaded to BusinessIdea.io.</p>
        </div>
      </section>

      <section id="my-ideas" className="scroll-mt-28 py-12 lg:py-16">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-bold uppercase tracking-wide text-blue-700">STEP 1 · CHOOSE IDEAS</p><h2 className="mt-2 text-3xl font-bold">Your shortlist</h2><p className="mt-2 text-slate-600">{workspace.shortlist.length} of 4 ideas saved in this browser.</p></div>
            <div className="flex flex-wrap gap-2">
              <a href="/browse" className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Browse all ideas</a>
              {workspace.shortlist.length>0&&<button type="button" onClick={clearShortlist} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"><X size={15}/>Clear</button>}
            </div>
          </div>
          {workspace.shortlist.length>0 ? <ul className="mt-6 grid gap-3 sm:grid-cols-2">{workspace.shortlist.map(idea=><li key={idea.slug} className={`${card} flex items-start justify-between gap-3`}><div className="min-w-0"><a href={`/idea/${idea.slug}`} className="font-bold text-slate-950 hover:underline">{idea.title}</a><p className="mt-2 text-sm leading-6 text-slate-600">{idea.summary||idea.hook||idea.description||"Published idea record"}</p><p className="mt-2 text-xs text-slate-500">{idea.categoryName||idea.categoryCode||"Published idea"}</p></div><button type="button" onClick={()=>removeShortlistIdea(idea.slug)} className="shrink-0 text-sm font-semibold text-slate-600 hover:text-slate-950">Remove</button></li>)}</ul>
          : <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6"><h3 className="text-lg font-bold">Start with one actual published idea</h3><p className="mt-2 max-w-2xl leading-6 text-slate-600">You can add ideas below or go to Browse and use its filters. The saved selection will follow you to Compare and this workbench on the same browser.</p><a href="/browse" className={`${button} mt-4`}>Find published ideas <ArrowRight size={17}/></a></div>}
        </div>
      </section>

      <section className="bg-slate-50 py-12 lg:py-16">
        <div className={wrap}>
          <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wide text-blue-700">START FROM THE SOURCE</p><h2 className="mt-2 text-3xl font-bold">Add an idea directly from this page</h2><p className="mt-2 leading-7 text-slate-600">These are real published records returned by the existing idea library. Add one to your shortlist; the data remains read-only.</p></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(idea=><article key={idea.slug} className={card}><span className="text-xs font-bold uppercase tracking-wide text-blue-700">{idea.category_code}</span><h3 className="mt-2 break-words text-lg font-bold">{idea.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{idea.hook||idea.summary}</p><div className="mt-4 grid grid-cols-1 gap-2"><a className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" href={`/idea/${idea.slug}`}><ArrowRight size={15}/>Read full idea</a><ShortlistToggle compact className="w-full [&>button]:w-full" idea={asWorkspaceIdea(idea)}/><a className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 hover:border-blue-500 hover:bg-blue-50" href={`/idea/${idea.slug}#idea-validate`}><Star size={15}/>Validate this idea</a></div></article>)}</div>
        </div>
      </section>

      <section id="founder-context" className="scroll-mt-28 py-12 lg:py-16">
        <div className={wrap}>
          <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wide text-blue-700">STEP 2 · ADD YOUR CONTEXT</p><h2 className="mt-2 text-3xl font-bold">What should the research know about you?</h2><p className="mt-2 leading-7 text-slate-600">Fill in only what you know. Your entries are stored in this browser with your shortlist. The prompt will tell the outside model to mark unknowns and cite evidence instead of inventing data.</p></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className={`${card} block text-sm font-semibold`}>City or target market<input className={input} value={workspace.context.location} onChange={event=>updateContext("location",event.target.value)} placeholder="e.g. Pune, a nearby industrial area, or online India"/></label>
            <label className={`${card} block text-sm font-semibold`}>Budget available (₹)<input className={input} type="number" min="0" step="any" inputMode="decimal" value={workspace.context.budgetINR} onChange={event=>updateContext("budgetINR",event.target.value)} placeholder="Your real cash limit"/></label>
            <label className={`${card} block text-sm font-semibold`}>Reliable hours per week<input className={input} type="number" min="0" step="1" value={workspace.context.hoursPerWeek} onChange={event=>updateContext("hoursPerWeek",event.target.value)} placeholder="Hours you can repeat"/></label>
            <label className={`${card} block text-sm font-semibold`}>Skills and experience<input className={input} value={workspace.context.skills} onChange={event=>updateContext("skills",event.target.value)} placeholder="Skills you already have"/></label>
            <label className={`${card} block text-sm font-semibold`}>Who might pay?<input className={input} value={workspace.context.buyer} onChange={event=>updateContext("buyer",event.target.value)} placeholder="A reachable type of buyer, not everyone"/></label>
            <label className={`${card} block text-sm font-semibold`}>Preferred response language<select className={input} value={workspace.context.language} onChange={event=>updateContext("language",event.target.value)}><option>English</option><option>Hindi</option><option>Telugu</option><option>Marathi</option><option>Tamil</option><option>Kannada</option><option>Bengali</option><option>Gujarati</option><option>Punjabi</option><option>Urdu</option><option>Other Indian language</option></select></label>
            <label className={`${card} block text-sm font-semibold md:col-span-2`}>What problem happened recently?<textarea className={input} rows={3} value={workspace.context.recentProblem} onChange={event=>updateContext("recentProblem",event.target.value)} placeholder="A real recent event you want to investigate"/></label>
            <label className={`${card} block text-sm font-semibold md:col-span-2`}>What do people do now instead?<textarea className={input} rows={3} value={workspace.context.currentWorkaround} onChange={event=>updateContext("currentWorkaround",event.target.value)} placeholder="Existing seller, workaround, family help, spreadsheet, or doing nothing"/></label>
            <label className={`${card} block text-sm font-semibold md:col-span-2`}>What small offer might you test?<textarea className={input} rows={3} value={workspace.context.proposedOffer} onChange={event=>updateContext("proposedOffer",event.target.value)} placeholder="Outcome, scope, a price to test, and a delivery window"/></label>
          </div>
          <p className="mt-4 text-sm text-slate-500" role="status">Your constraints save locally as you type. Clear browser site data or changing devices can remove them.</p>
        </div>
      </section>

      <section className="bg-slate-50 py-12 lg:py-16">
        <div className={wrap}>
          <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wide text-blue-700">STEP 3 · CHOOSE TASK AND OUTPUT</p><h2 className="mt-2 text-3xl font-bold">What should AI help you do?</h2><p className="mt-2 leading-7 text-slate-600">Pick the job and the kind of result you need. The prompt includes your saved ideas, constraints, output request and notes. Nothing is sent until you choose an AI tool.</p></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Choose validation task">{tasks.map(item=><button key={item.value} type="button" aria-pressed={task===item.value} onClick={()=>setTask(item.value)} className={`rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${task===item.value?"border-blue-700 bg-blue-50 ring-2 ring-blue-100":"border-slate-200 bg-white hover:border-blue-400"}`}><span className="block font-bold text-slate-950">{item.label}</span><span className="mt-2 block text-sm leading-6 text-slate-600">{item.description}</span></button>)}</div>
          <div className="mt-7"><h3 className="text-lg font-bold text-slate-950">Choose your output</h3><p className="mt-1 text-sm leading-6 text-slate-600">Image generation is offered through ChatGPT and Grok. Other output types are requested as text, code or visual specifications when supported.</p><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Choose output type">{outputs.map(item=><button key={item.value} type="button" aria-pressed={output===item.value} onClick={()=>setOutput(item.value)} className={`min-w-0 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${output===item.value?"border-blue-700 bg-blue-50 ring-2 ring-blue-100":"border-slate-200 bg-white hover:border-blue-400"}`}><span className="block font-bold text-slate-950">{item.label}</span><span className="mt-2 block text-sm leading-5 text-slate-600">{item.description}</span></button>)}</div></div>
          {task!=="compare"&&workspace.shortlist.length>0&&<label className="mt-6 block max-w-2xl text-sm font-semibold">Idea to use for this task<select className={input} value={activeIdea?.slug||""} onChange={event=>setActiveIdeaSlug(event.target.value)}>{workspace.shortlist.map(idea=><option key={idea.slug} value={idea.slug}>{idea.title}</option>)}</select></label>}
          <label className="mt-6 block max-w-3xl text-sm font-semibold">Anything else the AI should know? (optional)<textarea className={input} rows={3} value={extraNotes} onChange={event=>setExtraNotes(event.target.value)} placeholder="Example: Telugu, ₹50,000, a small town near Pune, weekends only — or anything else the AI should know"/></label>
          {promptReady ? <div className="mt-6"><p className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">STEP 4 · REVIEW AND CONTINUE</p><ProviderPromptActions title={task==="compare"?"Compare your saved ideas with AI":"Review prompt and continue with AI"} prompt={prompt} prefillPrompt={prefillPrompt} allowedProviders={output==="image"?["chatgpt","grok"]:undefined}/></div>
          : <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h3 className="font-bold text-slate-950">{task==="compare"?"Add two or more ideas before comparing":"Choose a published idea before preparing a prompt"}</h3><p className="mt-2 leading-6 text-slate-700">{task==="compare"?"The comparison prompt needs at least two records from your shortlist. Add more in Browse, Blueprints or the idea cards above.":"Add one published idea to your local shortlist to prepare a prompt. Nothing is sent until you choose a provider."}</p><div className="mt-4 flex flex-wrap gap-3"><a className={button} href="/browse">Find ideas <ArrowRight size={16}/></a><a className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold" href="/blueprints">Browse blueprints</a></div></div>}
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className={wrap}><div className="grid gap-8 lg:grid-cols-2 lg:items-center"><div><p className="text-sm font-bold uppercase tracking-wide text-blue-700">The honest boundary</p><h2 className="mt-2 text-3xl font-bold">A prompt is not proof of demand.</h2><p className="mt-3 leading-7 text-slate-600">The prepared prompt asks for source links and dates, but the model may still be wrong or out of date. Verify consequential claims, then ask a real potential buyer about what happened last time. BusinessIdea.io does not store the external model's answer or charge for its inference.</p><div className="mt-5 flex flex-wrap gap-3"><a href="/business-idea-research-india" className="inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Open the evidence desk</a><a href="/business-idea-pivot-or-stop" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold">Set a stop boundary</a></div></div><div className={card}><h3 className="text-lg font-bold">What gets carried into the prompt</h3><ul className="mt-4 list-disc space-y-2 pl-5 leading-6 text-slate-600"><li>Selected published record(s)</li><li>Your chosen city/market and actual rupee budget, if supplied</li><li>Available hours, skills and target buyer, if supplied</li><li>Your problem, current workaround and proposed small offer</li><li>Your selected task and optional extra notes</li></ul><p className="mt-4 text-sm text-slate-500">The prompt is prefilled when supported. Review it in the selected tool before confirming.</p></div></div></div>
      </section>

      <SellerFaq title="How this workbench handles your data" faq={[
        { q: "Does BusinessIdea.io run the AI analysis?", a: "No. It prepares a prompt and opens the selected AI tool. You review the prompt and confirm sending there." },
        { q: "Are my ideas and constraints saved to a server?", a: "No. The selected ideas and context are stored in browser local storage. They are not uploaded to BusinessIdea.io by this workbench. Browser data or device changes can remove them." },
        { q: "Can I use the result as proof that customers will buy?", a: "No. Use the outside model to find assumptions and research sources. Verify the source/date and run a suitable test with real buyers before committing money." },
        { q: "Do all outside AI accounts have the same free limits?", a: "No. Access, features and usage limits vary by provider and plan. This site does not guarantee unlimited free use or pay the provider for you." },
      ]} />

      <section className="bg-blue-800 py-12 text-white lg:py-16"><div className={wrap}><h2 className="text-3xl font-bold">One idea, one useful next action.</h2><p className="mt-3 max-w-3xl leading-7 text-blue-100">Save the idea, state your constraints, then take the prepared question into your selected AI tool. Keep the evidence and decision with you—not in another credit meter.</p><div className="mt-6 flex flex-wrap gap-3"><a href="/startup-idea-comparison" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-900 hover:bg-blue-50">Compare your shortlist <ArrowRight size={17}/></a><a href="/browse" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-300 px-5 py-3 font-semibold text-white hover:bg-blue-700">Find another idea <ArrowRight size={17}/></a></div></div></section>
    </main>
  </V2Frame>;
}
