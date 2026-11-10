import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, BookOpen, ClipboardCheck, Compass, FileSearch, HeartHandshake, MessagesSquare, Newspaper, Users, Wallet, BookOpenCheck, Calculator, Check, Layers3, MapPin, Quote, Scale, Search, SearchCheck, ShieldCheck, Smartphone, Sparkles, TriangleAlert, UserRoundCheck } from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { getListsHub } from "@/lib/lists.functions";
import { getBlogPosts } from "@/lib/blog.functions";
import { READY_CALCULATORS } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { TOPIC_PAGES } from "@/data/topic-pages";
import { getHomeLive, type HomeIdea } from "@/lib/home-live.functions";
import { TEAM, contactEmail, ORGANISATION_NAME } from "@/lib/site-config";
import { CountUp, HeroStreams } from "@/components/home/scroll-story";
import { Film, type FilmPerson } from "@/components/home/film";
import { Carousel, OrbitRing, ProcessBento, Quad, SearchDemand, StoryRail, Tunnel, useTypedPlaceholder, type VizKind } from "@/components/home/cinema";

/**
 * Home page for bbusiness.online (6 Nov 2026). Free for every reader in India: no prices, no
 * sign-up. Compact sections in the light layout; the words come from the original bbusiness.online
 * home (founder's promise, who it is for, why it stays free) and every section links into the library.
 */
export const Route = createFileRoute("/")({
  loader: async () => {
    const [hub, blog, live] = await Promise.all([
      getListsHub().catch(() => ({ total: 0, categories: [] })),
      getBlogPosts({ data: { page: 1 } }).catch(() => ({ posts: [] as { slug: string; title: string; image: string | null; imageAlt: string | null }[] })),
      getHomeLive().catch(() => ({ recent: [] as HomeIdea[], weekCount: 0, street: [] as HomeIdea[] })),
    ]);
    return { hub, posts: blog.posts.slice(0, 8), live };
  },
  head: () => ({
    meta: [
      { title: "Free business ideas for India, researched not guessed | bbusiness.online" },
      {
        name: "description",
        content:
          "A free library of researched business ideas for India: who pays you, how the money works, what hurts in year one and a straight verdict. No sign-up, nothing to pay.",
      },
      { property: "og:title", content: "Free business ideas for India, researched not guessed | bbusiness.online" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const eyebrow = "eh-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[#4643ba]";
const h2 = "eh-h2 mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl";


const IMG = "/images/categories/";
const BUILT_FOR = [
  { t: "No money to invest", l: "“Save up first” is not advice when there is nothing to save.", to: "/category/side-hustle-business-ideas", img: "zero-investment-business-ideas-no-money-free-to-start-online-beginners.webp" },
  { t: "Working from home", l: "Start from the room you are already paying rent for.", to: "/category/work-from-home-business-ideas", img: "work-from-home-business-ideas-remote-online-jobs-home-based-self-employed.webp" },
  { t: "Little capital", l: "Small capital is a constraint. It is not a verdict.", to: "/category/home-based-business-ideas", img: "low-investment-business-ideas-small-capital-startup-low-budget-beginners.webp" },
  { t: "Keeping your job", l: "Keep the salary. Build the second thing quietly.", to: "/category/part-time-business-ideas", img: "side-hustle-business-ideas-part-time-income-evenings-weekends-beginners.webp" },
  { t: "Still studying", l: "Too young is something people say. It is not a rule.", to: "/category/student-business-ideas", img: "side-hustle-business-ideas-young-creators-income-streams.webp" },
  { t: "Women at home", l: "Work that fits around a day you do not get to control.", to: "/category/women-friendly-business-ideas", img: "business-ideas-for-women-india-home-based-startup-funding-entrepreneurs.webp" },
];

const THEM = [
  "You pay every month, whether you use it that month or not.",
  "A handful of checks, then it asks for more.",
  "What comes back is the same generic paragraph anyone else would get.",
  "You pay before you are allowed to see whether it was worth paying for.",
];
const US = [
  "Read every researched idea in the library without paying anything.",
  "Validate as many ideas as you like. We do not ration it.",
  "No sign-up, no card, no account. Just open a page and read.",
  "Change your mind, come back in a year, and it is all still here.",
];

const FAQ = [
  { q: "Are these real business ideas or just inspiration?", a: "Every entry is a researched blueprint, not a topic suggestion. It covers what the business does day to day, who the specific customer is, how money changes hands, the realistic obstacles, and whether it suits the person building it." },
  { q: "Is the whole library free?", a: "Yes. Every blueprint is free to read, start to finish. Validating an idea is free too: you use AI tools you already pay for, so it costs you nothing extra, ever. There is no sign-up." },
  { q: "Who is this library for?", a: "Someone starting from zero, often without capital, a team or even a laptop, and people who already earn but want to test a second-income idea without giving up what they have." },
  { q: "Can a blueprint guarantee that a business will work?", a: "No. A blueprint is research to help you ask better questions, not a promise of success. You still need to speak with customers, test whether they will pay, and check the facts in your own town." },
  { q: "What if the honest answer is not to build?", a: "Then the blueprint says so. A useful research library does not push every idea. It shows who an idea suits, who it does not, and when walking away is the better decision." },
  { q: "Can I suggest a business idea for the library?", a: "Yes. Send the niche or sector through the Contact page. Suggestions help us decide what to research next." },
];

function firstLine(v: unknown): string {
  let x: unknown = v;
  if (typeof x === "string") {
    try { x = JSON.parse(x); } catch { /* plain text */ }
  }
  if (Array.isArray(x)) x = x[0];
  return typeof x === "string" ? x : "";
}

function shortDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

const card = "rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#4643ba]/50 hover:shadow-[0_8px_24px_-12px_rgba(70,67,186,0.35)] motion-reduce:transform-none";
const sec = "py-10 sm:py-14";
// Round section menu (scroll story): labels are the page's own section names.
const ORBIT = [
  { label: "Why we started", href: "#why-we-started" },
  { label: "Our working process", href: "#how-we-research" },
  { label: "FAQ", href: "#faq" },
  { label: "Explore the library", href: "/browse" },
];
const more = "inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba] hover:underline";

const ICON_ROW = [
  { img: "/icons/home/home-who-pays-you.webp", I: UserRoundCheck, t: "Who pays you", d: "A named buyer in a real Indian town, not a vague market." },
  { img: "/icons/home/home-how-the-money-works.webp", I: BadgeIndianRupee, t: "How the money works", d: "How a rupee comes in, how often, and what it costs." },
  { img: "/icons/home/home-what-hurts-year-one.webp", I: TriangleAlert, t: "What hurts in year one", d: "The risks people find too late, written down first." },
  { img: "/icons/home/home-straight-verdict.webp", I: Scale, t: "A straight verdict", d: "Build it, or walk away. We say which." },
  { img: "/icons/home/home-validate-free.webp", I: SearchCheck, t: "Validate for free", d: "Test any idea with an AI tool you already use." },
  { img: "/icons/home/home-free-calculators.webp", I: Calculator, t: "Free calculators", d: "Break-even, margins and startup cost in minutes." },
];

const INSIDE = [
  { ic: "/icons/home/home-validate-free.webp", t: "Search by any word", d: "Tiffin, tuition, tailoring" },
  { ic: "/icons/ui/ui-category.webp", t: "Sorted by category", d: "Easy to browse and compare" },
  { ic: "/icons/ui/ui-compare.webp", t: "Same checks on every idea", d: "Buyer, money, risk, verdict" },
  { ic: "/icons/ui/ui-launch.webp", t: "Made for your phone", d: "Light pages, no app needed" },
];

const TYPED = ["tiffin service", "home tuition", "tailoring", "zero investment", "work from home", "side hustle"];
const STRIP = ["Home Kitchen Food", "Tuition and Coaching", "Tailoring and Boutique", "Beauty", "Reselling", "Street Food"];

/**
 * Home images. Every slot points at an image already on the site today; the founder will
 * supply light, on-brand replacements (prompts handed over 6 Nov 2026) and only this map changes.
 */
const C = "/images/categories/";
const HOME_IMG = {
  hero: C + "researched-business-ideas-library-startup-opportunity-blueprints-free.webp",
  story: C + "side-hustle-business-ideas-young-creators-income-streams.webp",
  pageBlueprints: C + "researched-business-ideas-library-startup-opportunity-blueprints-free.webp",
  pageCalculators: C + "fintech-finance-business-ideas-payments-lending-personal-finance-startup.webp",
  pageValidate: C + "productivity-workflow-business-ideas-saas-tools-automation-remote-teams.webp",
  pageTopics: C + "timeless-business-ideas-evergreen-small-business-profitable-long-term.webp",
  pageGuides: C + "tech-saas-business-ideas-software-startup-subscription-b2b-micro-saas.webp",
  pageBlog: C + "creator-media-business-ideas-content-creator-youtube-podcast-online-income.webp",
  pageLists: C + "passive-income-business-ideas-recurring-revenue-digital-products-online-earning.webp",
  pageFounders: C + "business-ideas-for-women-india-home-based-startup-funding-entrepreneurs.webp",
};

/** Eight categories shown as a glimpse; the rest live on /browse. Image per category. */
const GLIMPSE: [string, string][] = [
  ["Work From Home", "work-from-home-business-ideas-remote-online-jobs-home-based-self-employed.webp"],
  ["Side Hustle", "side-hustle-business-ideas-part-time-income-evenings-weekends-beginners.webp"],
  ["Women Friendly", "business-ideas-for-women-india-home-based-startup-funding-entrepreneurs.webp"],
  ["Village and Small Town", "village-business-ideas-rural-india-low-cost-local-youth-enterprise.webp"],
  ["Student", "side-hustle-business-ideas-young-creators-income-streams.webp"],
  ["Tuition and Coaching", "education-edtech-business-ideas-online-tutoring-courses-coaching-startup.webp"],
  ["Online", "ecommerce-retail-business-ideas-online-store-dropshipping-d2c-small-business.webp"],
  ["Local Service", "small-town-business-ideas-india-local-market-shop-service-youth.webp"],
];


/** Monthly searches across India: the founder's own paid keyword research, November 2026. Update monthly. */
const DEMAND = [
  { label: "new business ideas", n: 802911, to: "/browse" },
  { label: "zero investment business ideas", n: 651371, to: "/category/side-hustle-business-ideas" },
  { label: "low investment business ideas", n: 472897, to: "/category/home-based-business-ideas" },
  { label: "work from home ideas", n: 349721, to: "/category/work-from-home-business-ideas" },
  { label: "side hustles", n: 294305, to: "/category/side-hustle-business-ideas" },
  { label: "small business ideas", n: 142339, to: "/lists" },
];

const H = "/images/hero/";
const D = (label: string) => DEMAND.find((d) => d.label === label)?.n ?? 0;
/** Six fictional people, one per search. Sizes are the cut-out files' own. */
const SEEKERS: FilmPerson[] = [
  { src: H + "p-student.webp", w: 324, h: 912, at: [1, 2], group: 1, label: "side hustles", n: D("side hustles") },
  { src: H + "p-jobholder.webp", w: 349, h: 917, at: [1, 2], group: 1, label: "new business ideas", n: D("new business ideas") },
  { src: H + "p-wfh.webp", w: 285, h: 893, at: [1, 2], group: 1, label: "work from home ideas", n: D("work from home ideas") },
  { src: H + "p-cook.webp", w: 316, h: 906, at: [2], group: 2, label: "small business ideas", n: D("small business ideas") },
  { src: H + "p-village.webp", w: 425, h: 914, at: [2], group: 2, label: "low investment business ideas", n: D("low investment business ideas") },
  { src: H + "p-tailor.webp", w: 413, h: 904, at: [2], group: 2, label: "zero investment business ideas", n: D("zero investment business ideas") },
];
const WALKERS: FilmPerson[] = [
  { src: H + "p-student-after.webp", w: 333, h: 914, at: [3], group: 1 },
  { src: H + "p-cook-after.webp", w: 261, h: 887, at: [3], group: 1 },
  { src: H + "p-jobholder-after.webp", w: 354, h: 917, at: [3], group: 1 },
  { src: H + "p-tailor-after.webp", w: 351, h: 881, at: [3], group: 3 },
  { src: H + "p-village-after.webp", w: 434, h: 900, at: [3], group: 3 },
  { src: H + "p-wfh-after.webp", w: 284, h: 891, at: [3], group: 3 },
];

/** The story, in order. Every line is already published on /about and /founders. */
const STORY = [
  { ic: "/icons/ui/ui-startup-cost.webp", t: "Paid three platforms", d: "Our founder paid three validation platforms to check four business ideas." },
  { ic: "/icons/ui/ui-sources.webp", t: "Got templated answers", d: "The same generic shape every time. One had no refund policy, another offered half back." },
  { ic: "/icons/ui/ui-language.webp", t: "Asked our communities", d: "Two WhatsApp communities of side hustlers and job holders told the same story." },
  { ic: "/icons/ui/ui-about.webp", t: "Built it free instead", d: "Four engineers from Madurai built the honest library they needed back then." },
];

/** How a blueprint is made: the curved infographic. */
const PROCESS = [
  { t: "Start from a real buyer", d: "Who pays, in a real Indian town or city, not a trend." },
  { t: "Work out the money", d: "How the first rupee comes in, how often, and what it costs." },
  { t: "Write down what hurts", d: "The risks of year one come before the good parts." },
  { t: "Verdict and sign-off", d: "No invented numbers. A named person signs it off." },
];

/** Raised, pressable primary button. */
const btn3d = "g-btn";
const btnHero = "g-btn g-shine";
const btn3dLight = "g-btn-light";

/** The ecosystem hub: every kind of page around one centre, Odoo-style. */
const HUB = [
  { I: BookOpen, c: "", img: "/icons/home/home-blueprints.webp", t: "Blueprints", d: "4 honest answers per idea", to: "/browse" },
  { I: SearchCheck, c: "pink", img: "/icons/home/home-validate.webp", t: "Validate", d: "Check your own idea free", to: "/startup-idea-validation" },
  { I: Calculator, c: "blue", img: "/icons/home/home-calculators.webp", t: "Calculators", d: "Break-even to payback", to: "/calculator" },
  { I: Compass, c: "teal", img: "/icons/home/home-answers-for-india.webp", t: "Answers for India", d: "Funding, GST, bank loans", to: "/topics" },
  { I: ClipboardCheck, c: "amber", img: "/icons/home/home-startup-guides.webp", t: "Startup guides", d: "Read before you build", to: "/startup-guides" },
  { I: Layers3, c: "violet", img: "/icons/home/home-idea-lists.webp", t: "Idea lists", d: "Sets for one kind of reader", to: "/lists" },
  { I: Newspaper, c: "pink", img: "/icons/home/home-blog.webp", t: "Blog", d: "Long reads, real mistakes", to: "/blog" },
  { I: Users, c: "blue", img: "/icons/home/home-founders.webp", t: "Founders", d: "Who writes this, and why", to: "/founders" },
];

const GUIDE_PICKS = ["Business Idea Validation Framework", "Zero-Investment Business Models", "Startup Cash Flow Management", "Competitor Analysis Framework", "Minimum Viable Product Development", "Startup Equity Split Guide"];

/** Continuous slideshow: the row is drawn twice and slides forever; the copy is hidden from readers. */
function Marquee({ children, speed = 48, rev = false }: { children: ReactNode; speed?: number; rev?: boolean }) {
  return (
    <div className={"g-marquee mt-6 py-3" + (rev ? " rev" : "")} style={{ "--g-speed": `${speed}s` } as CSSProperties}>
      <div className="g-marquee-track">
        <ul className="flex gap-4 pl-4">{children}</ul>
        <ul className="flex gap-4 pl-4" aria-hidden="true" data-loop-copy>{children}</ul>
      </div>
    </div>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2c.6 4.8 2.2 7.4 10 10-7.8 2.6-9.4 5.2-10 10-.6-4.8-2.2-7.4-10-10 7.8-2.6 9.4-5.2 10-10Z" />
    </svg>
  );
}

function HomePage() {
  const { hub, posts, live } = Route.useLoaderData();
  // Hero preview (founder, 9 Nov 2026): real blueprints from the library take turns, a new one every
  // 6 seconds; it pauses while the reader points at it or the page is hidden.
  const heroPool = live.recent.filter((i) => i.target_customer || i.verdict).slice(0, 6);
  const [heroAt, setHeroAt] = useState(0);
  const [heroHold, setHeroHold] = useState(false);
  useEffect(() => {
    if (heroPool.length < 2 || heroHold) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => { if (!document.hidden) setHeroAt((i) => (i + 1) % heroPool.length); }, 6000);
    return () => window.clearInterval(t);
  }, [heroPool.length, heroHold]);
  const featured = heroPool[heroAt] ?? live.recent[0];
  const typed = useTypedPlaceholder(TYPED);
  const fresh = live.recent.slice(1, 9);
  const reads = live.street.length >= 12 ? live.street : fresh;
  const categories = hub.categories;
  const strip = STRIP.map((n) => categories.find((c) => c.name.startsWith(n))).filter((c): c is (typeof categories)[number] => Boolean(c));
  const sideCats = categories.slice(0, 7);
  // Category reel (founder, 10 Nov 2026): twenty main categories as text cards, no images.
  const topCats = [...categories].sort((x, y) => y.subs.reduce((a, s) => a + s.count, 0) - x.subs.reduce((a, s) => a + s.count, 0)).slice(0, 20);
  const glimpse = GLIMPSE.map(([n, img]) => ({ c: categories.find((c) => c.name.replace(/ Business Ideas$/, "") === n), img })).filter((g): g is { c: (typeof categories)[number]; img: string } => Boolean(g.c));
  const tools = READY_CALCULATORS.slice(0, 8);
  const topics = TOPIC_PAGES.slice(0, 6);
  const guides = GUIDE_PICKS.map((t) => STARTUP_GUIDES.find((g) => g.title.startsWith(t))).filter((g): g is (typeof STARTUP_GUIDES)[number] => Boolean(g));
  const total = hub.total > 0 ? hub.total.toLocaleString("en-IN") : "";

  const floats = [
    total ? { ic: "/icons/home/home-blueprints.webp", n: total, l: "Researched blueprints" } : null,
    categories.length ? { ic: "/icons/ui/ui-category.webp", n: String(categories.length), l: "Categories" } : null,
    { ic: "/icons/home/home-calculators.webp", n: String(READY_CALCULATORS.length), l: "Free calculators" },
  ].filter(Boolean) as { ic: string; n: string; l: string }[];

  return (
    <V2Frame active="/" ember orbit={ORBIT}>
      {/* Hero film: one camera move into a small Indian town; six people, six searches */}
      <Film id="top" alt="A peaceful small town street in India at sunset, seen from closer and closer" frames={[H + "town-1.webp", H + "town-2.webp", H + "town-3.webp", H + "town-4.webp"]} people={SEEKERS}
        note="Monthly searches across India, from our own keyword research, November 2026."
        slides={[
          <>
            <span className="fm-kick">Free for every reader in India</span>
            <h1 className="fm-h">Tired of paying just to check if <em>your idea will work?</em></h1>
            <p className="fm-p">We built a free home for real business ideas: side hustles, zero investment ideas, work from home ideas and low investment ideas. Every idea is researched, not guessed.</p>
            <span className="fm-cue">Scroll</span>
          </>,
          <>
            <span className="fm-kick">Every month, across India</span>
            <p className="fm-h is-sm">Lakhs of people search for <em>a way to start.</em></p>
          </>,
          <>
            <span className="fm-kick">Different lives</span>
            <p className="fm-h is-sm">The <em>same</em> search.</p>
          </>,
          <>
            <span className="fm-kick">You are not alone</span>
            <p className="fm-h is-sm">Read one honest blueprint. <em>Before you spend a rupee.</em></p>
            <form action="/search" method="get" className="fm-form">
              <input name="q" type="search" placeholder="Try tiffin, tuition, tailoring…" aria-label="Search business ideas" />
              <button type="submit">Search</button>
            </form>
            <div className="fm-row"><Link to="/browse" className={btnHero}>Explore the library <ArrowRight size={16} /></Link></div>
          </>,
        ]} />

      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f1efff_0%,#f7f6ff_45%,#ffffff_100%)]">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-10%] h-[520px] w-[520px] rounded-full bg-[#cfc9ff]/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-64 left-[-12%] h-[380px] w-[380px] rounded-full bg-[#e5e1ff]/70 blur-3xl" />

        {/* Hero: poster stage (ember theme draws the red stage, light beam and grain) */}
        <section className="eh-hero relative pt-24 pb-8 sm:pt-28 lg:pb-12">
          <div aria-hidden className="eh-stage" />
          <HeroStreams />
          <div className={wrap + " grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] [&>*]:min-w-0"}>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4643ba]/25 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4643ba]">
                <Sparkles aria-hidden size={13} /> Free for every reader in India
              </span>
              <h2 className="eh-title mt-4 font-display text-[2.3rem] font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.6rem]">
                <span className="eh-kicker" data-keep-colour="">Open any idea and see</span>{" "}
                <span className="eh-giant">a real blueprint.</span>
              </h2>
              <form action="/search" method="get" className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-1.5 shadow-[0_10px_30px_-15px_rgba(70,67,186,0.45)] ring-1 ring-[#4643ba]/15 focus-within:ring-2 focus-within:ring-[#4643ba]">
                <Search aria-hidden className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
                <input name="q" type="search" placeholder="Try tiffin, tuition, tailoring…" aria-label="Search business ideas" className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base outline-none" />
                <button type="submit" className="min-h-11 rounded-xl bg-[#4643ba] px-4 text-sm font-semibold text-white transition hover:bg-[#3a37a0]">Search</button>
              </form>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link to="/browse" className={btnHero}>
                  Explore the library <ArrowRight size={16} />
                </Link>
                <a href="#how-we-research" className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#4643ba] hover:underline">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[#4643ba]/30 bg-white"><ShieldCheck aria-hidden size={15} /></span>
                  How we research
                </a>
              </div>
              {/* Founder, 9 Nov 2026: on phones the names sit in neat rows above the line, never cut off */}
              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <ul className="eh-team grid w-full grid-cols-4 gap-x-2 gap-y-2 sm:flex sm:w-auto sm:shrink-0 sm:flex-wrap sm:gap-x-3" aria-label="The people who sign off every blueprint">
                  {TEAM.map((m) => (
                    <li key={m.name} title={m.name} className="flex items-center gap-1.5">
                      <img src={`/icons/letters/letter-${m.name[0]!.toLowerCase()}.webp`} alt="" width={32} height={33} className="eh-letter h-8 w-8 shrink-0 object-contain" />
                      <span className="text-xs font-semibold text-white">{m.name.split(" ")[0]}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm leading-snug text-slate-600">
                  Researched and signed off by {TEAM.length} named people.<br className="hidden sm:block" /> No sign-up. Nothing to pay.
                </p>
              </div>
            </div>

            {/* Product preview: a real blueprint, with live library numbers floating around it */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:pl-6">
              <div aria-hidden className="eh-hide absolute -inset-y-6 right-6 left-24 hidden overflow-hidden rounded-[2.25rem] lg:block">
                <img src={HOME_IMG.hero} alt="" width={1280} height={720} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f1efff] via-[#e9e6ff]/75 to-[#4643ba]/35" />
              </div>
              <Sparkle className="absolute -left-2 top-6 hidden h-7 w-7 text-[#4643ba] lg:block" />
              <Sparkle className="absolute -bottom-4 right-10 hidden h-6 w-6 text-[#7b6ff0] lg:block" />
              {featured && (
                <a key={featured.slug} onMouseEnter={() => setHeroHold(true)} onMouseLeave={() => setHeroHold(false)} onFocus={() => setHeroHold(true)} onBlur={() => setHeroHold(false)} href={`/idea/${featured.slug}`} className="eh-preview group relative block rounded-[1.75rem] bg-white p-2 shadow-[0_30px_60px_-30px_rgba(70,67,186,0.55)] ring-1 ring-[#4643ba]/10 transition duration-300 hover:-translate-y-1 motion-reduce:transform-none lg:mr-32">
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff8f8f]" /><span className="h-2.5 w-2.5 rounded-full bg-[#ffd36b]" /><span className="h-2.5 w-2.5 rounded-full bg-[#7ddc9a]" />
                    <span className="ml-2 truncate rounded-full bg-slate-100 px-3 py-0.5 text-[11px] text-slate-500">bbusiness.online/idea/{featured.slug}</span>
                  </div>
                  <div className="rounded-[1.35rem] bg-gradient-to-b from-[#f6f5ff] to-white p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#4643ba] px-2.5 py-1 text-[11px] font-semibold text-white">A real blueprint</span>
                      <span className="text-[11px] text-slate-500">Updated {shortDate(featured.updated_at)}</span>
                    </div>
                    <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-slate-900">{featured.title}</h2>
                    {featured.category_name && <p className="text-xs text-slate-500">{featured.category_name}</p>}
                    <dl className="mt-4 space-y-2.5">
                      {([
                        ["who-pays-you", "Who pays you", featured.target_customer],
                        ["how-the-money-works", "How the money works", featured.how_you_make_money],
                        ["what-hurts-year-one", "What hurts in year one", firstLine(featured.cons_json)],
                        ["straight-verdict", "The verdict", featured.verdict],
                      ] as const).map(([ic, k, v]) => v ? (
                        <div key={k} className="flex gap-3 rounded-xl bg-white p-2.5 ring-1 ring-slate-100">
                          <img src={`/icons/home/home-${ic}.webp`} alt="" width={36} height={38} loading="lazy" decoding="async" className="h-9 w-9 shrink-0 object-contain" />
                          <div className="min-w-0">
                            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">{k}</dt>
                            <dd className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">{v}</dd>
                          </div>
                        </div>
                      ) : null)}
                    </dl>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba]">Read the full blueprint <ArrowRight size={16} className="transition group-hover:translate-x-0.5" /></span>
                    {heroPool.length > 1 && <span className="eh-dots mt-3 flex gap-1.5" aria-hidden>{heroPool.map((h, i) => <span key={h.slug} className={"h-1.5 rounded-full transition-all " + (i === heroAt ? "w-6 bg-[#e01b1f]" : "w-1.5 bg-white/30")} />)}</span>}
                  </div>
                </a>
              )}
              <ul className="mt-4 grid grid-cols-3 gap-2 lg:absolute lg:right-0 lg:top-12 lg:mt-0 lg:flex lg:w-36 lg:flex-col lg:gap-3">
                {floats.map(({ ic, n, l }) => (
                  <li key={l} className="rounded-2xl bg-white p-3 shadow-[0_16px_30px_-18px_rgba(70,67,186,0.6)] ring-1 ring-[#4643ba]/10 bbi-float-lg lg:p-4" style={{ animationDelay: `${floats.findIndex((f) => f.l === l) * 0.8}s` }}>
                    <img src={ic} alt="" width={40} height={42} loading="lazy" decoding="async" className="h-10 w-10 object-contain" />
                    <span className="mt-2 block font-display text-lg font-bold leading-none text-slate-900 lg:text-2xl"><CountUp value={n} /></span>
                    <span className="mt-1 block text-[11px] leading-tight text-slate-500 lg:text-xs">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What people start with: real categories, not borrowed logos */}
          {strip.length > 0 && (
            <div className={wrap + " mt-10"}>
              <div className="rounded-2xl bg-white/90 px-4 py-4 shadow-[0_10px_30px_-20px_rgba(70,67,186,0.5)] ring-1 ring-[#4643ba]/10 sm:px-6">
                <p className="text-center text-sm text-slate-500">What people across India start with, researched in the library</p>
                <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
                  {strip.map((c) => (
                    <li key={c.slug}>
                      <Link to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-slate-700 transition hover:text-[#4643ba]">
                        <MapPin aria-hidden size={14} className="text-[#7b6ff0]" />{c.name.replace(/ Business Ideas$/, "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* What every blueprint gives you */}
      <section data-reveal data-ember="line" className={sec}>
        <div className={wrap}>
          <h2 className="eh-h2 max-w-xl font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem] sm:leading-tight">Everything you need to decide, before you spend a rupee</h2>
          <ul className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-slate-200">
            {ICON_ROW.map(({ img, t, d }) => (
              <li key={t} data-stagger className="px-3 text-center">
                <img src={img} alt="" width={88} height={92} loading="lazy" decoding="async" className="ember-ico mx-auto h-[5.5rem] w-auto" />
                <h3 className="mt-3 font-display text-[15px] font-semibold leading-snug text-slate-900">{t}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Inside the library: a working mini browser of the real library */}
      <section data-reveal data-ember="inside" className={"bg-[linear-gradient(180deg,#f4f2ff,#faf9ff)] " + sec}>
        <div className={wrap + " grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] [&>*]:min-w-0"}>
          <div>
            <h2 className="eh-h2 font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Inside the library</h2>
            <p className="mt-1 text-slate-600">One library. Every idea checked the same way.</p>
            <ul className="mt-6 grid grid-cols-2 gap-4">
              {INSIDE.map(({ ic, t, d }) => (
                <li key={t} className="flex gap-3">
                  <img src={ic} alt="" width={48} height={50} loading="lazy" decoding="async" className="h-12 w-12 shrink-0 object-contain" />
                  <span><span className="block text-sm font-semibold text-slate-900">{t}</span><span className="block text-xs text-slate-500">{d}</span></span>
                </li>
              ))}
            </ul>
            <ol className="mt-7 space-y-3 border-t border-[#4643ba]/10 pt-6">
              {[
                ["Find an idea", "Search, or open a category that fits your money, time and town."],
                ["Read the four answers", "Who pays, how the money works, what hurts, and a straight verdict."],
                ["Check it for free", "Press Validate on any blueprint. We never charge for it."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <img src={`/icons/numbers/number-${i + 1}.webp`} alt="" width={32} height={33} loading="lazy" decoding="async" className="h-8 w-8 shrink-0 object-contain" />
                  <span className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{t}.</span> {d}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative">
            <Sparkle className="absolute -top-6 left-4 hidden h-7 w-7 text-[#4643ba] lg:block" />
            <div className="cn-lib rounded-3xl bg-white p-3 shadow-[0_30px_60px_-35px_rgba(70,67,186,0.6)] ring-1 ring-[#4643ba]/10 sm:p-4">
              <form action="/search" method="get" className="eh-search flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <Search aria-hidden size={16} className="text-slate-400" />
                <input ref={typed} name="q" type="search" placeholder="Search ideas, categories or keywords…" aria-label="Search the library" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </form>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[11rem_1fr]">
                <ul className="eh-cats hidden space-y-1 sm:block">
                  <li className="mb-2.5"><Link to="/browse" className="eh-cat-all block rounded-lg px-2.5 py-1.5 text-xs font-semibold">All categories</Link></li>
                  {sideCats.map((c) => (
                    <li key={c.slug}><Link to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="eh-cat block truncate rounded-lg px-2.5 py-1.5 text-xs text-slate-600">{c.name.replace(/ Business Ideas$/, "")}</Link></li>
                  ))}
                </ul>
                <ul className="cn-lib-rows space-y-2">
                  {fresh.slice(0, 4).map((i) => (
                    <li key={i.slug}>
                      <a href={`/idea/${i.slug}`} className="group flex items-center gap-3 rounded-xl p-2 ring-1 ring-slate-100 transition hover:bg-[#f6f5ff] hover:ring-[#4643ba]/20">
                        <img src={`/icons/letters/letter-${(i.title.match(/[A-Za-z]/)?.[0] ?? "b").toLowerCase()}.webp`} alt="" width={48} height={50} loading="lazy" decoding="async" className="h-12 w-12 shrink-0 object-contain" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900">{i.title}</span>
                          <span className="block truncate text-xs text-slate-500">{i.category_name?.replace(/ Business Ideas$/, "")} · Updated {shortDate(i.updated_at)}</span>
                        </span>
                        <span className="eh-read shrink-0 rounded-lg px-3 py-1 text-xs font-semibold">Read</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What India is searching for: the founder's own keyword research (monthly searches, all India) */}
      <section className={"relative " + sec} data-reveal id="india-searches">
        <div className={wrap}>
          <div className="mx-auto max-w-3xl text-center">
            <p className={eyebrow}>What India is searching for</p>
            <h2 className={h2}>Lakhs of people search for a business idea every month. You are not alone.</h2>
            <p className="mt-3 text-slate-600">Six searches people across India type when they want to start something of their own.</p>
          </div>
          <SearchDemand rows={DEMAND} note="Monthly searches across India, from our own keyword research, November 2026. We update these numbers every month." />
        </div>
      </section>

      {/* Start where you are */}
      <section data-reveal data-ember="built" className={sec}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={eyebrow}>Start where you are</p>
              <h2 className={h2}>For the person with an idea and nothing else.</h2>
            </div>
            <Link to="/browse" className={more}>See every category <ArrowRight size={16} /></Link>
          </div>
        </div>
        <Marquee speed={52}>
{BUILT_FOR.map((b) => (
              <li key={b.t} className="w-72 shrink-0 sm:w-80">
                <a href={b.to} className={card + " group block h-full overflow-hidden"}>
                  <img src={IMG + b.img} alt={b.t + " business ideas"} loading="lazy" width={640} height={360} className="aspect-video w-full object-cover" />
                  <span className="block p-4">
                    <span className="flex items-center justify-between font-display text-base font-semibold text-slate-900 group-hover:text-[#4643ba]">{b.t}<ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#4643ba]" /></span>
                    <span className="mt-0.5 block text-sm text-slate-600">{b.l}</span>
                  </span>
                </a>
              </li>
            ))}
        </Marquee>
        <div>
        </div>
      </section>

      {/* Why we started: the brand story as a timeline, plus a plain definition of the site */}
      <section className={sec} data-reveal data-ember="story" id="why-we-started">
        <div className={wrap}>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1fr] [&>*]:min-w-0">
            <div>
              <p className={eyebrow}>Why we started</p>
              <h2 className={h2}>We have been where you are.</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                We paid for those “validation” platforms too. We got a few generic lines back, spent our money, and got nothing real in return. When we asked for help, no one answered. That hurt. So we built the thing we needed back then: a free, honest library of small business ideas and side hustles, with real research, not empty hype.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Some of us have been jobless. Some of us have started over with no savings. BBI is for the person Googling “business ideas” from a phone, at 1am, hoping something makes sense for their actual life.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/about" className={btn3d}>Read the full story <ArrowRight size={16} /></Link>
                <Link to="/founders" className={btn3dLight}>Meet the founders</Link>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-35px_rgba(70,67,186,0.7)]">
                <img src={HOME_IMG.story} alt="Young Indians working on their first business idea" loading="lazy" width={1280} height={720} className="aspect-[16/10] w-full object-cover" />
              </div>
              <div className="relative -mt-16 ml-4 mr-4 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-[#4643ba]/10 sm:ml-10 sm:mr-0">
                <Quote aria-hidden size={26} className="text-[#7b6ff0]" />
                <p className="mt-1 font-display text-lg leading-snug text-slate-900">We tell you who will actually pay you, how the money works, and what will hurt in year one. Then we give it to you straight.</p>
                <div className="mt-3 flex items-center gap-3">
                  <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {TEAM.map((m) => (
                      <li key={m.name} className="flex items-center gap-1.5">
                        <img src={`/icons/letters/letter-${m.name[0]!.toLowerCase()}.webp`} alt="" width={28} height={29} className="eh-letter h-7 w-7 shrink-0 object-contain" />
                        <span className="text-xs font-semibold text-slate-900">{m.name.split(" ")[0]}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="text-xs text-slate-500">The founders' promise</span>
                </div>
              </div>
            </div>
          </div>

          <StoryRail steps={STORY} />

          <div className="mt-12 rounded-2xl border border-[#4643ba]/15 bg-[#f7f6ff] p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900">What is bbusiness.online?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
              bbusiness.online is {ORGANISATION_NAME}: a free library of researched business blueprints for India. It was built by four engineers who studied at Anna University Regional Campus, Madurai, after the founder paid three platforms to validate four business ideas and got templated answers back. Every blueprint answers the same four questions: who will pay you, how the money works, what will hurt in year one, and whether you should build it at all. There is no sign-up and nothing to pay. Readers can also check their own idea for free with an AI tool they already use, and work out the numbers with free calculators.
            </p>
          </div>
        </div>
      </section>

      {/* Why it stays free: the brand band */}
      <section data-reveal data-ember="band" className="pb-10 sm:pb-14">
        <div className={wrap}>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4643ba] via-[#5a50d6] to-[#8a7ff5] px-6 py-10 text-white sm:px-10 lg:py-12">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 [&>*]:min-w-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Why it stays free</p>
                <h2 className="eh-h2 mt-2 font-display text-2xl font-semibold leading-tight sm:text-[2rem]">Checking an idea should not cost the money you were going to start it with.</h2>
                <p className="mt-3 max-w-lg text-white/85">No sign-up, no card, no account. Read every blueprint, validate as many ideas as you like, and come back in a year: it is all still here.</p>
                <Link to="/browse" className={btn3dLight + " mt-6"}>Explore the library <ArrowRight size={16} /></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-white/80">What most validation tools ask</h3>
                  <ul className="mt-2 space-y-1.5">{THEM.map((x) => <li key={x} className="text-[13px] leading-relaxed text-white/85">✕ {x}</li>)}</ul>
                </div>
                <div className="rounded-2xl bg-white p-4 text-slate-700 shadow-xl sm:-rotate-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#4643ba]">What BBI does instead</h3>
                  <ul className="mt-2 space-y-1.5">{US.map((x) => <li key={x} className="flex gap-2 text-[13px] leading-relaxed"><Check aria-hidden size={15} className="mt-0.5 shrink-0 text-[#4643ba]" />{x}</li>)}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Validate road: the way through the library, gate by gate, ending at the open door */}
      <Film id="how-it-works" alt="A stone road leaving the town through four gateways to an open wooden door and green fields" frames={[H + "road-1.webp", H + "road-2.webp", H + "road-3.webp", H + "road-4.webp"]} people={WALKERS}
        slides={[
          <><span className="fm-no" aria-hidden>01</span><h2 className="fm-h is-sm">Find <em>an idea</em></h2><p className="fm-p">Search, or open a category that fits your money, time and town.</p></>,
          <><span className="fm-no" aria-hidden>02</span><p className="fm-h is-sm">Read the <em>four answers</em></p><p className="fm-p">Who pays, how the money works, what hurts, and a straight verdict.</p></>,
          <><span className="fm-no" aria-hidden>03</span><p className="fm-h is-sm">Check it <em>for free</em></p><p className="fm-p">Press Validate on any blueprint. We never charge for it.</p><div className="fm-row"><Link to="/startup-idea-validation" className={btn3dLight}>How validating works</Link></div></>,
          <><span className="fm-no" aria-hidden>04</span><p className="fm-h is-sm">Build it, <em>or walk away.</em></p><p className="fm-p">We say which. No sign-up, nothing to pay.</p><div className="fm-row"><Link to="/browse" className={btnHero}>Explore the library <ArrowRight size={16} /></Link></div></>,
        ]} />

      {/* The ecosystem: every kind of page around one hub */}
      <section className={"relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#efedff_0%,#faf9ff_55%,#ffffff_100%)] " + sec} data-reveal data-ember="hub">
        <div className={wrap}>
          <div className="text-center">
            <p className={eyebrow}>The bbusiness.online ecosystem</p>
            <h2 className={h2}>One free home. Eight ways to make up your mind.</h2>
          </div>
          <OrbitRing items={HUB} centre={
            <div>
              <p className="font-display text-lg font-bold tracking-tight sm:text-2xl"><span className="text-white">bbusiness</span><span className="text-[#e01b1f]">.online</span></p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">Free business research</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">for India</p>
            </div>
          } />
        </div>
      </section>

      {/* Category glimpse: eight image cards, the rest on /browse */}
      {topCats.length > 0 && (
        <section className={sec} data-reveal data-ember="glimpse">
          <Carousel label="Main categories" head={
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>The library</p>
                <h2 className={h2}>50+ main categories. Here are {topCats.length} to start with.</h2>
              </div>
              <Link to="/browse" className={more}>See all main categories <ArrowRight size={16} /></Link>
            </div>
          </div>
          }>
              {topCats.map((c, n) => {
                const name = c.name.replace(/ Business Ideas$/, "");
                return (
                  <li key={c.slug} className="ss-cat-li">
                    <Link to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="ss-cat">
                      <span aria-hidden className="ss-cat-no">{String(n + 1).padStart(2, "0")}</span>
                      <span className="ss-cat-name">{name.split(" ").map((w, wi) => <span key={wi} className="ss-cat-w" style={{ "--w": wi } as CSSProperties}><i>{w}</i></span>)}</span>
                      <span className="ss-cat-subs">{c.subs.slice(0, 2).map((x) => x.name.replace(/ Business Ideas$/, "")).join(" · ")}</span>
                      <span aria-hidden className="ss-cat-go"><ArrowRight size={18} /></span>
                    </Link>
                  </li>
                );
              })}
          </Carousel>
        </section>
      )}

      {/* Good first reads: ideas from the home and street categories, ending with the way into the lists */}
      {reads.length > 4 && (
        <section data-reveal data-ember="reads" className={sec}>
          <Carousel label="Ideas you can start from home or your own street" head={
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>Good first reads</p>
                <h2 className={h2}>Ideas you can start from home or your own street.</h2>
              </div>
              <Link to="/lists" className={more}>See the idea lists <ArrowRight size={16} /></Link>
            </div>
          </div>
          }>
              {reads.map((i) => (
                <li key={i.slug}>
                  <a href={`/idea/${i.slug}`} className="cn-idea">
                    <span className="cn-idea-cat">{i.category_name?.replace(/ Business Ideas$/, "")}</span>
                    <span className="cn-idea-t">{i.title}</span>
                    {i.summary && <span className="cn-idea-s">{i.summary}</span>}
                    <span className="cn-idea-go">Read the blueprint <ArrowRight size={16} /></span>
                  </a>
                </li>
              ))}
              <li>
                <div className="cn-idea cn-end">
                  <b>More ideas, sorted into lists</b>
                  <Link to="/lists" className={btnHero}>Open the idea lists <ArrowRight size={16} /></Link>
                </div>
              </li>
          </Carousel>
        </section>
      )}

      {/* How a blueprint is made: curved infographic, then the people accountable */}
      <section className={"bg-[linear-gradient(180deg,#f4f2ff,#ffffff)] " + sec} id="how-we-research" data-reveal data-ember="research">
        <div className={wrap}>
          <div className="text-center">
            <p className={eyebrow}>How we research every blueprint</p>
            <h2 className={h2}>Our working process</h2>
          </div>
          <ProcessBento steps={PROCESS.map((p, i) => ({ ...p, viz: (["pin", "bars", "list", "verdict"] as VizKind[])[i] ?? "pin", tag: ["The buyer", "The money", "The risks", "The verdict"][i] ?? "" }))} />
        </div>
      </section>

      {/* The people behind it: each name flies through the frame, no cards */}
      <section data-ember="team" id="team">
        <Tunnel head={
          <>
            <p className={eyebrow}>The people behind it</p>
            <h2 className={h2}>Built by hand, not by a headcount.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">Every figure traces to a real source. If we cannot verify a number, we say so instead of making one up.</p>
          </>
        }>
          {TEAM.map((m) => (
            <div key={m.name} className="cn-person">
              <img aria-hidden src={`/icons/letters/letter-${m.name[0]!.toLowerCase()}.webp`} alt="" width={84} height={87} loading="lazy" decoding="async" />
              <b><i>{m.name.split(" ")[0]}</i> {m.name.split(" ").slice(1).join(" ")}</b>
              <span>{m.role}</span>
              <small>{m.credential}</small>
            </div>
          ))}
          <div className="cn-person">
            <b><i>Questions</i> or corrections</b>
            <span><a href={`mailto:${contactEmail()}`} className="font-semibold text-white underline">{contactEmail()}</a></span>
          </div>
        </Tunnel>
      </section>

      {/* Tools and reading: glass infographic cards */}
      <section className={"relative " + sec} data-reveal data-ember="tools">
        <div className={wrap}>
          <div className="text-center">
            <p className={eyebrow}>Free tools and reading</p>
            <h2 className={h2}>Four steps from a hunch to a decision.</h2>
          </div>
        </div>
        <Quad items={[
          { n: "01", viz: "bars", t: "Make the numbers add up", links: tools.slice(0, 6).map((x) => ({ href: `/calculator/${x.slug}`, label: x.title })), more: ["/calculator", "All calculators"] },
          { n: "02", viz: "feed", t: "Answers for India", links: topics.slice(0, 5).map((x) => ({ href: `/${x.slug}`, label: x.seo.title.replace(/:.*$/, "").replace(/\?.*$/, "?") })), more: ["/topics", "All answers"] },
          { n: "03", viz: "list", t: "Read before you build", links: guides.slice(0, 5).map((g) => ({ href: `/startup-guides/${g.slug}`, label: g.title.replace(/:.*$/, "") })), more: ["/startup-guides", "All guides"] },
          { n: "04", viz: "scan", t: "Check your own idea", links: [
            { href: "/startup-idea-validation", label: "Validate your idea for free" },
            { href: "/how-to-validate-a-business-idea-in-india", label: "How validation works in India" },
            { href: "/how-to-talk-to-customers-before-starting-a-business-in-india", label: "Talk to customers before you start" },
            { href: "/how-to-check-if-your-business-idea-is-good-in-india", label: "Is my business idea good?" },
          ], more: ["/startup-idea-validation", "Start validating"] },
        ]} />
      </section>

      {/* Blog: heading and a 16:9 image only */}
      {posts.length > 0 && (
        <section data-reveal data-ember="blog" id="blog" className={sec}>
          <Carousel label="Articles from the blog" head={
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>From the blog</p>
                <h2 className={h2}>Long reads for the next decision.</h2>
              </div>
              <Link to="/blog" className={more}>All articles <ArrowRight size={16} /></Link>
            </div>
          </div>
          }>
            {posts.map((p) => (
              <li key={p.slug}>
                <a href={`/blog/${p.slug}`} className="cn-postcard">
                  {p.image && <img src={p.image} alt={p.imageAlt ?? ""} loading="lazy" width={640} height={360} />}
                  <b>{p.title}</b>
                  <span>Read the article <ArrowRight size={14} /></span>
                </a>
              </li>
            ))}
          </Carousel>
        </section>
      )}

      {/* FAQ and the closing call */}
      <section data-reveal data-ember="faq" id="faq" className={sec}>
        <div className={wrap}>
          <p className={eyebrow}>FAQ</p>
          <h2 className={h2}>Honest answers to fair questions.</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-200 bg-white p-4 open:border-[#4643ba]/40">
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
                  <span className="flex items-start justify-between gap-3">{f.q}<span aria-hidden className="text-[#4643ba] transition group-open:rotate-45">+</span></span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-1 items-center gap-6 rounded-[2rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(70,67,186,0.7)] ring-1 ring-[#4643ba]/15 sm:p-8 lg:grid-cols-[auto_1fr_auto]">
            <img src="/icons/home/home-blueprints.webp" alt="" width={96} height={100} loading="lazy" decoding="async" className="h-24 w-24 object-contain" />
            <div>
              <h2 className="eh-h2 font-display text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">Read one honest blueprint.<br />Before you spend a rupee.</h2>
              <p className="mt-2 text-slate-600">Follow the buyer, the money and the risks. If the honest answer is to walk away, you will hear it here first.</p>
            </div>
            <div className="text-center">
              <Link to="/browse" className={btnHero}>Explore the library <ArrowRight size={16} /></Link>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500"><ShieldCheck aria-hidden size={14} className="text-[#4643ba]" /> No sign-up · Nothing to pay</p>
            </div>
          </div>
        </div>
      </section>
    </V2Frame>
  );
}
