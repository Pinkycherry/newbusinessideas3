import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { AuthState } from "@/hooks/use-auth";
import { isSignedIn, signInHref, validateHref } from "@/lib/blog-cta-shared";
import "./blog-cta.css";

/**
 * Calls to action for blog posts, split by who is reading.
 *
 * New visitors are sent to sign in (Google, free) with a redirect straight
 * back to where they were heading, so signing up is one step on the way to
 * validating, not a detour. Signed-in readers skip that step and go straight
 * to the idea page's Validate section (`#validate`, rendered by
 * idea-cinema.tsx).
 *
 * "loading" is treated as anonymous on purpose: the server has no session,
 * so rendering the anonymous version first keeps SSR and hydration identical,
 * and the buttons swap once the session resolves on the client.
 */

/** Top-of-post panel, directly under the lede. */
export function BlogCtaHero({
  auth,
  postSlug,
  firstIdeaSlug,
  ideaCount,
}: {
  auth: AuthState;
  postSlug: string;
  firstIdeaSlug: string | null;
  ideaCount: number;
}) {
  const signedIn = isSignedIn(auth);
  const listy = ideaCount > 0;

  if (signedIn) {
    return (
      <aside className="blog-cta-panel" aria-label="Validate an idea">
        <p className="blog-cta-eyebrow">You're signed in</p>
        <p className="blog-cta-title">
          {listy
            ? `Every idea below has a Validate button. Pick one and get a full research write-up, free.`
            : `Every idea in the library has a Validate button. Find one and get a full research write-up, free.`}
        </p>
        <div className="blog-cta-actions">
          {firstIdeaSlug ? (
            <a className="ac-cta blog-cta-btn" href={validateHref(firstIdeaSlug, true)}>
              Validate the #1 idea
              <ArrowRight aria-hidden className="h-4 w-4" />
            </a>
          ) : (
            <Link to="/browse" className="ac-cta blog-cta-btn">
              Browse ideas to validate
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          )}
          <Link to="/browse" className="blog-cta-ghost">
            Browse all ideas
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="blog-cta-panel" aria-label="Sign up free">
      <p className="blog-cta-eyebrow">Free, no card, no limit</p>
      <p className="blog-cta-title">
        {listy
          ? `Like one of these ${ideaCount} ideas? Sign up free and validate it in one tap.`
          : `Have an idea of your own? Sign up free and validate any idea in the library in one tap.`}
      </p>
      <p className="blog-cta-sub">
        You get a full write-up on the market, your buyer and the risks. One Google sign-in, and
        it's free as many times as you want.
      </p>
      <div className="blog-cta-actions">
        <a className="ac-cta blog-cta-btn" href={signInHref(`/blog/${postSlug}`)}>
          Sign up free
          <ArrowRight aria-hidden className="h-4 w-4" />
        </a>
        <Link to="/browse" className="blog-cta-ghost">
          Browse all ideas
        </Link>
      </div>
    </aside>
  );
}

/** Closing panel after the article. */
export function BlogCtaEnd({ auth, postSlug }: { auth: AuthState; postSlug: string }) {
  const signedIn = isSignedIn(auth);
  return (
    <aside className="blog-cta-panel blog-cta-end" aria-label="Next step">
      <p className="blog-cta-eyebrow">{signedIn ? "Your next step" : "Before you spend a rupee"}</p>
      <p className="blog-cta-title">
        {signedIn
          ? "Found one that fits your life? Open it and tap Validate."
          : "Found one that fits your life? Check it properly before you commit a weekend."}
      </p>
      <p className="blog-cta-sub">
        {signedIn
          ? "Each idea page has the full blueprint and a Validate button. Run it on your top 2 or 3 picks and compare."
          : "Sign up free with Google and every idea page opens up a Validate button. No card, no fee, no limit."}
      </p>
      <div className="blog-cta-actions">
        {signedIn ? (
          <Link to="/browse" className="ac-cta blog-cta-btn">
            Browse ideas to validate
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        ) : (
          <a className="ac-cta blog-cta-btn" href={signInHref(`/blog/${postSlug}`)}>
            Sign up free
            <ArrowRight aria-hidden className="h-4 w-4" />
          </a>
        )}
      </div>
    </aside>
  );
}

/**
 * Slim bar pinned to the bottom of the screen on phones, for new visitors
 * only. Signed-in readers already have a button under every idea.
 *
 * Portalled to <body>: the article is a depth scene with a transform, and a
 * transformed ancestor turns `position: fixed` into "fixed to that box" and
 * traps the bar under the article's glass cards.
 */
export function BlogCtaStickyBar({ auth, postSlug }: { auth: AuthState; postSlug: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || isSignedIn(auth)) return null;
  return createPortal(
    <div className="blog-cta-sticky" role="complementary" aria-label="Sign up free">
      <span className="blog-cta-sticky-text">Validate any idea free</span>
      <a className="ac-cta blog-cta-btn blog-cta-btn-sm" href={signInHref(`/blog/${postSlug}`)}>
        Sign up free
      </a>
    </div>,
    document.body,
  );
}
