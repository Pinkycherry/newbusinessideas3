import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { ArrowRight, BookOpen, Calculator, ClipboardCheck, Compass, Layers3, Newspaper, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { metaFor } from "@/components/page-layout";
import { V2Frame } from "@/components/v2/frame";
import { TOPIC_PAGES } from "@/data/topic-pages";
import { LIVE_CATEGORY_SLUGS } from "@/config/live-categories";
import { LIVE_SUBCATEGORY_PATHS } from "@/config/live-subcategories";
import { CALCULATORS } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { TAXONOMY } from "@/data/taxonomy";
import { fetchBlogPostsForHub, type HubBlogPost } from "@/lib/sitemap.server";

/**
 * The HTML sitemap — one page that links to every page on this site.
 *
 * ## Why this exists at all, next to four XML sitemaps
 *
 * An XML sitemap tells a crawler a URL EXISTS. A link tells it the URL
 * MATTERS, and only the second one reliably gets a page indexed. Pages that
 * appear in a sitemap and nowhere else are what Search Console reports as
 * "Discovered – currently not indexed": found, judged not worth fetching.
 *
 * Before this page, every idea was in exactly that position. Nothing linked to
 * an idea from a page a crawler would already have, so the only route in was
 * the sitemap. This puts all of them one hop from a page that is itself
 * indexed, which is the single cheapest thing that can be done for crawl
 * coverage at this scale.
 *
 * It renders the full list in one document on purpose. At ten thousand ideas
 * that is a large page but a crawlable one. Past roughly twenty thousand it
 * should be tranched the way the XML sitemaps are.
 *
 * ## Why it renders through ContentPage
 *
 * This page first shipped with `SiteShell` plus its own hand-rolled section,
 * list and row components — including a local `Section` that shadowed the
 * shared one. It therefore had the right header and footer with the wrong
 * inside: different spacing scale, different heading treatment, no eyebrow, no
 * section chrome, and none of the reveal grammar the other templates use. Ten
 * pages render through `ContentPage`; this is now the eleventh, so the layout
 * has one owner and this page cannot drift from the rest again.
 *
 * ## Why the capsules are local and not `CategoryBadge`
 *
 * The links were a three-column grid first, which is the wrong shape for 500
 * labels of wildly differing length — a grid gives every cell the width of its
 * widest sibling, so short names were padded out and every short section had a
 * column of dead space down its right.
 *
 * `CategoryBadge` was the next attempt and was worse at this density. It
 * carries `.glass-pill`, and that block in styles.css is UNLAYERED, so its
 * `padding: 0.45rem 0.95rem` and `justify-content: center` beat every Tailwind
 * utility passed in — `size="sm"` never actually applied. Add
 * `text-wrap: balance` on the label and a long category name split across two
 * centred lines. The result was fat, centre-aligned buttons that fit one or
 * two per row on a phone.
 *
 * So the chip here is local and deliberately does NOT use `.glass-pill`:
 * nothing unlayered is fighting it, so its padding is actually its padding.
 * Editing `.glass-pill` instead would have been the wrong trade — every
 * button on the site depends on it.
 */
const getSitemapData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ blogPosts: HubBlogPost[] }> => {
    // The blog is the one database-backed list here; a failed read must not
    // take the category links down with it.
    const blogPosts = await fetchBlogPostsForHub().catch(() => []);
    return { blogPosts };
  },
);

export const Route = createFileRoute("/sitemap")({
  // Founder, 7 Nov 2026: redesigned in the glass layout and indexable again.
  head: () =>
    metaFor(
      "Site Map | bbusiness.online",
      "Every page on bbusiness.online in one place: business idea categories, answers for India, calculators, startup guides, blog posts and reference pages.",
    ),
  loader: () => getSitemapData(),
  component: SitemapPage,
});

/** Static destinations, grouped the way a reader would look for them. */
const PAGE_GROUPS: { heading: string; icon: typeof BookOpen; links: { to: string; label: string }[] }[] = [
  {
    heading: "Browse the library",
    icon: BookOpen,
    links: [
      { to: "/", label: "Home" },
      { to: "/browse", label: "Browse all ideas" },
      { to: "/all-business-ideas", label: "All business ideas" },
      { to: "/lists", label: "Idea lists" },
      { to: "/blog", label: "Blog" },
      { to: "/topics", label: "Answers for India" },
    ],
  },
  {
    heading: "Check and plan",
    icon: ClipboardCheck,
    links: [
      { to: "/startup-idea-validation", label: "Validate an idea" },
      { to: "/startup-idea-comparison", label: "Compare ideas" },
      { to: "/business-demand-test-india", label: "Demand test" },
      { to: "/first-customer-india", label: "First customer" },
      { to: "/startup-costs-india", label: "Startup costs" },
      { to: "/unit-economics-india", label: "Unit economics" },
      { to: "/business-idea-pivot-or-stop", label: "Pivot or stop" },
    ],
  },
  {
    heading: "Tools and reference",
    icon: Calculator,
    links: [
      { to: "/calculator", label: "All calculators" },
      { to: "/startup-guides", label: "Startup guides" },
      { to: "/founder-glossary", label: "Founder glossary" },
      { to: "/learning-resources", label: "Learning resources" },
      { to: "/tools", label: "Founder tools" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "About and policies",
    icon: ShieldCheck,
    links: [
      { to: "/about", label: "About" },
      { to: "/founders", label: "Founders" },
      { to: "/contact", label: "Contact" },
      { to: "/terms", label: "Terms of use" },
      { to: "/privacy", label: "Privacy policy" },
      { to: "/disclaimer", label: "Disclaimer" },
      { to: "/cookie-policy", label: "Cookie policy" },
      { to: "/refund-policy", label: "Refund policy" },
      { to: "/gdpr", label: "GDPR" },
    ],
  },
];

/**
 * A wrapping row of capsules. Chips size to their own label and wrap, so a
 * ten-item section takes two rows rather than the four a grid forced.
 */
function PillRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

/**
 * One link, as a capsule.
 *
 * Styling lives in `.bbi-sitemap-chip` in styles.css rather than in Tailwind
 * utilities here, for two reasons. First, the utilities lost: `.glass-pill`
 * and its neighbours are UNLAYERED, and an unlayered rule beats every
 * `@layer` utility regardless of specificity. Second, `bg-secondary/30` and
 * `text-muted-foreground` inside `.bbi-instrument` resolve to #262626 on
 * #141414 with #b2b2b2 text, which is why the first attempt rendered as grey
 * boxes nobody could read.
 *
 * `ins-action` is a marker, not a style. Several `.bbi-instrument` rules
 * force `color` with `!important` on links and buttons, and `!important`
 * beats an inline style; `:not(.ins-action)` is how the primary action opts
 * out of them. These chips need the same exemption to keep their own hover.
 *
 * `params as never` follows the convention in `Breadcrumbs` in
 * site-shell.tsx: one generic chip cannot carry every route's param types,
 * and each call site supplies the params its own route declares.
 */
function Chip({
  to,
  params,
  label,
}: {
  to: string;
  params?: Record<string, string>;
  label: string;
}) {
  return (
    <Link to={to} params={params as never} className="g-chip">
      {label}
    </Link>
  );
}

/**
 * Pack a row of chips so the ragged right edge closes up.
 *
 * Alphabetical order puts a 30-character label next to a 9-character one, so
 * every row breaks early and leaves a gap the width of the next label. Sorting
 * by length instead groups similar widths together, which lets each row fill
 * to the edge before wrapping. Nothing here is a navigational order a reader
 * relies on — it is a link index, and the category headings carry the
 * structure — so packing beats sorting by name.
 */
function packByWidth<T>(items: readonly T[], label: (item: T) => string): T[] {
  return [...items].sort((a, b) => label(a).length - label(b).length);
}

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

function Block({ id, icon: Icon, title, count, children }: { id: string; icon: typeof BookOpen; title: string; count?: number; children: ReactNode }) {
  return (
    <section id={id} className="g-tile scroll-mt-28 p-5 sm:p-6" data-stagger>
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-slate-900">
        <span className="g-icon !h-11 !w-11 shrink-0"><Icon aria-hidden size={19} /></span>
        {title}
        {count !== undefined && <span className="ml-auto rounded-full bg-[#4643ba]/10 px-2.5 py-0.5 text-xs font-semibold text-[#4643ba]">{count}</span>}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SitemapPage() {
  const { blogPosts } = Route.useLoaderData();
  const categories = TAXONOMY.filter((c) => LIVE_CATEGORY_SLUGS.has(c.slug));
  const jump = [["pages", "Main pages"], ["answers", "Answers for India"], ["guides", "Startup guides"], ["calculators", "Calculators"], ["blog", "Blog"], ["categories", "Categories"]];
  return (
    <V2Frame>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f1efff,#faf9ff_60%,#fff)] pt-28 pb-8 sm:pt-32">
        <div className={wrap + " text-center"}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4643ba]">Site map</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">Every page on bbusiness.online</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Categories, answers for India, calculators, startup guides and blog posts, all in one place.</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {jump.map(([id, t]) => <li key={id}><a href={`#${id}`} className="g-chip">{t}</a></li>)}
          </ul>
        </div>
      </section>

      <div className={wrap + " grid gap-5 pb-16"} data-reveal>
        <div id="pages" className="grid scroll-mt-28 gap-5 md:grid-cols-2">
          {PAGE_GROUPS.map((group) => (
            <Block key={group.heading} id={group.heading.toLowerCase().replace(/\W+/g, "-")} icon={group.icon} title={group.heading}>
              <PillRow>{group.links.map((link) => <Chip key={link.to} to={link.to} label={link.label} />)}</PillRow>
            </Block>
          ))}
        </div>

        <Block id="answers" icon={Compass} title="Answers for India" count={TOPIC_PAGES.length}>
          <ul className="grid gap-2.5 md:grid-cols-2">
            {TOPIC_PAGES.map((p) => (
              <li key={p.slug}><a href={`/${p.slug}`} className="g-link"><span>{p.seo.title.replace(/:.*$/, "")}</span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a></li>
            ))}
          </ul>
        </Block>

        <Block id="guides" icon={ClipboardCheck} title="Startup guides" count={STARTUP_GUIDES.length}>
          <PillRow>
            {packByWidth(STARTUP_GUIDES, (g) => g.title).map((guide) => (
              <Chip key={guide.slug} to="/startup-guides/$slug" params={{ slug: guide.slug }} label={guide.title.replace(/:.*$/, "")} />
            ))}
          </PillRow>
        </Block>

        <Block id="calculators" icon={Calculator} title="Calculators" count={CALCULATORS.length}>
          <PillRow>
            {packByWidth(CALCULATORS, (c) => c.title).map((calculator) => (
              <Chip key={calculator.slug} to="/calculator/$slug" params={{ slug: calculator.slug }} label={calculator.title} />
            ))}
          </PillRow>
        </Block>

        {blogPosts.length > 0 && (
          <Block id="blog" icon={Newspaper} title="Blog posts" count={blogPosts.length}>
            <ul className="grid gap-2.5 md:grid-cols-2">
              {blogPosts.map((post) => (
                <li key={post.slug}><a href={`/blog/${post.slug}`} className="g-link"><span>{post.title}</span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a></li>
              ))}
            </ul>
          </Block>
        )}

        {CASE_STUDIES.length > 0 && (
          <Block id="stories" icon={BookOpen} title="Founder stories" count={CASE_STUDIES.length}>
            <PillRow>{CASE_STUDIES.map((study) => <Chip key={study.slug} to="/founder-stories/$slug" params={{ slug: study.slug }} label={study.title} />)}</PillRow>
          </Block>
        )}

        <section id="categories" className="scroll-mt-28" data-stagger>
          <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-slate-900">
            <span className="g-icon !h-11 !w-11 shrink-0"><Layers3 aria-hidden size={19} /></span>
            Categories and subcategories
            <span className="rounded-full bg-[#4643ba]/10 px-2.5 py-0.5 text-xs font-semibold text-[#4643ba]">{categories.length}</span>
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {categories.map((category) => {
              const subs = category.subcategories.filter((sub) => LIVE_SUBCATEGORY_PATHS.has(`${category.slug}/${sub.slug}`));
              return (
                <div key={category.slug} className="g-tile p-5">
                  <Link to="/category/$categorySlug" params={{ categorySlug: category.slug }} className="flex items-center justify-between gap-3 font-display text-lg font-semibold text-slate-900 hover:text-[#4643ba]">
                    {category.name}
                    <span className="g-arrow grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#958cff] to-[#4643ba] text-white"><ArrowRight aria-hidden size={15} /></span>
                  </Link>
                  {subs.length > 0 && (
                    <div className="mt-3">
                      <PillRow>
                        {packByWidth(subs, (s) => s.name).map((sub) => (
                          <Chip key={sub.slug} to="/category/$categorySlug/$subcategorySlug" params={{ categorySlug: category.slug, subcategorySlug: sub.slug }} label={sub.name.replace(/ Business Ideas$/, "")} />
                        ))}
                      </PillRow>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        <p className="text-center text-sm text-slate-500">Search engines read the same pages through <a href="/sitemap-index.xml" className="font-semibold text-[#4643ba]">sitemap-index.xml</a>.</p>
      </div>
    </V2Frame>
  );
}
