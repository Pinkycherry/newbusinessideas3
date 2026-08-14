import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    metaFor(
      "Refund Policy | BBI",
      "BBI does not currently charge for anything, so there is nothing to refund.",
    ),
  component: RefundPage,
});

function RefundPage() {
  return (
    <ContentPage
      eyebrow="Refund policy"
      title="Nothing to"
      highlight="refund — yet"
      intro="The idea library is free to browse and validating an idea is free through your own Claude or Perplexity account. We do not currently charge for anything, so there is nothing to refund."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <Section heading="If that changes">
        <p>
          A small platform access fee is planned for later, priced low and India-first. If and when
          that goes live, this page will be replaced with a real refund window and clear terms
          before anyone is charged — not after.
        </p>
      </Section>
      <Section heading="Questions">
        <p>
          Email{" "}
          <a
            href="mailto:hello@businessidea.io"
            className="text-accent underline underline-offset-4"
          >
            hello@businessidea.io
          </a>
          . See also our{" "}
          <Link to="/terms" className="text-accent underline underline-offset-4">
            terms of service
          </Link>
          .
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
