import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/gdpr")({
  head: () =>
    metaFor(
      "GDPR & Your Data Rights | BBI",
      "How to use your GDPR rights with BBI: access, correction, deletion, portability, restriction and objection.",
    ),
  component: GdprPage,
});

function GdprPage() {
  return (
    <ContentPage
      tone="document"
      eyebrow="GDPR"
      title="Your data"
      highlight="rights"
      intro="If you are in the EEA or the UK, the law gives you specific rights over your personal data. Here they are in plain words, and here is exactly how to use them with us."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="The rights you have">
        <Bullets
          items={[
            "Access — ask for a copy of the personal data we hold about you.",
            "Correction — have anything inaccurate put right.",
            "Deletion — have your data removed, unless a law says we have to keep it.",
            "Restriction — put processing on hold while a dispute is sorted out.",
            "Portability — get your data in a format you can take somewhere else.",
            "Objection — object when we are processing on the basis of legitimate interests.",
            "Withdraw consent — whenever you like, wherever consent is what we relied on.",
          ]}
        />
      </Section>
      <Section heading="How to ask">
        <p>
          Write to{" "}
          <a href="mailto:privacy@businessidea.io" className="mo-link font-semibold text-accent">
            privacy@businessidea.io
          </a>{" "}
          and tell us which right you are using and the email address you used with us. We reply
          within 30 days. If the request is complicated we can take one extension, and we will tell
          you why. A reasonable request costs you nothing.
        </p>
      </Section>
      <Section heading="What we rely on to process data">
        <p>
          A contract with you (giving you the service you asked for), legitimate interests (running,
          securing and improving the site), a legal duty (tax and accounting records), and your
          consent (optional emails).
        </p>
      </Section>
      <Section heading="Data that leaves the EEA">
        <p>
          Some of the providers we use operate outside the EEA. Where that happens, the transfer is
          covered by proper safeguards — Standard Contractual Clauses or an adequacy decision.
        </p>
      </Section>
      <Section heading="If we get it wrong">
        <p>
          You can complain to your local supervisory authority. We would rather you gave us the
          chance to fix it first. The{" "}
          <Link to="/privacy" className="mo-link font-semibold text-accent">
            privacy policy
          </Link>{" "}
          sets out what we collect, if you want the context before you write.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
