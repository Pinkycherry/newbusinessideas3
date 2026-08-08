import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/pricing")({
  head: () =>
    metaFor(
      "Pricing | IdeaVault AI",
      "The idea library and free validation handoff to your own Claude or Perplexity account. No per-idea paywall.",
    ),
  component: PricingPage,
});

function PricingPage() {
  return (
    <ContentPage
      eyebrow="Pricing"
      title="The library is free."
      highlight="Validation is free."
      intro="Every idea in the library is fully readable, and validating one costs nothing beyond your own Claude or Perplexity account. We don't sell AI analysis wrapped in a UI — you run it yourself, for free, through a one-click handoff."
      wide
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div className="glass glass-hover flex flex-col rounded-3xl px-6 py-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          Free, in full
        </p>
        <p className="mt-4 text-5xl font-extrabold tracking-tight">$0</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Every blueprint in the library, in full, plus the free validation handoff to Claude or
          Perplexity on every idea page.
        </p>
        <div className="mt-5 flex-1 text-sm text-muted-foreground">
          <Bullets
            items={[
              "Every blueprint, no paywalled entries",
              "Category and subcategory browsing",
              "Keyword search across the library",
              "Trend-ranked ordering",
              "Free validation handoff to your own Claude or Perplexity account",
            ]}
          />
        </div>
        <Link
          to="/browse"
          className="sheen mt-7 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_oklch(0.687_0.161_51.5/40%)] transition-all duration-[400ms] ease-glass hover:scale-[1.02]"
        >
          Start browsing
        </Link>
      </div>
      <Section heading="Why validation is free">
        <p>
          Every tool that charges $20–$70/month for "idea validation" is calling the same public AI
          APIs anyone can access directly. We don't charge for that. You run the analysis yourself,
          on your own AI account, through a one-click handoff — see the idea page for exactly how it
          works.
        </p>
      </Section>
      <Section heading="A small platform fee, coming later">
        <p>
          Curation, search and the structured data layer behind this library take real work to
          maintain. A small platform access fee is planned to cover that — priced low, India-first —
          but nothing is charged today. This page will be updated with real numbers before anything
          changes.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
