import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/terms")({
  head: () =>
    metaFor(
      "Terms of Service | BBI",
      "The terms that govern your use of the BBI idea library, in plain language.",
    ),
  component: TermsPage,
});

function TermsPage() {
  return (
    <ContentPage
      tone="document"
      eyebrow="Terms of service"
      title="Terms of"
      highlight="service"
      intro="These terms cover how you use BBI. Using the site means you accept them. If any of it does not sit right with you, please do not use the service."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="What this service is">
        <p>
          BBI publishes researched business idea blueprints, with search and browsing tools and an
          editorial blog. It is information. It is not investment, legal, tax or professional
          advice, and reading it does not put us in a professional relationship with you.
        </p>
      </Section>
      <Section heading="Your access">
        <p>
          The library is free to browse. Where an account exists, it is yours alone — do not share
          your login, resell access, or hand bulk access to anyone else. If we have good reason to
          believe these terms are being broken, we can suspend access.
        </p>
      </Section>
      <Section heading="What you must not do">
        <Bullets
          items={[
            "Do not scrape, mirror or bulk-download the idea library.",
            "Do not republish blueprints as your own work, and do not resell them.",
            "Do not use what you find here to build a competing idea database.",
            "Do not probe, disrupt or overload the site or the systems behind it.",
          ]}
        />
      </Section>
      <Section heading="Who owns what">
        <p>
          The blueprints, the writing, the scoring, the brand and the interface belong to BBI or to
          the people who licensed them to us. You get a personal, non-transferable licence to read
          them and use them for your own planning. The business ideas themselves are not ours to own
          — go and build one.
        </p>
      </Section>
      <Section heading="Research produced outside BBI">
        <p>
          Some of the research you can pull up from an idea page is produced by a third party, not
          by us. We do not write it, store it or check it, and it is governed by that third
          party&apos;s own terms rather than ours. Treat it as a second opinion you still have to
          test, never as verified fact. Our{" "}
          <Link to="/disclaimer" className="mo-link font-semibold text-accent">
            disclaimer
          </Link>{" "}
          says the same thing in more detail.
        </p>
      </Section>
      <Section heading="Changes and uptime">
        <p>
          We can change, pause or remove features, entries and pricing at any time. We aim to keep
          the site up and working. We cannot promise it never goes down.
        </p>
      </Section>
      <Section heading="Limits on our liability">
        <p>
          As far as the law allows, BBI is not liable for lost profits, lost business, lost data, or
          any indirect or knock-on loss that follows from using this site or from decisions you make
          based on what you read here. Nothing in these terms limits liability that cannot lawfully
          be limited.
        </p>
      </Section>
      <Section heading="Ending it">
        <p>
          You can stop using the service whenever you like. We can end your access if these terms
          are broken. The parts about ownership, disclaimers and liability keep applying afterwards.
        </p>
      </Section>
      <Section heading="Questions">
        <p>
          Anything about these terms, write to{" "}
          <a href="mailto:hello@businessidea.io" className="mo-link font-semibold text-accent">
            hello@businessidea.io
          </a>
          .
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
