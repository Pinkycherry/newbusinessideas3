import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BadgeIndianRupee, BookOpen, Briefcase, Clock, Compass, GraduationCap, Hammer, MapPin, Quote, Scale, ShieldCheck, Sparkles, TriangleAlert, UserRoundCheck, Users, Wrench } from 'lucide-react';
import { V2Frame } from './frame';
import { SellerFaq } from './faq';
import { ValidateButton } from '@/components/validate-button';
import { ShortlistToggle } from '@/components/founder-workspace/shortlist-toggle';
import { useFounderWorkspace, type WorkspaceIdea } from '@/lib/founder-workspace';
import { IDEA_PAGE as copy } from '@/config/idea-page';
import type { ContentLink } from './content-page';

export type IdeaArticleField = { id: string; title: string; text?: string; items?: string[] };
export type IdeaArticleData = {
  slug: string; title: string; hook: string; summary: string; verdict: string;
  breadcrumbs: ContentLink[]; fields: IdeaArticleField[]; fit: IdeaArticleField[];
  opportunities: string[]; risks: string[]; steps: string[]; tools: string[];
  faq: { q: string; a: string }[]; related: ContentLink[]; lists: ContentLink[];
  prompt?: string; categoryName?: string; published?: string | null;
};

/**
 * Idea page in the glass system (6 Nov 2026). Mobile first: one column under 1024px, a sticky
 * contents rail beside the article on desktop. Every link is a visible glass control.
 */

const wrap = 'mx-auto w-full max-w-6xl px-4 sm:px-6';
/** Database values such as "small_town" or "any" read as plain words. */
const pretty = (v: string) => {
  const t = v.replaceAll('_', ' ').trim();
  if (/^any$/i.test(t)) return 'Anyone';
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function Prose({ text, className = '' }: { text: string; className?: string }) {
  return <div className={'space-y-3 text-[15px] leading-7 text-slate-700 sm:text-base ' + className}>{text.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>;
}

const FIELD_ICON: Record<string, { I: typeof BookOpen; c: string }> = {
  'idea-description': { I: BookOpen, c: '' },
  'idea-customer': { I: UserRoundCheck, c: 'pink' },
  'idea-revenue': { I: BadgeIndianRupee, c: 'teal' },
  'idea-needs': { I: Wrench, c: 'amber' },
};

function Card({ id, icon, title, children, tone = '' }: { id: string; icon?: ReactNode; title: string; children: ReactNode; tone?: string }) {
  return (
    <section id={id} className={'g-tile scroll-mt-28 p-5 sm:p-7 ' + tone} data-stagger>
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-slate-900 sm:text-2xl">{icon}{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function GLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="g-link"><span>{children}</span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a>;
}

export function IdeaArticle({ data }: { data: IdeaArticleData }) {
  const browseList = data.lists[0]?.href ?? '/lists';
  const { shortlist } = useFounderWorkspace();
  const workspaceIdea: WorkspaceIdea = {
    slug: data.slug, title: data.title, hook: data.hook, summary: data.summary, description: data.summary, categoryName: data.categoryName,
    targetCustomer: data.fields.find(f => /buyer|customer|who pays/i.test(f.title))?.text,
    revenueModel: data.fields.find(f => /revenue|money|pricing/i.test(f.title))?.text,
    startupCost: data.fields.find(f => /cost|capital|investment/i.test(f.title))?.text,
    risks: data.risks.join('; ').slice(0, 1200),
    firstSteps: data.steps.slice(0, 8),
  };
  const fit = (id: string) => data.fit.find(f => f.id === id);
  const stats = [
    { id: 'idea-investment', I: BadgeIndianRupee, c: '' },
    { id: 'idea-time', I: Clock, c: 'blue' },
    { id: 'idea-skills', I: GraduationCap, c: 'violet' },
    { id: 'idea-work-mode', I: MapPin, c: 'teal' },
  ].map(s => ({ ...s, f: fit(s.id) })).filter(s => s.f?.text);
  const who = [fit('idea-gender-fit')?.text, ...(fit('idea-life-stage')?.items ?? [])].filter((x): x is string => Boolean(x)).map(pretty);
  const places = (fit('idea-places')?.items ?? []).map(pretty);
  const jump: string[][] = [
    ...data.fields.map(f => [f.id, f.title]),
    ['idea-assessment', 'How to assess it'],
    ['idea-risks', 'What can hurt'],
    ...(data.steps.length ? [['idea-first-steps', 'First steps']] : []),
    ['idea-fit', 'Who this fits'],
    ['idea-validate', 'Validate it'],
  ];

  return <V2Frame>
    {/* Hero */}
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f1efff_0%,#f7f6ff_55%,#ffffff_100%)] pt-24 pb-8 sm:pt-28">
      <div aria-hidden className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-[#cfc9ff]/45 blur-3xl" />
      <div className={wrap + ' relative'}>
        <nav aria-label="Breadcrumb" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 text-xs text-slate-500 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {data.breadcrumbs.map(l => <a key={l.href} href={l.href} className="shrink-0 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-[#4643ba]/10 hover:text-[#4643ba]">{l.label}</a>)}
        </nav>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#4643ba] px-3 py-1 text-[11px] font-semibold text-white">{copy.badge}</span>
          {data.categoryName && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#4643ba] ring-1 ring-[#4643ba]/15">{data.categoryName}</span>}
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">{data.title}</h1>
        {data.hook && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{data.hook}</p>}
        <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
          <a className="g-btn g-shine w-full sm:w-auto" href="#idea-validate">{copy.validate}<ArrowRight size={17} /></a>
          <a className="g-btn-light w-full sm:w-auto" href={browseList}>Browse related ideas</a>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:flex">
          <ShortlistToggle idea={workspaceIdea} className="[&>button]:w-full [&>button]:min-h-11" />
          <a href={shortlist.length >= 2 ? '/startup-idea-comparison' : '/browse'} className="g-btn-light !min-h-11 !px-3 w-full sm:w-auto">{shortlist.length >= 2 ? `Compare (${shortlist.length}/4)` : 'Find ideas to compare'}</a>
        </div>
        {stats.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ id, I, c, f }) => (
              <div key={id} className="g-tile flex items-center gap-3 p-3 sm:p-4">
                <span className={'g-icon !h-11 !w-11 shrink-0 ' + c}><I aria-hidden size={19} /></span>
                <div className="min-w-0"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#4643ba]">{f!.title}</dt><dd className="font-display text-sm font-semibold leading-tight text-slate-900 sm:text-base">{f!.text}</dd></div>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-[#4643ba]" /><a href="/about" className="font-semibold text-slate-700 hover:text-[#4643ba]">bbusiness.online</a>{data.published && <span>· Published {new Date(data.published).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}</p>
      </div>
    </div>

    <div className={wrap + ' grid gap-8 pb-16 lg:grid-cols-[15rem_1fr]'} data-reveal>
      {/* Contents: sticky rail on desktop, sliding chips on phones */}
      <nav aria-label="On this page" className="order-first -mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:sticky lg:top-28 lg:mx-0 lg:self-start lg:overflow-visible lg:px-0">
        <p className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4643ba] lg:block">On this page</p>
        <ul className="flex gap-2 lg:mt-3 lg:flex-col">
          {jump.map(([id = "", t]) => <li key={id} className="shrink-0"><a href={`#${id}`} className="g-chip whitespace-nowrap lg:w-full lg:whitespace-normal">{t}</a></li>)}
        </ul>
      </nav>

      <article className="grid min-w-0 gap-5 sm:gap-6">
        <section id="idea-summary" className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#4643ba] to-[#7b6ff0] p-5 text-white shadow-[0_30px_60px_-35px_rgba(70,67,186,0.9)] sm:p-7" data-stagger>
          <Quote aria-hidden size={30} className="text-white/50" />
          <h2 className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">{copy.summary}</h2>
          <Prose text={data.summary} className="mt-2 !text-white/95 sm:!text-lg" />
        </section>

        {data.verdict && (
          <Card id="idea-verdict" title={copy.verdict} icon={<span className="g-icon !h-11 !w-11 violet"><Scale size={19} /></span>} tone="ring-2 ring-[#7b6ff0]/25">
            <Prose text={data.verdict} />
          </Card>
        )}

        {data.fields.map(f => {
          const ic = FIELD_ICON[f.id] ?? { I: Sparkles, c: '' };
          return f.text ? <Card key={f.id} id={f.id} title={f.title} icon={<span className={'g-icon !h-11 !w-11 ' + ic.c}><ic.I size={19} /></span>}><Prose text={f.text} /></Card> : null;
        })}

        <Card id="idea-assessment" title={copy.score} icon={<span className="g-icon !h-11 !w-11 blue"><Compass size={19} /></span>}>
          <p className="text-sm text-slate-500">A screening signal for the business model in general, not a verdict on your version of it.</p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {[
              ['Capital efficiency', '#idea-needs', 'Check startup costs'],
              ['Speed to first revenue', '/first-customer-india', 'Find your first customer'],
              ['Execution difficulty', '/business-idea-risk-check', 'Check skills and risk'],
              ['Margin quality', '#idea-revenue', 'Examine the money model'],
              ['Time load', '/business-idea-time-fit', 'Check the work involved'],
            ].map(([label, href, action]) => <li key={label}><GLink href={href}><span className="block text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">{label}</span>{action}</GLink></li>)}
          </ul>
        </Card>

        <Card id="idea-risks" title={copy.risks} icon={<span className="g-icon !h-11 !w-11 amber"><TriangleAlert size={19} /></span>} tone="!bg-[linear-gradient(160deg,#fffaf2,#fff3e3)]">
          {data.risks.map((r, i) => <Prose key={i} text={r} />)}
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            <GLink href="/business-demand-test-india">Test the demand for your offer</GLink>
            <GLink href="/failed-startups/india">Read the startup failure research</GLink>
          </div>
        </Card>

        {data.steps.length > 0 && (
          <Card id="idea-first-steps" title={copy.steps} icon={<span className="g-icon !h-11 !w-11 teal"><Hammer size={19} /></span>}>
            <ol className="relative grid gap-4 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#7b6ff0] before:to-[#c3bbff]">
              {data.steps.map((step, i) => (
                <li key={i} className="relative flex gap-4">
                  <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#8079f4] to-[#4643ba] text-sm font-bold text-white shadow-[0_3px_0_#302d91]">{i + 1}</span>
                  <Prose text={step} className="pt-1" />
                </li>
              ))}
            </ol>
            <div className="mt-5"><GLink href="/business-idea-pivot-or-stop">Decide your stopping point in advance</GLink></div>
          </Card>
        )}

        {data.tools.length > 0 && <Card id="idea-tools" title={copy.tools}><ul className="flex flex-wrap gap-2">{data.tools.map(t => <li key={t} className="g-chip">{t}</li>)}</ul></Card>}

        <Card id="idea-fit" title={copy.fit} icon={<span className="g-icon !h-11 !w-11 pink"><Users size={19} /></span>}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">Who can do this</h3>
              <ul className="mt-2 flex flex-wrap gap-2">{(who.length ? who : ['Anyone']).map(w => <li key={w} className="g-chip !min-h-9"><Briefcase size={13} className="mr-1.5 text-[#7b6ff0]" />{w}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">Where it can work</h3>
              <ul className="mt-2 flex flex-wrap gap-2">{(places.length ? places : ['Anywhere']).map(p => <li key={p} className="g-chip !min-h-9"><MapPin size={13} className="mr-1.5 text-[#d6337f]" />{p}</li>)}</ul>
            </div>
          </div>
        </Card>

        <section id="idea-validate" className="scroll-mt-28" data-stagger>
          <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{copy.validate}</h2>
          <p className="mt-2 text-slate-600">Add your town, budget and time. The checks run in an AI tool you already use, so it costs you nothing.</p>
          <div className="mt-5"><ValidateButton slug={data.slug} /></div>
        </section>

        {data.prompt && <Card id="idea-research-prompt" title={copy.prompt}><Prose text={data.prompt} /></Card>}

        <div data-stagger><SellerFaq title={copy.faq} faq={data.faq} id="idea-faq" /></div>

        {(data.related.length || data.lists.length) > 0 && (
          <section id="idea-related" className="scroll-mt-28" data-stagger>
            <h2 className="font-display text-2xl font-semibold text-slate-900">{copy.similar}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {(data.related.length ? data.related : data.lists).map(l => (
                <li key={l.href}>
                  <a href={l.href} className="g-tile group flex h-full flex-col p-4" data-tilt>
                    <span className="font-display text-base font-semibold text-slate-900 group-hover:text-[#4643ba]">{l.label}</span>
                    {l.note && <span className="mt-1 line-clamp-2 text-sm text-slate-600">{l.note}</span>}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba]">Read this idea <ArrowRight size={15} /></span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="idea-resources" className="g-tile p-5 sm:p-7" data-stagger>
          <h2 className="font-display text-xl font-semibold text-slate-900">{copy.onward}</h2>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <GLink href="/browse"><ArrowLeft size={14} className="mr-1 inline" />All business ideas</GLink>
            <GLink href={browseList}>Deeper list for this category</GLink>
            <GLink href="/startup-idea-comparison">Compare business ideas</GLink>
            <GLink href="/startup-costs-india">Check startup costs</GLink>
            <GLink href="/startup-guides">Startup guides</GLink>
            <GLink href="/topics">Answers for India</GLink>
          </div>
        </section>
      </article>
    </div>
  </V2Frame>;
}
