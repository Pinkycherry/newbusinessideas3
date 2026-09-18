import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

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
 * A wrapping row of capsules. Chips size to their own label and wrap, so a
 * ten-item section takes two rows rather than the four a grid forced.
 */
function PillRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

/**
 * One link, as a compact capsule. Left-aligned and sized to its text — see
 * the note at the top of this file for why it does not use `.glass-pill`.
 *
 * `params as never` follows the same convention as `Breadcrumbs` in
 * site-shell.tsx: one generic chip cannot carry every route's param types, and
 * each call site supplies the params its own route declares.
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
    <Link
      to={to}
      params={params as never}
      className="inline-flex max-w-full items-center rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-xs leading-snug text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary hover:text-foreground"
    >
      {label}
    </Link>
  );
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
              <Chip key={link.to} to={link.to} label={link.label} />
            ))}
          </PillRow>
        </Section>
      ))}

      <Section heading={`Calculators (${CALCULATORS.length})`}>
        <PillRow>
          {CALCULATORS.map((calculator) => (
            <Chip
              key={calculator.slug}
              to="/calculator/$slug"
              params={{ slug: calculator.slug }}
              label={calculator.title}
            />
          ))}
        </PillRow>
      </Section>

      <Section heading={`Startup guides (${STARTUP_GUIDES.length})`}>
        <PillRow>
          {STARTUP_GUIDES.map((guide) => (
            <Chip
              key={guide.slug}
              to="/startup-guides/$slug"
              params={{ slug: guide.slug }}
              label={guide.title}
            />
          ))}
        </PillRow>
      </Section>

      <Section heading={`Founder stories (${CASE_STUDIES.length})`}>
        <PillRow>
          {CASE_STUDIES.map((study) => (
            <Chip
              key={study.slug}
              to="/founder-stories/$slug"
              params={{ slug: study.slug }}
              label={study.title}
            />
          ))}
        </PillRow>
      </Section>

      <Section heading={`Idea blueprints (${ideas.length})`}>
        <div className="space-y-5">
          {categories.map(([categoryName, group]) => (
            <div key={categoryName}>
              {/* Every category heading is the same element at the same size,
                  so the section reads as one list rather than sixteen
                  differently-shaped blocks. It was a capsule, which wrapped
                  long names across two centred lines and pushed its count out
                  to the side. */}
              <h3 className="mb-2 font-display text-sm font-bold tracking-tight text-foreground">
                <Link
                  to="/category/$categorySlug"
                  params={{ categorySlug: group.slug }}
                  className="transition-colors hover:text-primary"
                >
                  {categoryName}
                </Link>
                <span className="ml-2 text-xs font-normal tabular-nums text-muted-foreground">
                  {group.ideas.length}
                </span>
              </h3>
              <PillRow>
                {group.ideas.map((idea) => (
                  <Chip
                    key={idea.slug}
                    to="/idea/$slug"
                    params={{ slug: idea.slug }}
                    label={idea.title}
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
