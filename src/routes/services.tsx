import { useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";
import { useElementPointerGroup, useStaggerReveal } from "@/motion";

export const Route = createFileRoute("/services")({
  head: () =>
    metaFor(
      "Services | BBI – Bro Business Ideas",
      "Idea library access, free idea validation, custom blueprint research and validation sprints. Everything in the library is free after one sign-in — honest research for people who cannot afford to lose money on an idea that was never going to work.",
    ),
  component: ServicesPage,
});

const services = [
  {
    name: "Idea library access",
    body: [
      "The full researched catalogue, organised category → subcategory → idea, with trend scoring, pros, cons and founder-fit verdicts. Every entry is free to browse, in full, after one sign-in.",
      "This is the same library the founder wished existed when he was paying other platforms and receiving templated answers. No credits that run out. No blurred pages. Sign in once and the whole thing opens.",
    ],
    points: [
      "Live database-backed catalogue",
      "Keyword search across every field",
      "Trend-ranked ordering",
    ],
  },
  {
    name: "Free idea validation",
    body: [
      "On every idea page, one tap turns a blueprint into a full validation report — what the market looks like, who buys, and what could kill it. Free, every time, on any idea. No add-on. No extra charge.",
      "Most tools make validation the paid part. We made it the free part because that is the exact moment people lose money they cannot afford to lose. The Validate button stays free forever.",
    ],
    points: [
      "Market analysis and target buyer",
      "Revenue model and key risks",
      "A concrete launch roadmap",
      "Free every time, on any idea",
    ],
  },
  {
    name: "Custom blueprint research",
    body: [
      "You bring a market, sector or thesis. We produce a BBI-grade blueprint on it, in the same structure as the library. Scoped to your market. Delivered as a full blueprint. Includes an honest kill-verdict.",
      "This is handled by the same people named on the About page. Write to us the same way you would write to a person — because a person will read it. No chatbot. No ticket number.",
    ],
    points: [
      "Scoped to your market",
      "Delivered as a full blueprint",
      "Includes an honest kill-verdict",
    ],
  },
  {
    name: "Validation sprint",
    body: [
      "A short engagement that takes one idea from blueprint to evidence: customer conversations, pricing pressure-tests and a go / no-go recommendation.",
      "Again, real humans. The same standard of honesty you see on every free blueprint. Contact us if this is what you need.",
    ],
    points: [
      "Demand-signal testing",
      "Pricing and willingness-to-pay checks",
      "Written go / no-go call",
    ],
  },
];

function ServicesPage() {
  // One grid element, two behaviours: the cards reveal in sequence on entry,
  // and a single delegated pointer listener feeds the cursor sheen on
  // whichever card is under the cursor — four cards, one listener.
  const revealRef = useStaggerReveal<HTMLDivElement>({ direction: "up" });
  const pointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  const gridRef = useCallback(
    (node: HTMLDivElement | null) => {
      revealRef.current = node;
      pointerRef.current = node;
    },
    [revealRef, pointerRef],
  );

  return (
    <ContentPage
      eyebrow="Services"
      title="Research you can"
      highlight="actually act on"
      intro={
        "Four ways to work with BBI — from the free library to bespoke research on a market you already care about.\n" +
        "Everything in the library is free after one sign-in. The same four people named on the About page stand behind every piece of work."
      }
      wide
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div ref={gridRef} className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-5">
        {services.map((service) => (
          <div
            key={service.name}
            className="glass mo-card flex h-full flex-col rounded-2xl px-6 py-7 transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_18px_50px_rgb(0_0_0/0.28)] motion-reduce:transform-none"
          >
            <h2 className="font-display text-xl font-bold tracking-tight">{service.name}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {service.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <Bullets items={service.points} />
            </div>
          </div>
        ))}
      </div>
      <Section heading="Where to start">
        <p>
          If you are still exploring, start with{" "}
          <Link to="/browse" className="mo-link text-accent underline underline-offset-4">
            the library
          </Link>
          . Sign in once. That is the only requirement. The research is already done. The verdicts
          are already written. The only thing left is for you to read them without paying for the
          privilege of finding out an idea will not work.
        </p>
        <p className="mt-5">
          If you already know your market and need something built specifically for it,{" "}
          <Link to="/contact" className="mo-link text-accent underline underline-offset-4">
            write to us
          </Link>
          . The inbox is read by the same four people named on the About and Contact pages. One of
          them built the site you are reading. There is no chatbot between you and them.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
