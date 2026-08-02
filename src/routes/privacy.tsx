import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/privacy")({
  head: () =>
    metaFor(
      "Privacy Policy | IdeaVault AI",
      "What data IdeaVault AI collects, why we collect it, who processes it and how you exercise your privacy rights.",
    ),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy policy"
      title="Privacy"
      highlight="policy"
      intro="This page is maintained by IdeaVault AI and describes how we handle personal data. It reflects current practice and is updated when that practice changes."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="What we collect">
        <Bullets
          items={[
            "Information you send us directly, such as your email address and message content when you contact us.",
            "Purchase information when Pro Pass checkout is live — handled by our payment provider, not stored by us.",
            "Technical request data such as IP address, browser type and pages requested, used to operate and secure the service.",
            "Text you submit to an AI audit request, which is sent to our AI provider to generate the response.",
          ]}
        />
      </Section>
      <Section heading="What we do not collect">
        <p>
          We do not sell personal data, we do not run advertising trackers, and we do not build
          advertising profiles of visitors.
        </p>
      </Section>
      <Section heading="Why we process it">
        <p>
          To deliver the service you requested (contract), to keep the service secure and working
          (legitimate interests), and to comply with legal and accounting obligations. Where we rely
          on consent — for example optional email updates — you can withdraw it at any time.
        </p>
      </Section>
      <Section heading="Processors we rely on">
        <Bullets
          items={[
            "Hosting and application delivery infrastructure.",
            "A managed database provider that stores the idea library.",
            "An AI model provider that generates AI audit responses at request time.",
            "A content management system that serves blog articles.",
            "A payment provider, once Pro Pass checkout is live.",
          ]}
        />
        <p>
          These providers process data on our instructions only. We can supply the current
          provider list on request.
        </p>
      </Section>
      <Section heading="Retention">
        <p>
          Contact correspondence is retained while the enquiry is open and for a reasonable period
          afterwards. Technical logs are short-lived. Purchase records are retained as long as tax
          and accounting law requires.
        </p>
      </Section>
      <Section heading="Cookies">
        <p>
          We use only the cookies and local storage required to operate the site and remember your
          session. We do not use third-party advertising cookies.
        </p>
      </Section>
      <Section heading="Your rights">
        <p>
          You can request access, correction, deletion, restriction, portability, or object to
          processing. See the{" "}
          <Link to="/gdpr" className="text-accent underline underline-offset-4">
            GDPR page
          </Link>{" "}
          for how to exercise these rights, or email{" "}
          <a href="mailto:privacy@ideavault.ai" className="text-accent underline underline-offset-4">
            privacy@ideavault.ai
          </a>
          .
        </p>
      </Section>
    {/* EDITABLE SECTION END */}
      </ContentPage>
  );
}