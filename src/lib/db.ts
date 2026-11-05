import { createClient } from "@supabase/supabase-js";

/**
 * Server-side database client for the parts of the site that still read rows
 * (blog posts, newsletter sign-ups). Categories and subcategories do NOT come
 * from here: they are the approved static architecture in src/data/taxonomy.ts.
 */
export function db() {
  const url = process.env["IDEAVAULT_DB_URL"];
  const key = process.env["IDEAVAULT_DB_ANON_KEY"];
  if (!url || !key) throw new Error("BBI database credentials are not configured.");
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/** The same client, or null when the deployment has no database configured. */
export function dbOrNull() {
  try {
    return db();
  } catch {
    return null;
  }
}
