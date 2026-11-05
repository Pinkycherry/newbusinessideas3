import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { getListsHub } from "@/lib/lists.functions";
import { getBlogPosts } from "@/lib/blog.functions";
import { READY_CALCULATORS } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { TOPIC_PAGES } from "@/data/topic-pages";

/**
 * Home page for bbusiness.online (6 Nov 2026). Free for every reader in India: no prices, no
 * sign-up. Compact sections in the light layout; the words come from the original bbusiness.online
 * home (founder's promise, who it is for, why it stays free) and every section links into the library.
 */
export const Route = createFileRoute("/")({
  loader: async () => {
    const [hub, blog] = await Promise.all([
      getListsHub().catch(() => ({ total: 0, categories: [] })),
      getBlogPosts({ data: { page: 1 } }).catch(() => ({ posts: [] as { slug: string; title: string; image: string | null; imageAlt: string | null }[] })),
    ]);
    return { hub, posts: blog.posts.slice(0, 8) };
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

const BUILT_FOR = [
  { t: "Any business idea without investment", l: "“Save up first” is not advice when there is nothing to save.", to: "/category/side-hustle-business-ideas" },
  { t: "Work from home business opportunity", l: "Start from the room you are already paying rent for.", to: "/category/work-from-home-business-ideas" },
  { t: "Best business to start with little money", l: "Small capital is a constraint. It is not a verdict.", to: "/category/home-based-business-ideas" },
  { t: "Side hustle and best side job ideas", l: "Keep the salary. Build the second thing quietly.", to: "/category/part-time-business-ideas" },
  { t: "Business ideas for students", l: "Too young is something people say. It is not a rule.", to: "/category/student-business-ideas" },
  { t: "Business ideas for women at home", l: "Work that fits around a day you do not get to control.", to: "/category/women-friendly-business-ideas" },
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
  { q: "Is the whole library free?", a: "Yes. Every blueprint is free to read, start to finish. Validating an idea is free too — you use AI tools you already pay for, so it costs you nothing extra, ever. There is no sign-up." },
  { q: "Who is this library for?", a: "Someone starting from zero — often without capital, a team or even a laptop — and people who already earn but want to test a second-income idea without giving up what they have." },
  { q: "Can a blueprint guarantee that a business will work?", a: "No. A blueprint is research to help you ask better questions, not a promise of success. You still need to speak with customers, test whether they will pay, and check the facts in your own town." },
  { q: "What if the honest answer is not to build?", a: "Then the blueprint says so. A useful research library does not push every idea. It shows who an idea suits, who it does not, and when walking away is the better decision." },
  { q: "Can I suggest a business idea for the library?", a: "Yes. Send the niche or sector through the Contact page. Suggestions help us decide what to research next." },
];

function HomePage() {
  const { hub, posts } = Route.useLoaderData();
  const categories = hub.categories;
  const topCats = categories.slice(0, 10);
  const tools = READY_CALCULATORS.slice(0, 12);
  const topics = TOPIC_PAGES.slice(0, 16);
  const guides = STARTUP_GUIDES.slice(0, 10);

  return (
    <V2Frame active="/">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-[#f4f3ff] to-white pt-28 pb-10 sm:pt-32">
        <div className={wrap + " text-center"}>
          <p className={eyebrow}>The truth about business ideas · Free for every reader in India</p>
          <h1 className="mx-auto mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
            Tired of paying just to check if <span className="text-[#4643ba]">your idea will work?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            We built a free home for real business ideas — side hustles, zero investment ideas, work from home ideas, and low investment ideas. Every idea is researched, not guessed.
          </p>
          <form action="/search" method="get" className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
            <Search aria-hidden className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
            <input name="q" type="search" placeholder="Search ideas: tiffin, tuition, tailoring…" aria-label="Search business ideas" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-base outline-none" />
            <button type="submit" className="rounded-xl bg-[#4643ba] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3a37a0]">Search</button>
          </form>
          <div className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2">
            {topCats.map((c) => (
              <Link key={c.slug} to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-[#4643ba] hover:text-[#4643ba]">
                {c.name.replace(/ Business Ideas$/, "")}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500">
            {hub.total > 0 ? `${hub.total.toLocaleString("en-IN")} researched blueprints · ${categories.length} categories · ` : ""}No sign-up · Nothing to pay
          </p>
        </div>
      </section>

      {/* Four answers */}
      <section className="py-12">
        <div className={wrap}>
          <p className={eyebrow}>What every blueprint gives you</p>
          <h2 className={h2}>Four honest answers before you spend a rupee.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FOUR.map((f, i) => (
              <div key={f.t} className="rounded-2xl border border-slate-200 bg-white p-5">
                <span className="text-xs font-bold text-[#4643ba]">0{i + 1}</span>
                <h3 className="mt-1 font-display text-base font-semibold text-slate-900">{f.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Library: every category with its subcategories */}
      <section className="border-y border-slate-200 bg-slate-50 py-12">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={eyebrow}>The library</p>
              <h2 className={h2}>Every category, and what it actually holds.</h2>
            </div>
            <Link to="/browse" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba] hover:underline">Browse all ideas <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div key={c.slug} className="rounded-2xl border border-slate-200 bg-white p-4">
                <Link to="/category/$categorySlug" params={{ categorySlug: c.slug }} className="font-display text-base font-semibold text-slate-900 hover:text-[#4643ba]">
                  {c.name}
                </Link>
                <p className="text-xs text-slate-500">{c.subs.reduce((n, s) => n + s.count, 0)} ideas · {c.subs.length} topics</p>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {c.subs.slice(0, 5).map((s) => (
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
      <section className="py-12">
        <div className={wrap + " grid gap-8 lg:grid-cols-3"}>
          <div>
            <p className={eyebrow}>Free calculators</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900">Make your next move add up.</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link to="/calculator/$slug" params={{ slug: t.slug }} className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#4643ba] hover:text-[#4643ba]">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/calculator" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba] hover:underline">All calculators <ArrowRight size={16} /></Link>
          </div>
          <div>
            <p className={eyebrow}>Answers for India</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900">The questions people ask first.</h2>
            <ul className="mt-3 space-y-1.5">
              {topics.map((p) => (
                <li key={p.slug}>
                  <a href={`/${p.slug}`} className="text-sm text-slate-700 hover:text-[#4643ba] hover:underline">{p.seo.title}</a>
                </li>
              ))}
            </ul>
            <Link to="/topics" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba] hover:underline">All topics <ArrowRight size={16} /></Link>
          </div>
          <div>
            <p className={eyebrow}>Startup guides</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900">Read before you build.</h2>
            <ul className="mt-3 space-y-1.5">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link to="/startup-guides/$slug" params={{ slug: g.slug }} className="text-sm text-slate-700 hover:text-[#4643ba] hover:underline">{g.title}</Link>
                </li>
              ))}
            </ul>
            <Link to="/startup-guides" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba] hover:underline">All guides <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="border-y border-slate-200 bg-slate-50 py-12">
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={eyebrow}>From the blog</p>
                <h2 className={h2}>Long reads for the next decision.</h2>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4643ba] hover:underline">All articles <ArrowRight size={16} /></Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((p) => (
                <a key={p.slug} href={`/blog/${p.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {p.image && <img src={p.image} alt={p.imageAlt ?? ""} loading="lazy" className="aspect-video w-full object-cover" />}
                  <h3 className="p-4 font-display text-sm font-semibold leading-snug text-slate-900 group-hover:text-[#4643ba]">{p.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why we built it */}
      <section className="py-12">
        <div className={wrap + " grid gap-8 lg:grid-cols-2"}>
          <div>
            <p className={eyebrow}>Who we are</p>
            <h2 className={h2}>We have been where you are.</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              We paid for those “validation” platforms too. We got a few generic lines back, spent our money, and got nothing real in return. When we asked for help, no one answered. That hurt. So we built the thing we needed back then — a free, honest library of small business ideas and side hustles, with real research, not empty hype.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Some of us have been jobless. Some of us have started over with no savings. BBI is for the person Googling “business ideas” from a phone, at 1am, hoping something makes sense for their actual life.
            </p>
            <blockquote className="mt-4 border-l-2 border-[#4643ba] pl-4 font-display text-lg text-slate-900">
              “We tell you who will actually pay you, how the money works, and what will hurt in year one. Then we give it to you straight.”
            </blockquote>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <Link to="/about" className="text-[#4643ba] hover:underline">Read the full story</Link>
              <Link to="/founders" className="text-[#4643ba] hover:underline">Meet the people behind it</Link>
              <Link to="/contact" className="text-[#4643ba] hover:underline">Write to us</Link>
            </div>
          </div>
          <div>
            <p className={eyebrow}>Built for</p>
            <h2 className={h2}>For the person with an idea and nothing else.</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {BUILT_FOR.map((b) => (
                <li key={b.t}>
                  <a href={b.to} className="block h-full rounded-xl border border-slate-200 bg-white p-3 hover:border-[#4643ba]">
                    <span className="block text-sm font-semibold text-slate-900">{b.t}</span>
                    <span className="mt-0.5 block text-sm text-slate-600">{b.l}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why it stays free */}
      <section className="border-y border-slate-200 bg-slate-50 py-12">
        <div className={wrap}>
          <p className={eyebrow}>Why it stays free</p>
          <h2 className={h2}>Checking an idea should not cost the money you were going to start it with.</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">What most idea validation tools ask of you</h3>
              <ul className="mt-2 space-y-2">{THEM.map((x) => <li key={x} className="text-sm leading-relaxed text-slate-600">— {x}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-[#4643ba]/40 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#4643ba]">What BBI does instead</h3>
              <ul className="mt-2 space-y-2">{US.map((x) => <li key={x} className="text-sm leading-relaxed text-slate-700">✓ {x}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className={wrap}>
          <p className={eyebrow}>FAQ</p>
          <h2 className={h2}>Honest answers to fair questions.</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-slate-900">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#4643ba] px-5 py-5 text-white">
            <p className="font-display text-lg font-semibold">Start with one honest blueprint. Follow the buyer, the money and the risks.</p>
            <Link to="/browse" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#4643ba]">Browse the library free</Link>
          </div>
        </div>
      </section>
    </V2Frame>
  );
}
