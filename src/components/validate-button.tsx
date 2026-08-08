import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";

import { getValidateUrl } from "@/lib/validate.functions";
import { VALIDATE_PLATFORMS, type ValidatePlatform } from "@/lib/validate-shared";
import { useAuth } from "@/hooks/use-auth";
import { PaywallPopup } from "@/components/paywall-popup";

/**
 * PROJECT_BRIEF.md Section 8 — Validate for Free, with Section 3.2's Step 0
 * precondition: an active paid plan is required before the platform picker
 * runs. No visible prompt text or copy button anywhere: the platform picker
 * is the entire UI, the prompt is built server-side and only ever exists as
 * a query param in the tab we open.
 */
export function ValidateButton({ slug }: { slug: string }) {
  const ideaPath = `/idea/${slug}`;
  const auth = useAuth();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const run = useServerFn(getValidateUrl);
  const go = useMutation({
    mutationFn: (platform: ValidatePlatform) => run({ data: { slug, platform } }),
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
      setPickerOpen(false);
    },
  });

  return (
    <section className="glass mt-10 rounded-3xl px-5 py-7 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            Free · runs on your own AI account
          </p>
          <h2 className="mt-2 font-display text-xl font-bold tracking-tight">Validate this idea</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            We do not charge for validation. Pick Claude or Perplexity and we hand you a fully
            researched, ready-to-run prompt on your own account — free.
          </p>
        </div>

        {!pickerOpen ? (
          <button
            type="button"
            disabled={auth.status === "loading"}
            onClick={() => {
              // Step 0 (PROJECT_BRIEF.md Section 3.2): plan required, being
              // logged in alone is not enough. Anonymous visitors go sign in
              // first rather than seeing a price before they even have an
              // account to attach a plan to.
              if (auth.status === "anonymous") {
                navigate({ to: "/sign-in", search: { redirect: ideaPath } });
              } else if (auth.status === "authenticated" && auth.hasActivePlan) {
                setPickerOpen(true);
              } else {
                setPaywallOpen(true);
              }
            }}
            className="sheen inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-all duration-[400ms] ease-glass hover:scale-105 disabled:cursor-wait disabled:opacity-70"
          >
            Validate for free
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {VALIDATE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                disabled={go.isPending}
                onClick={() => go.mutate(platform.id)}
                className="sheen inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-all duration-[400ms] ease-glass hover:scale-105 disabled:cursor-wait disabled:opacity-70"
              >
                {go.isPending ? "Opening…" : platform.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {go.isError && (
        <p className="mt-5 rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {(go.error as Error).message}
        </p>
      )}

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        You&apos;ll be taken to Claude or Perplexity with your prompt ready — just hit enter. Not
        signed in yet? Sign in there, then tap Validate again.
      </p>

      <PaywallPopup open={paywallOpen} onOpenChange={setPaywallOpen} />
    </section>
  );
}
