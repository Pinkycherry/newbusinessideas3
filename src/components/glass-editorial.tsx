import { Children, createContext, useContext, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";

import { GlassShell } from "@/components/glass-shell";
import { V2PageHero, V2PageSection, V2PageAsideCta } from "@/components/v2/page-sections";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import "@/components/glass-library.css";

type EditorialTone = "brief" | "document" | "notice" | "focus" | "default";
const Tone = createContext<EditorialTone>("default");

export function ContentPage({
  eyebrow, title, highlight, intro, children, tone = "brief",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro: string;
  children: ReactNode;
  tone?: EditorialTone;
  wide?: boolean;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const sections = Children.toArray(children);
  return <>
    <JsonLd schema={[
      webPageSchema({ path: pathname, name: `${title}${highlight ? ` ${highlight}` : ""}`, description: intro }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: eyebrow, path: pathname }]),
    ]} />
    <GlassShell>
      <div className="gl-page gl-editorial">
        <nav className="gl-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>{eyebrow}</span></nav>
        <V2PageHero className="gl-editorial-hero">
          <p className="gh-eyebrow">{eyebrow.toUpperCase()}</p>
          <h1>{title}{highlight && <> <em>{highlight}</em></>}</h1>
          <p>{intro}</p>
        </V2PageHero>
        <Tone.Provider value={tone}><div className="gl-editorial-stack">{sections.map((child, index) => <div className="gl-editorial-unit" key={index}>{child}{((tone === "document" || tone === "notice") ? index === sections.length - 1 : (index === 1 || (index === 4 && sections.length > 6))) && <EditorialNext />}</div>)}</div></Tone.Provider>
      </div>
    </GlassShell>
  </>;
}

function EditorialNext() {
  return <V2PageAsideCta className="gl-editorial-next" aria-label="Explore more at BusinessIdea.io">
    <div><p className="gh-eyebrow">FOLLOW THE NEXT QUESTION</p><h2>Keep your momentum.</h2><p>Choose a real page that helps you turn what you have read into a decision.</p></div>
    <div className="gl-editorial-next-links">
      <Link to="/blueprints"><strong>Read a blueprint</strong><span>Explore published ideas →</span></Link>
      <Link to="/calculator"><strong>Run your numbers</strong><span>Use a live calculator →</span></Link>
      <Link to="/startup-guides"><strong>Learn the method</strong><span>Open startup guides →</span></Link>
      <Link to="/founder-glossary"><strong>Understand a term</strong><span>Browse the glossary →</span></Link>
    </div>
  </V2PageAsideCta>;
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  const tone = useContext(Tone);
  return <V2PageSection className={`gl-editorial-section gl-editorial-${tone}`}>
    <h2>{heading}</h2><div className="gl-editorial-copy">{children}</div>
  </V2PageSection>;
}

export function Bullets({ items }: { items: string[] }) {
  return <ul className="gl-editorial-bullets">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function metaFor(title: string, description: string) {
  return { meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] };
}
