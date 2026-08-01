import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    metaFor(
      "Refund Policy | IdeaVault AI",
      "The IdeaVault AI Pro Pass refund window, what qualifies, what does not, and how to request a refund.",
    ),
  component: RefundPage,
});

function RefundPage() {
  return (
    <ContentPage
      eyebrow="Refund policy"
      title="Refund"
      highlight="policy"
      intro="This policy applies to the IdeaVault Pro Pass. Checkout is not live yet, so nothing has been charged to anyone — these are the terms that will apply the moment it is."
    >
      <Section heading="14-day window">
        <p>
          You can request a full refund within 14 days of purchase if the Pro Pass did not deliver
          what this site described. Email us with your purchase email and one line on what went
          wrong. Approved refunds are returned to the original payment method within 5–10 business
          days, depending on your bank.
        </p>
      </Section>
      <Section heading="What qualifies">
        <Bullets
          items={[
            "Premium entries did not unlock after payment.",
            "The AI audit feature was unavailable for your purchased access.",
            "You were charged twice for the same pass.",
            "The product materially differed from what was described at checkout.",
          ]}
        />
      </Section>
      <Section heading="What does not qualify">
        <Bullets
          items={[
            "You read the premium blueprints and then changed your mind.",
            "A business idea did not work out for you — blueprints are research, not outcomes.",
            "You disagree with an AI audit's conclusion.",
            "Requests made after the 14-day window has closed.",
            "Accounts suspended for breaching the terms of service.",
          ]}
        />
      </Section>
      <Section heading="How to request">
        <p>
          Email{" "}
          <a href="mailto:hello@ideavault.ai" className="text-accent underline underline-offset-4">
            hello@ideavault.ai
          </a>{" "}
          with the subject "Refund request" and your purchase email. We acknowledge within two
          business days. Statutory consumer rights in your jurisdiction always apply on top of this
          policy. See also our{" "}
          <Link to="/terms" className="text-accent underline underline-offset-4">
            terms of service
          </Link>
          .
        </p>
      </Section>
    </ContentPage>
  );
}