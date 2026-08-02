import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/terms")({
  head: () =>
    metaFor(
      "Terms of Service | IdeaVault AI",
      "The terms governing your use of the IdeaVault AI idea library, Pro Pass and AI audit features.",
    ),
  component: TermsPage,
});

function TermsPage() {
  return (
    <ContentPage
      eyebrow="Terms of service"
      title="Terms of"
      highlight="service"
      intro="These terms govern your use of IdeaVault AI. By using the site you accept them. If you do not accept them, please do not use the service."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="1. The service">
        <p>
          IdeaVault AI provides researched business idea blueprints, search and browsing tools, an
          editorial blog and — for premium entries — an AI-generated audit. The service is
          informational. It is not investment, legal, tax or professional advice.
        </p>
      </Section>
      <Section heading="2. Accounts and the Pro Pass">
        <p>
          Some content is marked premium and requires a Pro Pass. Access is personal to you. You may
          not share credentials, resell access, or provide bulk access to third parties. We may
          suspend access where we reasonably believe these terms have been breached.
        </p>
      </Section>
      <Section heading="3. Acceptable use">
        <Bullets
          items={[
            "Do not scrape, mirror or bulk-extract the idea library.",
            "Do not republish blueprints as your own work or resell them.",
            "Do not attempt to bypass access controls on premium entries.",
            "Do not use the service to build a competing idea database.",
            "Do not probe, disrupt or overload the service or its infrastructure.",
          ]}
        />
      </Section>
      <Section heading="4. Intellectual property">
        <p>
          All blueprints, editorial content, scoring, branding and interface design remain the
          property of IdeaVault AI or its licensors. You get a personal, non-exclusive,
          non-transferable licence to read and use the content for your own business planning. The
          business ideas themselves are not proprietary — you are free to build them.
        </p>
      </Section>
      <Section heading="5. AI-generated content">
        <p>
          AI audits are generated at request time by a large language model. They can be incomplete
          or wrong. Treat them as a structured second opinion, never as verified fact. See our{" "}
          <Link to="/disclaimer" className="text-accent underline underline-offset-4">
            disclaimer
          </Link>
          .
        </p>
      </Section>
      <Section heading="6. Availability and changes">
        <p>
          We may change, suspend or remove features, entries or pricing at any time. We aim for
          continuous availability but do not guarantee uninterrupted service.
        </p>
      </Section>
      <Section heading="7. Limitation of liability">
        <p>
          To the maximum extent permitted by law, IdeaVault AI is not liable for lost profits, lost
          business, lost data or any indirect or consequential loss arising from your use of the
          service or decisions made on the basis of its content. Nothing in these terms limits
          liability that cannot lawfully be limited.
        </p>
      </Section>
      <Section heading="8. Termination">
        <p>
          You may stop using the service at any time. We may terminate access for breach of these
          terms. Sections on intellectual property, disclaimers and liability survive termination.
        </p>
      </Section>
      <Section heading="9. Contact">
        <p>
          Questions about these terms:{" "}
          <a href="mailto:hello@ideavault.ai" className="text-accent underline underline-offset-4">
            hello@ideavault.ai
          </a>
          .
        </p>
      </Section>
    {/* EDITABLE SECTION END */}
      </ContentPage>
  );
}