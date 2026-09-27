import type { AuthState } from "@/hooks/use-auth";

/** Pure helpers behind blog-cta.tsx, kept apart so that file only exports components. */

export function isSignedIn(auth: AuthState): boolean {
  return auth.status === "authenticated";
}

export function signInHref(redirect: string): string {
  return `/sign-in?redirect=${encodeURIComponent(redirect)}`;
}

export function validateHref(slug: string, signedIn: boolean): string {
  const target = `/idea/${slug}#validate`;
  return signedIn ? target : signInHref(target);
}

/** Slugs of every idea whose own H3 heading links to it, in page order. */
export function headingIdeaSlugs(html: string): string[] {
  const out: string[] = [];
  const re = /<h3[^>]*>(?:(?!<\/h3>)[\s\S])*?href="\/idea\/([^"#?]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) if (m[1]) out.push(m[1]);
  return out;
}

function ideaCtaHtml(slug: string, signedIn: boolean): string {
  const href = validateHref(slug, signedIn);
  const label = signedIn ? "Validate this idea" : "Validate this idea free";
  const note = signedIn ? "Free, as many times as you want" : "Free Google sign-in, then one tap";
  return (
    `<p class="blog-cta-row">` +
    `<a class="ac-cta blog-cta-btn" href="${href}" data-cta="${signedIn ? "validate" : "signup"}">${label}<span aria-hidden="true">&rarr;</span></a>` +
    `<span class="blog-cta-note">${note}</span>` +
    `</p>`
  );
}

/**
 * Listicle posts give every idea its own H3 that links to its page. After each
 * of those sections (the H3 and everything up to the next heading) this adds a
 * Validate button. Posts that link ideas only inside paragraphs are left as
 * they are. Runs on the already-sanitised HTML, so the classes it adds are
 * ours and survive.
 */
export function injectIdeaCtas(html: string, signedIn: boolean): string {
  const re =
    /(<h3[^>]*>(?:(?!<\/h3>)[\s\S])*?href="\/idea\/([^"#?]+)"[\s\S]*?<\/h3>)([\s\S]*?)(?=<h2|<h3|$)/g;
  return html.replace(
    re,
    (_all, head: string, slug: string, body: string) => head + body + ideaCtaHtml(slug, signedIn),
  );
}
