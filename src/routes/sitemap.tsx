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
 * Column counts are literal class names on purpose. Tailwind generates
 * utilities by scanning source text, so an interpolated `lg:grid-cols-$n`
 * appears in no file and is never compiled.
 */
function LinkGrid({ children }: { children: React.ReactNode }) {
  return <ul className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>;
}

/**
 * One link row. `params as never` follows the same convention as `Breadcrumbs`
 * in site-shell.tsx: a single generic row cannot carry every route's param
 * types, and each call below supplies the params its own route declares.
 *
 * The row grammar — `mo-row`, the negative inset, `hover:bg-secondary`,
 * `hover:text-foreground` — is the same one the header's category dropdown and
 * `Bullets` in page-layout.tsx use, rather than a bespoke underline.
 */
function LinkRow({
  to,
  params,
  label,
}: {
  to: string;
  params?: Record<string, string>;
  label: string;
}) {
  return (
    <li className="min-w-0">
      <Link
        to={to}
        params={params as never}
        className="mo-row -mx-2 block truncate rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary hover:text-foreground"
      >
        {label}
      </Link>
    </li>
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
          <LinkGrid>
            {group.links.map((link) => (
              <LinkRow key={link.to} to={link.to} label={link.label} />
            ))}
          </LinkGrid>
        </Section>
      ))}

      <Section heading={`Calculators (${CALCULATORS.length})`}>
        <LinkGrid>
          {CALCULATORS.map((calculator) => (
            <LinkRow
              key={calculator.slug}
              to="/calculator/$slug"
              params={{ slug: calculator.slug }}
              label={calculator.title}
            />
          ))}
        </LinkGrid>
      </Section>

      <Section heading={`Startup guides (${STARTUP_GUIDES.length})`}>
        <LinkGrid>
          {STARTUP_GUIDES.map((guide) => (
            <LinkRow
              key={guide.slug}
              to="/startup-guides/$slug"
              params={{ slug: guide.slug }}
              label={guide.title}
            />
          ))}
        </LinkGrid>
      </Section>

      <Section heading={`Founder stories (${CASE_STUDIES.length})`}>
        <LinkGrid>
          {CASE_STUDIES.map((study) => (
            <LinkRow
              key={study.slug}
              to="/founder-stories/$slug"
              params={{ slug: study.slug }}
              label={study.title}
            />
          ))}
        </LinkGrid>
      </Section>

      <Section heading={`Idea blueprints (${ideas.length})`}>
        <div className="space-y-6">
          {categories.map(([categoryName, group]) => (
            <div key={categoryName}>
              <h3 className="font-display text-sm font-bold tracking-tight text-foreground">
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
              <div className="mt-2">
                <LinkGrid>
                  {group.ideas.map((idea) => (
                    <LinkRow
                      key={idea.slug}
                      to="/idea/$slug"
                      params={{ slug: idea.slug }}
                      label={idea.title}
                    />
                  ))}
                </LinkGrid>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </ContentPage>
  );
}
