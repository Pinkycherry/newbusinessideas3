import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/pricing")({
  head: () =>
    metaFor(
      "Pricing | BBI",
      "₹199 for 3 months or ₹399 for lifetime access. Validation itself is always free, on your own Claude or Perplexity account.",
    ),
  component: PricingPage,
});

const plans = [
  {
    name: "3 months",
    price: "₹199",
    cadence: "one-time",
    body: "Full access for 90 days — every blueprint and the Validate button, unlocked.",
    highlighted: false,
  },
  {
    name: "Lifetime",
    price: "₹399",
    cadence: "one-time, forever",
    body: "Pay once. Every blueprint, the Validate button, and every future update — no renewal, ever.",
    highlighted: true,
  },
];

function PricingPage() {
  return (
    <ContentPage
      eyebrow="Pricing"
      title="Two prices."
      highlight="No subscription."
      intro="Browsing is free, no account needed. Sign in with Google (free) to read full blueprints. ₹199 or ₹399 unlocks the Validate button — the AI part stays free forever, on your own Claude or Perplexity account."
      wide
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass glass-hover flex h-full flex-col rounded-3xl px-6 py-8 ${
              plan.highlighted
                ? "border-primary/60 shadow-[0_20px_60px_oklch(0.687_0.161_51.5/25%)]"
                : ""
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
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{plan.body}</p>
            <button
              type="button"
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground opacity-60"
            >
              Checkout not live yet
            </button>
          </div>
        ))}
      </div>
      <Section heading="Why validation is free">
        <p>
          Every tool that charges $20–$100/month for "idea validation" is calling the same public AI
          APIs anyone can access directly. We don't charge for that — you run it yourself, on your
          own account, through the Validate button on every idea page. The ₹199/₹399 fee is for our
          time building and maintaining the library, not for AI access.
        </p>
      </Section>
      <Section heading="Checkout status">
        <p>
          Payment processing isn't wired up yet, so this button does nothing on purpose rather than
          pretending to take your money. This page will be updated the moment checkout is real — see
          our{" "}
          <Link to="/refund-policy" className="text-accent underline underline-offset-4">
            refund policy
          </Link>{" "}
          for what happens once it is.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
