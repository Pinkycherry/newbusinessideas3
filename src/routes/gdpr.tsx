import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/gdpr")({
  head: () =>
    metaFor(
      "GDPR & Your Data Rights | BBI",
      "How to exercise your GDPR rights with BBI: access, rectification, erasure, portability, restriction and objection.",
    ),
  component: GdprPage,
});

function GdprPage() {
  return (
    <ContentPage
      eyebrow="GDPR"
      title="Your data"
      highlight="rights"
      intro="If you are in the EEA or UK, data protection law gives you specific rights over your personal data. This page explains those rights and exactly how to use them with us."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="Your rights">
        <Bullets
          items={[
            "Access — get a copy of the personal data we hold about you.",
            "Rectification — have inaccurate data corrected.",
            "Erasure — have your data deleted where there is no overriding legal reason to keep it.",
            "Restriction — limit how we process your data while a dispute is resolved.",
            "Portability — receive your data in a structured, machine-readable format.",
            "Objection — object to processing based on legitimate interests.",
            "Withdraw consent — at any time, where processing is based on consent.",
          ]}
        />
      </Section>
      <Section heading="How to make a request">
        <p>
          Email{" "}
          <a
            href="mailto:privacy@ideavault.ai"
            className="text-accent underline underline-offset-4"
          >
            privacy@ideavault.ai
          </a>{" "}
          stating which right you are exercising and the email address you used with us. We respond
          within 30 days. If a request is complex we may extend that once and will tell you why.
          There is no fee for a reasonable request.
        </p>
      </Section>
      <Section heading="Legal bases we rely on">
        <p>
          Performance of a contract (delivering the service you asked for), legitimate interests
          (operating, securing and improving the service), legal obligation (tax and accounting
          records) and consent (optional communications).
        </p>
      </Section>
      <Section heading="International transfers">
        <p>
          Some of our processors operate outside the EEA. Where that happens, transfers are covered
          by appropriate safeguards such as Standard Contractual Clauses or an adequacy decision.
        </p>
      </Section>
      <Section heading="Complaints">
        <p>
          If you are unhappy with how we handled your request, you can complain to your local
          supervisory authority. We would appreciate the chance to fix it first — see the{" "}
          <Link to="/privacy" className="text-accent underline underline-offset-4">
            privacy policy
          </Link>{" "}
          for context on what we collect.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
