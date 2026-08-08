import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { ContentPage, metaFor } from "@/components/page-layout";
import { signInWithGoogle } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-in")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () =>
    metaFor(
      "Sign In | IdeaVault AI",
      "Sign in with Google to read full idea blueprints on IdeaVault AI.",
    ),
  component: SignInPage,
});

function SignInPage() {
  const { redirect } = Route.useSearch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setPending(true);
    setError(null);
    // Google must drop the user back where they actually were, not on
    // /sign-in itself — that was the bug that made login look like it did
    // nothing.
    const destination =
      window.location.origin + (redirect && redirect.startsWith("/") ? redirect : "/");
    const { error: signInError } = await signInWithGoogle(destination);
    if (signInError) {
      setError(signInError.message);
      setPending(false);
    }
    // On success the browser is redirected to Google, so nothing else to do here.
  };

  return (
    <ContentPage
      eyebrow="Sign in"
      title="One tap,"
      highlight="with Google"
      intro="Sign in to read the full library. No email, no password to remember — just your Google account."
    >
      <div className="glass rounded-2xl px-6 py-8 text-center">
        <button
          type="button"
          onClick={handleSignIn}
          disabled={pending}
          className="sheen mx-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_oklch(0.687_0.161_51.5/40%)] transition-all duration-300 hover:scale-105 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Redirecting…" : "Continue with Google"}
        </button>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <p className="mt-4 text-xs text-muted-foreground">
          We only ever offer Google sign-in — no other login method exists on this site.
        </p>
      </div>
    </ContentPage>
  );
}
