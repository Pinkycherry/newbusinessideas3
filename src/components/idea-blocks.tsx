import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

import type { InternalLink } from "@/lib/ideas-shared";
import { FOUNDER, founderProfile } from "@/lib/site-config";

/**
 * Blocks shared by both idea-page presentations: the standard template in
 * `routes/idea.$slug.tsx` and the cinema trial in
 * `components/idea-cinema/idea-cinema.tsx`. They live here so the two can
 * never drift apart on content, links or lock state. Moved out of the route
 * file unchanged on 2026-09-24.
 */

/**
 * One inline internal link, as a natural sentence rather than a card or a
 * bolted-on "related" rail. `link.anchor` must be an exact substring of
 * `link.sentence` (enforced by toObjectList's picker in ideas-shared.ts) —
 * that phrase becomes the link, the rest stays plain text. Saffron/yellow
 * styling lives in styles.css under `.bbi-inline-link`, the one deliberate
 * exception to this page's five-value greyscale rule.
 */
export function InternalLinkLine({
  link,
  className = "mt-5 text-[1.0625rem] leading-[1.8] sm:text-lg",
}: {
  link: InternalLink | undefined;
  className?: string;
}) {
  if (!link) return null;
  const i = link.sentence.indexOf(link.anchor);
  if (i === -1) return null;
  const before = link.sentence.slice(0, i);
  const after = link.sentence.slice(i + link.anchor.length);
  return (
    <p className={className}>
      {before}
      <Link to="/idea/$slug" params={{ slug: link.slug }} className="bbi-inline-link">
        {link.anchor}
      </Link>
      {after}
    </p>
  );
}

/**
 * The signature that closes every blueprint.
 *
 * One name now, not four lines. The founder asked for the block trimmed to
 * the person who is actually accountable for the page, and that is the one
 * claim worth making: he researches and signs off every blueprint.
 *
 * The name is a link, and it is the SAME destination the page's JSON-LD
 * author already resolves to (`personUrl()` in schema.tsx) — a byline whose
 * visible link and machine-readable `author.url` disagree is a worse signal
 * than either alone. `FOUNDER.name` and the profile both come from
 * site-config, so the name here can never drift from the name on /founders.
 */
export function IdeaSignature({ className }: { className?: string }) {
  const profile = founderProfile(FOUNDER.name);
  return (
    <section
      className={
        className ??
        "mt-12 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground motion-safe:animate-none"
      }
    >
      <p>
        Researched and signed off by{" "}
        <Link
          to="/founders"
          hash={profile.slug}
          className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
        >
          {FOUNDER.name}
        </Link>
        .
      </p>
    </section>
  );
}

/**
 * PROJECT_BRIEF.md Section 3.3 (2026-09-16) — the FOMO model. These panels
 * are never unlocked on our own page, for anyone, at any tier: not by
 * signing in, not by paying. The real researched content still renders in
 * the DOM underneath the blur — this is a visual tease, not cloaking, and a
 * search crawler reads the same real text a human can't make out — a CSS
 * filter is the only thing between a reader and it. The only way to
 * actually read it is the Validate button below: paying unlocks that
 * button, which sends this exact content, server-side, into the reader's
 * own chosen LLM. It is never unblurred here.
 */
// TEMPORARY — founder asked to see every section unblurred while reviewing
// layout and content gaps against Supabase. Flip back to `true` to restore
// the permanent lock from PROJECT_BRIEF.md Section 3.3. Nothing else about
// LockedSection changes: same sections, same structure, blur switched off.
export const LOCK_ENABLED = false;

/** The locked panel's body: blur and the unlock overlay while LOCK_ENABLED. */
export function LockedBody({ children }: { children: ReactNode }) {
  return (
    <div className="relative mt-4">
      <div
        aria-hidden={LOCK_ENABLED}
        className={LOCK_ENABLED ? "pointer-events-none select-none blur-sm" : undefined}
      >
        {children}
      </div>
      {LOCK_ENABLED && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 px-4 text-center">
          <Lock className="h-5 w-5 text-accent" aria-hidden />
          <p className="text-sm font-semibold">This is what the Validate button unlocks</p>
          <a
            href="#validate"
            className="text-xs font-semibold uppercase tracking-widest text-primary underline decoration-border underline-offset-4 hover:text-accent"
          >
            See how to unlock it ↓
          </a>
        </div>
      )}
    </div>
  );
}
