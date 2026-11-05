import { V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { GlassShell } from "@/components/glass-shell";
import "@/components/glass-library.css";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [
    { title: "Pricing | BusinessIdea.io" },
    { name: "description", content: "BusinessIdea.io has two paid plan prices: ₹199 and ₹299. Plan inclusions will be specified before checkout." },
    { property: "og:title", content: "Pricing | BusinessIdea.io" },
    { property: "og:type", content: "website" },
  ] }),
  component: PricingPage,
});

function PricingPage() {
  return <GlassShell><div className="gl-page">
    <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Pricing</span></nav>
    <V2PageHero className="gl-hero"><div className="gl-hero-copy"><p className="gh-eyebrow">PLAN PRICES</p><h1>A clearer next step, <em>at your pace.</em></h1><p>Our paid plan prices are ₹199 and ₹299. We will specify what each includes before checkout. There is no payment button on this page while those details are being finalised.</p></div><div className="gl-hero-art" aria-hidden="true"><span className="gl-art-orbit gl-art-orbit-one" /><span className="gl-art-orbit gl-art-orbit-two" /><span className="gl-art-core">✦</span></div></V2PageHero>
    <V2PageSection className="gl-index" aria-labelledby="available-title"><div className="gl-section-heading"><div><p className="gh-eyebrow">TWO PLAN PRICES</p><h2 id="available-title">Choose after the details are clear.</h2><p>The included features and access terms are pending confirmation.</p></div></div><div className="gl-pricing-grid"><div className="gl-pricing-card"><span className="gl-path-index">PLAN ONE</span><h3>₹199</h3><p>Exact plan details will be published here before purchase.</p><Link to="/browse" className="gh-button gh-button-primary">Browse ideas <ArrowUpRight size={17} /></Link></div><div className="gl-pricing-card"><span className="gl-path-index">PLAN TWO</span><h3>₹299</h3><p>Exact plan details will be published here before purchase.</p><Link to="/startup-guides" className="gh-button gh-button-secondary">Read guides <ArrowUpRight size={17} /></Link></div></div></V2PageSection>
  </div></GlassShell>;
}
