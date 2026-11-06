import { ArrowUpRight } from "lucide-react";
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
  const linkPrompt = prefillPrompt || prompt;
  const visibleProviders = providers.filter(provider => !allowedProviders || allowedProviders.includes(provider.id));
  const linkLimit = 7200;
  return <section className={`py-2 ${className}`} aria-label="Choose an AI provider">
    <h3 className="text-xl font-bold text-slate-950">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">Opens in a new tab with your details filled in. bbusiness.online never sees or stores the answer.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {visibleProviders.map(provider => { let text = linkPrompt; while (text.length > 200 && (provider.base + encodeURIComponent(text)).length > linkLimit) text = text.slice(0, Math.floor(text.length * 0.9)); const href = provider.base + encodeURIComponent(text); const Icon = provider.Icon; return <a key={provider.id} href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-3 font-semibold text-slate-900 shadow-[0_3px_0_rgba(15,23,42,0.06),0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_4px_0_rgba(15,23,42,0.06),0_14px_24px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-[0_2px_0_rgba(15,23,42,0.08),0_6px_12px_rgba(15,23,42,0.08)]" aria-hidden="true">{Icon ? <Icon size={22}/> : <img src="https://grok.com/images/favicon.svg" width="24" height="24" alt="" loading="lazy" className="h-6 w-6 object-contain"/>}</span><span className="min-w-0 flex-1">{`Ask ${provider.label}`}</span><ArrowUpRight size={17} className="shrink-0 text-blue-700"/>
      </a>; })}
    </div>
    <pre hidden>{prompt}</pre>
  </section>;
}
