import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";
import { useStaggerReveal } from "@/motion";

export const Route = createFileRoute("/pricing")({
  head: () =>
    metaFor(
      "Pricing | BBI",
      "₹199 for 3 months or ₹399 for lifetime access. Validation itself is always free, on every idea, every time.",
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
  // Split stage: the two plans arrive in sequence rather than landing as one
  // block, so the comparison reads left to right instead of all at once.
  const plansRef = useStaggerReveal<HTMLDivElement>({ direction: "up" });

  return (
    <ContentPage
      eyebrow="Pricing"
      title="Two prices."
      highlight="No subscription."
      intro="Browsing is free, no account needed. Sign in with Google (free) to read full blueprints. ₹199 or ₹399 unlocks the Validate button — validation itself stays free, forever."
      wide
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div ref={plansRef} className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass mo-card flex h-full flex-col rounded-3xl px-6 py-8 ${
              plan.highlighted
                ? "border-primary/60 shadow-[0_20px_60px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
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
            {/* Deliberately inert, and deliberately un-animated. Checkout does
                not exist yet, so this button gets no magnet, no hover travel
                and no urgency treatment — motion here would promise a
                transaction the page cannot complete. The magnet belongs on
                this button (the primary plan's CTA) the day it can take
                money, and not one day earlier. */}
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
          Validation is the part most tools bill a monthly fee for. We don&apos;t charge for it at
          all. Tap Validate on any idea, free, every single time. ₹199 or ₹399 pays for something
          else entirely: our time building and keeping this library alive.
        </p>
      </Section>
      <Section heading="Checkout status">
        <p>
          Payment processing isn&apos;t wired up yet, so this button does nothing on purpose rather
          than pretending to take your money. This page will be updated the moment checkout is real
          — see our{" "}
          <Link to="/refund-policy" className="mo-link text-accent underline underline-offset-4">
            refund policy
          </Link>{" "}
          for what happens once it is.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
