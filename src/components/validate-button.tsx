import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import type { IconType } from "react-icons";
import { SiClaude, SiPerplexity } from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";

import { getValidateUrl } from "@/lib/validate.functions";
import { VALIDATE_PLATFORMS, type ValidatePlatform } from "@/lib/validate-shared";
import { useAuth } from "@/hooks/use-auth";
import { Spotlight } from "@/components/spotlight";
import { usePillInteraction } from "@/hooks/use-pill-interaction";
import { ValidateContextInput } from "@/components/validate-context-input";
import { useMagnet } from "@/motion";

/**
 * PROJECT_BRIEF.md Section 8 — Validate for Free, with Section 3.2's Step 0
 * The prompt is built server-side. Provider selection opens the chosen
 * destination with the prepared question; the user reviews and sends it there.
 *
 * PROJECT_BRIEF.md Section 3.3 (2026-09-16) added Gemini and Grok; on
 * 2026-10-02 the founder replaced Gemini with ChatGPT in the same slot.
 * Use the provider marks for Claude, Perplexity and ChatGPT, plus Grok's
 * own favicon for its button. The text label remains visible beside every mark.
 */
const PLATFORM_ICONS: Partial<Record<ValidatePlatform, IconType>> = {
  claude: SiClaude,
  perplexity: SiPerplexity,
  chatgpt: RiOpenaiFill,
};

function PlatformMark({ platform }: { platform: ValidatePlatform }) {
  if (platform === "grok") {
    return (
      <img
        src="https://grok.com/images/favicon.svg"
        alt=""
        aria-hidden="true"
        className="h-5 w-5 shrink-0 object-contain"
        width={20}
        height={20}
      />
    );
  }
  const Icon = PLATFORM_ICONS[platform];
  return Icon ? <Icon aria-hidden className="h-5 w-5 shrink-0" /> : null;
}

/**
 * `primary` marks the one button on the idea page that carries the page's
 * single magnet (MOTION_SPEC §2.4). A magnet writes `transform` on the element
 * every pointer frame, and the pill hover/press tween writes `transform`
 * through gsap, so the two cannot share an element — whichever ran last would
 * win and the button would visibly drop its hover state. The primary button
 * therefore takes the magnet and leaves the transform to it; the secondary
 * keeps the pill tween exactly as it was. Both still get the site-wide button
 * response from motion.css.
 */
function PlatformButton({
  platform,
  isOpening,
  disabled,
  primary = false,
  cinema = false,
  onSelect,
}: {
  platform: (typeof VALIDATE_PLATFORMS)[number];
  isOpening: boolean;
  disabled: boolean;
  primary?: boolean;
  /** Cinema trial: CSS owns this button's motion, so neither the magnet nor
   * the pill tween is attached, and the Spotlight wrapper is dropped. */
  cinema?: boolean;
  onSelect: (id: ValidatePlatform) => void;
}) {
  const pill = usePillInteraction<HTMLButtonElement>();
  const magnetRef = useMagnet<HTMLButtonElement>();
  const motionProps = primary
    ? { ref: magnetRef }
    : {
        ref: pill.ref,
        onMouseEnter: pill.onMouseEnter,
        onMouseLeave: pill.onMouseLeave,
        onPointerDown: pill.onPointerDown,
        onPointerUp: pill.onPointerUp,
      };

  if (cinema) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(platform.id)}
        className={primary ? "cm-btn cm-btn-primary bbi-bare" : "cm-btn cm-btn-secondary bbi-bare"}
      >
        <Icon aria-hidden className="h-5 w-5 shrink-0" />
        <span>{isOpening ? "Opening…" : `Continue with ${platform.label}`}</span>
      </button>
    );
  }

  return (
    <Spotlight className="inline-block rounded-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(platform.id)}
        {...motionProps}
        className="glass-pill inline-flex items-center gap-2.5 rounded-md px-6 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-70"
      >
        <Icon aria-hidden className="h-5 w-5 shrink-0" />
        <span>{isOpening ? "Opening…" : `Continue with ${platform.label}`}</span>
      </button>
    </Spotlight>
  );
}

// There is no paid-plan check any more, and no flag to flip back on. The
// founder's decision is that the whole site is free, so signing in is the only
// gate the Validate button has. What was here was a `PAYWALL_ENABLED` constant
// already set to false, guarding a popup that argued a ₹199 / ₹399 case the
// site no longer makes — unreachable code carrying prices that contradict the
// pricing page.

export function ValidateButton({ slug, cinema = false }: { slug: string; cinema?: boolean }) {
  const ideaPath = `/idea/${slug}`;
  const auth = useAuth();
  const navigate = useNavigate();
  const [context, setContext] = useState("");
  const [activePlatform, setActivePlatform] = useState<ValidatePlatform | null>(null);
  const [fallback, setFallback] = useState<{ url: string; platform: ValidatePlatform } | null>(null);
  const popupRef = useRef<Window | null>(null);

  const run = useServerFn(getValidateUrl);
  const go = useMutation({
    mutationFn: (platform: ValidatePlatform) =>
      run({ data: { slug, platform, context: context.trim() || undefined } }),
    onSuccess: (url, platform) => {
      const popup = popupRef.current;
      popupRef.current = null;
      if (popup && !popup.closed) {
        try {
          popup.location.replace(url);
        } catch {
          setFallback({ url, platform });
        }
      } else {
        setFallback({ url, platform });
      }
      setActivePlatform(null);
    },
    onError: () => {
      popupRef.current?.close();
      popupRef.current = null;
      setActivePlatform(null);
    },
  });

  const handleSelect = (platform: ValidatePlatform) => {
    // Step 0 (PROJECT_BRIEF.md Section 3.2): plan required, being logged in
    // alone is not enough. Anonymous visitors go sign in first rather than
    // seeing a price before they even have an account to attach a plan to.
    if (auth.status === "anonymous") {
      navigate({ to: "/sign-in", search: { redirect: ideaPath } });
      return;
    }
    setFallback(null);
    // Reserve the new tab during the user's click. Opening it only after the
    // server request can be blocked by browsers because the gesture has ended.
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;
    popupRef.current = popup;
    setActivePlatform(platform);
    go.mutate(platform);
  };

  const buttonsDisabled = auth.status === "loading" || go.isPending;

  return (
    <section className={cinema ? "cm-validate" : "glass mt-10 rounded-3xl px-5 py-7 sm:px-8"}>
      <p className="t-eyebrow">Free · no extra cost, no limit</p>
      <h2 className="mt-2 font-display text-xl font-bold tracking-tight">Validate this idea</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        We do not charge for validation. We prepare a research prompt for the AI tool you choose.
        The provider's own access and usage limits still apply.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {VALIDATE_PLATFORMS.map((platform, i) => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isOpening={go.isPending && activePlatform === platform.id}
            disabled={buttonsDisabled}
            primary={i === 0}
            cinema={cinema}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="mt-5">
        <ValidateContextInput
          value={context}
          onChange={setContext}
          disabled={go.isPending}
          cinema={cinema}
        />
      </div>

      {go.isError && (
        <p className="mt-5 rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {(go.error as Error).message}
        </p>
      )}

      {fallback && (
        <div className="mt-5 rounded-2xl border border-border bg-background/70 px-4 py-3" role="status">
          <p className="text-sm text-muted-foreground">
            Your browser blocked the new tab. Open {VALIDATE_PLATFORMS.find((item) => item.id === fallback.platform)?.label ?? "the selected tool"} with the prepared question here.
          </p>
          <a
            href={fallback.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground underline underline-offset-4"
          >
            Open {VALIDATE_PLATFORMS.find((item) => item.id === fallback.platform)?.label ?? "selected tool"}
          </a>
        </div>
      )}

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Choose a tool to open the prepared question. Review it there and send it when you are ready.
        Grok receives a shorter handoff to reduce URL-length problems.
      </p>
    </section>
  );
}
