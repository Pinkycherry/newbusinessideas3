import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export type ContentLink = { label: string; href: string; note?: string };

export const contentWrap = "mx-auto max-w-6xl px-4 md:px-6";
export const contentSection = `${contentWrap} scroll-mt-28 py-12 lg:py-16`;
export const contentCard = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-violet-300";
export const contentButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700";
export const contentSecondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-violet-300";

export function SellerHero({ breadcrumbs, badge, title, intro, primary, secondary }: { breadcrumbs: ContentLink[]; badge: string; title: string; intro: string; primary: ContentLink; secondary?: ContentLink }) {
  return <div className={`${contentWrap} pt-28 md:pt-32`}><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap gap-2 text-sm text-slate-500">{breadcrumbs.map((item, i) => <span key={`${i}-${item.href}`} className="inline-flex gap-2">{i > 0 && <span aria-hidden="true">/</span>}<a href={item.href} className="hover:text-violet-700">{item.label}</a></span>)}</nav>
    <header className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6 md:p-9"><p className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-700">{badge}</p><h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">{title}</h1><p className="mt-4 max-w-3xl text-base text-slate-600 md:text-lg">{intro}</p><div className="mt-6 flex flex-wrap gap-3"><a href={primary.href} className={contentButton}>{primary.label}<ArrowRight size={16} /></a>{secondary && <a href={secondary.href} className={contentSecondary}>{secondary.label}</a>}</div></header>
  </div>;
}

export function SellerSection({ id, badge, title, children }: { id?: string | undefined; badge?: string | undefined; title: string; children: ReactNode }) {
  return <section id={id} className={contentSection}>{badge && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-700">{badge}</p>}<h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h2>{children}</section>;
}

export function SellerLinkGrid({ title, links, id }: { title: string; links: ContentLink[]; id?: string }) {
  if (!links.length) return null;
  return <SellerSection id={id} title={title}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{links.map((link) => <a key={link.href + link.label} href={link.href} className={contentCard}><h3 className="font-semibold text-slate-950">{link.label}</h3>{link.note && <p className="mt-2 text-sm text-slate-600">{link.note}</p>}<span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">Explore <ArrowRight size={15} /></span></a>)}</div></SellerSection>;
}

export function SellerChips({ links }: { links: ContentLink[] }) {
  if (!links.length) return null;
  return <SellerSection title="People also search for"><div className="flex flex-wrap gap-2">{links.map(link => <a key={link.href} href={link.href} className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100">{link.label}</a>)}</div></SellerSection>;
}
