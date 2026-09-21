import { createFileRoute } from "@tanstack/react-router";

import { Bullets, ContentPage, Section, metaFor } from "@/components/page-layout";
import { JsonLd, personSchema } from "@/lib/schema";
import { COMMUNITY, communityMembers, contactEmail, TEAM } from "@/lib/site-config";

/**
 * The who, how and why.
 *
 * Google's guidance on AI-assisted content asks for exactly three things:
 * who made this, how it was made, and why. This page is the only place on the
 * site that answers all three, which is why every `author` reference in
 * schema.tsx resolves here — a name with no page behind it is a weaker signal
 * than no name at all.
 *
 * Every figure on this page is one the founder paid himself. No competitor is
 * named: the point of the story is what the experience cost, not who to
 * blame for it.
 */
export const Route = createFileRoute("/about")({
  head: () =>
    metaFor(
      "About | BBI – Bro Business Ideas",
      "BBI is a free library of researched business blueprints, built by four engineers from Madurai after paying three platforms to validate four ideas and getting templated answers back.",
    ),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      {/* The credentials are printed further down this page for a reader.
          This is the same two facts in the form a search engine can read —
          nothing written here that is not already written below. */}
      <JsonLd schema={TEAM.map((member) => personSchema(member))} />
      <ContentPage
        tone="brief"
        eyebrow="About"
        title="He could afford to lose the money."
        highlight="Most people can't."
        intro="BBI exists because its founder paid three platforms to validate four business ideas, got templated answers back, and could not get a rupee of it returned. He had the money to waste. The people he built this for do not."
      >
        <Section heading="The first twenty dollars">
          <p>
            Kartik Ramaswamy is an engineer. He works a corporate job in Delhi, he is from Tamil
            Nadu, and like a few million other people he has spent years quietly wanting to start
            something of his own.
          </p>
          <p>
            So he did what you are supposed to do. He found a platform that promised to validate a
            business idea, and he paid for it — twenty dollars, plus tax, up front. He did not go in
            careless. He wrote his prompts properly, in detail, the way you would brief a person who
            was actually going to do the work.
          </p>
          <p>
            Four ideas later, the credits were gone. What came back was generic — the kind of answer
            that would fit any business in any market, assembled somewhere behind the interface by a
            model nobody would name.
          </p>
        </Section>

        <Section heading="Then he did it again. Twice.">
          <p>
            He assumed the problem was the platform, not the pattern. So he tried another one, at
            twenty euros plus tax. Then a third, at five to nine dollars with add-on credits.
          </p>
          <p>
            Same shape of answer every time. You type your idea, it gets folded into a prompt
            already written by somebody else, and whatever comes back is what you get. Sometimes it
            was accurate. Often it was thin. Occasionally it answered a question about a completely
            different business.
          </p>
          <p>
            And whichever it was, the credits were spent the moment you pressed the button. A wrong
            answer cost exactly as much as a right one.
          </p>
        </Section>

        <Section heading="The refund policy was the part that stung">
          <p>
            One platform had no refund policy at all. Another had one, technically — several emails
            in, the offer was half the money back. Meanwhile the promotional emails kept arriving,
            templated, from a list that was not easy to leave.
          </p>
          <p>
            That was the moment. Not the money, which he could absorb. The realisation underneath
            it:{" "}
            <strong className="text-foreground">
              if this is what it costs someone with a salary to find out an answer is useless, what
              happens to someone with nothing to spend in the first place?
            </strong>
          </p>
        </Section>

        <Section heading="It turned out not to be just him">
          <p>
            Kartik and Chandini — his co-founder, who he met doing an MBA at the same campus — run
            two WhatsApp communities between them. Side hustlers. People in corporate jobs trying to
            build a second income. Small shop owners. A lot of people with an idea and no capital at
            all.
          </p>
          <p className="glass rounded-2xl px-5 py-4 text-base leading-relaxed">
            <strong className="text-foreground">
              {communityMembers()} members across {COMMUNITY.groups} communities
            </strong>
            <span className="text-muted-foreground">
              {" "}
              — counted on {COMMUNITY.countedOnLabel}. The date is published because a membership
              count is true on the day it is taken and stale the day after, and a number without a
              date is just a claim.
            </span>
          </p>
          <p>
            When they started asking, the same story came back from all directions. People had paid.
            People had been disappointed. Nobody had been refunded. The only difference was how much
            each of them could afford to lose.
          </p>
        </Section>

        <Section heading="So they built the thing they had been looking for">
          <p>
            They bought a domain the same week, while they were still annoyed. They imagined
            something useful. They argued it into something meaningful. They built it into something
            scalable — and it is live, which is the only part of that sentence that counts.
          </p>
          <p>
            The rule they set on day one has not moved since: someone starting from zero — no
            capital, no team, no laptop, reading this on a phone at one in the morning — should get
            the whole thing. Not a preview. Not three free credits. The research, the numbers, the
            risks, and the verdict that says do not build this one.
          </p>
        </Section>

        <Section heading="Who actually makes this">
          <p>
            Four people, three of whom passed out of Anna University Regional Campus, Madurai in
            2012, and one who is rather newer.
          </p>
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-4">
            {TEAM.map((member) => (
              <div key={member.name} className="glass rounded-2xl px-5 py-5">
                <p className="text-base font-semibold text-foreground">{member.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {member.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
                  {member.credential}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5">
            <strong className="text-foreground">Kartik</strong> is the son of Veerabhadra Swami and
            Manikyamba. He grew up in Tamil Nadu, studied computer science and then an MBA at the
            Madurai campus, and now works a corporate job in Delhi. The library you are reading was
            built around that job — evenings, weekends, and the hours nobody else wanted.
          </p>
          <p>
            <strong className="text-foreground">Chandini</strong> is his co-founder and his fiancée.
            They met at the same campus doing the same MBA, and they are getting married on{" "}
            <strong className="text-foreground">26 October 2026</strong>. She also runs a curry
            point she started herself, near his office — which makes her the only one of us
            currently running a business with real customers, real margins and real days when nobody
            turns up. She does not let the rest of us forget it, and she is right not to. A lot of
            what this site says about first customers comes from her, not from a spreadsheet.
          </p>
          <p>
            <strong className="text-foreground">Muthuraj Iyer</strong> grew up in Kerala and moved
            to Tamil Nadu after his tenth, finished his engineering and MBA at the same campus, and
            is married with two children. He joined because he wanted to help. He has never taken a
            rupee for any of it and has never asked.
          </p>
          <p>
            <strong className="text-foreground">Prathap Purohit</strong> graduated in 2022 and is
            the newest. He answers roughly half the email that reaches us and is learning the rest
            on the job. His girlfriend calls him Honey, and he made the mistake of letting the rest
            of us find that out, so now it is on the About page of a website. He is taking it well.
          </p>
        </Section>

        <Section heading="How an idea actually gets made here">
          <p>
            We will not pretend otherwise: AI assists the drafting. It is a tool, and refusing to
            use it would make the library smaller and no more honest.
          </p>
          <p>
            What it does not do is decide. Every blueprint is researched, checked and given its
            verdict by one of us. The founder signs off on each one before it is published — which
            is why his name, not a company name, sits in the byline.
          </p>
          <Bullets
            items={[
              "No figure is published unless it traces to a real source. If we cannot verify a number, we say so instead of inventing one.",
              "The verdict section is written to talk you out of ideas that are wrong for you. A library where every idea is a good idea is a catalogue, not research.",
              "Nothing here is generated on demand from a prompt you cannot see. What you read was written, checked and published before you arrived.",
            ]}
          />
        </Section>

        <Section heading="Who gets everything free, no questions">
          <p>
            The whole library is free to read. Beyond that, there is a standing commitment, and it
            is not a promotion that expires:
          </p>
          <p className="rounded-2xl border border-accent/40 bg-accent/5 px-5 py-4 text-base font-semibold leading-relaxed text-foreground">
            Students, people with disabilities, widows, single mothers and founders starting with
            zero investment pay nothing. Not a rupee, not a dollar — including any subscription we
            ever charge, and including personalised guides and workflows built for your specific
            situation. Email us and say which applies to you. That is the entire process.
          </p>
          <p className="mt-4">
            Poor comes first. Zero-investment founders come second. Students, people with
            disabilities, widows and single mothers are at the top of the list, not the bottom of
            it.
          </p>
        </Section>

        <Section heading="Advice costs nothing, and comes with no guarantee">
          <p>
            Write to us with a real problem and a human reads it. If it needs the founder, the
            founder answers — and where it touches trademarks, business registration, workspace
            questions or raising money, he will bring in family and friends who work in finance and
            law.
          </p>
          <p>
            <strong className="text-foreground">Not one rupee is charged for any of that.</strong>{" "}
            The only thing we would ever charge for is a subscription to this website, to keep it
            running. Advice given in person, over email, to anyone who asks, is free and always will
            be.
          </p>
          <p>
            And the honest half: nobody here can promise your business will work. He will give you
            the best he has. He will not tell you it is a sure thing, because it is not, and anyone
            who tells you otherwise is selling you something.
          </p>
        </Section>

        <Section heading="What we will never do">
          <Bullets
            items={[
              "No AI chatbot. No AI voice agent. If you are talking to BBI, you are talking to one of the four people above.",
              "No automated email. Nothing that reaches your inbox from us was generated and sent by a machine.",
              "No charging you for an answer that turned out to be wrong.",
              "No number we cannot source, on any page of this site.",
            ]}
          />
          <p className="mt-4">
            If any of that ever stops being true, this page changes first. Write to us at{" "}
            <a href={`mailto:${contactEmail()}`} className="mo-link font-semibold text-accent">
              {contactEmail()}
            </a>
            .
          </p>
        </Section>
      </ContentPage>
    </>
  );
}
