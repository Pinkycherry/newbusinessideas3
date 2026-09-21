import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";
import { useStaggerReveal } from "@/motion";

export const Route = createFileRoute("/pricing")({
  head: () =>
    metaFor(
      "Pricing — ₹0 | BBI – Bro Business Ideas",
      "Everything on BBI is free. Two plans, both ₹0. Sign in once and every blueprint, the Validate button and every future update stay open. No card, no renewal, no expiry.",
    ),
  component: PricingPage,
});

/**
 * Both plans are ₹0, and that is the whole page.
 *
 * This replaced a ₹199 / ₹399 pair whose only call to action was a disabled
 * button reading "Checkout not live yet". A price you cannot pay is worse than
 * no price: it tells a reader the site is a prototype at the exact moment they
 * had decided to trust it. The founder's decision is that the site is free, so
 * the prices are gone rather than hidden, and the button now does the one thing
 * the site actually asks for.
 */
const plans = [
  {
    name: "1 month",
    price: "₹0",
    cadence: "one-time sign-in",
    body: "Full access for 30 days — every blueprint and the Validate button, unlocked. No card. No trial ending. Just sign in.",
    highlighted: false,
  },
  {
    name: "Lifetime",
    price: "₹0",
    cadence: "one-time sign-in, forever",
    body: "Pay nothing. Every blueprint, the Validate button, and every future update — no renewal, ever. Sign in once. It stays yours.",
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
      highlight="Both are zero."
      intro="The founder paid three platforms and lost money he could afford to lose. Most people reading this cannot. So BBI is free. Sign in once. Everything stays open."
      wide
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div ref={plansRef} className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-5">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass mo-card flex h-full flex-col rounded-3xl px-6 py-8 ${
              plan.highlighted
                ? "border-primary/60 shadow-[0_20px_60px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
                : ""
            }`}
          >
            <p className="t-eyebrow">{plan.name}</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {plan.cadence}
              </span>
            </p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{plan.body}</p>
            {/* A real control, at last. The button this replaced was disabled
                and said so, because checkout did not exist. Sign-in does
                exist, it is the only gate left, and it is what this page is
                asking for — so the call to action goes there. */}
            <Link to="/sign-in" className="ac-cta mt-7 block w-full px-6 py-3 text-center text-sm">
              Sign in free
            </Link>
          </div>
        ))}
      </div>
      <Section heading="Why everything is free">
        <p>
          Validation is the part most tools charge a monthly fee for. We do not charge for it at
          all.
        </p>
        <p className="mt-4">
          The founder decided this after watching people in his WhatsApp groups lose money they
          could not get back. ₹0 is not a launch offer. It is the rule.
        </p>
        <p className="mt-4">
          Sign in with Google (or email). That is the only step. The library, the research, the
          honest kill-verdicts — all of it stays free because the people this was built for start
          from zero.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
