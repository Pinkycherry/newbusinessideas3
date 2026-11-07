import { createClient } from "@supabase/supabase-js";
import { cleanFetch } from "@/lib/clean-fetch";

/**
 * Server-side database client for the parts of the site that still read rows
 * (blog posts, newsletter sign-ups). Categories and subcategories do NOT come
 * from here: they are the approved static architecture in src/data/taxonomy.ts.
 */
// The new database (ubuavzcuwvvedojsrmux). The URL and publishable key are public by design.
// BBI_DB_* in the Cloudflare worker settings; IDEAVAULT_DB_* stays the live database.
const PUBLIC_URL = "https://ubuavzcuwvvedojsrmux.supabase.co";
const PUBLIC_KEY = "sb_publishable_jjA0oFdaqraLaCTY_AqUIw_hKOVV8mD";

export function db() {
  const url = process.env["BBI_DB_URL"] || PUBLIC_URL;
  const key = process.env["BBI_DB_ANON_KEY"] || PUBLIC_KEY;
  if (!url || !key) throw new Error("BBI database credentials are not configured.");
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: cleanFetch },
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
