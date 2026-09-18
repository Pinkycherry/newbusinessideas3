import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { CategoryBadge } from "@/components/category-badge";
import { ContentPage, Section, metaFor } from "@/components/page-layout";
import { CALCULATORS } from "@/lib/calculators";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { fetchIdeasForHub, type HubIdea } from "@/lib/sitemap.server";

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
 * ## Why every link is a capsule
 *
 * Inside that shell the links were a three-column grid, which is the wrong
 * shape for 500 links of wildly differing length — see the note on `PillRow`.
 * They are now `CategoryBadge`, the same capsule the header dropdown, the
 * Golden Tree and the footer already use, so this page borrows the site's
 * existing pill grammar and its spring interaction rather than defining a
 * third link treatment of its own.
 */
const getSitemapData = createServerFn({ method: "GET" }).handler(async (): Promise<HubIdea[]> =>
  fetchIdeasForHub(),
);

export const Route = createFileRoute("/sitemap")({
  head: () =>
    metaFor(
      "Site Map — Every Page on BBI",
      "Every page on BBI in one place: business idea blueprints by category, calculators, startup guides, founder stories and reference pages.",
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
      { to: "/browse", label: "Browse all ideas" },
      { to: "/list", label: "Curated lists" },
      { to: "/blog", label: "Blog" },
      { to: "/faq", label: "Questions and answers" },
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
 * A wrapping row of capsules.
 *
 * This replaced a three-column grid, which was the wrong shape for the
 * content: a grid gives every cell the width of the longest label and the
 * height of the tallest row, so a ten-item section rendered as four rows with
 * two empty cells, and a page of 500 links became a wall of evenly spaced text
 * with dead space down the right of every short section. Capsules size to
 * their own label and wrap, so the same ten items take two rows instead of
 * four and nothing is padded out to match its neighbour.
 */
function PillRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

function SitemapPage() {
  const ideas = Route.useLoaderData();

  // Grouped by category so the page has the same shape as the site, and so
  // each category heading links to the category page a crawler should also see.
  const byCategory = new Map<string, { slug: string; ideas: HubIdea[] }>();
  for (const idea of ideas) {
    const existing = byCategory.get(idea.categoryName);
    if (existing) existing.ideas.push(idea);
    else byCategory.set(idea.categoryName, { slug: idea.categorySlug, ideas: [idea] });
  }
  const categories = [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <ContentPage
      wide
      tone="brief"
      eyebrow="Site map"
      title="Every page on"
      highlight="BBI"
      intro={`${ideas.length} idea blueprints across ${categories.length} categories, plus ${CALCULATORS.length} calculators, ${STARTUP_GUIDES.length} startup guides and ${CASE_STUDIES.length} founder stories — every one of them linked from this page.`}
    >
      {PAGE_GROUPS.map((group) => (
        <Section key={group.heading} heading={group.heading}>
          <PillRow>
            {group.links.map((link) => (
              <CategoryBadge key={link.to} to={link.to} label={link.label} size="sm" />
            ))}
          </PillRow>
        </Section>
      ))}

      <Section heading={`Calculators (${CALCULATORS.length})`}>
        <PillRow>
          {CALCULATORS.map((calculator) => (
            <CategoryBadge
              key={calculator.slug}
              to={`/calculator/${calculator.slug}`}
              label={calculator.title}
              size="sm"
            />
          ))}
        </PillRow>
      </Section>

      <Section heading={`Startup guides (${STARTUP_GUIDES.length})`}>
        <PillRow>
          {STARTUP_GUIDES.map((guide) => (
            <CategoryBadge
              key={guide.slug}
              to={`/startup-guides/${guide.slug}`}
              label={guide.title}
              size="sm"
            />
          ))}
        </PillRow>
      </Section>

      <Section heading={`Founder stories (${CASE_STUDIES.length})`}>
        <PillRow>
          {CASE_STUDIES.map((study) => (
            <CategoryBadge
              key={study.slug}
              to={`/founder-stories/${study.slug}`}
              label={study.title}
              size="sm"
            />
          ))}
        </PillRow>
      </Section>

      <Section heading={`Idea blueprints (${ideas.length})`}>
        <div className="space-y-5">
          {categories.map(([categoryName, group]) => (
            <div key={categoryName} className="border-l border-border/60 pl-4">
              {/* The category stays an h3 so the document outline a crawler
                  reads is unchanged; the capsule is only how it looks. */}
              <h3 className="mb-2 flex items-center gap-2">
                <CategoryBadge slug={group.slug} label={categoryName} dot />
                <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {group.ideas.length}
                </span>
              </h3>
              <PillRow>
                {group.ideas.map((idea) => (
                  <CategoryBadge
                    key={idea.slug}
                    to={`/idea/${idea.slug}`}
                    label={idea.title}
                    size="sm"
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
