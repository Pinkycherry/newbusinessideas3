import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Calculator, ChartNoAxesCombined, ChevronDown, ClipboardCheck, Clock, Coins, Menu, NotebookPen, Rocket, Search, Wallet, X, type LucideIcon } from "lucide-react";

import { TAXONOMY } from "@/data/taxonomy";

import "./v2.css";
import { useFounderWorkspace, removeShortlistIdea, clearShortlist, MAX_SHORTLIST } from "@/lib/founder-workspace";

/**
 * Header and footer of the purchased page architecture, converted to React.
 * Purchased layout with approved BusinessIdea.io routes and taxonomy.
 * Also rendered to static markup for the purchased HTML pages.
 */

function A({ children, className, href }: { children: ReactNode; className?: string | undefined; href?: string | undefined }) {
  if (!href || href === "#") return null;
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function Banner({ tone = "", title, sub, href }: { tone?: string; title: string; sub: string; href?: string }) {
  return (
    <A className={`mm-banner ${tone}`} href={href}>
      <i className="ic" aria-hidden="true"><BookOpen size={22} /></i>
      <div>
        <b>{title}</b>
        <span>{sub}</span>
      </div>
    </A>
  );
}

function Links({ items, className = "mm-list" }: { items: (string | [string, string])[]; className?: string }) {
  return (
    <div className={className}>
      {items.filter((x) => typeof x !== "string" && Boolean(x[1]) && x[1] !== "#").map((x) => {
        const [t, href] = typeof x === "string" ? [x, undefined] : x;
        return (
          <A key={t} href={href}>
            {t}
          </A>
        );
      })}
    </div>
  );
}

function Hero({ tone = "", badge, badgeTone = "", icon, title, body, cta, href }: { tone?: string; badge: string; badgeTone?: string; icon: string; title: string; body: string[]; cta: string; href: string }) {
  return (
    <div className={`mm-hero ${tone}`}>
      <div className="mm-hero-top"><div className="ic" aria-hidden="true">{icon}</div>
      <span className={`mm-badge ${badgeTone}`}>{badge}</span></div>
      <h4>{title}</h4>
      {body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <A className="mm-btn" href={href}>
        {cta}
      </A>
    </div>
  );
}

/** Category n (1-100) from the approved taxonomy as [label, link]. */
function cat(n: number, label?: string): [string, string] {
  const c = TAXONOMY.find((x) => x.n === n);
  return [label ?? c?.short ?? "", c ? `/category/${c.slug}` : "/browse"];
}

/** Our broad idea categories for Learn > Startup ideas, from the approved taxonomy. */
const OUR_IDEAS: [string, string][] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => cat(n));

const TOOL_ICONS: Record<string, LucideIcon> = {
  "/calculator/startup-cost": Wallet, "/calculator/break-even": Calculator,
  "/calculator/roi": ChartNoAxesCombined, "/calculator/funding-needed": Coins,
  "/unit-economics-india": Calculator, "/startup-cash-flow-india": ChartNoAxesCombined,
  "/business-pricing-india": Coins, "/startup-launch-plan-india": Rocket,
  "/business-idea-research-india": Search, "/business-idea-time-fit": Clock,
  "/founder-decision-journal": NotebookPen,
};
function Tile({ label, href }: { label: string; href: string }) {
  const Icon = TOOL_ICONS[href] ?? ClipboardCheck;
  return (
    <A className="mm-tile" href={href}>
      <i aria-hidden="true"><Icon size={28} strokeWidth={1.6} /></i>
      {label}
    </A>
  );
}

function Pdf({ title, sub, href }: { title: string; sub: string; href: string }) {
  return (
    <A className="mm-pdf" href={href}>
      <div>
        {title}
        <em>{sub}</em>
      </div>
    </A>
  );
}

export function ValidatePanel() {
  return (
    <>
      <div>
        <Hero badge="FREE" icon="✓" title="Validation Workbench" body={["Write your buyer, their problem and a small first offer on one page.", "Then test it with real buyers before you spend."]} cta="Start free →" href="/product" />
        <div className="mm-label">Popular checks</div>
        <Links
          items={[
            ["How to validate an idea", "/startup-idea-validation"],
            ["Test demand", "/business-demand-test-india"],
            ["Business idea risk check", "/business-idea-risk-check"],
            ["Compare two ideas", "/startup-idea-comparison"],
            ["Find your first customer", "/first-customer-india"],
          ]}
        />
      </div>
      <div className="mm-cols" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <div>
          <div className="mm-label mm-dot" style={{ marginTop: 0 }}>Founder tools</div>
          <div className="mm-tiles">
            <Tile label="Startup Cost" href="/calculator/startup-cost" />
            <Tile label="Break-even" href="/calculator/break-even" />
            <Tile label="Return on Investment" href="/calculator/roi" />
            <Tile label="Funding Needed" href="/calculator/funding-needed" />
            <Tile label="Unit Economics" href="/unit-economics-india" />
            <Tile label="Cash Flow" href="/startup-cash-flow-india" />
            <Tile label="Pricing" href="/business-pricing-india" />
            <Tile label="Launch Plan" href="/startup-launch-plan-india" />
            <Tile label="Research Desk" href="/business-idea-research-india" />
            <Tile label="Time Fit" href="/business-idea-time-fit" />
            <Tile label="Decision Journal" href="/founder-decision-journal" />
            <A className="mm-tile" href="/calculator">
              <i className="mm-tile-more" aria-hidden="true"><ArrowRight size={28} /></i>VIEW ALL<br />calculators →
            </A>
          </div>
        </div>
        <div>
          <div className="mm-label mm-dot" style={{ marginTop: 0 }}>Founder guides</div>
          <Banner title="All startup guides" sub="Step-by-step guides for first-time founders" href="/startup-guides" />
          <div className="mm-pdfs">
            <Pdf title="Startup Costs in India" sub="What leaves your pocket first" href="/startup-costs-india" />
            <Pdf title="Business Models in India" sub="How an idea earns" href="/business-models-india" />
            <Pdf title="When to Pivot or Stop" sub="Reading the evidence" href="/business-idea-pivot-or-stop" />
            <Pdf title="Your First Customer" sub="Reach one real buyer" href="/first-customer-india" />
          </div>
          <div className="mm-cols" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
            <div>
              <div className="mm-label" style={{ margin: "0 0 4px" }}>By place</div>
              <Links items={[cat(1), cat(5), cat(9, "Small Town"), cat(10), cat(4)]} />
            </div>
            <div>
              <div className="mm-label" style={{ margin: "0 0 4px" }}>For you</div>
              <Links items={[cat(6, "Women"), cat(7, "Students"), cat(8, "Senior Citizens"), cat(14, "Parents"), cat(11, "Skilled People")]} />
            </div>
            <div>
              <div className="mm-label" style={{ margin: "0 0 4px" }}>By industry</div>
              <Links items={[cat(16), cat(27), cat(30), cat(37), cat(47)]} />
            </div>
          </div>
          <A className="mm-pill" href="/browse">See all categories →</A>
        </div>
      </div>
    </>
  );
}

export function LearnPanel() {
  return (
    <>
      <div>
        <Hero tone="orange" badge="IDEA LIBRARY" badgeTone="o" icon="💡" title="Business Ideas Database" body={["Researched business ideas for India, organised by category."]} cta="Browse →" href="/browse" />
        <div className="mm-label">Start here</div>
        <Links
          items={[
            ["Business ideas in India", "/business-ideas-india"],
            ["Side business ideas", "/side-business-ideas-india"],
            ["Local business ideas", "/local-business-ideas-india"],
            ["Online business ideas", "/online-business-ideas-india"],
            ["Service business ideas", "/service-business-ideas-india"],
            ["Product business ideas", "/product-business-ideas-india"],
          ]}
        />
      </div>
      <div className="mm-cols" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
        <div>
          <div className="mm-label mm-dot o" style={{ marginTop: 0 }}>Startup ideas</div>
          <Banner tone="o" title="All Idea Lists" sub="Every business idea list in one place" href="/all-business-ideas" />
          <Links items={OUR_IDEAS} />
        </div>
        <div>
          <div className="mm-label mm-dot r" style={{ marginTop: 0 }}>Money and risk</div>
          <Banner tone="r" title="Startup Costs" sub="What you spend before the first sale" href="/startup-costs-india" />
          <Links
            items={[
              ["Cash flow", "/startup-cash-flow-india"],
              ["Unit economics", "/unit-economics-india"],
              ["Pricing your offer", "/business-pricing-india"],
              ["Business models", "/business-models-india"],
              ["Risk check", "/business-idea-risk-check"],
              ["Pivot or stop", "/business-idea-pivot-or-stop"],
              ["Launch plan", "/startup-launch-plan-india"],
            ]}
          />
          <div className="mm-label">More categories</div>
          <Links className="mm-two mm-list" items={[cat(17), cat(19), cat(28), cat(38)]} />
          <A className="mm-pill" href="/browse">See all categories →</A>
        </div>
        <div>
          <div className="mm-label mm-dot b" style={{ marginTop: 0 }}>Knowledge</div>
          <Banner tone="b" title="Startup Guides" sub="Step-by-step guides for founders" href="/startup-guides" />
          <Links
            items={[
              ["Glossary", "/founder-glossary"],
              ["Startup terms", "/startup-terms-india"],
              ["Founder stories", "/founder-stories"],
              ["Journal", "/blog"],
              ["Reading room", "/business-idea-reading-room"],
              ["Learning resources", "/learning-resources"],
              ["Research desk", "/business-idea-research-india"],
              ["Our founders", "/founders"],
              ["About us", "/about"],
              ["Contact", "/contact"],
            ]}
          />
        </div>
      </div>
    </>
  );
}

export function ToolsPanel() {
  return (
    <>
      <div>
        <Hero badge="FREE" badgeTone="p" icon="✓" title="Founder Toolkit" body={["Pick a founder question and work it through with your own numbers."]} cta="Open the toolkit →" href="/business-idea-toolkit" />
        <div className="mm-label">Popular tools</div>
        <Links
          items={[
            ["Startup cost calculator", "/calculator/startup-cost"],
            ["Break-even calculator", "/calculator/break-even"],
            ["Validation workbench", "/product"],
          ]}
        />
      </div>
      <div className="mm-cols" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
        <div>
          <div className="mm-label mm-dot g" style={{ marginTop: 0 }}>Calculators</div>
          <Banner tone="g" title="All Calculators" sub="Free money calculators for founders" href="/calculator" />
          <Links
            className="mm-two mm-list"
            items={[
              ["Startup Cost", "/calculator/startup-cost"],
              ["Break-even", "/calculator/break-even"],
              ["ROI", "/calculator/roi"],
              ["Funding Needed", "/calculator/funding-needed"],
              ["Unit Economics", "/unit-economics-india"],
              ["Cash Flow", "/startup-cash-flow-india"],
            ]}
          />
        </div>
        <div>
          <div className="mm-label mm-dot pk" style={{ marginTop: 0 }}>Worksheets</div>
          <Banner tone="pk" title="Templates" sub="Plans, interviews and more" href="/templates" />
          <Links
            items={[
              ["Launch plan", "/startup-launch-plan-india"],
              ["Demand test", "/business-demand-test-india"],
              ["Compare two ideas", "/startup-idea-comparison"],
              ["Decision journal", "/founder-decision-journal"],
              ["Weekend stall profit check", "/weekend-market-stall-profit-check"],
              ["Coaching batch check", "/coaching-batch-business-idea-india"],
            ]}
          />
          <A className="mm-pill g" href="/learning-resources">All Resources →</A>
        </div>
        <div>
          <div className="mm-label mm-dot g" style={{ marginTop: 0 }}>Tools directory</div>
          <Banner tone="g" title="Useful Tools" sub="Free tools we recommend to founders" href="/useful-tools" />
          <Links
            className="mm-two mm-list"
            items={[
              ["Learning resources", "/learning-resources"],
              ["Reading room", "/business-idea-reading-room"],
              ["Search ideas", "/search"],
              ["Blueprints", "/blueprints"],
            ]}
          />
          <A className="mm-pill g" href="/useful-tools">See all tools →</A>
          <div className="mm-label mm-dot">Idea lists</div>
          <Banner title="All Idea Lists" sub="Every business idea list in one place" href="/all-business-ideas" />
          <Links className="mm-two mm-list" items={[cat(1), cat(2), cat(3), cat(4), cat(5), cat(10)]} />
        </div>
      </div>
    </>
  );
}

const MEGA = [
  { label: "Validate", Panel: ValidatePanel },
  { label: "Learn", Panel: LearnPanel },
  { label: "Free Tools", Panel: ToolsPanel },
];

function Logo({ footer = false }: { footer?: boolean }) {
  return <a className={footer ? "mm-brand mm-brand-footer" : "mm-brand"} href="/" aria-label="BusinessIdea.io home">
    Business<span>Idea</span>.io
  </a>;
}

/** Same markup is rendered by React and scripts/render-menu-panels.tsx.
 * Raw pages attach the matching disclosure events in bought/menus.html.
 * Keep every panel in the DOM so aria-controls always resolves. */
export function Header({ active: _active }: { active?: string | undefined }) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLElement>(null);
  const pinned = useRef(false);
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const show = (i: number) => { cancel(); setOpen(i); };
  const hideSoon = () => {
    cancel();
    timer.current = setTimeout(() => {
      // Keyboard focus must not disappear when the pointer leaves the menu.
      if (!pinned.current && !ref.current?.querySelector(".mm-panel:focus-within, .mm-disclosure:focus-within")) setOpen(null);
    }, 180);
  };
  useEffect(() => {
    const out = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        pinned.current = false; setOpen(null); setMobile(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const root = ref.current;
      const expanded = root?.querySelector<HTMLButtonElement>('.mm-desktop button[aria-expanded="true"]');
      if (expanded) expanded.focus();
      else if (root?.querySelector('.mm-mobile-toggle[aria-expanded="true"]')) root.querySelector<HTMLButtonElement>('.mm-mobile-toggle')?.focus();
      cancel(); pinned.current = false; setOpen(null); setMobile(false);
    };
    document.addEventListener("mousedown", out);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", out);
      document.removeEventListener("keydown", esc);
      cancel();
    };
  }, []);
  return (
    <header ref={ref} className="mm-header" data-header-version="2026-10-28">
      <nav className="mm-nav" aria-label="Main navigation">
        <Logo />
        <div className="mm-desktop">
          {MEGA.map((m, i) => <div key={m.label} className="mm-disclosure" onMouseEnter={() => show(i)} onMouseLeave={hideSoon}>
            <button id={`mm-trigger-${i}`} type="button" aria-expanded={open === i} aria-controls={`mm-panel-${i}`}
              onClick={() => { cancel(); pinned.current = true; setOpen(i); }}
              onKeyDown={(e) => { if(e.key === "ArrowDown") { e.preventDefault(); pinned.current = true; show(i); requestAnimationFrame(() => ref.current?.querySelector<HTMLAnchorElement>(`#mm-panel-${i} a`)?.focus()); } }}>
              {m.label}<ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>)}
          <a href="/pricing">Pricing</a>
          <a className="mm-search" href="/search" aria-label="Search"><Search size={19} aria-hidden="true" /></a>
        </div>
        <div className="mm-actions">
          <a className="mm-login" href="/sign-in">Login</a>
          <a className="mm-report" href="/product">Get Report</a>
          <a className="mm-mobile-search" href="/search" aria-label="Search"><Search size={20} aria-hidden="true" /></a>
          <button className="mm-mobile-toggle" type="button" aria-label={mobile ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobile} aria-controls="mm-mobile" onClick={() => {setMobile(!mobile);setOpen(null);}}>
            <Menu className="mm-open-icon" size={23} aria-hidden="true"/><X className="mm-close-icon" size={23} aria-hidden="true"/>
          </button>
        </div>
      </nav>
      {MEGA.map(({label, Panel}, i) => <div key={label} id={`mm-panel-${i}`} className={`mm-panel${open === i ? " open" : ""}`}
        aria-labelledby={`mm-trigger-${i}`} hidden={open !== i} onMouseEnter={cancel} onMouseLeave={hideSoon}
        onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node | null)) setOpen(null); }}>
        <Panel />
      </div>)}
      <nav id="mm-mobile" className="mm-mobile" aria-label="Mobile navigation" hidden={!mobile}>
        {MEGA.map(({label, Panel}) => <details key={label}>
          <summary>{label}<ChevronDown size={18} aria-hidden="true" /></summary>
          <div className="mm-mobile-content"><Panel /></div>
        </details>)}
        <a className="mm-mobile-link" href="/search">Search</a>
        <a className="mm-mobile-link" href="/pricing">Pricing</a>
        <a className="mm-mobile-link" href="/sign-in">Login</a>
      </nav>
    </header>
  );
}

type L = { label: string; href: string };

const LEGAL: L[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Site Map", href: "/sitemap" },
];

export function Footer() {
  return (
    <footer className="v2 v2-footer" role="contentinfo">
      <div className="v2-footer-inner">
        <div className="v2-footer-top">
          <div className="v2-footer-brand">
            <Logo footer />
            <p>A free library of researched business ideas for India: who pays you, how the money works and what hurts in year one.</p>
            <div className="v2-footer-actions">
              <a href="/browse">Browse ideas</a>
              <a href="/lists">Idea lists</a>
              <a href="/product">Validate an idea</a>
            </div>
          </div>
          <div className="v2-footer-cats">
            <h3>Business idea categories</h3>
            <ul>
              {TAXONOMY.map((c) => (
                <li key={c.slug}>
                  <a href={`/category/${c.slug}`}>{c.short}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="v2-footer-bottom">
          <p>© {new Date().getFullYear()} BusinessIdea.io</p>
          <nav aria-label="Footer">
            {LEGAL.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FounderShortlistTray({ shortlist }: { shortlist: ReturnType<typeof useFounderWorkspace>["shortlist"] }) {
  if (!shortlist.length) return null;
  return <aside
    aria-label="Your comparison shortlist"
    className="fixed inset-x-2 z-[70] mx-auto w-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_18px_55px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:inset-x-4"
    style={{ bottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
  >
    <div className="p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0"><h2 className="text-sm font-bold text-slate-950 sm:text-base">Your comparison</h2><p className="text-xs text-slate-600">{shortlist.length} of {MAX_SHORTLIST} ideas selected · saved on this browser</p></div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={clearShortlist} className="inline-flex min-h-9 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-500 sm:text-sm">Clear all</button>
          <a href={shortlist.length >= 2 ? "/startup-idea-comparison" : "/browse"} aria-disabled={shortlist.length < 2} className={"inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold sm:text-sm " + (shortlist.length >= 2 ? "bg-blue-700 text-white hover:bg-blue-800" : "border border-blue-200 bg-blue-50 text-blue-800")}>{shortlist.length >= 2 ? "Compare selected" : "Add one more"}</a>
        </div>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-4">
        {shortlist.map((idea,index) => <li key={idea.slug} className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[10px] font-bold text-blue-800 ring-1 ring-slate-200">{index + 1}</span>
          <a href={"/idea/" + idea.slug} title={idea.title} className="min-w-0 flex-1 break-words text-xs font-semibold leading-4 text-slate-800 hover:underline line-clamp-2">{idea.title}</a>
          <button type="button" onClick={() => removeShortlistIdea(idea.slug)} aria-label={"Remove " + idea.title + " from comparison"} className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-slate-950">×</button>
        </li>)}
      </ul>
    </div>
  </aside>;
}

export function V2Frame({ active, children, showShortlistTray = true }: { active?: string | undefined; children: ReactNode; showShortlistTray?: boolean }) {
  const { shortlist } = useFounderWorkspace();
  const trayVisible = showShortlistTray && shortlist.length > 0;
  return (
    <div className="v2 min-h-screen flex flex-col bg-background">
      <Header active={active} />
      <main className={"flex-grow " + (trayVisible ? "pb-56 sm:pb-40" : "")}>{children}</main>
      <Footer />
      {trayVisible && <FounderShortlistTray shortlist={shortlist} />}
    </div>
  );
}
