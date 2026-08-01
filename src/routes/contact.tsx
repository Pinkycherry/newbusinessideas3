import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";

export const Route = createFileRoute("/contact")({
  head: () =>
    metaFor(
      "Contact IdeaVault AI — Research, Support & Partnerships",
      "Reach the IdeaVault AI team about library access, Pro Pass support, custom blueprint research, data corrections or partnerships.",
    ),
  component: ContactPage,
});

const channels = [
  {
    label: "General & support",
    value: "hello@ideavault.ai",
    note: "Access questions, Pro Pass issues, anything about the library.",
  },
  {
    label: "Custom research",
    value: "research@ideavault.ai",
    note: "Bespoke blueprints and validation sprints. Include the market you care about.",
  },
  {
    label: "Privacy & data requests",
    value: "privacy@ideavault.ai",
    note: "Access, correction, deletion and other GDPR requests.",
  },
  {
    label: "Security reports",
    value: "security@ideavault.ai",
    note: "Responsible disclosure. Please do not test against live user data.",
  },
];

function ContactPage() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="Talk to a"
      highlight="real person"
      intro="Pick the right channel and you will get a faster, more useful answer. We reply to most messages within two business days."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {channels.map((c) => (
          <div key={c.value} className="glass glass-hover rounded-2xl px-5 py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              {c.label}
            </p>
            <a
              href={`mailto:${c.value}`}
              className="mt-2 block text-base font-semibold underline underline-offset-4 transition-colors hover:text-primary"
            >
              {c.value}
            </a>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
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
    </ContentPage>
  );
}