import { V2PageAsideCta, V2PageCard, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { GlassShell } from "@/components/glass-shell";
import { PAGE_IMAGES, pageImageMeta } from "@/config/page-imagery";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { absoluteUrl, JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import "@/components/glass-library.css";

export const Route = createFileRoute("/founder-stories/")({
  head: () => ({ meta: [
    { title: "Founder Stories | BusinessIdea.io" },
    { name: "description", content: "Founder case studies are published here when the operator and numbers can be checked." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...pageImageMeta(PAGE_IMAGES.stories, absoluteUrl),
  ] }),
  component: FounderStoriesIndexPage,
});

function FounderStoriesIndexPage() {
  const image = PAGE_IMAGES.stories;
  return <>
    <JsonLd schema={[
      collectionPageSchema({ path: "/founder-stories", name: "Founder stories", description: "Checked founder and operator case studies.", itemCount: CASE_STUDIES.length, image: image.src }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Founder stories", path: "/founder-stories" }]),
    ]} />
    <GlassShell><div className="gl-page">
      <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Founder stories</span></nav>
      <V2PageHero className="gl-hero"><div className="gl-hero-copy"><p className="gh-eyebrow">REAL OPERATOR BREAKDOWNS</p><h1>Stories with <em>the facts behind them.</em></h1><p>We publish founder stories after the operator and numbers have been checked. There are no verified stories ready yet.</p></div><figure className="gl-image-hero"><img src={image.src} alt={image.alt} width={1280} height={549} loading="eager" fetchPriority="high" /><figcaption>{image.description}</figcaption></figure></V2PageHero>
      <V2PageSection className="gl-index" aria-labelledby="stories-title"><div className="gl-section-heading"><div><p className="gh-eyebrow">THE COLLECTION</p><h2 id="stories-title">Founder stories.</h2></div></div>
        {CASE_STUDIES.length ? <div className="gl-resource-grid">{CASE_STUDIES.map((study) => <V2PageCard key={study.slug} className="gl-resource-card"><p className="gh-eyebrow">{study.story_theme}</p><h3>{study.title}</h3><p>{study.solution_and_offer}</p><Link className="gl-resource-foot" to="/founder-stories/$slug" params={{ slug: study.slug }}>Read story <ArrowUpRight size={18} /></Link></V2PageCard>)}</div> : <div className="gl-empty gl-story-empty"><h3>Checked stories are being prepared.</h3><p>Earlier illustrative examples were removed. We will add real operator breakdowns when we can verify the details.</p><Link to="/startup-guides">Read startup guides <ArrowUpRight size={18} /></Link></div>}
      </V2PageSection>
      <V2PageAsideCta className="gl-bottom-note"><div><p className="gh-eyebrow">IN THE MEANTIME</p><h2>Explore a researched idea.</h2><p>The library shows buyers, costs, risks and first steps for published blueprints.</p></div><Link to="/browse" className="gh-button gh-button-primary">Browse ideas <ArrowUpRight size={18} /></Link></V2PageAsideCta>
    </div></GlassShell>
  </>;
}
