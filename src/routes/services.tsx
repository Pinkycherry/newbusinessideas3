import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/services")({
  head: () =>
    metaFor(
      "Services — Idea Research, AI Audits & Custom Blueprints | IdeaVault AI",
      "Idea library access, live AI audits, custom blueprint research and market validation sprints for founders and operators.",
    ),
  component: ServicesPage,
});

const services = [
  {
    name: "Idea library access",
    body: "The full researched catalogue, organised category → subcategory → idea, with trend scoring, pros, cons and founder-fit verdicts. Free entries are open; Pro entries unlock with the Pro Pass.",
    points: ["Live database-backed catalogue", "Keyword search across every field", "Trend-ranked ordering"],
  },
  {
    name: "Live AI audit",
    body: "An on-demand stress test of any Pro idea. The audit is generated at request time from the real record and returns a structured verdict rather than generic advice.",
    points: [
      "Capital intensity and time-to-first-revenue",
      "Moat, distribution difficulty and competitive pressure",
      "The single most likely failure mode",
      "A concrete 30-day first move",
    ],
  },
  {
    name: "Custom blueprint research",
    body: "You bring a market, sector or thesis; we produce an IdeaVault-grade blueprint on it, in the same structure as the library.",
    points: ["Scoped to your market", "Delivered as a full blueprint", "Includes an honest kill-verdict"],
  },
  {
    name: "Validation sprint",
    body: "A short engagement that takes one idea from blueprint to evidence: customer conversations, pricing pressure-tests and a go / no-go recommendation.",
    points: ["Demand-signal testing", "Pricing and willingness-to-pay checks", "Written go / no-go call"],
  },
];

function ServicesPage() {
  return (
    <ContentPage
      eyebrow="Services"
      title="Research you can"
      highlight="actually act on"
      intro="Four ways to work with IdeaVault AI — from self-serve library access to bespoke research on a market you already care about."
      wide
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <div key={service.name} className="glass glass-hover flex h-full flex-col rounded-2xl px-6 py-7">
            <h2 className="font-display text-xl font-bold tracking-tight">{service.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.body}</p>
            <div className="mt-4 text-sm text-muted-foreground">
              <Bullets items={service.points} />
            </div>
          </div>
        ))}
      </div>
      <Section heading="Where to start">
        <p>
          If you are exploring, start with{" "}
          <Link to="/browse" className="text-accent underline underline-offset-4">
            the library
          </Link>
          . If you already know your market, run a{" "}
          <Link to="/search" className="text-accent underline underline-offset-4">
            keyword search
          </Link>{" "}
          first. For custom research or a validation sprint,{" "}
          <Link to="/contact" className="text-accent underline underline-offset-4">
            get in touch
          </Link>
          .
        </p>
      </Section>
    {/* EDITABLE SECTION END */}
      </ContentPage>
  );
}