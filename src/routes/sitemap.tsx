import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { ContentPage, Section, metaFor } from "@/components/page-layout";
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
  head: () =>
    metaFor(
      "Site Map | BBI – Bro Business Ideas",
      "Every page on BBI in one place: business idea categories, focused paths, calculators, startup guides, founder stories and reference pages.",
    ),
  loader: () => getSitemapData(),
  component: SitemapPage,
});

/** Static destinations, grouped the way a reader would look for them. */
const PAGE_GROUPS: { heading: string; links: { to: string; label: string }[] }[] = [
  {
    heading: "Browse the library",
    links: [
      { to: "/", label: "Home" },
      { to: "/browse", label: "Browse all categories" },
      { to: "/blueprints", label: "Published blueprints" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    heading: "Tools and reference",
    links: [
      { to: "/calculator", label: "All calculators" },
      { to: "/startup-guides", label: "All startup guides" },
      { to: "/founder-stories", label: "Founder stories" },
      { to: "/founder-glossary", label: "Founder glossary" },
      { to: "/learning-resources", label: "Learning resources" },
    ],
  },
  {
    heading: "About BBI",
    links: [
      { to: "/about", label: "About" },
      // Listed beside About rather than under it: /about is the story and all
      // four people, /founders is the two who sign the research off.
      { to: "/founders", label: "Founders" },
      { to: "/services", label: "Services" },
      { to: "/pricing", label: "Pricing" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { to: "/terms", label: "Terms of use" },
      { to: "/privacy", label: "Privacy policy" },
      { to: "/refund-policy", label: "Refund policy" },
      { to: "/disclaimer", label: "Disclaimer" },
      { to: "/gdpr", label: "GDPR" },
    ],
  },
];

/**
 * A wrapping row of capsules. Chips size to their own label and wrap, so a
 * ten-item section takes two rows rather than the four a grid forced.
 */
function PillRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
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
    <Link to={to} params={params as never} className="ins-action bbi-sitemap-chip">
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

function SitemapPage() {
  const { blogPosts } = Route.useLoaderData();
  return (
    <ContentPage
      wide
      tone="brief"
      eyebrow="Site map"
      title="Every page on"
      highlight="BBI"
      intro="Browse the business idea categories, focused paths, calculators, startup guides, founder stories and journal posts. Search the separate index of completed source blueprints from the links below."
    >
      {PAGE_GROUPS.map((group) => (
        <Section key={group.heading} heading={group.heading}>
          <PillRow>
            {group.links.map((link) => (
              <Chip key={link.to} to={link.to} label={link.label} />
            ))}
          </PillRow>
        </Section>
      ))}

      <Section heading="Calculators">
        <PillRow>
          {packByWidth(CALCULATORS, (c) => c.title).map((calculator) => (
            <Chip
              key={calculator.slug}
              to="/calculator/$slug"
              params={{ slug: calculator.slug }}
              label={calculator.title}
            />
          ))}
        </PillRow>
      </Section>

      <Section heading="Startup guides">
        <PillRow>
          {packByWidth(STARTUP_GUIDES, (g) => g.title).map((guide) => (
            <Chip
              key={guide.slug}
              to="/startup-guides/$slug"
              params={{ slug: guide.slug }}
              label={guide.title}
            />
          ))}
        </PillRow>
      </Section>

      <Section heading="Founder stories">
        <PillRow>
          {packByWidth(CASE_STUDIES, (c) => c.title).map((study) => (
            <Chip
              key={study.slug}
              to="/founder-stories/$slug"
              params={{ slug: study.slug }}
              label={study.title}
            />
          ))}
        </PillRow>
      </Section>

      <Section heading="Blog posts">
        <PillRow>
          {packByWidth(blogPosts, (p) => p.title).map((post) => (
            <Chip
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              label={post.title}
            />
          ))}
        </PillRow>
      </Section>

      <Section heading="Categories and subcategories">
        <div className="space-y-5">
          {TAXONOMY.map((category) => (
            <div key={category.slug}>
              <h3 className="mb-2.5 text-base font-semibold tracking-tight text-foreground">
                <Link
                  to="/category/$categorySlug"
                  params={{ categorySlug: category.slug }}
                  className="transition-colors hover:text-primary"
                >
                  {category.name}
                </Link>
              </h3>
              <PillRow>
                {packByWidth(category.subcategories, (s) => s.name).map((sub) => (
                  <Chip
                    key={sub.slug}
                    to="/category/$categorySlug/$subcategorySlug"
                    params={{ categorySlug: category.slug, subcategorySlug: sub.slug }}
                    label={sub.name.replace(/ Business Ideas$/, "")}
                  />
                ))}
              </PillRow>
            </div>
          ))}
        </div>
      </Section>
    </ContentPage>
  );
}
