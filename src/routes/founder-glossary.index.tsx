import { V2PageAsideCta, V2PageCard, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

import { PAGE_IMAGES, pageImageMeta } from "@/config/page-imagery";
import { absoluteUrl } from "@/lib/schema";
import { GlassShell } from "@/components/glass-shell";
import { GLOSSARY_DATA, GLOSSARY_CATEGORIES } from "@/lib/glossary-data";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import "@/components/glass-library.css";

export const Route = createFileRoute("/founder-glossary/")({
  head: () => ({ meta: [
    { title: "Founder Glossary | BusinessIdea.io" },
    { name: "description", content: "Clear definitions and practical context for founder, finance and startup terms." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...pageImageMeta(PAGE_IMAGES.glossary, absoluteUrl),
  ] }),
  component: FounderGlossaryPage,
});

export function FounderGlossaryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [letter, setLetter] = useState("");
  const letters = useMemo(() => Array.from(new Set(GLOSSARY_DATA.map((term) => term.term[0]?.toUpperCase()).filter((item): item is string => Boolean(item) && /^[A-Z]$/.test(item)))).sort(), []);
  const terms = useMemo(() => GLOSSARY_DATA.filter((term) => {
    const haystack = [term.term, term.definition, term.why_it_matters, term.example_in_practice, term.formula].filter(Boolean).join(" ").toLowerCase();
    return (category === "All" || term.category === category) && (!letter || term.term.toUpperCase().startsWith(letter)) && (!query.trim() || haystack.includes(query.trim().toLowerCase()));
  }), [query, category, letter]);
  const clear = () => { setQuery(""); setCategory("All"); setLetter(""); };
  return <>
    <JsonLd schema={[
      collectionPageSchema({ path: "/founder-glossary", name: "Founder glossary", description: "Plain-language startup and finance terms.", itemCount: GLOSSARY_DATA.length, image: PAGE_IMAGES.glossary.src }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Glossary", path: "/founder-glossary" }]),
    ]} />
    <GlassShell><div className="gl-page">
      <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Glossary</span></nav>
      <V2PageHero className="gl-hero"><div className="gl-hero-copy"><p className="gh-eyebrow">WORDS, WITHOUT THE FOG</p><h1>The founder’s <em>plain-language glossary.</em></h1><p>Look up a term, understand the calculation when one applies, and come back to the decision you are making.</p></div><figure className="gl-image-hero"><img src={PAGE_IMAGES.glossary.src} alt={PAGE_IMAGES.glossary.alt} width={1280} height={549} loading="eager" fetchPriority="high" /><figcaption>{PAGE_IMAGES.glossary.description}</figcaption></figure></V2PageHero>
      <V2PageSection className="gl-index" aria-labelledby="glossary-title"><div className="gl-section-heading"><div><p className="gh-eyebrow">FIND A DEFINITION</p><h2 id="glossary-title">Explore the terms.</h2></div></div><div className="gl-controls"><label className="gl-search"><Search size={19} aria-hidden="true" /><span className="gh-sr-only">Search glossary terms</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a term or definition..." /></label><label className="gl-sort">Topic <select value={category} onChange={(event) => setCategory(event.target.value)}><option value="All">All topics</option>{GLOSSARY_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><div className="gl-letterbar" role="group" aria-label="Filter glossary by initial"><button type="button" aria-pressed={!letter} onClick={() => setLetter("")}>All</button>{letters.map((item) => <button type="button" key={item} aria-pressed={letter === item} onClick={() => setLetter(letter === item ? "" : item)}>{item}</button>)}</div>
      {terms.length ? <div className="gl-glossary-grid">{terms.map((term) => <V2PageCard key={term.slug} id={term.slug} className="gl-glossary-card"><span className="gh-eyebrow">{term.category}</span><h3>{term.term}</h3><p>{term.definition}</p>{(term.why_it_matters || term.example_in_practice || term.formula || term.example_or_formula) && <details><summary>More context</summary>{term.why_it_matters && <p><strong>Why it matters.</strong> {term.why_it_matters}</p>}{term.example_in_practice && <p><strong>Example.</strong> {term.example_in_practice}</p>}{term.formula && <p><strong>Formula.</strong> <code>{term.formula}</code></p>}{term.example_or_formula && !term.formula && <p>{term.example_or_formula}</p>}</details>}{term.related_terms?.length ? <div className="gl-related-terms">{term.related_terms.slice(0, 4).map((related) => <button key={related} type="button" onClick={() => { setQuery(related); setLetter(""); setCategory("All"); }}>{related}</button>)}</div> : null}</V2PageCard>)}</div> : <div className="gl-empty"><h3>No matching term.</h3><p>Try another word or reset the filters.</p><button type="button" onClick={clear}>Reset filters</button></div>}
      </V2PageSection><V2PageAsideCta className="gl-bottom-note"><div><p className="gh-eyebrow">MAKE THE TERMS USEFUL</p><h2>Put a formula to work.</h2><p>Our calculators let you test definitions with your own numbers.</p></div><Link to="/calculator" className="gh-button gh-button-primary">Open calculators <ArrowUpRight size={17} /></Link></V2PageAsideCta>
    </div></GlassShell>
  </>;
}
