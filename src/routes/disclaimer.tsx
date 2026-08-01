import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/disclaimer")({
  head: () =>
    metaFor(
      "Disclaimer | IdeaVault AI",
      "IdeaVault AI blueprints, trend scores and AI audits are research and opinion — not financial, legal or professional advice.",
    ),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <ContentPage
      eyebrow="Disclaimer"
      title="Research, not"
      highlight="advice"
      intro="Everything on IdeaVault AI is informational. Starting a business is risky, and nothing here removes that risk or guarantees an outcome."
    >
      <Section heading="No professional advice">
        <p>
          Blueprints, trend scores, verdicts and AI audits do not constitute financial, investment,
          legal, tax, accounting or regulatory advice. Consult qualified professionals in your
          jurisdiction before committing capital or signing anything.
        </p>
      </Section>
      <Section heading="No guarantee of results">
        <p>
          Market conditions change, competitors appear, and execution dominates idea quality. A
          strong trend score is a signal about momentum at the time of research — not a prediction
          of your revenue.
        </p>
      </Section>
      <Section heading="AI-generated content">
        <Bullets
          items={[
            "AI audits are produced by a language model at request time and can contain errors.",
            "Model output may be out of date relative to current market conditions.",
            "Always verify numbers, regulations and competitive claims independently.",
          ]}
        />
      </Section>
      <Section heading="Third-party content and links">
        <p>
          Articles on our blog and links to external sites are provided for context. We do not
          control third-party content and are not responsible for it.
        </p>
      </Section>
      <Section heading="Accuracy and corrections">
        <p>
          We research carefully but do not warrant that every detail is complete or current. If you
          spot something wrong, tell us via the{" "}
          <Link to="/contact" className="text-accent underline underline-offset-4">
            contact page
          </Link>{" "}
          with the idea ID and we will review it.
        </p>
      </Section>
    </ContentPage>
  );
}