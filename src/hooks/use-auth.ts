import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { authClient } from "@/lib/auth-client";

export type PlanTier = "none" | "3month" | "lifetime";

export type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; session: Session; planTier: PlanTier; hasActivePlan: boolean };

/**
 * PROJECT_BRIEF.md Section 3.2 — three access levels. Plan status is looked
 * up from public.profiles and fails closed to "none" on any error (no row
 * yet, network issue, RLS mismatch) rather than assuming access.
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [planTier, setPlanTier] = useState<PlanTier>("none");

  useEffect(() => {
    authClient.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => setSession(data.session));
    const { data: sub } = authClient.auth.onAuthStateChange(
      (_event: string, next: Session | null) => setSession(next),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) {
      setPlanTier("none");
      return;
    }
    let cancelled = false;
    authClient
      .from("profiles")
      .select("plan_tier,plan_expires_at")
      .eq("id", userId)
      .maybeSingle()
      .then(
        ({ data }: { data: Record<string, unknown> | null }) => {
        if (cancelled) return;
        const tier = data?.["plan_tier"] as PlanTier | undefined;
        if (tier === "lifetime") {
          setPlanTier("lifetime");
        } else if (
          tier === "3month" &&
          data?.["plan_expires_at"] &&
          new Date(data["plan_expires_at"] as string) > new Date()
        ) {
          setPlanTier("3month");
        } else {
          setPlanTier("none");
        }
        },
        () => {
          if (!cancelled) setPlanTier("none");
        },
      );
    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  if (session === undefined) return { status: "loading" };
  if (!session) return { status: "anonymous" };
  return { status: "authenticated", session, planTier, hasActivePlan: planTier !== "none" };
}
