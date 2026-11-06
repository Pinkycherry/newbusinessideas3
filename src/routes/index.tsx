import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Search } from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { getListsHub } from "@/lib/lists.functions";
import { getBlogPosts } from "@/lib/blog.functions";
import { READY_CALCULATORS } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { TOPIC_PAGES } from "@/data/topic-pages";
import { getHomeLive, type HomeIdea } from "@/lib/home-live.functions";
import { TEAM, contactEmail } from "@/lib/site-config";

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
const eyebrow = "text-xs font-semibold uppercase tracking-[0.16em] text-[#4643ba]";
const h2 = "mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl";

const FOUR = [
  { t: "Who will actually pay you", d: "A named buyer, not a vague market. If nobody specific pays, the idea says so." },
  { t: "How the money really works", d: "How a rupee comes in, how often, and what it costs you to earn it." },
  { t: "What will hurt in year one", d: "The painful risks people find out too late, written down before you spend." },
  { t: "A straight verdict", d: "Build it, or walk away. Sometimes the honest answer is: do not build this one." },
];

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

function HomePage() {
  const { hub, posts, live } = Route.useLoaderData();
  const featured = live.recent[0];
  const fresh = live.recent.slice(1, 9);
  const categories = hub.categories;
  const topCats = categories.slice(0, 8);
  const tools = READY_CALCULATORS.slice(0, 12);
  const topics = TOPIC_PAGES.slice(0, 10);
  const guides = STARTUP_GUIDES.slice(0, 10);

  const stats = [
    hub.total > 0 ? [hub.total.toLocaleString("en-IN"), "researched blueprints"] : null,
    categories.length > 0 ? [String(categories.length), "categories"] : null,
    [String(TOPIC_PAGES.length), "answers for India"],
    [String(READY_CALCULATORS.length), "free calculators"],
  ].filter(Boolean) as string[][];

  return (
    <V2Frame active="/">
      {/* Hero: the problem, the promise, and a real blueprint as proof */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-[#f4f3ff] via-white to-white pt-24 pb-10 sm:pt-28 sm:pb-12">
        <div className={wrap + " grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 [&>*]:min-w-0"}>
          <div>
            <p className={eyebrow}>Free for every reader in India</p>
            <h1 className="mt-3 font-display text-[2.15rem] font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              Tired of paying just to check if <span className="text-[#4643ba]">your idea will work?</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              We built a free home for real business ideas: side hustles, zero investment ideas, work from home ideas and low investment ideas. Every idea is researched, not guessed.
            </p>
            <form action="/search" method="get" className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-[#4643ba]">
              <Search aria-hidden className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
              <input name="q" type="search" placeholder="Try tiffin, tuition, tailoring…" aria-label="Search business ideas" className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base outline-none" />
              <button type="submit" className="min-h-11 rounded-xl bg-[#4643ba] px-4 text-sm font-semibold text-white transition hover:bg-[#3a37a0]">Search</button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link to="/browse" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Browse the library <ArrowRight size={16} />
              </Link>
              <a href="/startup-idea-validation" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-[#4643ba] hover:text-[#4643ba]">
                Check your own idea
              </a>
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              {["No sign-up", "Nothing to pay", "Every blueprint signed off by a named person"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5"><Check aria-hidden size={16} className="text-[#4643ba]" />{t}</li>
              ))}
            </ul>
          </div>

          {featured && (
            <a href={`/idea/${featured.slug}`} className={card + " block p-5 sm:p-6"}>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#4643ba]/10 px-2.5 py-1 text-xs font-semibold text-[#4643ba]">A real blueprint from the library</span>
                <span className="text-xs text-slate-500">Updated {shortDate(featured.updated_at)}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-slate-900">{featured.title}</h2>
              {featured.category_name && <p className="text-xs text-slate-500">{featured.category_name}</p>}
              <dl className="mt-4 space-y-3">
                {[
                  ["Who pays you", featured.target_customer],
                  ["How the money works", featured.how_you_make_money],
                  ["What hurts in year one", firstLine(featured.cons_json)],
                  ["The verdict", featured.verdict],
                ].map(([k, v]) => v ? (
                  <div key={k as string} className="border-l-2 border-[#4643ba]/30 pl-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">{k}</dt>
                    <dd className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{v}</dd>
                  </div>
                ) : null)}
              </dl>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba]">Read the full blueprint <ArrowRight size={16} /></span>
            </a>
          )}
        </div>

        {/* Live numbers: all counted from the library, nothing typed by hand */}
        <div className={wrap + " mt-8"}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
            {stats.map(([n, l]) => (
              <div key={l} className="bg-white px-4 py-3">
                <dt className="font-display text-xl font-bold text-slate-900">{n}</dt>
                <dd className="text-xs text-slate-500">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Start where you are */}
      <section className={sec}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={eyebrow}>Start where you are</p>
              <h2 className={h2}>For the person with an idea and nothing else.</h2>
            </div>
            <div className="hidden flex-wrap gap-2 sm:flex">
              {topCats.slice(0, 4).map((c) => (
                <Link key={c.slug} to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-[#4643ba] hover:text-[#4643ba]">
                  {c.name.replace(/ Business Ideas$/, "")}
                </Link>
              ))}
            </div>
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

      {/* Fresh in the library */}
      {fresh.length > 0 && (
        <section className={"border-y border-slate-200 bg-slate-50 " + sec}>
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>Good first reads</p>
                <h2 className={h2}>Ideas you can start from home or your own street.</h2>
              </div>
              <Link to="/browse" className={more}>See every blueprint <ArrowRight size={16} /></Link>
            </div>
            <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {fresh.map((i) => (
                <li key={i.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
                  <a href={`/idea/${i.slug}`} className={card + " flex h-full flex-col p-4"}>
                    <span className="text-xs font-medium text-[#4643ba]">{i.category_name?.replace(/ Business Ideas$/, "")}</span>
                    <span className="mt-1 font-display text-base font-semibold leading-snug text-slate-900">{i.title}</span>
                    {i.summary && <span className="mt-1.5 line-clamp-2 text-sm text-slate-600">{i.summary}</span>}
                    <span className="mt-auto pt-3 text-xs text-slate-400">Updated {shortDate(i.updated_at)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* How it works + the four answers */}
      <section className={sec}>
        <div className={wrap + " grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"}>
          <div>
            <p className={eyebrow}>How it works</p>
            <h2 className={h2}>Three steps. No account.</h2>
            <ol className="mt-5 space-y-4">
              {[
                ["Find an idea", "Search, or open a category that fits your money, time and town."],
                ["Read the four answers", "Who pays, how the money works, what hurts, and a straight verdict."],
                ["Check it for free", "Press Validate on any blueprint and test it with an AI tool you already use. We never charge for it."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#4643ba] text-sm font-bold text-white">{i + 1}</span>
                  <span><span className="block font-semibold text-slate-900">{t}</span><span className="block text-sm text-slate-600">{d}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {FOUR.map((f, i) => (
              <div key={f.t} className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5">
                <span className="text-xs font-bold text-[#4643ba]">0{i + 1}</span>
                <h3 className="mt-1 font-display text-sm font-semibold leading-snug text-slate-900 sm:text-base">{f.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Library: every category with its subcategories */}
      <section className={"border-y border-slate-200 bg-slate-50 " + sec}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={eyebrow}>The library</p>
              <h2 className={h2}>Every category, and what it actually holds.</h2>
            </div>
            <Link to="/browse" className={more}>Browse all ideas <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {categories.map((c) => (
              <div key={c.slug} className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                <Link to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="font-display text-sm font-semibold leading-snug text-slate-900 hover:text-[#4643ba] sm:text-base">
                  {c.name.replace(/ Business Ideas$/, "")}
                </Link>
                <p className="text-xs text-slate-500">{c.subs.reduce((n, s) => n + s.count, 0)} ideas · {c.subs.length} topics</p>
                <ul className="mt-2 hidden flex-col gap-1 sm:flex">
                  {c.subs.slice(0, 3).map((s) => (
                    <li key={s.slug}>
                      <Link to="/category/$categorySlug/$subcategorySlug" params={{ categorySlug: c.slug, subcategorySlug: s.slug }} className="text-sm text-slate-600 hover:text-[#4643ba] hover:underline">
                        {s.name.replace(/ Business Ideas$/, "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools, topic guides and startup guides */}
      <section className={sec}>
        <div className={wrap + " grid gap-8 lg:grid-cols-3"}>
          <div>
            <p className={eyebrow}>Free calculators</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900">Make your next move add up.</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link to="/calculator/$slug" params={{ slug: t.slug }} className="flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-[#4643ba] hover:text-[#4643ba]">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/calculator" className={more + " mt-3"}>All calculators <ArrowRight size={16} /></Link>
          </div>
          <div>
            <p className={eyebrow}>Answers for India</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900">The questions people ask first.</h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {topics.map((p) => (
                <li key={p.slug}>
                  <a href={`/${p.slug}`} className="block py-1.5 text-sm text-slate-700 hover:text-[#4643ba] hover:underline">{p.seo.title}</a>
                </li>
              ))}
            </ul>
            <Link to="/topics" className={more + " mt-3"}>All topics <ArrowRight size={16} /></Link>
          </div>
          <div>
            <p className={eyebrow}>Startup guides</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900">Read before you build.</h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link to="/startup-guides/$slug" params={{ slug: g.slug }} className="block py-1.5 text-sm text-slate-700 hover:text-[#4643ba] hover:underline">{g.title}</Link>
                </li>
              ))}
            </ul>
            <Link to="/startup-guides" className={more + " mt-3"}>All guides <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Blog: heading and a 16:9 image only */}
      {posts.length > 0 && (
        <section className={"border-y border-slate-200 bg-slate-50 " + sec}>
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>From the blog</p>
                <h2 className={h2}>Long reads for the next decision.</h2>
              </div>
              <Link to="/blog" className={more}>All articles <ArrowRight size={16} /></Link>
            </div>
            <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {posts.map((p) => (
                <li key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
                  <a href={`/blog/${p.slug}`} className={card + " group block h-full overflow-hidden"}>
                    {p.image && <img src={p.image} alt={p.imageAlt ?? ""} loading="lazy" width={640} height={360} className="aspect-video w-full object-cover" />}
                    <h3 className="p-4 font-display text-sm font-semibold leading-snug text-slate-900 group-hover:text-[#4643ba]">{p.title}</h3>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* E-E-A-T: how the research is done, and the people accountable for it */}
      <section className={sec} id="how-we-research">
        <div className={wrap + " grid gap-8 lg:grid-cols-2"}>
          <div>
            <p className={eyebrow}>How we research every blueprint</p>
            <h2 className={h2}>Researched by people. Checked before it goes live.</h2>
            <ol className="mt-5 space-y-3">
              {[
                ["Start from a real buyer", "Every idea begins with who pays, in a real Indian town or city, not with a trend."],
                ["Work out the money", "How the first rupee comes in, how often, and what it costs to earn it."],
                ["Write down what hurts", "The risks of year one are written before the good parts, not after."],
                ["No invented numbers", "A figure is published only when it traces to a real source. If we cannot verify a number, we say so instead of making one up."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#4643ba]/10 text-xs font-bold text-[#4643ba]">{i + 1}</span>
                  <span><span className="block text-sm font-semibold text-slate-900">{t}</span><span className="block text-sm text-slate-600">{d}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className={eyebrow}>The people behind it</p>
            <h2 className={h2}>Built by hand, not by a headcount.</h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {TEAM.map((m) => (
                <li key={m.name} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#4643ba]/10 font-display text-sm font-bold text-[#4643ba]">
                    {m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{m.name}</span>
                    <span className="block text-xs leading-relaxed text-slate-600">{m.role}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              Questions or corrections: <a href={`mailto:${contactEmail()}`} className="font-semibold text-[#4643ba] hover:underline">{contactEmail()}</a> · <Link to="/founders" className="font-semibold text-[#4643ba] hover:underline">Meet the founders</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Why we built it, and why it stays free */}
      <section className={"border-y border-slate-200 bg-slate-50 " + sec}>
        <div className={wrap + " grid gap-8 lg:grid-cols-2"}>
          <div>
            <p className={eyebrow}>Who we are</p>
            <h2 className={h2}>We have been where you are.</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              We paid for those “validation” platforms too. We got a few generic lines back, spent our money, and got nothing real in return. When we asked for help, no one answered. That hurt. So we built the thing we needed back then: a free, honest library of small business ideas and side hustles, with real research, not empty hype.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Some of us have been jobless. Some of us have started over with no savings. BBI is for the person Googling “business ideas” from a phone, at 1am, hoping something makes sense for their actual life.
            </p>
            <blockquote className="mt-4 border-l-2 border-[#4643ba] pl-4 font-display text-lg text-slate-900">
              “We tell you who will actually pay you, how the money works, and what will hurt in year one. Then we give it to you straight.”
            </blockquote>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <Link to="/about" className="text-[#4643ba] hover:underline">Read the full story</Link>
              <Link to="/contact" className="text-[#4643ba] hover:underline">Write to us</Link>
            </div>
          </div>
          <div>
            <p className={eyebrow}>Why it stays free</p>
            <h2 className={h2}>Checking an idea should not cost the money you were going to start it with.</h2>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">What most idea validation tools ask of you</h3>
                <ul className="mt-2 space-y-1.5">{THEM.map((x) => <li key={x} className="text-sm leading-relaxed text-slate-600">✕ {x}</li>)}</ul>
              </div>
              <div className="rounded-2xl border border-[#4643ba]/40 bg-white p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#4643ba]">What BBI does instead</h3>
                <ul className="mt-2 space-y-1.5">{US.map((x) => <li key={x} className="flex gap-2 text-sm leading-relaxed text-slate-700"><Check aria-hidden size={16} className="mt-0.5 shrink-0 text-[#4643ba]" />{x}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ and the closing call */}
      <section className={sec}>
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
          <div className="mt-10 rounded-3xl border border-[#4643ba]/20 bg-gradient-to-br from-[#f4f3ff] to-white px-6 py-8 text-center sm:px-10">
            <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Read one honest blueprint before you spend a rupee.</h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-600">Follow the buyer, the money and the risks. If the honest answer is to walk away, you will hear it here first.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/browse" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-[#4643ba] px-5 text-sm font-semibold text-white transition hover:bg-[#3a37a0]">Browse the library <ArrowRight size={16} /></Link>
              <a href="/startup-idea-validation" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-[#4643ba] hover:text-[#4643ba]">Check your own idea</a>
            </div>
          </div>
        </div>
      </section>
    </V2Frame>
  );
}
