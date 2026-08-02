import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/idea-card";
import { SiteShell } from "@/components/site-shell";
import { TiltPanel } from "@/components/tilt-panel";
import { AdSlot } from "@/components/AdSlot";
import { FEATURED_IDEA_IDS } from "@/config/featured";
import { getCatalog, getFeaturedIdeas } from "@/lib/ideas.functions";

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });

/** Editorial image trio — replace `src` only; nothing structural depends on it. */
const EDITORIAL_IMAGES = [
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-16.jpg.webp",
    alt: "Smiling businesswoman working at a laptop in a relaxed, warmly lit setting",
    blob: "blob-portrait-1",
    tilt: -2,
    offset: "sm:mt-0",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-17.jpg.webp",
    alt: "Businesswoman with a coffee and an open notebook in a calm workspace",
    blob: "blob-portrait-2",
    tilt: 4,
    offset: "sm:mt-24",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-37.jpg.webp",
    alt: "Close-up of hands typing on a laptop keyboard in warm ambient light",
    blob: "blob-portrait-3",
    tilt: -1.5,
    offset: "sm:mt-10",
  },
];

/** Scroll-stack panel copy. */
const SCROLL_PANELS = [
  {
    title: "Most small business ideas are guesses dressed as research.",
    body: "A trend chart and a list of niches is not a blueprint. This directory exists because the hard part of starting a business is never finding an idea — it is knowing if yours will actually pay.",
  },
  {
    title: "Every blueprint answers four questions.",
    body: "Who specifically pays for this. How the money actually moves. What will hurt in year one. And whether you, specifically, are the right person to build it.",
  },
  {
    title: "43 blueprints live. Scaling to 10,000.",
    body: "Organized across categories from Tech and SaaS to Creator and Media, FinTech, E-Commerce and more. Every new category added to the database appears here automatically.",
  },
  {
    title: "The AI audit goes further.",
    body: "Every blueprint has a live AI audit option. Run it and get real-time market sizing, a competitor map, and a 90-day launch plan generated for that specific idea. Pro Pass unlocks it.",
  },
];

/** Hero content panels. */
const HERO_PANELS = [
  {
    label: "What you get",
    body: "Every small business idea in this library comes with a named buyer, a revenue model in plain numbers, the failure modes most people find only after spending money, and a direct verdict on who should actually build it. Not a list. A blueprint.",
  },
  {
    label: "How it works",
    body: "Browse a category. Read the blueprint. If it fits, run a live AI audit and get a real-time market sizing, competitor map, and a 90-day launch plan built for that specific idea. Free to browse. Pro Pass for the audit.",
  },
];

/** FAQ content. */
const FAQS = [
  {
    q: "Are these real business ideas or just inspiration?",
    a: "Every entry is a researched blueprint, not a topic suggestion. Each one covers what the business actually does day to day, who the specific customer is, how money changes hands, what the realistic obstacles are, and a direct verdict on founder fit. You can evaluate any idea in under ten minutes.",
  },
  {
    q: "What is the difference between a free and Pro entry?",
    a: "Free entries give you the full blueprint — summary, pros, cons, and verdict. Pro entries add the live AI audit: a real-time market sizing, competitor analysis, target customer profile, and a 90-day go-to-market plan generated specifically for that idea.",
  },
  {
    q: "How are trend scores calculated?",
    a: "Each idea receives a trend score between 55 and 98 based on current market demand signals for that specific micro-niche, not the broader category. A score above 88 indicates strong current momentum and unlocks Pro tier status.",
  },
  {
    q: "Can I suggest a business idea to add to the library?",
    a: "Yes. Use the Contact page to submit a niche or sector you want covered. We review suggestions and prioritize based on search demand and founder interest.",
  },
  {
    q: "How often is the library updated?",
    a: "New blueprints are added regularly across all categories. Every new entry appears automatically in the browse page and category listings the moment it is published.",
  },
  {
    q: "Is this useful if I already have a business idea?",
    a: "Yes. Run the AI audit on the closest matching entry to get a real-time market sizing, competitive landscape, and launch plan that you can adapt to your own version of the idea.",
  },
];

const featuredQuery = queryOptions({
  queryKey: ["featured", FEATURED_IDEA_IDS],
  queryFn: () => getFeaturedIdeas({ data: { ideaIds: FEATURED_IDEA_IDS } }),
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      context.queryClient.ensureQueryData(featuredQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "IdeaVault — Researched Small Business Ideas & Startup Blueprints" },
      {
        name: "description",
        content:
          "Browse 1,000+ researched small business ideas, startup blueprints, and work from home business opportunities. Every idea includes market context, pros, cons, a trend score, and a straight founder-fit verdict.",
      },
      {
        property: "og:title",
        content: "IdeaVault — Researched Small Business Ideas & Startup Blueprints",
      },
      {
        property: "og:description",
        content:
          "Browse 1,000+ researched small business ideas, startup blueprints, and work from home business opportunities — with market context, pros, cons, trend scores and founder-fit verdicts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">The idea library could not be loaded.</p>
    </SiteShell>
  ),
});

function HomePage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  // Featured picks are configured in src/config/featured.ts
  const { data: highlights } = useSuspenseQuery(featuredQuery);

  return (
    <SiteShell>
      {/* LLM / AI-search crawlable summary — visually hidden, fully readable by crawlers. */}
      <p className="sr-only">
        IdeaVault is a business idea directory and startup intelligence library. This resource
        covers small business ideas, work from home business ideas, low investment startup ideas,
        business ideas for women, zero investment business ideas, and startup ideas organized by
        sector, investment level, and founder profile. Each entry includes a market breakdown,
        revenue model, risk analysis, trend score, and founder-fit verdict. IdeaVault is a curated
        directory of startup opportunities, not a generic listicle.
      </p>
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <section className="px-3 pt-10 sm:px-4 sm:pt-16">
        <TiltPanel className="mx-auto max-w-6xl" max={4}>
          <div className="glass blob-1 px-6 py-14 sm:px-12 sm:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent sm:text-xs">
              {catalog.totalIdeas} live blueprints
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              10,000+ small business ideas,{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent [text-shadow:0_0_40px_oklch(0.723_0.161_56/25%)]">
                researched properly
              </span>{" "}
              — not listicles.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Every entry is a blueprint: who the customer is, how the money works, what will hurt,
              and a blunt verdict on who should actually build it. Browse startup ideas, work from
              home business ideas, and low-investment opportunities — all ranked by real market
              demand.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {HERO_PANELS.map((panel, i) => (
                <div key={panel.label} className={`glass glass-hover ${i === 0 ? "blob-sm-1" : "blob-sm-2"} px-6 py-7`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                    {panel.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{panel.body}</p>
                </div>
              ))}
            </div>
          </div>
        </TiltPanel>
      </section>

      {/* MOVING CATEGORY TICKER — categories are live from the database. */}
      <section className="pt-10" aria-label="Browse by category">
        <style>{`@keyframes iv-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}.iv-ticker-track{animation:iv-ticker 38s linear infinite;width:max-content}.iv-ticker:hover .iv-ticker-track,.iv-ticker:active .iv-ticker-track{animation-play-state:paused}`}</style>
        <p className="mx-auto max-w-6xl px-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent sm:px-4">
          Browse by category
        </p>
        <div className="iv-ticker mt-4 overflow-x-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
          <div className="iv-ticker-track flex gap-3 px-3 sm:px-4">
            {[...catalog.categories, ...catalog.categories].map((c, i) => (
              <Link
                key={`${c.categorySlug}-${i}`}
                to="/category/$categorySlug"
                params={{ categorySlug: c.categorySlug }}
                className="glass shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_24px_oklch(0.723_0.161_56/45%)]"
              >
                {c.categoryName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="px-3 pt-8 sm:px-4">
        <AdSlot position="homepage-hero-below" size="banner" />
      </div>

      <section className="mx-auto max-w-6xl px-3 py-16 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              Featured blueprints
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Three blueprints worth your afternoon
            </h2>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
          >
            See all {catalog.totalIdeas} →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((idea) => (
            <IdeaCard key={idea.ideaId} idea={idea} />
          ))}
        </div>
      </section>

      <div className="px-3 pb-8 sm:px-4">
        <AdSlot position="homepage-featured-below" size="banner" />
      </div>

      <section className="mx-auto max-w-6xl px-3 pb-10 sm:px-4">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              Why this exists
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              A list of ideas is not research.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Most idea lists are written in an afternoon by someone who has never sold the thing
                they are describing. They tell you the market is growing and stop there. The hard
                part of starting a business was never finding a plausible-sounding idea — it was
                working out who pays, how often, at what margin, and what happens on the day a
                bigger company decides to do the same thing for free.
              </p>
              <p>
                A blueprint in the vault answers those questions before you commit a weekend to it.
                Each one names the customer specifically rather than as a demographic, explains the
                revenue mechanics in plain numbers, and lists the failure modes we would expect in
                the first year — the churn, the acquisition costs that quietly exceed lifetime
                value, the regulation nobody mentions until you are already trading.
              </p>
              <p>
                The verdict at the end is deliberately blunt. Some entries end with a
                recommendation not to build. That is the point: research that only ever agrees with
                you is marketing wearing a lab coat.
              </p>
            </div>
            <Link
              to="/browse"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
            >
              Read a blueprint
              <span aria-hidden>→</span>
            </Link>
          </div>

          <aside className="glass blob-3 p-8 lg:mt-16 lg:self-start sm:p-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              What every entry has to contain
            </h3>
            <dl className="mt-6 divide-y divide-border">
              {[
                {
                  t: "A named buyer",
                  d: "Not \"small businesses\" — the specific role, the budget it comes out of, and why it is a priority this quarter.",
                },
                {
                  t: "Working money mechanics",
                  d: "Pricing, delivery cost and the point at which the model stops being a job and starts being a business.",
                },
                {
                  t: "The unglamorous risks",
                  d: "Platform dependency, seasonality, licensing, and the competitor already halfway there.",
                },
                {
                  t: "A founder-fit verdict",
                  d: "Who is well placed to build it, and who should walk away from it entirely.",
                },
              ].map((row) => (
                <div key={row.t} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-sm font-semibold text-foreground">{row.t}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{row.d}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* EDITORIAL IMAGE TRIO — swap only the `src` values below to change images. */}
      <section className="mx-auto max-w-6xl px-3 pb-16 sm:px-4">
        <div className="grid gap-6 sm:grid-cols-3 sm:items-start">
          {EDITORIAL_IMAGES.map((img) => (
            <figure
              key={img.src}
              className={`glass relative overflow-hidden ${img.blob} ${img.offset} aspect-[3/4]`}
              style={{ transform: `rotate(${img.tilt}deg)` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary to-ember opacity-15"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* SCROLL-STACK — panels pin and stack as you scroll. Edit SCROLL_PANELS below. */}
      <section className="mx-auto max-w-5xl px-3 pb-24 sm:px-4">
        {SCROLL_PANELS.map((panel, i) => (
          <div key={panel.title} className="h-[70vh]">
            <div
              className={`glass sticky top-24 p-8 sm:p-12 ${["blob-2", "blob-4", "blob-5", "blob-6"][i]}`}
              style={{ zIndex: i + 1 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                {panel.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {panel.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* WHY WE BUILT THIS */}
      <section className="mx-auto max-w-4xl px-3 pb-24 sm:px-4">
        <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
          We got tired of the same 50 ideas recycled into infinity.
        </h2>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            Every business idea list on the internet is the same list. Drop shipping. Print on
            demand. Start a blog. Sell on Etsy. They are not wrong exactly, but they are not
            researched either. Nobody tells you the margin, the failure rate, the licensing
            requirement, or the competitor who already owns the space.
          </p>
          <p>
            This library exists because a genuine small business idea blueprint is worth more than
            a hundred recycled suggestions. We research each one properly — market context, real
            revenue mechanics, honest risks — and we tell you directly whether you are the right
            person to build it.
          </p>
        </div>
        <Link
          to="/browse"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
        >
          Read a blueprint
          <span aria-hidden>→</span>
        </Link>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-3 pb-24 sm:px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Common questions
        </p>
        <div className="mt-6 divide-y divide-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-foreground transition-colors hover:text-primary sm:text-lg">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="px-3 pb-10 sm:px-4">
        <AdSlot position="homepage-above-footer" size="banner" />
      </div>
      {/* EDITABLE SECTION END */}
    </SiteShell>
  );
}
