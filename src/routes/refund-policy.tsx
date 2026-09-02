import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    metaFor(
      "Refund Policy | BBI",
      "BBI does not charge for anything right now, so there is nothing to refund.",
    ),
  component: RefundPage,
});

function RefundPage() {
  return (
    <ContentPage
      tone="notice"
      eyebrow="Refund policy"
      title="Nothing to"
      highlight="refund — yet"
      intro="Browsing the library is free, and validating an idea costs you nothing extra. We do not charge for anything right now, so there is nothing to refund."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="When that changes">
        <p>
          A small platform access fee is planned for later — priced low, and built for India first.
          If it goes live, this page gets replaced with a real refund window and clear terms before
          anyone is charged. Before, not after.
        </p>
      </Section>
      <Section heading="Questions">
        <p>
          Write to{" "}
          <a href="mailto:hello@businessidea.io" className="mo-link font-semibold text-accent">
            hello@businessidea.io
          </a>{" "}
          and ask. Our{" "}
          <Link to="/terms" className="mo-link font-semibold text-accent">
            terms of service
          </Link>{" "}
          cover the rest.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
