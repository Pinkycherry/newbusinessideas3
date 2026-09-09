import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/privacy")({
  head: () =>
    metaFor(
      "Privacy Policy | BBI",
      "What data BBI collects, why we collect it, who else touches it and how you exercise your privacy rights.",
    ),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <ContentPage
      tone="document"
      eyebrow="Privacy policy"
      title="Privacy"
      highlight="policy"
      intro="This page is written and kept up to date by BBI. It says what personal data we handle, why we handle it, and what you can do about it. When our practice changes, this page changes with it."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="What we collect">
        <Bullets
          items={[
            "What you send us yourself — your email address, and whatever you write when you contact us.",
            "Ordinary request data such as IP address, browser type and the pages you asked for, used to run the site and keep it secure.",
          ]}
        />
        <p>
          Research you run on an idea does not pass through our servers. That exchange happens
          directly between you and the third party providing it, under their privacy policy, not
          ours.
        </p>
      </Section>
      <Section heading="What we do not do">
        <p>
          We do not sell personal data. We do not run advertising trackers. We do not build
          advertising profiles of the people who visit.
        </p>
      </Section>
      <Section heading="Why we handle it">
        <p>
          To give you the service you asked for, to keep that service secure and working, and to
          meet legal and accounting duties. Where we rely on your consent — optional email updates,
          for example — you can take that consent back whenever you want.
        </p>
      </Section>
      <Section heading="Who else touches it">
        <Bullets
          items={[
            "Hosting and delivery infrastructure that serves the site.",
            "A managed database that stores the idea library.",
            "A content system that serves the blog articles.",
          ]}
        />
        <p>
          They act on our instructions and nothing else. Ask us and we will tell you who they
          currently are.
        </p>
      </Section>
      <Section heading="How long we keep it">
        <p>
          Messages you send stay with us while the enquiry is open and for a reasonable time after
          it closes. Technical logs are short-lived.
        </p>
      </Section>
      <Section heading="Cookies">
        <p>
          Only what the site needs to work and to remember your session. No third-party advertising
          cookies.
        </p>
      </Section>
      <Section heading="Your rights">
        <p>
          You can ask for a copy of your data, ask us to correct it, delete it, limit what we do
          with it, hand it over in a portable form, or object to us processing it at all. The{" "}
          <Link to="/gdpr" className="mo-link font-semibold text-accent">
            GDPR page
          </Link>{" "}
          explains how to do each one, or write straight to{" "}
          <a href="mailto:privacy@businessidea.io" className="mo-link font-semibold text-accent">
            privacy@businessidea.io
          </a>
          .
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
