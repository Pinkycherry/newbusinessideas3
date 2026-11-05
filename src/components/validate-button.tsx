import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, ChevronDown, FileText, MapPin, Clock3, Coins, Languages, Image as ImageIcon } from "lucide-react";
import { ProviderPromptActions } from "@/components/founder-workspace/provider-prompt-actions";
import {
  getValidatePrompt,
  VALIDATE_OUTPUTS,
  type ValidateOutput,
} from "@/lib/validate.functions";
import { saveFounderContext, useFounderWorkspace } from "@/lib/founder-workspace";

const languages = [
  "English", "Hindi", "Telugu", "Tamil", "Marathi", "Bengali", "Kannada",
  "Malayalam", "Gujarati", "Punjabi", "Odia", "Urdu", "Other Indian language",
];
const fieldClass = "mt-2 block min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const outputIcons = {
  report: FileText,
  roadmap: Check,
  html: FileText,
  infographic: ImageIcon,
  image: ImageIcon,
};

type PreparedPrompt = { prompt: string; prefillPrompt: string };

export function ValidateButton({ slug }: { slug: string }) {
  const getPrompt = useServerFn(getValidatePrompt);
  const workspace = useFounderWorkspace();
  const [location, setLocation] = useState("");
  const [budgetINR, setBudgetINR] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [skills, setSkills] = useState("");
  const [buyer, setBuyer] = useState("");
  const [language, setLanguage] = useState("English");
  const [recentProblem, setRecentProblem] = useState("");
  const [currentWorkaround, setCurrentWorkaround] = useState("");
  const [proposedOffer, setProposedOffer] = useState("");
  const [context, setContext] = useState("");
  const [outputs, setOutputs] = useState<ValidateOutput[]>(["report"]);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState<PreparedPrompt | null>(null);

  useEffect(() => {
    if (dirty) return;
    setLocation(workspace.context.location);
    setBudgetINR(workspace.context.budgetINR);
    setHoursPerWeek(workspace.context.hoursPerWeek);
    setSkills(workspace.context.skills);
    setBuyer(workspace.context.buyer);
    setLanguage(workspace.context.language || "English");
    setRecentProblem(workspace.context.recentProblem);
    setCurrentWorkaround(workspace.context.currentWorkaround);
    setProposedOffer(workspace.context.proposedOffer);
    setContext(workspace.context.additionalContext);
  }, [workspace.context, dirty]);

  const currentContext = {
    location, budgetINR, hoursPerWeek, skills, buyer, language,
    recentProblem, currentWorkaround, proposedOffer, additionalContext: context,
  };
  const saveContext = () => saveFounderContext(currentContext);
  const resetPrepared = () => { setPrepared(null); setError(""); setDirty(true); };
  const toggleOutput = (output: ValidateOutput) => {
    setDirty(true);
    setPrepared(null);
    setError("");
    setOutputs(current => current.includes(output)
      ? (current.length > 1 ? current.filter(value => value !== output) : current)
      : [...current, output]);
  };
  const prepare = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setPrepared(null);
    saveContext();
    try {
      const result = await getPrompt({ data: { slug, location, budgetINR, hoursPerWeek, skills, buyer, language, recentProblem, currentWorkaround, proposedOffer, context, outputs } });
      setPrepared(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not prepare this validation. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const imageIntent = outputs.includes("image");

  return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 md:p-7">
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><FileText size={21}/></span>
      <div><h3 className="text-xl font-bold">Tailor the validation to your situation</h3><p className="mt-1 text-sm text-muted-foreground">These details go with the idea you picked. They stay only in this browser.</p></div>
    </div>
    <form onSubmit={prepare} className="mt-5 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Your town or market (include state if known)
          <span className="mt-1 block text-xs font-normal text-slate-500">Example: Warangal, Telangana</span>
          <span className="relative block"><MapPin className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16}/><input className={fieldClass + " pl-9"} maxLength={120} value={location} onChange={event => { setLocation(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="Town, city, district or state" /></span>
        </label>
        <label className="block text-sm font-semibold">Budget available (₹)
          <span className="mt-1 block text-xs font-normal text-slate-500">Use an amount or range.</span>
          <span className="relative block"><Coins className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16}/><input className={fieldClass + " pl-9"} maxLength={60} value={budgetINR} onChange={event => { setBudgetINR(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="₹50,000 or ₹40,000–₹60,000" /></span>
        </label>
        <label className="block text-sm font-semibold">Time you can give each week
          <span className="relative block"><Clock3 className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16}/><input className={fieldClass + " pl-9"} maxLength={40} value={hoursPerWeek} onChange={event => { setHoursPerWeek(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="Weekends, or 8–10 hours" /></span>
        </label>
        <label className="block text-sm font-semibold">Response language
          <span className="relative block"><Languages className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16}/><select className={fieldClass + " appearance-none pr-9"} value={language} onChange={event => { setLanguage(event.target.value); resetPrepared(); saveFounderContext({ language: event.target.value }); }}><option value="English">English</option>{languages.filter(item => item !== "English").map(item => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-400" size={16}/></span>
        </label>
        <label className="block text-sm font-semibold">Who might buy first?
          <input className={fieldClass} maxLength={300} value={buyer} onChange={event => { setBuyer(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="e.g. nearby tuition centres or PG owners" />
        </label>
        <label className="block text-sm font-semibold">What problem have they faced recently?
          <input className={fieldClass} maxLength={300} value={recentProblem} onChange={event => { setRecentProblem(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="A specific event, delay, cost or workaround" />
        </label>
        <label className="block text-sm font-semibold">What do they use today instead?
          <input className={fieldClass} maxLength={300} value={currentWorkaround} onChange={event => { setCurrentWorkaround(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="Existing shop, service, app or doing it themselves" />
        </label>
        <label className="block text-sm font-semibold">What small offer could you test?
          <input className={fieldClass} maxLength={300} value={proposedOffer} onChange={event => { setProposedOffer(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="One unit, trial service, booking or paid pilot" />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">Skills or experience you already have
          <input className={fieldClass} maxLength={300} value={skills} onChange={event => { setSkills(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="Trade, language, contacts, software, craft or sales experience" />
        </label>
      </div>

      <label className="block text-sm font-semibold">Anything else? (optional)
        <span className="mt-1 block text-xs font-normal text-slate-500">You can write naturally or separate details with commas. The AI will interpret clear constraints and ask if a key detail is ambiguous.</span>
        <textarea className={fieldClass + " min-h-28"} maxLength={1800} rows={4} value={context} onChange={event => { setContext(event.target.value); resetPrepared(); }} onBlur={saveContext} placeholder="Example: Telugu, part-time, start from home, avoid borrowing, and I can travel only within 5 km." />
      </label>

      <fieldset>
        <legend className="text-sm font-bold text-slate-900">What would you like the AI to produce?</legend>
        <p className="mt-1 text-xs text-slate-500">Choose one or more. Image creation is offered through ChatGPT and Grok only.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {VALIDATE_OUTPUTS.map(output => {
            const checked = outputs.includes(output.id);
            const Icon = outputIcons[output.id];
            return <label key={output.id} className={"flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition " + (checked ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300")}>
              <input type="checkbox" checked={checked} onChange={() => toggleOutput(output.id)} className="mt-1 h-4 w-4 accent-blue-700" />
              <span className="min-w-0 flex-1"><span className="flex items-center gap-2 font-semibold text-slate-900"><Icon size={16} className="text-blue-700"/>{output.label}</span><span className="mt-1 block text-xs font-normal leading-5 text-slate-600">{output.helper}</span></span>
              {checked && <Check size={15} className="shrink-0 text-blue-700" aria-hidden="true"/>}
            </label>;
          })}
        </div>
      </fieldset>

      {imageIntent && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">For an image request, only ChatGPT and Grok are offered below. The actual image feature can still depend on the chosen service's current session and plan.</p>}

      <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        {loading ? "Getting ready…" : "Validate this idea"}
        {!loading && <ArrowRight size={17}/>}
      </button>
      <p className="text-xs leading-5 text-slate-500">The AI tool you pick does the research in a new tab. BusinessIdea.io never sees or stores the answer.</p>
    </form>

    {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}
    {prepared && <div className="mt-5">
      <ProviderPromptActions title="Continue with AI" prompt={prepared.prompt} prefillPrompt={prepared.prefillPrompt} allowedProviders={imageIntent ? ["chatgpt", "grok"] : undefined}/>
    </div>}
  </div>;
}
