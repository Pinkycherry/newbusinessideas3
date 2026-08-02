import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";

import { runIdeaAudit } from "@/lib/audit.functions";

export function AiAudit({ slug, locked = false }: { slug: string; locked?: boolean }) {
  const navigate = useNavigate();
  const run = useServerFn(runIdeaAudit);
  const audit = useMutation({ mutationFn: () => run({ data: { slug } }) });

  // No Pro Pass exists for a visitor without a verified entitlement, and checkout
  // is not live yet — so any premium idea sends the visitor to /pricing.
  const hasProPass = false;
  const gated = locked && !hasProPass;

  const handleClick = () => {
    if (gated) {
      navigate({ to: "/pricing" });
      return;
    }
    audit.mutate();
  };

  const rows = audit.data
    ? [
        ["Capital intensity", audit.data.capitalIntensity],
        ["Time to first revenue", audit.data.timeToFirstRevenue],
        ["Moat", audit.data.moat],
        ["Distribution", audit.data.distribution],
        ["Biggest risk", audit.data.biggestRisk],
        ["Kill criteria", audit.data.killCriteria],
        ["First 30-day move", audit.data.firstMove],
        ["Best-fit founder", audit.data.bestFitFounder],
      ]
    : [];

  return (
    <section className="glass mt-10 rounded-3xl px-5 py-7 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            Pro feature · Live AI audit
          </p>
          <h2 className="mt-2 font-display text-xl font-bold tracking-tight">
            Stress-test this idea
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {gated
              ? "This is a Pro Pass idea. The live AI audit runs only for verified Pro Pass holders — see pricing to unlock it."
              : "Generated at request time from this idea's real record — capital, moat, distribution, kill criteria and the first move that matters."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={audit.isPending}
          className="sheen inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_36px_oklch(0.687_0.161_51.5/40%)] transition-all duration-[400ms] ease-glass hover:scale-105 disabled:cursor-wait disabled:opacity-70"
        >
          {audit.isPending ? "Auditing…" : audit.data ? "Re-run audit" : "Run AI audit"}
        </button>
      </div>

      {audit.isError && (
        <p className="mt-5 rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {(audit.error as Error).message}
        </p>
      )}

      {audit.data && (
        <div className="mt-7 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="glass flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl">
              <span className="text-2xl font-extrabold text-accent">
                {audit.data.viabilityScore}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                /100
              </span>
            </div>
            <p className="min-w-[12rem] flex-1 text-base font-semibold leading-snug">
              {audit.data.headline}
            </p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border p-4">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  {label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {audit.data.model} · {new Date(audit.data.generatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </section>
  );
}