import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";
import { contactEmail } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () =>
    metaFor(
      "Contact BBI — Research, Support & Partnerships",
      "Reach the BBI team about library access, custom blueprint research, data corrections or partnerships.",
    ),
  component: ContactPage,
});

/**
 * What to write about, not where to write.
 *
 * These were four cards each showing a DIFFERENT address — hello@, research@,
 * privacy@ and security@ — none of which was a mailbox anyone reads. There is
 * one address now, shown once, and these are the topics it covers. Keying the
 * cards on the address would also have collided the moment they shared one.
 */
const topics = [
  {
    label: "General & support",
    note: "Access questions, corrections, anything at all about the library.",
  },
  {
    label: "Custom research",
    note: "Bespoke blueprints and validation sprints. Include the market you care about.",
  },
  {
    label: "Privacy & data requests",
    note: "Access, correction, deletion and other GDPR requests.",
  },
  {
    label: "Security reports",
    note: "Responsible disclosure. Please do not test against live user data.",
  },
];

function ContactPage() {
  return (
    <ContentPage
      tone="brief"
      eyebrow="Contact"
      title="Talk to a"
      highlight="real person"
      intro="One address, read by a person. Say which of the below your message is about and you will get a faster, more useful answer. We reply to most messages within two business days."
    >
      {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
      <div className="glass rounded-2xl px-5 py-6 sm:px-7">
        <p className="t-eyebrow">Email us</p>
        <a
          href={`mailto:${contactEmail()}`}
          className="mo-link mt-2 inline-block text-lg font-semibold text-accent sm:text-xl"
        >
          {contactEmail()}
        </a>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-4">
        {topics.map((t) => (
          <div key={t.label} className="glass glass-hover rounded-2xl px-5 py-6">
            <p className="t-eyebrow">{t.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
          </div>
        ))}
      </div>
      <Section heading="What to include">
        <p>
          For research enquiries: the market or sector, who the customer is, your budget range and
          your timeline. For support: the idea ID or page URL you were on, and what you expected to
          happen. For data corrections: the idea ID and the specific claim you believe is wrong.
        </p>
      </Section>
      {/* EDITABLE SECTION END */}
    </ContentPage>
  );
}
