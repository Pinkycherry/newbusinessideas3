import { SellerFaq } from "@/components/v2/faq";
import { V2PageCta, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Download, Trash2 } from "lucide-react";
import { GlassShell } from "@/components/glass-shell";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import "@/components/idea-comparison.css";
import { useFounderWorkspace, removeShortlistIdea, clearShortlist, buildFounderPrompt, buildProviderHandoffPrompt, type WorkspaceIdea } from "@/lib/founder-workspace";
import { getComparisonRecords } from "@/lib/comparison.functions";
import { ProviderPromptActions } from "@/components/founder-workspace/provider-prompt-actions";

const ASSESSMENT_KEY_PREFIX = "bbi-idea-comparison-v1:";

const lenses = [
  { title: "A buyer you can reach", prompt: "Can you name a real group and reach a decision-maker this week?", next: "/first-customer-india", link: "Map the first payer" },
  { title: "A problem that has happened", prompt: "Have you heard a recent workaround or seen an actual purchase?", next: "/business-idea-research-india", link: "Check the evidence" },
  { title: "Cash before collection", prompt: "Which idea ties up more money before a buyer pays?", next: "/startup-costs-india", link: "Map startup cash" },
  { title: "One sale that carries the work", prompt: "Which first offer has a defined price, scope and delivery cost?", next: "/business-pricing-india", link: "Quote the first sale" },
  { title: "Time you can truly give", prompt: "Can you make the first promise alongside work, travel and family obligations?", next: "/startup-idea-validation", link: "Plan a reversible test" },
] as const;
export const Route = createFileRoute("/startup-idea-comparison")({
  head: () => ({ meta: [
    { title: "Compare Two Startup Ideas in India with Evidence | BusinessIdea.io" },
    { name: "description", content: "Compare two business ideas in India by buyer access, observed need, cash, first-sale economics and the time you can truly give. Choose a small next test without a fake score." },
    { property: "og:title", content: "Compare two startup ideas in India | BusinessIdea.io" },
    { property: "og:type", content: "article" },
  ] }),
  component: ComparisonPage,
});
function ComparisonPage() {
  const { shortlist, context } = useFounderWorkspace();
  const getFullRecords = useServerFn(getComparisonRecords);
  const [fullRecords, setFullRecords] = useState<WorkspaceIdea[]>([]);
  const [recordState, setRecordState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [recordError, setRecordError] = useState("");
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [nextStep, setNextStep] = useState("");

  const shortlistKey = shortlist.map(idea => (idea.source || "auto") + ":" + idea.slug).join("|");
  const [assessmentKey, setAssessmentKey] = useState("");
  useEffect(() => {
    if (!shortlistKey) {
      setAssessmentKey("");
      setChoices({});
      setNotes({});
      setNextStep("");
      return;
    }
    try {
      const saved = JSON.parse(window.localStorage.getItem(ASSESSMENT_KEY_PREFIX + shortlistKey) || "null") as {
        choices?: Record<string, string>;
        notes?: Record<string, string>;
        nextStep?: string;
      } | null;
      setChoices(saved?.choices && typeof saved.choices === "object" ? saved.choices : {});
      setNotes(saved?.notes && typeof saved.notes === "object" ? saved.notes : {});
      setNextStep(typeof saved?.nextStep === "string" ? saved.nextStep : "");
    } catch {
      setChoices({});
      setNotes({});
      setNextStep("");
    }
    setAssessmentKey(shortlistKey);
  }, [shortlistKey]);

  useEffect(() => {
    if (!assessmentKey || assessmentKey !== shortlistKey) return;
    try {
      window.localStorage.setItem(ASSESSMENT_KEY_PREFIX + assessmentKey, JSON.stringify({ choices, notes, nextStep }));
    } catch {
      // Keep the current comparison usable if browser storage is unavailable.
    }
  }, [assessmentKey, shortlistKey, choices, notes, nextStep]);

  useEffect(() => {
    const items = shortlist.map(({ slug, source }) => ({ slug, source }));
    if (items.length < 2) {
      setFullRecords([]);
      setRecordState("idle");
      setRecordError("");
      return;
    }
    let cancelled = false;
    setRecordState("loading");
    setRecordError("");
    void getFullRecords({ data: { items } }).then(records => {
      if (cancelled) return;
      if (records.some(record => !record)) {
        setFullRecords(records.filter((record): record is WorkspaceIdea => Boolean(record)));
        setRecordState("error");
        setRecordError("One or more selected records could not be loaded. Remove the missing item or try again.");
        return;
      }
      setFullRecords(records as WorkspaceIdea[]);
      setRecordState("ready");
    }).catch(() => {
      if (cancelled) return;
      setRecordState("error");
      setRecordError("The published idea details could not be loaded. Your saved shortlist has not been changed.");
    });
    return () => { cancelled = true; };
  }, [shortlistKey, getFullRecords]);

  const selectedRecords = shortlist.map(saved => fullRecords.find(idea => idea.slug === saved.slug) || saved);
  const comparisonRows: { label: string; value: (idea: WorkspaceIdea) => string }[] = [
    { label: "Business description", value: idea => idea.description || idea.summary || idea.hook || "" },
    { label: "Category", value: idea => idea.categoryName || idea.categoryCode || "" },
    { label: "Starting investment", value: idea => idea.startupCost || idea.investmentBand || "" },
    { label: "Time demand", value: idea => idea.timeNeeded || "" },
    { label: "Skills", value: idea => idea.skillLevel || "" },
    { label: "Work setting", value: idea => idea.workMode || "" },
    { label: "Target buyer", value: idea => idea.targetCustomer || "" },
    { label: "Revenue model", value: idea => idea.revenueModel || "" },
    { label: "Known risks", value: idea => idea.risks || "" },
    { label: "First steps", value: idea => idea.firstSteps?.join("; ") || "" },
  ];
  const gaps = selectedRecords.map(idea => ({
    title: idea.title,
    fields: comparisonRows.filter(row => !row.value(idea).trim()).map(row => row.label),
  })).filter(item => item.fields.length > 0);
  const missingFieldCount = gaps.reduce((sum, item) => sum + item.fields.length, 0);
  const choiceLines = lenses.map(lens => {
    const chosen = selectedRecords.find(idea => idea.slug === choices[lens.title]);
    const note = notes[lens.title]?.trim();
    return `- ${lens.title}: ${chosen ? chosen.title : "unclear / more evidence needed"}.${note ? " Founder note: " + note : ""}`;
  }).join("\n");
  const comparisonNotes = choiceLines + (nextStep.trim() ? "\nFounder-defined next step / review date: " + nextStep.trim() : "");
  const prompt = buildFounderPrompt("compare", selectedRecords, context) +
    "\n\nFOUNDER'S COMPARISON OBSERVATIONS:\n" + comparisonNotes +
    (gaps.length ? "\n\nSOURCE GAPS TO RESEARCH:\n" + gaps.map(item => "- " + item.title + ": " + item.fields.join(", ")).join("\n") : "");
  const prefillPrompt = buildProviderHandoffPrompt("compare", selectedRecords, context,
    comparisonNotes + (gaps.length ? "\nSource gaps to research: " + gaps.map(item => item.title + " — " + item.fields.join(", ")).join("; ") : ""));
  const updateChoice = (lens: string, slug: string) => setChoices(current => ({ ...current, [lens]: slug }));

  const updateNote = (lens: string, note: string) => setNotes(current => ({ ...current, [lens]: note }));
  const exportComparisonBrief = () => {
    const ideaSections = selectedRecords.map(idea => [
      "## " + idea.title,
      ...comparisonRows.map(row => "- " + row.label + ": " + (row.value(idea).trim() || "Needs research")),
    ].join("\n")).join("\n\n");
    const assessmentSections = lenses.map(lens => {
      const chosen = selectedRecords.find(idea => idea.slug === choices[lens.title]);
      return [
        "### " + lens.title,
        "Question: " + lens.prompt,
        "Evidence points to: " + (chosen?.title || "Unclear — need evidence"),
        "Founder note: " + (notes[lens.title] || "Not recorded"),
      ].join("\n");
    }).join("\n\n");
    const gapSection = gaps.map(item => "- " + item.title + ": " + item.fields.join(", ")).join("\n");
    const content = [
      "# Startup idea comparison brief",
      "",
      "## Selected ideas and published fields",
      ideaSections || "No idea details loaded.",
      "",
      "## Source gaps",
      gapSection || "No missing fields identified in the loaded records.",
      "",
      "## Founder evidence assessment",
      assessmentSections,
      "",
      "## Next action and review date",
      nextStep || "Not recorded",
      "",
      "This brief records source fields and founder observations. It is not a success prediction or validation score.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "businessidea-startup-idea-comparison.md";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const clearAssessment = () => {
    if (!assessmentKey || assessmentKey !== shortlistKey) return;
    if (!window.confirm("Clear the notes and decisions for this comparison only? Your saved idea shortlist will stay unchanged.")) return;
    setChoices({});
    setNotes({});
    setNextStep("");
  };
  const recordsReady = recordState === "ready" && fullRecords.length === shortlist.length;

  return <>
    <JsonLd schema={[
      webPageSchema({ path: "/startup-idea-comparison", name: "Compare Two Startup Ideas in India", description: "Compare selected published business ideas using real source fields and the founder's evidence notes." }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Startup idea comparison", path: "/startup-idea-comparison" }]),
    ]} />
    <GlassShell showShortlistTray={false}><div className="ic-page">
      <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Startup idea comparison</span></nav>
      <V2PageHero className="ic-hero"><div><p className="gh-eyebrow">TWO TO FOUR IDEAS · ONE REAL LIFE</p><h1>Which idea deserves <em>your next Tuesday?</em></h1><p>Compare actual published details, then research what the source does not tell you. This page does not invent a winner or score.</p><a href="#compare-board" className="gh-button gh-button-primary">Compare my saved ideas <ArrowRight size={17}/></a></div><aside><strong>Your shortlist travels with you on this browser.</strong><p className="mt-2">Add published ideas from Browse or Blueprints. Your selection is stored locally.</p><p className="mt-3 font-semibold">{shortlist.length} of 4 ideas saved</p></aside></V2PageHero>

      <section id="compare-board" className="scroll-mt-28 py-8 lg:py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="text-sm font-bold uppercase tracking-wide text-blue-700">Your actual shortlist</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Compare the source records</h2><p className="mt-2 max-w-3xl text-slate-600">We reload full source details for these selected ideas. A missing value is marked as a research gap—not mistaken for a fact about the business.</p></div><div className="flex flex-wrap gap-2"><a href="/browse" className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Find another idea</a>{shortlist.length>0&&<button type="button" onClick={clearShortlist} className="min-h-10 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Clear shortlist</button>}</div></div>

          {shortlist.length<2 ? <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5"><h3 className="font-bold text-slate-950">Choose at least two ideas to compare</h3><p className="mt-2 text-sm leading-6 text-slate-700">You have {shortlist.length} selected. Use Add to compare on a published idea; your selection follows you in this browser.</p><div className="mt-4 flex flex-wrap gap-3"><a href="/browse" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Browse published ideas <ArrowRight size={16}/></a><a href="/blueprints" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800">Browse blueprints</a></div></div>
          : recordState === "loading" ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5" role="status"><p className="font-semibold text-slate-900">Loading the full published details for all {shortlist.length} selected ideas…</p><p className="mt-2 text-sm text-slate-600">The shortlist itself is unchanged while details load.</p></div>
          : recordState === "error" ? <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5" role="alert"><h3 className="font-bold text-slate-950">We could not load every selected idea</h3><p className="mt-2 text-sm text-slate-700">{recordError}</p><button type="button" onClick={()=>{setRecordState("idle");setFullRecords([]);}} className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-amber-400 bg-white px-4 py-2 text-sm font-semibold">Try loading again</button></div>
          : recordsReady && <>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">{selectedRecords.map(idea=><li key={idea.slug} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="min-w-0"><a href={`/idea/${idea.slug}`} className="font-semibold text-slate-950 hover:underline">{idea.title}</a><p className="mt-1 text-xs text-slate-500">{idea.categoryName || idea.categoryCode || "Published idea"}</p></div><button type="button" onClick={()=>removeShortlistIdea(idea.slug)} className="shrink-0 text-sm font-semibold text-slate-600 hover:text-slate-950">Remove</button></li>)}</ul>

            <div className="mt-5 hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead className="bg-slate-100"><tr><th scope="col" className="sticky left-0 w-44 bg-slate-100 p-4 font-bold text-slate-900">What to compare</th>{selectedRecords.map(idea=><th scope="col" key={idea.slug} className="min-w-52 p-4 font-bold text-slate-900">{idea.title}</th>)}</tr></thead>
                <tbody>{comparisonRows.map(row=><tr key={row.label} className="border-t border-slate-200 align-top"><th scope="row" className="sticky left-0 bg-slate-50 p-4 font-semibold text-slate-800">{row.label}</th>{selectedRecords.map(idea=>{const value=row.value(idea).trim();return <td key={idea.slug} className="p-4 leading-6 text-slate-700">{value||<span className="font-medium text-amber-800">Needs research</span>}</td>})}</tr>)}</tbody>
              </table>
            </div>
            <div className="mt-4 grid gap-3 md:hidden" aria-label="Mobile idea comparison">
              {selectedRecords.map(idea=><article key={idea.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="break-words text-base font-bold text-slate-950">{idea.title}</h3><dl className="mt-3 grid gap-3">{comparisonRows.map(row=>{const value=row.value(idea).trim();return <div key={row.label} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-3 border-t border-slate-100 pt-2"><dt className="text-xs font-semibold text-slate-500">{row.label}</dt><dd className="min-w-0 break-words text-sm leading-5 text-slate-800">{value||<span className="italic text-amber-800">Needs research</span>}</dd></div>})}</dl></article>)}
            </div>

            {missingFieldCount>0 && <aside className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6"><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Research gaps found</p><h3 className="mt-2 text-xl font-bold text-slate-950">Research missing details for all selected ideas</h3><p className="mt-2 max-w-3xl leading-6 text-slate-700">Instead of repeating missing-data messages in every row, here are the exact facts to investigate. One prompt carries all selected ideas and all listed gaps to your chosen AI tool.</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{gaps.map(item=><li key={item.title} className="rounded-xl border border-blue-100 bg-white p-3"><strong className="block text-sm text-slate-900">{item.title}</strong><span className="mt-1 block text-sm text-slate-600">{item.fields.join(" · ")}</span></li>)}</ul><div className="mt-5"><ProviderPromptActions title="Research missing details for all selected ideas" prompt={prompt} prefillPrompt={prefillPrompt}/></div></aside>}

            {missingFieldCount===0 && <div className="mt-6"><ProviderPromptActions title="Compare all selected ideas with an AI tool" prompt={prompt} prefillPrompt={prefillPrompt}/></div>}
            <p className="mt-3 text-sm text-slate-500">Published details are starting evidence, not proof of local demand. Verify important claims with dated sources and reachable buyers.</p>
          </>}
        </div>
      </section>

      {shortlist.length>=2 && <V2PageSection className="ic-assessment" aria-labelledby="ic-assessment-title"><div><p className="gh-eyebrow">YOUR EVIDENCE, NOT A SCORE</p><h2 id="ic-assessment-title">Which idea has stronger evidence for this question?</h2><p>Pick the record with stronger evidence, or leave it unclear. Add an observation or source you can check; these notes are included in the full prompt below.</p></div><div className="mt-5 grid gap-3 md:grid-cols-2">{lenses.map(lens=><article key={lens.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="text-lg font-bold">{lens.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{lens.prompt}</p><label className="mt-4 block text-sm font-semibold text-slate-800">Current evidence points to<select value={choices[lens.title]||""} onChange={event=>updateChoice(lens.title,event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal"><option value="">Unclear — need evidence</option>{selectedRecords.map(idea=><option key={idea.slug} value={idea.slug}>{idea.title}</option>)}</select></label><label className="mt-3 block text-sm font-semibold text-slate-800">Observation or source note<textarea rows={2} value={notes[lens.title]||""} onChange={event=>updateNote(lens.title,event.target.value)} placeholder="What happened, when, and where can you verify it?" className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 font-normal leading-6"/></label></article>)}</div><label className="mt-5 block text-sm font-semibold text-slate-800">Your next action and review date<textarea rows={2} value={nextStep} onChange={event=>setNextStep(event.target.value)} placeholder="Example: speak to two likely buyers before placing a stock order; review Friday." className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 font-normal leading-6"/></label><div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={exportComparisonBrief} disabled={!assessmentKey || assessmentKey!==shortlistKey} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50"><Download size={15}/> Download comparison</button>
          <button type="button" onClick={clearAssessment} disabled={!assessmentKey || assessmentKey!==shortlistKey} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50"><Trash2 size={15}/> Clear assessment</button>
          <span className="self-center text-xs text-slate-500">Notes save in this browser for this exact shortlist.</span>
        </div>
        <div className="mt-4"><ProviderPromptActions title="Continue this comparison with AI" prompt={prompt} prefillPrompt={prefillPrompt}/></div></V2PageSection>}

      <V2PageSection className="ic-cost" aria-labelledby="ic-cost-title"><div><p className="gh-eyebrow">THE RISK YOU FEEL AT HOME</p><h2 id="ic-cost-title">A rupee at risk is personal.</h2><p>A deposit, unsold stock or four nights a week can take room from a household. Compare the smallest useful version of each idea, then check the timing of bills rather than only total cost.</p></div><div className="ic-cost-actions"><Link to="/startup-costs-india"><strong>What must I spend first?</strong><span>Map one-time and monthly cash requirements.</span><ArrowUpRight size={17}/></Link><Link to="/startup-cash-flow-india"><strong>When does cash run out?</strong><span>Place bills beside the date customer payment arrives.</span><ArrowUpRight size={17}/></Link></div></V2PageSection>

      <SellerFaq title="Questions about your comparison" faq={[
        {q:"Does this page save selected ideas?",a:<><p>The shortlist is stored in this browser. It is not uploaded to BusinessIdea.io; browser data or device changes can remove it.</p></>},
        {q:"Does the table tell me which business will succeed?",a:<><p>No. It shows published source fields and flags missing details. Neither the table nor an AI answer proves demand in your market.</p></>},
        {q:"What happens when I continue to an AI tool?",a:<><p>The selected ideas and your comparison notes are included in a prepared prompt. The selected tool opens separately; review the prompt and confirm sending there. BusinessIdea.io does not run the AI inference or store the response.</p></>},
      ]} />
      <V2PageCta className="ic-final"><div><p className="gh-eyebrow">THE NEXT TUESDAY</p><h2>Choose a test you can finish.</h2><p>Take the idea whose next uncertainty you can resolve responsibly. If the shortlist is empty, begin with published records instead of guessing.</p></div><div><Link to="/startup-idea-validation" className="gh-button gh-button-primary">Plan a validation test <ArrowUpRight size={17}/></Link><Link to="/browse" className="gh-button gh-button-secondary">Find published ideas <ArrowUpRight size={17}/></Link></div></V2PageCta>
    </div></GlassShell>
  </>;
}