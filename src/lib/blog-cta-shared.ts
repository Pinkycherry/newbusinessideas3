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
 * How often a mid-list checkpoint appears, scaled to the number of ideas in
 * the post. Readers scroll a long list and forget to act, so a long list gets
 * a pause every 10 ideas; a short one gets one pause halfway; a very short one
 * gets none (the top panel, per-idea buttons and closing panel cover it). No
 * checkpoint is placed after the last idea, where the closing panel sits.
 *   50 ideas -> after 10, 20, 30, 40   30 ideas -> after 10, 20
 *   20 ideas -> after 10               12 ideas -> after 6
 */
export function checkpointStep(count: number): number {
  if (count < 8) return 0;
  if (count <= 15) return Math.ceil(count / 2);
  return 10;
}

function escapeText(text: string): string {
  return text
    .replace(/&(?!#?\w+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type IdeaRef = { slug: string; label: string };

function checkpointHtml(
  done: number,
  total: number,
  recent: IdeaRef[],
  signedIn: boolean,
  postSlug: string,
): string {
  const eyebrow = `You've read ${done} of ${total} ideas`;
  const title = signedIn
    ? `Which of these ${recent.length} caught your eye? Validate it now, before you scroll on.`
    : `Don't lose the ones you liked. Sign up free and validate any of them in one tap.`;
  const chips = recent
    .map(
      (idea) =>
        `<a class="blog-cta-chip" href="${validateHref(idea.slug, signedIn)}">${idea.label}</a>`,
    )
    .join("");
  const action = signedIn
    ? ""
    : `<div class="blog-cta-actions"><a class="ac-cta blog-cta-btn" href="${signInHref(`/blog/${postSlug}`)}" data-cta="signup-checkpoint">Sign up free<span aria-hidden="true">&rarr;</span></a><span class="blog-cta-note">Google sign-in. No card, no fee.</span></div>`;
  // Divs and spans only: the article is split into cards on every </p>, so a
  // <p> inside this block would cut it in half.
  return (
    `<aside class="blog-cta-checkpoint" aria-label="Validate the ideas you liked">` +
    `<div class="blog-cta-eyebrow">${eyebrow}</div>` +
    `<div class="blog-cta-title">${title}</div>` +
    `<div class="blog-cta-chips">${chips}</div>` +
    action +
    `</aside>`
  );
}

/**
 * Listicle posts give every idea its own H3 that links to its page. After each
 * of those sections (the H3 and everything up to the next heading) this adds a
 * Validate button, and every `checkpointStep` ideas a checkpoint listing the
 * ideas just read. Posts that link ideas only inside paragraphs are left as
 * they are. Runs on the already-sanitised HTML, so the classes it adds are
 * ours and survive.
 */
export function injectIdeaCtas(html: string, signedIn: boolean, postSlug = ""): string {
  const re =
    /(<h3[^>]*>(?:(?!<\/h3>)[\s\S])*?href="\/idea\/([^"#?]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>)([\s\S]*?)(?=<h2|<h3|$)/g;
  const total = headingIdeaSlugs(html).length;
  const step = checkpointStep(total);
  const seen: IdeaRef[] = [];
  return html.replace(re, (_all, head: string, slug: string, label: string, body: string) => {
    const plain = escapeText(label.replace(/<[^>]*>/g, "").trim());
    seen.push({ slug, label: plain.split(":")[0]?.trim() || plain });
    let out = head + body + ideaCtaHtml(slug, signedIn);
    const done = seen.length;
    if (step > 0 && done % step === 0 && done < total) {
      out += checkpointHtml(done, total, seen.slice(-step), signedIn, postSlug);
    }
    return out;
  });
}
