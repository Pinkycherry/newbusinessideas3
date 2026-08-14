import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import type { IconType } from "react-icons";
import { SiClaude, SiPerplexity } from "react-icons/si";

import { getValidateUrl } from "@/lib/validate.functions";
import { VALIDATE_PLATFORMS, type ValidatePlatform } from "@/lib/validate-shared";
import { useAuth } from "@/hooks/use-auth";
import { PaywallPopup } from "@/components/paywall-popup";
import { Spotlight } from "@/components/spotlight";
import { usePillInteraction } from "@/hooks/use-pill-interaction";
import { ValidateContextInput } from "@/components/validate-context-input";

/**
 * PROJECT_BRIEF.md Section 8 — Validate for Free, with Section 3.2's Step 0
 * precondition: an active paid plan is required before either platform
 * button actually fires. The master prompt itself is still built entirely
 * server-side and never rendered or copyable in our UI — only the button
 * labels/icons name the destinations, which is fine for this functional
 * picker (the mechanism-hiding rule is about marketing copy elsewhere on
 * the site, not this screen, which the user only reaches by already using
 * the feature).
 *
 * No Gemini button here — explicitly deferred by the founder, see
 * PENDING.md. Real brand marks reuse the same react-icons/si pattern as
 * site-shell.tsx's "Built With" section rather than inventing a new one;
 * unlike that section's ChatGPT/Grok gap, react-icons/si does carry a real
 * Perplexity mark (`SiPerplexity`), so both buttons below show a genuine
 * logo — no text-only fallback needed for either.
 */
const PLATFORM_ICONS: Record<ValidatePlatform, IconType> = {
  claude: SiClaude,
  perplexity: SiPerplexity,
};

function PlatformButton({
  platform,
  isOpening,
  disabled,
  onSelect,
}: {
  platform: (typeof VALIDATE_PLATFORMS)[number];
  isOpening: boolean;
  disabled: boolean;
  onSelect: (id: ValidatePlatform) => void;
}) {
  const pill = usePillInteraction<HTMLButtonElement>();
  const Icon = PLATFORM_ICONS[platform.id];

  return (
    <Spotlight className="inline-block rounded-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(platform.id)}
        ref={pill.ref}
        onMouseEnter={pill.onMouseEnter}
        onMouseLeave={pill.onMouseLeave}
        onPointerDown={pill.onPointerDown}
        onPointerUp={pill.onPointerUp}
        className="glass-pill inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-70"
      >
        <Icon aria-hidden className="h-5 w-5 shrink-0" />
        <span>{isOpening ? "Opening…" : `Continue with ${platform.label}`}</span>
      </button>
    </Spotlight>
  );
}

export function ValidateButton({ slug }: { slug: string }) {
  const ideaPath = `/idea/${slug}`;
  const auth = useAuth();
  const navigate = useNavigate();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [context, setContext] = useState("");
  const [activePlatform, setActivePlatform] = useState<ValidatePlatform | null>(null);

  const run = useServerFn(getValidateUrl);
  const go = useMutation({
    mutationFn: (platform: ValidatePlatform) =>
      run({ data: { slug, platform, context: context.trim() || undefined } }),
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
      setActivePlatform(null);
    },
    onError: () => setActivePlatform(null),
  });

  const handleSelect = (platform: ValidatePlatform) => {
    // Step 0 (PROJECT_BRIEF.md Section 3.2): plan required, being logged in
    // alone is not enough. Anonymous visitors go sign in first rather than
    // seeing a price before they even have an account to attach a plan to.
    if (auth.status === "anonymous") {
      navigate({ to: "/sign-in", search: { redirect: ideaPath } });
      return;
    }
    if (auth.status === "authenticated" && auth.hasActivePlan) {
      setActivePlatform(platform);
      go.mutate(platform);
      return;
    }
    setPaywallOpen(true);
  };

  const buttonsDisabled = auth.status === "loading" || go.isPending;

  return (
    <section className="glass mt-10 rounded-3xl px-5 py-7 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
        Free · runs on your own AI account
      </p>
      <h2 className="mt-2 font-display text-xl font-bold tracking-tight">Validate this idea</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        We do not charge for validation. Pick Claude or Perplexity and we hand you a fully
        researched, ready-to-run prompt on your own account — free.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {VALIDATE_PLATFORMS.map((platform) => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isOpening={go.isPending && activePlatform === platform.id}
            disabled={buttonsDisabled}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="mt-5">
        <ValidateContextInput value={context} onChange={setContext} disabled={go.isPending} />
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
