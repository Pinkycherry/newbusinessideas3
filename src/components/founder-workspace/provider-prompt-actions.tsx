import { useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { SiClaude, SiPerplexity } from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";

const providers = [
  { id: "chatgpt", label: "ChatGPT", base: "https://chatgpt.com/?q=", Icon: RiOpenaiFill },
  { id: "claude", label: "Claude", base: "https://claude.ai/new?q=", Icon: SiClaude },
  { id: "grok", label: "Grok", base: "https://grok.com/?q=", Icon: null },
  { id: "perplexity", label: "Perplexity", base: "https://www.perplexity.ai/search?q=", Icon: SiPerplexity },
] as const;

type ProviderId = (typeof providers)[number]["id"];

export function ProviderPromptActions({ prompt, prefillPrompt, title = "Continue with AI", className = "", allowedProviders }: { prompt: string; prefillPrompt?: string; title?: string; className?: string; allowedProviders?: readonly ProviderId[] }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const linkPrompt = prefillPrompt || prompt;
  const visibleProviders = providers.filter(provider => !allowedProviders || allowedProviders.includes(provider.id));
  const linkLimit = 7200;
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`} aria-label="Choose an AI provider">
    <h3 className="text-xl font-bold text-slate-950">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">Opens in a new tab with your details filled in. bbusiness.online never sees or stores the answer.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {visibleProviders.map(provider => { const href = provider.base + encodeURIComponent(linkPrompt); const canPrefill = href.length <= linkLimit; const Icon = provider.Icon; return <a key={provider.id} href={canPrefill ? href : provider.base.split("?")[0]} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-3 font-semibold text-slate-900 shadow-[0_3px_0_rgba(15,23,42,0.06),0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_4px_0_rgba(15,23,42,0.06),0_14px_24px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-[0_2px_0_rgba(15,23,42,0.08),0_6px_12px_rgba(15,23,42,0.08)]" aria-hidden="true">{Icon ? <Icon size={22}/> : <img src="https://grok.com/images/favicon.svg" width="24" height="24" alt="" loading="lazy" className="h-6 w-6 object-contain"/>}</span><span className="min-w-0 flex-1">{canPrefill ? `Ask ${provider.label}` : `Ask ${provider.label} (copy first)`}</span><ArrowUpRight size={17} className="shrink-0 text-blue-700"/>
      </a>; })}
    </div>
    <pre hidden>{prompt}</pre>
    {visibleProviders.some(provider => (provider.base + encodeURIComponent(linkPrompt)).length > linkLimit) && <p className="mt-3 text-sm text-amber-800">For this tool, tap Copy first, then paste in the new tab.</p>}
    {prefillPrompt && prefillPrompt !== prompt && <p className="mt-2 text-xs text-slate-500">The Copy button carries every detail.</p>}
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" onClick={()=>void copyPrompt()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-blue-500">{copyState==="copied"?<Check size={16}/>:<Copy size={16}/>} {copyState==="copied"?"Copied":"Copy"}</button>
      {copyState==="copied"&&<p role="status" className="text-sm text-green-700">Ready to paste wherever you need it.</p>}
      {copyState==="failed"&&<p role="status" className="text-sm text-amber-800">Copy was blocked by your browser. Please try again.</p>}
    </div>
  </section>;
}
