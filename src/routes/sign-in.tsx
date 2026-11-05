import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { z } from "zod";

import { GlassShell } from "@/components/glass-shell";
import "@/components/glass-library.css";

export const Route = createFileRoute("/sign-in")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Sign In | bbusiness.online" },
    { name: "description", content: "Explore bbusiness.online while account sign-in is being configured." },
    { name: "robots", content: "noindex,follow" },
  ] }),
  component: SignInPage,
});

function SignInPage() {
  return <GlassShell><div className="gl-page gl-sign-page">
    <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Sign in</span></nav>
    <div className="gl-sign-card"><div className="gl-sign-art" aria-hidden="true">✦</div><p className="gh-eyebrow">YOUR ACCOUNT</p><h1>Keep exploring <em>for free.</em></h1><p>Account sign-in is temporarily unavailable on this demo. You can read published ideas, use calculators, and validate a published idea without a site account.</p><Link to="/browse" className="gh-button gh-button-primary">Explore ideas <ArrowUpRight size={17} aria-hidden="true" /></Link><p className="gl-sign-small">Google sign-in will return when its provider is enabled for this deployment.</p></div>
  </div></GlassShell>;
}
