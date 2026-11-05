import { createClient } from "@supabase/supabase-js";

/**
 * SINGLE SOURCE OF TRUTH for the browser Supabase client. Unlike db() in
 * db.ts (server-only, no session storage), this one persists a
 * session in the browser — it's what Google sign-in and the plan-gate
 * actually run on. Uses the public anon key, which is safe to ship to the
 * browser: RLS on public.profiles is what actually enforces access.
 */
/* A build without the two VITE_ variables must still render every page:
 * categories and subcategories are static. Sign-in simply fails until the
 * variables are set in the deployment's build environment. */
export const authClient = createClient(
  (import.meta.env["VITE_IDEAVAULT_DB_URL"] as string | undefined) || "https://unconfigured.invalid",
  (import.meta.env["VITE_IDEAVAULT_DB_ANON_KEY"] as string | undefined) || "unconfigured",
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
