import { createFileRoute } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/about")({
  head: () =>
    metaFor(
      "About BBI — How We Research Business Ideas",
      "BBI turns raw market signal into researched business blueprints with pros, cons, trend scores and honest founder-fit verdicts.",
    ),
  component: AboutPage,
});

function AboutPage() {
  return (
    <ContentPage
      tone="brief"
      eyebrow="About"
      title="We publish blueprints,"
      highlight="not listicles"
      intro="BBI exists because most 'business idea' content is filler. We research each idea until it can survive a real conversation with an operator, then publish the whole thing — including the parts that make it a bad idea for most people."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="What a BBI entry actually contains">
        <Bullets
          items={[
            "A concrete business description: who the customer is and what they are paying for.",
            "A market breakdown covering demand drivers, competitive density and timing.",
            "Pros and cons written as operator constraints, not marketing copy.",
            "A trend score used to rank momentum across the library.",
            "A founder-fit verdict that says plainly who should and should not build it.",
          ]}
        />
      </Section>
      <Section heading="How ideas are organised">
        <p>
          Every idea lives inside a category and a subcategory, and both stay current on their own —
          navigation, category pages and counts always match what is actually published. Nothing
          here goes stale.
        </p>
      </Section>
      <Section heading="Where AI fits">
        <p>
          We don&apos;t charge for AI analysis. Every blueprint has a Validate button that gets you
          real research — market sizing, target buyer, revenue model, risks and a launch roadmap,
          built from that idea&apos;s real record — free, using AI tools you already pay for.
        </p>
      </Section>
      <Section heading="What we do not do">
        <Bullets
          items={[
            "We do not publish ideas we could not describe to an operator in detail.",
            "We do not present editorial articles as database entries — the blog and the idea library are kept apart, on purpose.",
            "We do not promise outcomes. A blueprint is research, not a guarantee.",
          ]}
        />
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
