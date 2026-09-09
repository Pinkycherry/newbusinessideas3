import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A plate that turns over to show what is on its back.
 *
 * Adapted from Kokonut UI (MIT). Two departures from upstream, both to keep it
 * inside this design: the orange accent becomes the brand indigo, and the
 * pulsing radial "scale" keyframes are dropped — that glow belonged to the
 * vocabulary this site replaced. The turn itself is the effect.
 *
 * Flips on hover AND on focus, so it is reachable from the keyboard; under
 * reduced motion the back face is simply shown without the rotation.
 */
export default function CardFlip({
  title,
  subtitle,
  description,
  points,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  description: string;
  points?: string[];
  actionLabel?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  const face =
    "absolute inset-0 h-full w-full overflow-hidden rounded-md border border-border bg-card p-5 [backface-visibility:hidden]";

  return (
    <div
      className="group relative h-[320px] w-full [perspective:2000px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d]",
          "transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]",
          "motion-reduce:transition-none",
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
        )}
      >
        <div className={cn(face, "flex flex-col justify-end [transform:rotateY(0deg)]")}>
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold leading-snug text-foreground">{title}</h3>
              {subtitle ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            <Repeat2 aria-hidden className="h-4 w-4 shrink-0 text-primary" />
          </div>
        </div>

        <div className={cn(face, "flex flex-col [transform:rotateY(180deg)]")}>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold leading-snug text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ul className="space-y-2">
              {(points ?? []).map((point, i) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-sm text-foreground transition-[transform,opacity] duration-300 motion-reduce:transition-none"
                  style={{
                    transform: flipped ? "translateX(0)" : "translateX(-10px)",
                    opacity: flipped ? 1 : 0,
                    transitionDelay: `${i * 50 + 150}ms`,
                  }}
                >
                  <ArrowRight aria-hidden className="h-3 w-3 shrink-0 text-hl-green" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          {actionLabel ? (
            <p className="mt-5 border-t border-border pt-4 text-sm font-medium text-primary">
              {actionLabel}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
