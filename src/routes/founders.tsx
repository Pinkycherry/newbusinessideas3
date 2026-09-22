import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage, Section, metaFor } from "@/components/page-layout";
import { JsonLd, personSchema } from "@/lib/schema";
import { FOUNDER_PROFILES, contactEmail } from "@/lib/site-config";

/**
 * The byline's destination.
 *
 * Every blueprint on this site is signed "Researched and signed off by Kartik
 * Ramaswamy", and until now that name went nowhere — 409 pages carrying an
 * author claim with no author page behind it, which is the weaker of the two
 * available signals. This is that page: `personUrl()` in schema.tsx resolves
 * both founders here, and the visible signature on every idea page links to
 * the same anchor the JSON-LD points at.
 *
 * `/about` is untouched and stays the home of the whole story and all four
 * people. This page is narrower on purpose: the two founders, their
 * credentials, and what each of them is actually accountable for. Every
 * sentence rendered here comes from `FOUNDER_PROFILES` in site-config, which
 * is drawn from `/about` and adds nothing to it.
 *
 * Two profiles today, four later. The page maps whatever is in the array.
 */
export const Route = createFileRoute("/founders")({
  head: () =>
    metaFor(
      "Founders | BBI – Bro Business Ideas",
      "Kartik Ramaswamy and Chandini — who researches the blueprints on BBI, who reviews them, and why the whole library is free.",
    ),
  component: FoundersPage,
});

function FoundersPage() {
  return (
    <>
      <JsonLd schema={FOUNDER_PROFILES.map((profile) => personSchema(profile))} />
      <ContentPage
        tone="brief"
        wide
        eyebrow="Founders"
        title="Two people sign off on"
        highlight="every blueprint here."
        intro="Not a company name, not a research team, not a model. One of the two names below is on every idea page on this site, and this is the page that backs it up."
      >
        {FOUNDER_PROFILES.map((profile) => (
          <Section key={profile.slug} heading={profile.name}>
            {/* The anchor sits on an empty span rather than the heading so the
                fragment lands above the card's own top padding instead of
                clipping the name under the sticky header. */}
            <span id={profile.slug} className="block scroll-mt-32" aria-hidden />
            <p className="text-lg font-semibold leading-snug text-foreground">
              {profile.standfirst}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {profile.credential}
            </p>
            <div className="mt-5 space-y-4 text-[1.05rem] leading-[1.75]">
              {profile.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{profile.role}</p>
          </Section>
        ))}

        <Section heading="Who else is behind this">
          <p className="text-[1.05rem] leading-[1.75]">
            Two more people work on BBI — Muthuraj Iyer, who does research and verification and has
            never taken a rupee for it, and Prathap Purohit, who answers roughly half the email that
            reaches us. They are on the{" "}
            <Link
              to="/about"
              className="font-semibold text-primary underline decoration-border underline-offset-4 hover:text-accent"
            >
              About page
            </Link>
            , along with the full story of why this site exists and how an idea actually gets made
            here.
          </p>
          <p className="mt-4 text-[1.05rem] leading-[1.75]">
            If something on a blueprint looks wrong, write to{" "}
            <a href={`mailto:${contactEmail()}`} className="mo-link font-semibold text-accent">
              {contactEmail()}
            </a>{" "}
            and a human reads it. That is the whole process.
          </p>
        </Section>
      </ContentPage>
    </>
  );
}
