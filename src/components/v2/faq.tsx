import { useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, CircleHelp } from "lucide-react";

export type SellerFaqItem = { q: string; a: ReactNode; href?: string };

export function SellerFaq({ faq, title = "Frequently Asked Questions", id }: { faq: readonly SellerFaqItem[]; title?: string; id?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!faq.length) return null;
  return <section id={id} className="mx-auto max-w-6xl scroll-mt-28 px-4 py-12 md:px-6 lg:py-16">
    <div className="premium-card rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-950"><CircleHelp className="size-6 shrink-0 text-violet-600" />{title}</h2>
      {faq.map((item, index) => <div key={`${index}-${item.q}`} className="border-b border-slate-200 last:border-0">
        <h3><button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-slate-900 hover:text-violet-700">
          <span>{item.q}</span><ChevronDown aria-hidden="true" className={`size-4 shrink-0 transition-transform ${open === index ? "rotate-180" : ""}`} />
        </button></h3>
        <div hidden={open !== index} className="pb-5 pr-8 text-sm leading-relaxed text-slate-600">{item.a}{item.href && <> <a className="font-semibold text-violet-700 underline underline-offset-2" href={item.href}>Explore the source <ArrowRight className="inline size-3.5" /></a></>}</div>
      </div>)}
    </div>
  </section>;
}
