import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, BookOpen, Calculator, Sparkles, Tag, ArrowRight } from "lucide-react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { GLOSSARY_DATA, GLOSSARY_CATEGORIES, type GlossaryTerm } from "@/lib/glossary-data";

export const Route = createFileRoute("/founder-glossary/")({
  head: () => ({
    meta: [
      { title: `Founder Glossary — ${GLOSSARY_DATA.length} Essential Startup Terms | BBI` },
      {
        name: "description",
        content: `Clear, practical definitions and formulas for ${GLOSSARY_DATA.length} essential startup, unit economics, fundraising, and venture metrics.`,
      },
      {
        property: "og:title",
        content: `Founder Glossary — ${GLOSSARY_DATA.length} Essential Startup Terms | BBI`,
      },
      {
        property: "og:description",
        content:
          "Definitions and mathematical formulas for TAM, CAC Payback, LTV, Burn Rate, MOIC, Churn, ARR, and Safe Notes.",
      },
    ],
  }),
  component: FounderGlossaryPage,
});

export function FounderGlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Available letters from terms
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    GLOSSARY_DATA.forEach((t) => {
      const firstChar = t.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      }
    });
    return Array.from(letters).sort();
  }, []);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        (item.why_it_matters && item.why_it_matters.toLowerCase().includes(q)) ||
        (item.example_in_practice && item.example_in_practice.toLowerCase().includes(q)) ||
        (item.formula && item.formula.toLowerCase().includes(q)) ||
        (item.related_terms && item.related_terms.some((r) => r.toLowerCase().includes(q)));

      const matchesLetter = !selectedLetter || item.term.toUpperCase().startsWith(selectedLetter);

      return matchesCategory && matchesSearch && matchesLetter;
    });
  }, [searchQuery, selectedCategory, selectedLetter]);

  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/founder-glossary",
            name: "Founder & Unit Economics Glossary",
            description: `${GLOSSARY_DATA.length} essential startup and unit economics terms defined for operators.`,
            itemCount: GLOSSARY_DATA.length,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Founder Glossary", path: "/founder-glossary" },
          ]),
        ]}
      />
      <SiteShell>
        <div className="mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Founder Glossary" }]} />

          <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="t-eyebrow">Operator Lexicon</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Founder & Unit Economics{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
                  Glossary
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {GLOSSARY_DATA.length} operator-tested terms covering venture financing, unit
                economics, product-market fit, and market sizing with exact mathematical formulas.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/calculator"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Calculator className="h-3.5 w-3.5" />
                Useful Calculators
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 grid gap-4 sm:grid-cols-12">
            <div className="relative sm:col-span-8 lg:col-span-9">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by term (e.g. CAC, LTV, TAM, ARR, Safe Note, Churn)..."
                className="glass w-full rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="sm:col-span-4 lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass w-full rounded-xl py-3 px-3.5 text-xs font-semibold uppercase tracking-wider text-foreground focus:border-primary focus:outline-none"
              >
                <option value="All">All Categories ({GLOSSARY_DATA.length})</option>
                {GLOSSARY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alphabet Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-1 border-b border-border/70 pb-4">
            <button
              type="button"
              onClick={() => setSelectedLetter(null)}
              className={`rounded px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
                selectedLetter === null
                  ? "glass-btn-glow glass-btn"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All
            </button>
            {availableLetters.map((ltr) => (
              <button
                key={ltr}
                type="button"
                onClick={() => setSelectedLetter(selectedLetter === ltr ? null : ltr)}
                className={`rounded px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                  selectedLetter === ltr
                    ? "glass-btn-glow glass-btn"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {ltr}
              </button>
            ))}
          </div>

          {/* Counter Status */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredTerms.length}</strong> of{" "}
              {GLOSSARY_DATA.length} terms
            </span>
            {(searchQuery || selectedCategory !== "All" || selectedLetter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedLetter(null);
                }}
                className="text-primary hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Terms Cards Grid */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTerms.map((t) => (
              <article
                key={t.slug}
                id={t.slug}
                className="glass flex flex-col justify-between rounded-2xl p-5 transition-all hover:border-primary/50 sm:p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      {t.category}
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
                    {t.term}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t.definition}
                  </p>

                  {t.why_it_matters && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Why it matters
                      </p>
                      <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                        {t.why_it_matters}
                      </p>
                    </div>
                  )}

                  {t.example_in_practice && (
                    <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Example
                      </p>
                      <p className="mt-1 text-sm text-foreground/90 italic">
                        "{t.example_in_practice}"
                      </p>
                    </div>
                  )}

                  {/* Mathematical Formula if present */}
                  {t.formula && (
                    <div className="mt-4 rounded-xl border border-border/80 bg-background/50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Formula / Computation:
                      </p>
                      <code className="mt-1 block font-mono text-xs text-foreground">
                        {t.formula}
                      </code>
                    </div>
                  )}

                  {/* Benchmark or example if present */}
                  {t.example_or_formula && !t.formula && (
                    <div className="mt-4 rounded-xl border border-border/80 bg-background/50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Operator Rule:
                      </p>
                      <p className="mt-0.5 text-xs text-foreground/90 leading-snug">
                        {t.example_or_formula}
                      </p>
                    </div>
                  )}
                </div>

                {/* Related Terms Pills */}
                {t.related_terms && t.related_terms.length > 0 && (
                  <div className="mt-5 border-t border-border/60 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      Related Terms:
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {t.related_terms.map((rel) => (
                        <button
                          key={rel}
                          type="button"
                          onClick={() => {
                            setSearchQuery(rel);
                            window.scrollTo({ top: 220, behavior: "smooth" });
                          }}
                          className="rounded-md border border-border/70 bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                        >
                          {rel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Zero Results fallback */}
          {filteredTerms.length === 0 && (
            <div className="glass mt-10 rounded-2xl p-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <h3 className="mt-4 font-display text-lg font-bold">No matching terms found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try searching for a different keyword or clear your category and letter filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedLetter(null);
                }}
                className="glass-btn-light mt-5 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </SiteShell>
    </>
  );
}
