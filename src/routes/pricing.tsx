import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/pricing")({
  head: () =>
    metaFor(
      "Pricing — Free Library & IdeaVault Pro Pass",
      "Browse researched business blueprints free. The Pro Pass unlocks premium entries and live AI audits. Transparent pricing, no hidden tiers.",
    ),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    body: "The open library. Everything published as a free-tier entry, in full.",
    features: [
      "Full free-tier blueprints",
      "Category and subcategory browsing",
      "Keyword search across the library",
      "Trend-ranked ordering",
    ],
    highlighted: false,
  },
  {
    name: "Pro Pass",
    price: "$49",
    cadence: "one-time",
    body: "Unlocks premium entries and the live AI Audit on every Pro idea.",
    features: [
      "Every premium blueprint unlocked",
      "Live AI Audit on Pro ideas",
      "New premium entries as they publish",
      "Priority support",
    ],
    highlighted: true,
  },
];

function PricingPage() {
  return (
    <ContentPage
      eyebrow="Pricing"
      title="Free to browse."
      highlight="Pro to go deeper."
      intro="Most of the library is open. The Pro Pass exists for the premium entries and the live AI audit that runs on them."
      wide
    >
      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass glass-hover flex h-full flex-col rounded-3xl px-6 py-8 ${
              plan.highlighted ? "border-primary/60 shadow-[0_20px_60px_oklch(0.687_0.161_51.5/25%)]" : ""
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              {plan.name}
            </p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {plan.cadence}
              </span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{plan.body}</p>
            <div className="mt-5 flex-1 text-sm text-muted-foreground">
              <Bullets items={plan.features} />
            </div>
            {plan.highlighted ? (
              <div className="mt-7">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground opacity-60"
                >
                  Checkout not live yet
                </button>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Payments are not wired yet, so this button does nothing on purpose rather than
                  pretending to take your money. Pro entries stay locked until checkout is real.
                </p>
              </div>
            ) : (
              <Link
                to="/browse"
                className="sheen mt-7 inline-flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition-all duration-[400ms] ease-glass hover:border-primary"
              >
                Start browsing
              </Link>
            )}
          </div>
        ))}
      </div>
      <Section heading="What happens when checkout goes live">
        <p>
          Pro Pass will be a single payment processed by a PCI-compliant provider. We will never
          store card details ourselves. Refund terms are covered by our{" "}
          <Link to="/refund-policy" className="text-accent underline underline-offset-4">
            refund policy
          </Link>
          .
        </p>
      </Section>
    </ContentPage>
  );
}