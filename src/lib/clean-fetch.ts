/**
 * Some idea rows carry leftover citation code from the writing tool, e.g.
 * "【entity-Meesho¦canonical_name=Meesho】" (7 Nov 2026). Every database client reads through this
 * fetch, so visitors only ever see the plain word ("Meesho"), whatever is stored.
 */
const ENTITY = /【entity-([^¦】"\\]+)[^】"\\]*】/g;
const OTHER = /【[^】"\\]{0,200}】/g;

export function cleanText(text: string): string {
  if (!text.includes("【")) return text;
  return text.replace(ENTITY, "$1").replace(OTHER, "");
}

export const cleanFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("json")) return response;
  const body = await response.text();
  const cleaned = cleanText(body);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(cleaned, { status: response.status, statusText: response.statusText, headers });
};
