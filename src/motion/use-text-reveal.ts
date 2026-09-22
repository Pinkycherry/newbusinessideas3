/**
 * Text reveal — REMOVED at the founder's request, 2026-09-22.
 *
 * This used to run GSAP SplitText over a page's single headline with
 * `mask: "lines"`, sliding each line up from a clean edge. It is switched
 * off, and the hook now does nothing but hand back the ref it is given.
 *
 * WHY IT IS A NO-OP RATHER THAN DELETED: twenty routes call it, each one
 * holding the returned ref on its `<h1>`. Deleting the hook means editing
 * all twenty in one pass, and an effect the founder may want back is not
 * worth that blast radius. Every call site keeps working, unchanged, and
 * renders the heading exactly as it is authored.
 *
 * WHY IT WENT: two reasons, and the second is the one that forced it.
 *
 * 1. The founder has been stripping motion from this site section by
 *    section — the hero background, the hero text reveal, the search pill.
 *    A headline that animates on arrival is the same class of thing.
 *
 * 2. It broke the page. SplitText wraps each line in its own masking
 *    element, and on a heading that wraps to two lines the wrappers stopped
 *    contributing the second line's height to the `<h1>` — so whatever
 *    followed was laid out as though the heading were one line tall and
 *    rendered straight over it. Confirmed live on a blog post, where the
 *    byline sat on top of the second line of the title. Every template with
 *    a headline long enough to wrap had the same bug waiting in it.
 *
 * To bring it back: restore the SplitText effect in this file. Nothing at
 * any call site has to change. Fix the height collapse first.
 */
import { useRef, type RefObject } from "react";

export type TextRevealOptions = {
  /** "lines" (default) or "words" for shorter, punchier labels. */
  type?: "lines" | "words";
  /** Seconds between lines/words. Default 0.08. */
  stagger?: number;
  /** Seconds per line/word. Default 0.7. */
  duration?: number;
  delay?: number;
  /** ScrollTrigger start. Default "top 85%". */
  start?: string;
};

/**
 * Returns a ref and nothing else. The options are still accepted so no call
 * site needs touching, and are deliberately unused.
 */
export function useTextReveal<T extends HTMLElement = HTMLElement>(
  _options: TextRevealOptions = {},
): RefObject<T | null> {
  return useRef<T | null>(null);
}
