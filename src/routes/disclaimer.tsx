import { createFileRoute, Link } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/disclaimer")({
  head: () =>
    metaFor(
      "Disclaimer | BBI",
      "BBI blueprints and trend scores are research and opinion — not financial, legal or professional advice.",
    ),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <ContentPage
      tone="notice"
      eyebrow="Disclaimer"
      title="Research, not"
      highlight="advice"
      intro="Everything here is information. Starting a business is risky, and nothing on this site takes that risk away or promises you an outcome."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="This is not professional advice">
        <p>
          Blueprints, trend scores and verdicts are our research and our opinion. They are not
          financial, investment, legal, tax, accounting or regulatory advice. Before you put money
          in, sign anything, or register a business, talk to a qualified professional who knows the
          rules where you plan to operate.
        </p>
      </Section>
      <Section heading="Nobody can promise you results">
        <p>
          Markets move. Competitors turn up. Two people can build the same idea and get opposite
          results, because how you run it matters more than what you picked. A high trend score
          means momentum looked strong when we researched it. It is not a forecast of your revenue.
        </p>
      </Section>
      <Section heading="Research that comes from outside BBI">
        <Bullets
          items={[
            "Research you pull up from an idea page is produced outside BBI. It is not our work, and it can contain mistakes.",
            "It reflects one moment in time, so treat it as possibly out of date the day you read it.",
            "Check the numbers, the rules and the claims about competitors yourself before you act on any of them.",
          ]}
        />
      </Section>
      <Section heading="Links and other people's content">
        <p>
          Our blog links out to other sites for context. We do not control what sits on them and we
          are not responsible for it. Read them the way you should read us — as a starting point,
          not a verdict.
        </p>
      </Section>
      <Section heading="We get things wrong too">
        <p>
          We research carefully. We still do not claim that every detail is complete or current. If
          something looks wrong, tell us on the{" "}
          <Link to="/contact" className="mo-link font-semibold text-accent">
            contact page
          </Link>{" "}
          with the idea ID and we will look at it. Corrections make the library better, so send
          them.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
