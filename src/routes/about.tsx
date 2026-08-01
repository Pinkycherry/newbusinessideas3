import { createFileRoute } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/about")({
  head: () =>
    metaFor(
      "About IdeaVault AI — How We Research Business Ideas",
      "IdeaVault AI turns raw market signal into researched business blueprints with pros, cons, trend scores and honest founder-fit verdicts.",
    ),
  component: AboutPage,
});

function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title="We publish blueprints,"
      highlight="not listicles"
      intro="IdeaVault AI exists because most 'business idea' content is filler. We research each idea until it can survive a real conversation with an operator, then publish the whole thing — including the parts that make it a bad idea for most people."
    >
      <Section heading="What an IdeaVault entry actually contains">
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
          Every idea lives inside a category and a subcategory. Both are read live from our idea
          database, so the navigation, category pages and counts always reflect what is actually
          published — nothing about the taxonomy is hardcoded in the interface.
        </p>
      </Section>
      <Section heading="Where AI fits">
        <p>
          AI is used for structured analysis, not for filling pages. Pro entries include a live AI
          Audit that stress-tests the idea on demand: capital intensity, moat, distribution
          difficulty, the fastest realistic route to first revenue and the failure mode most likely
          to kill it. It runs at request time against the real record — it is not pre-written text.
        </p>
      </Section>
      <Section heading="What we do not do">
        <Bullets
          items={[
            "We do not publish ideas we could not describe to an operator in detail.",
            "We do not present editorial articles as database entries — the blog is a separate system.",
            "We do not promise outcomes. A blueprint is research, not a guarantee.",
          ]}
        />
      </Section>
    </ContentPage>
  );
}