import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";
import { contactEmail, TEAM } from "@/lib/site-config";

/**
 * One address, four people, and the promises that come with writing to them.
 *
 * This used to be four cards each showing a different address — hello@,
 * research@, privacy@, security@ — none of which was a mailbox anyone read.
 * A contact page listing addresses that bounce is worse than one listing a
 * single address that works.
 */
export const Route = createFileRoute("/contact")({
  head: () =>
    metaFor(
      "Contact BBI — A Person Reads Every Email",
      "One address, answered by people. No chatbot, no automated replies. Free personalised help for students, people with disabilities, widows, single mothers and zero-investment founders.",
    ),
  component: ContactPage,
});

/** What to write about. Not where — there is one address for all of it. */
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
      title="A person reads this."
      highlight="Every single time."
      intro="One address. No chatbot, no ticket number, no automated reply written by a machine. Four people answer this inbox, and one of them built the site you are reading."
    >
      <div className="glass rounded-2xl px-5 py-6 sm:px-7">
        <p className="t-eyebrow">Email us</p>
        <a
          href={`mailto:${contactEmail()}`}
          className="mo-link mt-2 inline-block text-lg font-semibold text-accent sm:text-xl"
        >
          {contactEmail()}
        </a>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Most messages get an answer within two business days.
        </p>
      </div>

      <Section heading="Why there is no chatbot on this page">
        <p>
          BBI started because its founder paid three platforms to validate four business ideas and
          got templated answers back from a model nobody would name. Answering you with a bot would
          make us the thing we built this to get away from.
        </p>
        <p>
          So there is no AI chatbot here, no AI voice agent, and no automated email. Whatever
          arrives in your inbox from us was typed by one of four people. The whole story is on the{" "}
          <Link to="/about" className="mo-link font-semibold text-accent">
            about page
          </Link>
          .
        </p>
      </Section>

      <Section heading="Who is actually on the other end">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-4">
          {TEAM.map((member) => (
            <div key={member.name} className="glass rounded-2xl px-5 py-5">
              <p className="text-base font-semibold text-foreground">{member.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
        <p className="mt-5">
          Prathap answers roughly half of it. Anything that needs the founder reaches the founder.
        </p>
      </Section>

      <Section heading="Say which of these it is">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-4">
          {topics.map((topic) => (
            <div key={topic.label} className="glass glass-hover rounded-2xl px-5 py-6">
              <p className="t-eyebrow">{topic.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{topic.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section heading="If you are in one of these groups, everything is free">
        <p className="rounded-2xl border border-accent/40 bg-accent/5 px-5 py-4 text-base font-semibold leading-relaxed text-foreground">
          Students, people with disabilities, widows, single mothers and founders starting with zero
          investment pay nothing. Not a rupee, not a dollar — including any subscription we ever
          charge, and including personalised guides and workflows built for your situation. Email
          us, say which applies to you, and that is the whole process.
        </p>
        <p className="mt-4">
          You will not be asked for documents or made to prove anything. Telling us is enough.
        </p>
      </Section>

      <Section heading="What the free advice covers, and what it does not">
        <p>
          Write with a real problem and you get a real answer. Where it touches trademarks, business
          registration, workspace questions or raising money, the founder brings in family and
          friends who work in finance and law.
        </p>
        <p>
          <strong className="text-foreground">Not one rupee is charged for any of it.</strong> The
          only thing BBI would ever charge for is a subscription to this website, to keep it
          running. Advice over email is free and always will be.
        </p>
        <p>
          The honest half: nobody here can promise your business will work. You will get the best we
          have, given freely, with no guarantee attached — because there isn&apos;t one, and anyone
          who offers you one is selling something.
        </p>
      </Section>
    </ContentPage>
  );
}
