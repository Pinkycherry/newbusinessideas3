import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";
import { useStaggerReveal } from "@/motion";

export const Route = createFileRoute("/pricing")({
  head: () =>
    metaFor(
      "Pricing | BBI – Bro Business Ideas",
      "Two prices, both zero. Every blueprint and the Validate button are free after one sign-in — honest research written for people who cannot afford to lose money on an idea that was never going to work.",
    ),
  component: PricingPage,
});

/**
 * Both plans are ₹0, and that is the whole page.
 *
 * This replaced a ₹199 / ₹399 pair whose only call to action was a disabled
 * button reading "Checkout not live yet". A price a reader cannot pay is worse
 * than no price: it says prototype at the exact moment they had decided to
 * trust the site. The founder's decision is that the site is free, so the
 * prices are gone rather than hidden, and the button now does the one thing the
 * site actually asks for.
 */
const plans = [
  {
    name: "1 month",
    price: "₹0",
    cadence: "one-time sign-in",
    body: [
      "Full access for 30 days — every blueprint and the Validate button, unlocked.",
      "No card asked. No trial that quietly ends. No surprise charge on day 31.",
      "Just sign in. The library opens. That is the whole process.",
    ],
    highlighted: false,
  },
  {
    name: "Lifetime",
    price: "₹0",
    cadence: "one-time sign-in, forever",
    body: [
      "Pay nothing. Every blueprint, the Validate button, and every future update — no renewal, ever.",
      "Sign in once. It stays yours.",
      "The same access a person with money would get. The same research. The same honest verdicts. Only the price is different — because the people this was built for start from zero.",
    ],
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
      intro={
        "The founder paid three platforms and lost money he could afford to lose.\n" +
        "Most people reading this cannot.\n" +
        "So BBI is free.\n" +
        "Sign in once. Everything stays open."
      }
      wide
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div ref={plansRef} className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-5">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass mo-card flex h-full flex-col rounded-3xl px-6 py-8 transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_18px_50px_rgb(0_0_0/0.28)] motion-reduce:transform-none ${
              plan.highlighted
                ? "border-primary/60 shadow-[0_20px_60px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
                : ""
            }`}
          >
            <p className="t-eyebrow">{plan.name}</p>
            {/* ₹0 is the largest thing in the card on purpose. It is the
                entire argument the page is making. */}
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-6xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {plan.cadence}
              </span>
            </p>
            <div className="mt-4 flex-1 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {plan.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {/* A real control, at last. The button this replaced was disabled
                and said so, because checkout did not exist. Sign-in does
                exist, it is the only gate left, and it is what this page is
                asking for — so the call to action goes there. */}
            <Link
              to="/sign-in"
              className="ac-cta mt-7 block w-full px-6 py-3 text-center text-sm transition-[transform,filter] duration-[250ms] ease-out hover:scale-[1.02] hover:brightness-110 motion-reduce:transform-none"
            >
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
        <p className="mt-5">
          The founder of BBI paid three different platforms to validate four business ideas. He
          wrote careful prompts. He paid in dollars and euros and rupees. What came back was generic
          — the kind of answer that could fit any business in any market. The credits were spent the
          moment he pressed the button. A wrong answer cost exactly as much as a right one. One
          platform had no refund policy. Another offered half the money back after several emails.
          The promotional messages kept arriving.
        </p>
        <p className="mt-5">
          He could absorb the loss. He had a corporate salary in Delhi. Most people cannot.
        </p>
        <p className="mt-5">
          The people in the WhatsApp groups he and Chandini run — side hustlers, people in corporate
          jobs trying to build a second income, small shop owners, people with an idea and no
          capital at all — told the same story. They had paid. They had been disappointed. Nobody
          had been refunded. The only difference was how much each of them could afford to lose.
        </p>
        <p className="mt-5">That was the moment the rule was set.</p>
        <p className="mt-5">
          Someone starting from zero — no capital, no team, no laptop, reading this on a phone at
          one in the morning — should get the whole thing. Not a preview. Not three free credits.
          The research, the numbers, the risks, and the verdict that says do not build this one.
        </p>
        <p className="mt-5">
          So ₹0 is not a launch offer. It is not a limited-time discount. It is the rule.
        </p>
        <p className="mt-5">
          Sign in with Google or with email. That is the only step. The library opens. The Validate
          button works. Every future blueprint we publish stays open to the same account. No
          renewal. No expiry. No sudden paywall.
        </p>
        <p className="mt-5">
          We will never charge for the core library because the people this was built for start from
          zero. The only thing we will ever ask is that you sign in once so we know a real person is
          reading the work.
        </p>
        <p className="mt-5 whitespace-pre-line">
          {
            "That is the whole pricing page.\nTwo prices. Both are zero.\nSign in once. Everything stays open."
          }
        </p>
      </Section>
      <p className="mt-10 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Payment processing is not needed. There is nothing to pay.
      </p>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
