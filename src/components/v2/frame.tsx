import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";

import { TAXONOMY } from "@/data/taxonomy";
import { LIVE_CATEGORY_SLUGS } from "@/config/live-categories";

import "./v2.css";
import { useGlassMotion } from "@/components/home/use-glass-motion";
import { OrbitMenu, type OrbitLink } from "@/components/home/scroll-story";
import { useFounderWorkspace, removeShortlistIdea, clearShortlist, MAX_SHORTLIST } from "@/lib/founder-workspace";

/**
 * Header and footer of the purchased page architecture, converted to React.
 * Purchased layout with approved bbusiness.online routes and taxonomy.
 * Also rendered to static markup for the purchased HTML pages.
 */

/* ===== Mega menus (founder, 8 Nov 2026) =====
   Wide panels of plain text links in columns under short headings, like the "Pure CSS Mega Menu"
   reference. No icons (header space is strict). Short labels; the column heading carries the words.
   Every column ends with "See all". Every link was checked live (200) when this was written. */
type MCol = { h: string; links: [string, string][]; all?: [string, string]; box?: boolean };
type MMenu = { label: string; cols: MCol[]; foot?: [string, string][]; more?: [string, string][] };
const L = (slug: string) => `/lists/${slug}-business-ideas`;
const C = (slug: string) => `/category/${slug}-business-ideas`;

const MENUS: MMenu[] = [
  { label: "Ideas", cols: [
    { h: "By way of work", links: [["Work From Home", C("work-from-home")], ["Side Hustle", C("side-hustle")], ["Part Time", C("part-time")], ["Online", C("online")], ["Home Based", C("home-based")], ["Freelance", C("freelance")], ["Local Service", C("local-service")], ["Reselling", C("reselling")]], all: ["See all", "/browse"] },
    { h: "By who you are", links: [["Women", C("women-friendly")], ["Students", C("student")], ["Senior Citizens", C("senior-citizen")], ["Village and Small Town", C("village-and-small-town")], ["Parents and Childcare", C("childcare-and-parenting-support")], ["Skilled People", C("skill-based")]], all: ["See all", "/browse"] },
    { h: "Food business ideas", links: [["All Food", C("food")], ["Home Kitchen", C("home-kitchen-food")], ["Street Food", C("street-food")], ["Bakery", C("bakery-and-confectionery")], ["Cloud Kitchen", C("cloud-kitchen")], ["Catering", C("catering")], ["Packaged Snacks", C("packaged-snack")], ["Sweets and Mithai", C("sweet-shop-and-mithai")]], all: ["See all", "/browse"] },
    { h: "Beauty and fashion", links: [["Beauty", C("beauty")], ["Salon and Grooming", C("salon-and-grooming")], ["Bridal Beauty", C("bridal-and-wedding-beauty")], ["Fashion and Apparel", C("fashion-and-apparel")], ["Tailoring and Boutique", C("tailoring-and-boutique")], ["Jewellery", C("jewellery-and-accessories")], ["Footwear and Bags", C("footwear-and-bag")], ["Personal Care", C("personal-care-product")]], all: ["See all", "/browse"] },
    { h: "Skills and selling", links: [["Education", C("education")], ["Tuition and Coaching", C("tuition-and-coaching")], ["Exam Coaching", C("competitive-exam-coaching")], ["Digital Marketing", C("digital-marketing")], ["E-commerce Selling", C("e-commerce-selling")], ["Content Sites", C("affiliate-and-content-site")], ["Handmade Products", C("handmade-product")], ["Printing and Signage", C("printing-and-signage")]], all: ["See all", "/browse"] },
    { h: "Start here", box: true, links: [["Browse all business ideas", "/browse"], ["Idea blueprints", "/blueprints"], ["Business idea topics", "/topics"], ["Every idea, A to Z", "/all-business-ideas"], ["Search ideas", "/search"]], all: ["See all categories", "/browse"] },
  ], foot: [["Daily dabba supply", L("daily-dabba-supply")], ["Home tuition batch", L("home-tuition-batch")], ["Ladies tailoring shop", L("ladies-tailoring-shop")], ["Cloud kitchen", C("cloud-kitchen")]], more: [["See all lists", "/lists"], ["See all guides", "/startup-guides"]] },
  { label: "Lists", cols: [
    { h: "Home food", links: [["Daily Dabba Supply", L("daily-dabba-supply")], ["Home Cooked Meal Plans", L("home-cooked-meal-subscription")], ["Homemade Pickle Brand", L("homemade-pickle-brand")], ["Celebration Cakes", L("custom-celebration-cake")], ["Office Lunch Contract", L("office-lunch-contract")]], all: ["See all", "/lists"] },
    { h: "Women and home", links: [["Women Led Home Food", L("women-led-home-food")], ["Women Led Stitching", L("women-led-stitching-work")], ["Home Beauty Studio", L("home-beauty-studio")], ["Homemaker Reselling", L("homemaker-reselling")], ["Home Daycare Group", L("home-daycare-group")]], all: ["See all", "/lists"] },
    { h: "Teaching", links: [["Home Tuition Batch", L("home-tuition-batch")], ["Board Exam Tuition", L("board-exam-tuition")], ["Spoken English Batch", L("spoken-english-batch")], ["Bank Exam Coaching", L("bank-exam-coaching")], ["Retired Teacher Class", L("retired-teacher-class")]], all: ["See all", "/lists"] },
    { h: "Online and digital", links: [["Own Brand Online Store", L("own-brand-online-store")], ["Online Course Selling", L("online-course-selling")], ["Freelance Websites", L("freelance-website-project")], ["Social Posting Service", L("social-posting-service")], ["Product Review Website", L("product-review-website")]], all: ["See all", "/lists"] },
    { h: "Local shops and services", links: [["Village Daily Needs Shop", L("village-daily-needs-shop")], ["Copy and Print Shop", L("copy-and-print-shop")], ["Neighbourhood Home Help", L("neighbourhood-home-help")], ["Men Hair Salon", L("men-hair-salon")], ["Tea Stall and Chai", L("tea-stall-and-chai-brand")]], all: ["See all", "/lists"] },
    { h: "Start here", box: true, links: [["All business idea lists", "/lists"], ["Every idea, A to Z", "/all-business-ideas"], ["Compare ideas", "/startup-idea-comparison"], ["Idea blueprints", "/blueprints"]], all: ["See all lists", "/lists"] },
  ] },
  { label: "Validate", cols: [
    { h: "Check your idea", links: [["Validation workbench", "/product"], ["How to validate an idea", "/startup-idea-validation"], ["Validate in India", "/how-to-validate-a-business-idea-in-india"], ["Risk check", "/business-idea-risk-check"], ["Pivot or stop", "/business-idea-pivot-or-stop"]], all: ["See all", "/startup-guides"] },
    { h: "Test with buyers", links: [["Test demand", "/business-demand-test-india"], ["Find your first customer", "/first-customer-india"], ["Research desk", "/business-idea-research-india"], ["Time fit check", "/business-idea-time-fit"]], all: ["See all", "/startup-guides"] },
    { h: "Compare and decide", links: [["Compare two ideas", "/startup-idea-comparison"], ["Business models", "/business-models-india"], ["Decision journal", "/founder-decision-journal"], ["Launch plan", "/startup-launch-plan-india"]], all: ["See all", "/startup-guides"] },
    { h: "Money check", links: [["Startup costs", "/startup-costs-india"], ["Price your first sale", "/business-pricing-india"], ["Unit economics", "/unit-economics-india"], ["Cash flow", "/startup-cash-flow-india"]], all: ["See all calculators", "/calculator"] },
    { h: "Start here", box: true, links: [["Validate an idea free", "/product"], ["Read a blueprint first", "/blueprints"], ["Researched case studies", "/researched-case-studies"], ["Failed startups in India", "/failed-startups/india"]], all: ["See all guides", "/startup-guides"] },
  ] },
  { label: "Tools", cols: [
    { h: "Calculators", links: [["Startup cost", "/calculator/startup-cost"], ["Break-even", "/calculator/break-even"], ["Return on investment", "/calculator/roi"], ["Funding needed", "/calculator/funding-needed"]], all: ["See all calculators", "/calculator"] },
    { h: "Money planners", links: [["Unit economics", "/unit-economics-india"], ["Cash flow", "/startup-cash-flow-india"], ["Pricing", "/business-pricing-india"], ["Launch plan", "/startup-launch-plan-india"]], all: ["See all", "/tools"] },
    { h: "Worksheets", links: [["Templates", "/templates"], ["Demand test", "/business-demand-test-india"], ["Compare two ideas", "/startup-idea-comparison"], ["Decision journal", "/founder-decision-journal"], ["Weekend stall profit check", "/weekend-market-stall-profit-check"], ["Coaching batch check", "/coaching-batch-business-idea-india"]], all: ["See all templates", "/templates"] },
    { h: "Directories", links: [["Founder toolkit", "/business-idea-toolkit"], ["Free tools", "/tools"], ["Learning resources", "/learning-resources"], ["Reading room", "/business-idea-reading-room"]], all: ["See all tools", "/tools"] },
    { h: "Start here", box: true, links: [["All calculators", "/calculator"], ["Founder toolkit", "/business-idea-toolkit"], ["Validation workbench", "/product"]], all: ["See all tools", "/tools"] },
  ] },
  { label: "Learn", cols: [
    { h: "Startup guides", links: [["All startup guides", "/startup-guides"], ["How to validate", "/how-to-validate-a-business-idea-in-india"], ["Startup costs", "/startup-costs-india"], ["Business models", "/business-models-india"], ["First customer", "/first-customer-india"]], all: ["See all guides", "/startup-guides"] },
    { h: "Real stories", links: [["Researched case studies", "/researched-case-studies"], ["Failed startups in India", "/failed-startups/india"], ["Founder stories", "/founder-stories"], ["Blog", "/blog"]], all: ["See all", "/blog"] },
    { h: "Idea guides by type", links: [["Business ideas in India", "/business-ideas-india"], ["Side business ideas", "/side-business-ideas-india"], ["Local business ideas", "/local-business-ideas-india"], ["Online business ideas", "/online-business-ideas-india"], ["Service business ideas", "/service-business-ideas-india"], ["Product business ideas", "/product-business-ideas-india"]], all: ["See all", "/topics"] },
    { h: "Words and reading", links: [["Founder glossary", "/founder-glossary"], ["Startup terms", "/startup-terms-india"], ["Reading room", "/business-idea-reading-room"], ["Learning resources", "/learning-resources"]], all: ["See all", "/learning-resources"] },
    { h: "About us", box: true, links: [["Our founders", "/founders"], ["About bbusiness.online", "/about"], ["Contact", "/contact"]], all: ["See all guides", "/startup-guides"] },
  ] },
];

function MegaPanel({ m }: { m: MMenu }) {
  return <>
    <div className="mm-mega" style={{ ["--cols" as string]: String(m.cols.length) }}>
      {m.cols.map((c) => <div key={c.h} className={"mm-col" + (c.box ? " mm-col-box" : "")}>
        <div className="mm-h">{c.h}</div>
        <ul>{c.links.map(([t, href]) => <li key={href + t}><a href={href}>{t}</a></li>)}</ul>
        {c.all && <a className="mm-all" href={c.all[1]}>{c.all[0]} ›</a>}
      </div>)}
    </div>
    {(m.foot || m.more) && <div className="mm-foot">
      {m.foot && <><span>Popular now:</span>{m.foot.map(([t, href]) => <a key={href} href={href}>{t}</a>)}</>}
      {m.more && <span className="mm-more">{m.more.map(([t, href]) => <a key={href} className="mm-all" href={href}>{t} ›</a>)}</span>}
    </div>}
  </>;
}

const MEGA = MENUS.map((m) => ({ label: m.label, Panel: () => <MegaPanel m={m} /> }));

function Logo({ footer = false }: { footer?: boolean }) {
  return <a className={footer ? "mm-brand mm-brand-footer" : "mm-brand"} href="/" aria-label="bbusiness.online home">
    bbusiness<span>.online</span>
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
  // Cinema header (founder, 10 Nov 2026): shown at the top of the page; it slides away once the reader
  // scrolls and the round menu button takes over. The thin red line is the reading progress.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = window.scrollY, raf = 0;
    const run = () => {
      raf = 0;
      const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--read", String(max > 0 ? Math.min(1, y / max) : 0));
      // Reference behaviour: the header belongs to the top of the page; after that the round button is the menu.
      if (y < 240) el.classList.remove("is-away");
      else if (y > last && !el.querySelector('[aria-expanded="true"]')) el.classList.add("is-away");
      last = y;
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(run); };
    window.addEventListener("scroll", ask, { passive: true });
    return () => { window.removeEventListener("scroll", ask); if (raf) cancelAnimationFrame(raf); };
  }, []);
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
          <a className="mm-search" href="/search" aria-label="Search"><Search size={19} aria-hidden="true" /></a>
        </div>
        <div className="mm-actions">
          <a className="mm-report mm-cta" href="/browse">Browse ideas</a>
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
        <div className="mm-quick">{[["Browse ideas","/browse"],["Idea lists","/lists"],["Validate an idea","/product"],["Free tools","/tools"]].map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
        {MEGA.map(({label, Panel}) => <details key={label}>
          <summary>{label}<ChevronDown size={18} aria-hidden="true" /></summary>
          <div className="mm-mobile-content"><Panel /></div>
        </details>)}
        <a className="mm-mobile-link" href="/search">Search</a>
      </nav>
    </header>
  );
}

type L = { label: string; href: string };

/* Footer redesign (7 Nov 2026, P2 n10): clear columns by task, then every live category, then legal. */
const FOOTER_COLS: { title: string; links: L[] }[] = [
  { title: "Find ideas", links: [
    { label: "Browse business ideas", href: "/browse" },
    { label: "Business idea lists", href: "/lists" },
    { label: "Idea blueprints", href: "/blueprints" },
    { label: "Business idea topics", href: "/topics" },
    { label: "Search ideas", href: "/search" },
  ] },
  { title: "Check an idea", links: [
    { label: "Validate an idea", href: "/product" },
    { label: "Compare ideas", href: "/startup-idea-comparison" },
    { label: "Startup cost calculators", href: "/calculator" },
    { label: "Free founder tools", href: "/tools" },
  ] },
  { title: "Learn", links: [
    { label: "How to validate an idea", href: "/how-to-validate-a-business-idea-in-india" },
    { label: "Researched case studies", href: "/researched-case-studies" },
    { label: "Failed startups in India", href: "/failed-startups/india" },
    { label: "Founder glossary", href: "/founder-glossary" },
  ] },
  { title: "Company", links: [
    { label: "About us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Site map", href: "/sitemap" },
  ] },
];

const LEGAL: L[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  return (
    <footer className="v2 v2-footer" role="contentinfo">
      {/* Back to top (founder, 8 Nov 2026): plain link, shows after the reader scrolls (CSS only). */}
      <a className="e-totop" href="#" aria-label="Back to top"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
      <div className="v2-footer-inner">
        <div className="v2-footer-top">
          <div className="v2-footer-brand">
            <Logo footer />
            <p>A free library of researched business ideas for India: who pays you, how the money works and what hurts in year one.</p>
            <div className="v2-footer-actions">
              <a href="/browse">Browse ideas</a>
              <a href="/product">Validate an idea</a>
            </div>
          </div>
          <div className="v2-footer-cols">
            {FOOTER_COLS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3>{col.title}</h3>
                <ul>{col.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="v2-footer-cats">
          <h3>Business idea categories</h3>
          {/* Founder, 8-9 Nov 2026 (model A, locked): every live main category in three moving rows,
              rows go opposite ways, quiet dark chips with a red edge. Only categories with published
              ideas, so no footer link is a 404. Each row is drawn twice for a seamless loop; the copy is
              hidden from screen readers and the keyboard. */}
          <div className="e-fcats">
            {[0, 1, 2].map((r) => {
              const row = TAXONOMY.filter((c) => LIVE_CATEGORY_SLUGS.has(c.slug)).filter((_, i) => i % 3 === r);
              return <div key={r} className={"e-mq" + (r === 1 ? " rev" : "")} style={{ ["--d" as string]: `${Math.max(40, row.length * 5)}s` }}>
                <ul className="e-mq-track">
                  {row.map((c) => <li key={c.slug}><a className="e-fchip" href={`/category/${c.slug}`}>{c.name}</a></li>)}
                  {row.map((c) => <li key={c.slug + "-copy"} aria-hidden="true"><a className="e-fchip" tabIndex={-1} href={`/category/${c.slug}`}>{c.name}</a></li>)}
                </ul>
              </div>;
            })}
          </div>
        </div>
        <div className="v2-footer-bottom">
          <p>© {new Date().getFullYear()} bbusiness.online</p>
          <nav aria-label="Legal">
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

// Round menu on every page (founder, 10 Nov 2026): the same main menu as the header, as on the reference
// site. The `orbit` prop is kept for callers but the menu is the same everywhere.
const ORBIT_DEFAULT: OrbitLink[] = [
  { label: "Ideas", href: "/browse" },
  { label: "Lists", href: "/lists" },
  { label: "Validate", href: "/product" },
  { label: "Tools", href: "/tools" },
  { label: "Learn", href: "/startup-guides" },
  { label: "FAQ", href: "/faq" },
  { label: "Search", href: "/search" },
];

export function V2Frame({ active, children, showShortlistTray = true, ember = true }: { active?: string | undefined; children: ReactNode; showShortlistTray?: boolean; ember?: boolean; orbit?: OrbitLink[] }) {
  useGlassMotion();
  const { shortlist } = useFounderWorkspace();
  const trayVisible = showShortlistTray && shortlist.length > 0;
  return (
    <div className={"v2 min-h-screen flex flex-col bg-background" + (ember ? " ember" : "")}>
      <Header active={active} />
      <main className={"flex-grow " + (trayVisible ? "pb-56 sm:pb-40" : "")}>{children}</main>
      <Footer />
      {trayVisible && <FounderShortlistTray shortlist={shortlist} />}
      <OrbitMenu links={ORBIT_DEFAULT} raised={trayVisible} />
    </div>
  );
}
