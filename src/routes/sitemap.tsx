import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
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
 * coverage at this scale — and it is what the most structurally mature site in
 * this space does with its own five thousand pages.
 *
 * It renders the full list in one document on purpose. At ten thousand ideas
 * that is a large page but a crawlable one. Past roughly twenty thousand it
 * should be tranched the way the XML sitemaps are.
 */
const getSitemapData = createServerFn({ method: "GET" }).handler(async (): Promise<HubIdea[]> =>
  fetchIdeasForHub(),
);

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Site Map — Every Page on BBI" },
      {
        name: "description",
        content:
          "Every page on BBI in one place: business idea blueprints by category, calculators, startup guides, founder stories and reference pages.",
      },
      { property: "og:title", content: "Site Map — Every Page on BBI" },
    ],
  }),
  loader: () => getSitemapData(),
  component: SitemapPage,
});

/** Static destinations, grouped the way a reader would look for them. */
const PAGE_GROUPS: { heading: string; links: { to: string; label: string }[] }[] = [
  {
    heading: "Browse",
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

function Section({
  heading,
  count,
  children,
}: {
  heading: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {heading}
        {typeof count === "number" && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">{count}</span>
        )}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function LinkList({ children }: { children: React.ReactNode }) {
  return <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>;
}

/* `params as never` follows the same convention as `Breadcrumbs` in
   site-shell.tsx: one generic link row cannot carry the per-route param types,
   and every call below supplies the params its own route declares. */
function Item({
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
        className="block truncate text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
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
    <SiteShell>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Site map", path: "/sitemap" },
        ])}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Site map" }]} />

        <header className="mt-6 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Site map
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Every page on BBI in one place — {ideas.length} idea blueprints across{" "}
            {categories.length} categories, plus {CALCULATORS.length} calculators,{" "}
            {STARTUP_GUIDES.length} startup guides and {CASE_STUDIES.length} founder stories.
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {PAGE_GROUPS.map((group) => (
            <Section key={group.heading} heading={group.heading}>
              <LinkList>
                {group.links.map((link) => (
                  <Item key={link.to} to={link.to} label={link.label} />
                ))}
              </LinkList>
            </Section>
          ))}

          <Section heading="Calculators" count={CALCULATORS.length}>
            <LinkList>
              {CALCULATORS.map((calculator) => (
                <Item
                  key={calculator.slug}
                  to="/calculator/$slug"
                  params={{ slug: calculator.slug }}
                  label={calculator.title}
                />
              ))}
            </LinkList>
          </Section>

          <Section heading="Startup guides" count={STARTUP_GUIDES.length}>
            <LinkList>
              {STARTUP_GUIDES.map((guide) => (
                <Item key={guide.slug} to={`/startup-guides/${guide.slug}`} label={guide.title} />
              ))}
            </LinkList>
          </Section>

          <Section heading="Founder stories" count={CASE_STUDIES.length}>
            <LinkList>
              {CASE_STUDIES.map((study) => (
                <Item key={study.slug} to={`/founder-stories/${study.slug}`} label={study.title} />
              ))}
            </LinkList>
          </Section>

          <Section heading="Idea blueprints" count={ideas.length}>
            <div className="space-y-8">
              {categories.map(([categoryName, group]) => (
                <div key={categoryName}>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    <Link
                      to="/category/$categorySlug"
                      params={{ categorySlug: group.slug }}
                      className="underline-offset-4 hover:underline"
                    >
                      {categoryName}
                    </Link>
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {group.ideas.length}
                    </span>
                  </h3>
                  <div className="mt-3">
                    <LinkList>
                      {group.ideas.map((idea) => (
                        <Item
                          key={idea.slug}
                          to="/idea/$slug"
                          params={{ slug: idea.slug }}
                          label={idea.title}
                        />
                      ))}
                    </LinkList>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </SiteShell>
  );
}
