import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";
import { contactEmail } from "@/lib/site-config";

export const Route = createFileRoute("/cookie-policy")({
  head: () =>
    metaFor(
      "Cookie Policy | BBI – Bro Business Ideas",
      "Which cookies and browser storage BBI uses today, and what changes if we show Google ads.",
    ),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <ContentPage
      tone="document"
      eyebrow="Cookie policy"
      title="Cookie"
      highlight="policy"
      intro="This page says what the site stores in your browser today, and what would change if we start showing Google ads. It is kept in step with what the site actually does."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="What the site stores today">
        <Bullets
          items={[
            "What it needs to work: your sign-in session if you sign in with Google, and small preferences such as a saved shortlist, kept in your browser's storage.",
            "Ordinary request data such as IP address and browser type, used to run the site and keep it secure.",
          ]}
        />
        <p>
          Today there are no advertising cookies on this site and no analytics cookies. If that
          changes, this page changes first.
        </p>
      </Section>
      <Section heading="If we show Google ads">
        <p>
          We plan to apply for Google AdSense. Ads are not live yet. If they go live, Google and its
          advertising partners will use cookies, including to show ads based on what you have
          previously visited on this and other sites. You will be able to see and control this
          through Google&apos;s own settings, and we will add the consent choices the law in your
          region requires before any advertising cookie is set.
        </p>
        <p>
          You can manage personalised advertising at{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mo-link font-semibold text-accent"
          >
            Google Ads Settings
          </a>
          , and learn how Google uses information from sites that use its services at{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="mo-link font-semibold text-accent"
          >
            policies.google.com
          </a>
          .
        </p>
      </Section>
      <Section heading="Controlling cookies in your browser">
        <p>
          Every major browser lets you block or delete cookies. Blocking the ones the site needs to
          work may sign you out or stop a saved shortlist from being remembered.
        </p>
      </Section>
      <Section heading="Questions">
        <p>
          Write to{" "}
          <a href={`mailto:${contactEmail()}`} className="mo-link font-semibold text-accent">
            {contactEmail()}
          </a>
          . The{" "}
          <Link to="/privacy" className="mo-link font-semibold text-accent">
            privacy policy
          </Link>{" "}
          covers the rest of what we handle.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
