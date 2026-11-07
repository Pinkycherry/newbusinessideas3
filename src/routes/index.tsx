import { useEffect, type CSSProperties, type ReactNode } from "react";
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
import { IndiaMap3D } from "@/components/home/india-map-3d";

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
      getHomeLive().catch(() => ({ recent: [] as HomeIdea[], weekCount: 0 })),
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
  const featured = live.recent[0];
  const fresh = live.recent.slice(1, 9);
  const categories = hub.categories;
  const strip = STRIP.map((n) => categories.find((c) => c.name.startsWith(n))).filter((c): c is (typeof categories)[number] => Boolean(c));
  const sideCats = categories.slice(0, 7);
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
    <V2Frame active="/" ember>
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f1efff_0%,#f7f6ff_45%,#ffffff_100%)]">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-10%] h-[520px] w-[520px] rounded-full bg-[#cfc9ff]/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-64 left-[-12%] h-[380px] w-[380px] rounded-full bg-[#e5e1ff]/70 blur-3xl" />

        {/* Hero: poster stage (ember theme draws the red stage, light beam and grain) */}
        <section className="eh-hero relative pt-24 pb-8 sm:pt-28 lg:pb-12">
          <div aria-hidden className="eh-stage" />
          <div className={wrap + " grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] [&>*]:min-w-0"}>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4643ba]/25 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4643ba]">
                <Sparkles aria-hidden size={13} /> Free for every reader in India
              </span>
              <h1 className="eh-title mt-4 font-display text-[2.3rem] font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.6rem]">
                <span className="eh-kicker">Tired of paying just to check if</span>{" "}
                <span className="eh-giant">your idea will work?</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                We built a free home for real business ideas: side hustles, zero investment ideas, work from home ideas and low investment ideas. Every idea is researched, not guessed.
              </p>
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
              <div className="mt-6 flex items-center gap-3">
                <div className="flex shrink-0 -space-x-2">
                  {TEAM.map((m) => (
                    <img key={m.name} title={m.name} src={`/icons/letters/letter-${m.name[0]!.toLowerCase()}.webp`} alt={m.name} width={40} height={42} className="eh-letter h-10 w-10 shrink-0 object-contain" />
                  ))}
                </div>
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
                <a href={`/idea/${featured.slug}`} className="group relative block rounded-[1.75rem] bg-white p-2 shadow-[0_30px_60px_-30px_rgba(70,67,186,0.55)] ring-1 ring-[#4643ba]/10 transition duration-300 hover:-translate-y-1 motion-reduce:transform-none lg:mr-32">
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
                  </div>
                </a>
              )}
              <ul className="mt-4 grid grid-cols-3 gap-2 lg:absolute lg:right-0 lg:top-12 lg:mt-0 lg:flex lg:w-36 lg:flex-col lg:gap-3">
                {floats.map(({ ic, n, l }) => (
                  <li key={l} className="rounded-2xl bg-white p-3 shadow-[0_16px_30px_-18px_rgba(70,67,186,0.6)] ring-1 ring-[#4643ba]/10 bbi-float-lg lg:p-4" style={{ animationDelay: `${floats.findIndex((f) => f.l === l) * 0.8}s` }}>
                    <img src={ic} alt="" width={40} height={42} loading="lazy" decoding="async" className="h-10 w-10 object-contain" />
                    <span className="mt-2 block font-display text-lg font-bold leading-none text-slate-900 lg:text-2xl">{n}</span>
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
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#4643ba] text-xs font-bold text-white">{i + 1}</span>
                  <span className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{t}.</span> {d}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative">
            <Sparkle className="absolute -top-6 left-4 hidden h-7 w-7 text-[#4643ba] lg:block" />
            <div className="rounded-3xl bg-white p-3 shadow-[0_30px_60px_-35px_rgba(70,67,186,0.6)] ring-1 ring-[#4643ba]/10 sm:p-4">
              <form action="/search" method="get" className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <Search aria-hidden size={16} className="text-slate-400" />
                <input name="q" type="search" placeholder="Search ideas, categories or keywords…" aria-label="Search the library" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </form>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[11rem_1fr]">
                <ul className="hidden space-y-0.5 sm:block">
                  <li><Link to="/browse" className="block rounded-lg bg-[#4643ba]/10 px-2.5 py-1.5 text-xs font-semibold text-[#4643ba]">All categories</Link></li>
                  {sideCats.map((c) => (
                    <li key={c.slug}><Link to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="block truncate rounded-lg px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-[#4643ba]">{c.name.replace(/ Business Ideas$/, "")}</Link></li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {fresh.slice(0, 4).map((i) => (
                    <li key={i.slug}>
                      <a href={`/idea/${i.slug}`} className="group flex items-center gap-3 rounded-xl p-2 ring-1 ring-slate-100 transition hover:bg-[#f6f5ff] hover:ring-[#4643ba]/20">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#4643ba] to-[#7b6ff0] font-display text-sm font-bold text-white">
                          {i.title.split(" ").filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join("").slice(0, 2)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900">{i.title}</span>
                          <span className="block truncate text-xs text-slate-500">{i.category_name?.replace(/ Business Ideas$/, "")} · Updated {shortDate(i.updated_at)}</span>
                        </span>
                        <span className="shrink-0 rounded-lg border border-[#4643ba]/30 px-3 py-1 text-xs font-semibold text-[#4643ba] group-hover:bg-[#4643ba] group-hover:text-white">Read</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D India: where women are starting up, state by state */}
      <section className={"relative overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f3f1ff_40%,#faf9ff)] " + sec} data-reveal id="india-map">
        <div className={wrap}>
          <div className="mx-auto max-w-3xl text-center">
            <p className={eyebrow}>The anatomy of India's startups, 2026</p>
            <h2 className={h2}>1 lakh women are already building. Your state is on this map.</h2>
            <p className="mt-3 text-slate-600">Each state rises by the number of startups with at least one woman director or partner, as recognised by the Government of India. Hover or tap any state for its number, then zoom into its cities.</p>
          </div>
          <div className="mt-8"><IndiaMap3D ember /></div>
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
          <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {BUILT_FOR.map((b) => (
              <li key={b.t} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <a href={b.to} className={card + " group block h-full overflow-hidden"}>
                  <img src={IMG + b.img} alt={b.t + " business ideas"} loading="lazy" width={640} height={360} className="aspect-video w-full object-cover" />
                  <span className="block p-4">
                    <span className="flex items-center justify-between font-display text-base font-semibold text-slate-900 group-hover:text-[#4643ba]">{b.t}<ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#4643ba]" /></span>
                    <span className="mt-0.5 block text-sm text-slate-600">{b.l}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
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
                  <div className="flex shrink-0 -space-x-2">
                    {TEAM.map((m) => (
                      <img key={m.name} title={m.name} src={`/icons/letters/letter-${m.name[0]!.toLowerCase()}.webp`} alt={m.name} width={36} height={38} className="eh-letter h-9 w-9 shrink-0 object-contain" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">The founders' promise</span>
                </div>
              </div>
            </div>
          </div>

          <ol className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-gradient-to-r from-[#c3bbff] via-[#7b6ff0] to-[#c3bbff] lg:block" />
            {STORY.map(({ ic, t, d }) => (
              <li key={t} data-stagger className="relative text-center">
                <img src={ic} alt="" width={64} height={67} loading="lazy" decoding="async" className="eh-story-ico relative mx-auto h-16 w-16 object-contain" />
                <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{t}</h3>
                <p className="mx-auto mt-1 max-w-[16rem] text-sm leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ol>

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

      {/* The ecosystem: every kind of page around one hub */}
      <section className={"relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#efedff_0%,#faf9ff_55%,#ffffff_100%)] " + sec} data-reveal data-ember="hub">
        <div className={wrap}>
          <div className="text-center">
            <p className={eyebrow}>The bbusiness.online ecosystem</p>
            <h2 className={h2}>One free home. Eight ways to make up your mind.</h2>
          </div>
          <div className="relative mx-auto mt-10 max-w-5xl lg:h-[640px]">
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block">
              <defs>
                <linearGradient id="hubline" x1="0" x2="1"><stop offset="0" stopColor="#7b6ff0" /><stop offset=".5" stopColor="#ff7ab6" /><stop offset="1" stopColor="#5aa3ff" /></linearGradient>
              </defs>
              {HUB.map((_, i) => {
                const a = -Math.PI / 2 + (i * 2 * Math.PI) / HUB.length;
                return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(a)} y2={50 + 40 * Math.sin(a)} stroke="url(#hubline)" strokeWidth="0.35" strokeLinecap="round" className="g-flow" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }} />;
              })}
            </svg>
            <div className="relative mx-auto grid h-56 w-56 place-items-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2" data-stagger>
              <span aria-hidden className="absolute inset-[-34px] rounded-full border border-[#7b6ff0]/25 [transform:rotateX(70deg)]" />
              <span aria-hidden className="absolute inset-[-58px] rounded-full border border-[#ff7ab6]/20 [transform:rotateX(70deg)_rotateY(18deg)]" />
              <div className="g-hub grid h-full w-full place-items-center text-center">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight"><span className="text-slate-900">bbusiness</span><span className="bg-gradient-to-r from-[#4643ba] to-[#d6337f] bg-clip-text text-transparent">.online</span></p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Free business research</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">for India</p>
                </div>
              </div>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-0 lg:block">
              {HUB.map(({ img, t, d, to }, i) => {
                const a = -Math.PI / 2 + (i * 2 * Math.PI) / HUB.length;
                return (
                  <li key={t} data-stagger className="lg:absolute lg:w-48 lg:-translate-x-1/2 lg:-translate-y-1/2" style={{ left: `${50 + 40 * Math.cos(a)}%`, top: `${50 + 40 * Math.sin(a)}%` }}>
                    <a href={to} className="g-tile flex h-full flex-col items-center p-4 text-center" style={{ "--eb-angle": `${Math.round(90 + (a * 180) / Math.PI)}deg` } as CSSProperties}>
                      <img src={img} alt="" width={76} height={80} loading="lazy" decoding="async" className="ember-ico h-[4.75rem] w-auto" />
                      <span className="mt-3 font-display text-[15px] font-semibold text-slate-900">{t}</span>
                      <span className="mt-0.5 text-xs text-slate-500">{d}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Category glimpse: eight image cards, the rest on /browse */}
      {glimpse.length > 0 && (
        <section className={sec} data-reveal data-ember="glimpse">
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>The library</p>
                <h2 className={h2}>{categories.length} categories. Here are eight to start with.</h2>
              </div>
              <Link to="/browse" className={more}>See all {categories.length} categories <ArrowRight size={16} /></Link>
            </div>
          </div>
          <Marquee speed={55}>
              {glimpse.map(({ c, img }) => (
                <li key={c.slug} className="w-64 shrink-0 sm:w-72">
                  <Link to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="group relative block overflow-hidden rounded-2xl bg-white shadow-[0_16px_34px_-22px_rgba(70,67,186,0.7)] ring-1 ring-[#4643ba]/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_40px_-22px_rgba(70,67,186,0.75)] motion-reduce:transform-none">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={"/images/categories/" + img} alt={c.name} loading="lazy" width={640} height={480} className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#4643ba] backdrop-blur">{c.subs.reduce((n, x) => n + x.count, 0)} ideas</span>
                    </div>
                    <div className="relative px-4 pb-4 pt-7">
                      <img src="/icons/ui/ui-category.webp" alt="" width={52} height={54} loading="lazy" decoding="async" className="absolute -top-7 left-4 h-[3.25rem] w-[3.25rem] object-contain" />
                      <span className="block font-display text-base font-semibold text-slate-900 group-hover:text-[#4643ba]">{c.name.replace(/ Business Ideas$/, "")}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{c.subs.slice(0, 2).map((x) => x.name.replace(/ Business Ideas$/, "")).join(" · ")}</span>
                    </div>
                  </Link>
                </li>
              ))}
          </Marquee>
          <div>
          </div>
        </section>
      )}

      {/* Good first reads */}
      {fresh.length > 4 && (
        <section data-reveal data-ember="reads" className={"border-y border-slate-200 bg-slate-50 " + sec}>
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>Good first reads</p>
                <h2 className={h2}>Ideas you can start from home or your own street.</h2>
              </div>
              <Link to="/browse" className={more}>See every blueprint <ArrowRight size={16} /></Link>
            </div>
          </div>
          <Marquee speed={60} rev>
              {fresh.map((i) => (
                <li key={i.slug} className="w-64 shrink-0 sm:w-72">
                  <a href={`/idea/${i.slug}`} className={card + " flex h-full flex-col p-4"}>
                    <span className="text-xs font-medium text-[#4643ba]">{i.category_name?.replace(/ Business Ideas$/, "")}</span>
                    <span className="mt-1 font-display text-base font-semibold leading-snug text-slate-900">{i.title}</span>
                    {i.summary && <span className="mt-1.5 line-clamp-2 text-sm text-slate-600">{i.summary}</span>}
                    <span className="mt-auto pt-3 text-xs text-slate-400">Updated {shortDate(i.updated_at)}</span>
                  </a>
                </li>
              ))}
          </Marquee>
          <div>
          </div>
        </section>
      )}

      {/* How a blueprint is made: curved infographic, then the people accountable */}
      <section className={"bg-[linear-gradient(180deg,#f4f2ff,#ffffff)] " + sec} id="how-we-research" data-reveal data-ember="research">
        <div className={wrap}>
          <div className="text-center">
            <p className={eyebrow}>How we research every blueprint</p>
            <h2 className={h2}>Our working process</h2>
          </div>
          <div className="relative mt-10">
            <svg aria-hidden viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-x-0 top-6 hidden h-40 w-full lg:block">
              <path className="bbi-path" d="M60 150 C 200 150, 220 40, 375 40 S 560 160, 625 160 S 800 40, 940 40" fill="none" stroke="#b9b2ff" strokeWidth="2.5" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
            </svg>
            <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map(({ t, d }, i) => (
                <li key={t} data-stagger className={"flex flex-col items-center text-center " + (i % 2 === 0 ? "lg:pt-24" : "lg:pt-0")}>
                  <img src={["/icons/home/home-who-pays-you.webp", "/icons/home/home-how-the-money-works.webp", "/icons/home/home-what-hurts-year-one.webp", "/icons/home/home-validate.webp"][i]} alt="" width={72} height={75} loading="lazy" decoding="async" className="h-[4.5rem] w-[4.5rem] object-contain" />
                  <span className="mt-3 grid h-7 w-7 place-items-center rounded-full bg-[#4643ba] text-xs font-bold text-white">{i + 1}</span>
                  <h3 className="mt-2 font-display text-base font-semibold text-slate-900">{t}</h3>
                  <p className="mt-1 max-w-[15rem] text-sm leading-relaxed text-slate-600">{d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] [&>*]:min-w-0">
            <div>
              <p className={eyebrow}>The people behind it</p>
              <h2 className={h2}>Built by hand, not by a headcount.</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">Every figure traces to a real source. If we cannot verify a number, we say so instead of making one up.</p>
              <p className="mt-3 text-sm text-slate-600">
                Questions or corrections: <a href={`mailto:${contactEmail()}`} className="font-semibold text-[#4643ba] hover:underline">{contactEmail()}</a>
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {TEAM.map((m) => (
                <li key={m.name} data-stagger className="flex gap-3 rounded-2xl bg-white p-4 shadow-[0_12px_26px_-20px_rgba(70,67,186,0.7)] ring-1 ring-[#4643ba]/10 transition hover:-translate-y-0.5 motion-reduce:transform-none">
                  <img aria-hidden src={`/icons/letters/letter-${m.name[0]!.toLowerCase()}.webp`} alt="" width={56} height={58} loading="lazy" decoding="async" className="h-14 w-14 shrink-0 object-contain" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{m.name}</span>
                    <span className="block text-xs leading-relaxed text-slate-600">{m.role}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">{m.credential}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tools and reading: glass infographic cards */}
      <section className={"relative " + sec} data-reveal data-ember="tools">
        <div className={wrap}>
          <div className="text-center">
            <p className={eyebrow}>Free tools and reading</p>
            <h2 className={h2}>Four steps from a hunch to a decision.</h2>
          </div>
          <div className="relative mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {[
              { n: "01", t: "Make the numbers add up", links: tools.slice(0, 6).map((x) => ({ href: `/calculator/${x.slug}`, label: x.title })), more: ["/calculator", "All calculators"] },
              { n: "02", t: "Answers for India", links: topics.slice(0, 5).map((x) => ({ href: `/${x.slug}`, label: x.seo.title.replace(/:.*$/, "").replace(/\?.*$/, "?") })), more: ["/topics", "All answers"] },
              { n: "03", t: "Read before you build", links: guides.slice(0, 5).map((g) => ({ href: `/startup-guides/${g.slug}`, label: g.title.replace(/:.*$/, "") })), more: ["/startup-guides", "All guides"] },
              { n: "04", t: "Check your own idea", links: [
                { href: "/startup-idea-validation", label: "Validate your idea for free" },
                { href: "/how-to-validate-a-business-idea-in-india", label: "How validation works in India" },
                { href: "/how-to-talk-to-customers-before-starting-a-business-in-india", label: "Talk to customers before you start" },
                { href: "/how-to-check-if-your-business-idea-is-good-in-india", label: "Is my business idea good?" },
              ], more: ["/startup-idea-validation", "Start validating"] },
            ].map((c) => (
              <div key={c.n} data-stagger className="g-step">
                <span className="g-step-tab">{c.n}</span>
                <div className="g-step-card p-5 pl-6 pt-8 sm:p-6 sm:pt-9">
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-slate-800">{c.t}</h3>
                  <ul className="mt-4 grid gap-2.5">
                    {c.links.map((l) => (
                      <li key={l.href}><a href={l.href} className="g-link"><span>{l.label}</span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a></li>
                    ))}
                  </ul>
                  <a href={c.more[0]} className="g-btn-light mt-5 !min-h-11">{c.more[1]} <ArrowRight size={16} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog: heading and a 16:9 image only */}
      {posts.length > 0 && (
        <section data-reveal data-ember="blog" className={"border-y border-slate-200 bg-slate-50 " + sec}>
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>From the blog</p>
                <h2 className={h2}>Long reads for the next decision.</h2>
              </div>
              <Link to="/blog" className={more}>All articles <ArrowRight size={16} /></Link>
            </div>
          </div>
          <Marquee speed={70}>
              {posts.map((p) => (
                <li key={p.slug} className="w-64 shrink-0 sm:w-80">
                  <a href={`/blog/${p.slug}`} className={card + " group block h-full overflow-hidden"}>
                    {p.image && <img src={p.image} alt={p.imageAlt ?? ""} loading="lazy" width={640} height={360} className="aspect-video w-full object-cover" />}
                    <h3 className="p-4 font-display text-sm font-semibold leading-snug text-slate-900 group-hover:text-[#4643ba]">{p.title}</h3>
                  </a>
                </li>
              ))}
          </Marquee>
          <div>
          </div>
        </section>
      )}

      {/* FAQ and the closing call */}
      <section data-reveal data-ember="faq" className={sec}>
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
