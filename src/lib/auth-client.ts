import { createClient } from "@supabase/supabase-js";

/**
 * SINGLE SOURCE OF TRUTH for the browser Supabase client. Unlike db() in
 * ideas.functions.ts (server-only, no session storage), this one persists a
 * session in the browser — it's what Google sign-in and the plan-gate
 * actually run on. Uses the public anon key, which is safe to ship to the
 * browser: RLS on public.profiles is what actually enforces access.
 */
export const authClient = createClient(
  import.meta.env["VITE_IDEAVAULT_DB_URL"] as string,
  import.meta.env["VITE_IDEAVAULT_DB_ANON_KEY"] as string,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  },
);

/**
 * redirectTo must be an absolute URL back into this app (Supabase rejects/
 * falls back otherwise). Callers pass where the user actually was — never
 * omit it, or Google drops them back on whatever page called this function
 * (e.g. /sign-in itself) instead of where they started.
 */
export async function signInWithGoogle(redirectTo: string) {
  return authClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}

export async function signOut() {
  return authClient.auth.signOut();
}
