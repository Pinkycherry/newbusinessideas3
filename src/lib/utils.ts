import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ref callback for server-rendered <img> tags pointing at external/hotlinked
 * sources that might fail. Also pass the same element as the `onError`
 * handler for failures that happen after mount.
 *
 * Why both: this app is server-rendered, so a browser-eager <img src="..."
 * is already in the DOM and fetching before React hydrates. If that fetch
 * fails fast (a blocked/dead host errors near-instantly), the native
 * `error` event can fire and resolve BEFORE hydration attaches React's
 * onError handler — and a browser event that already fired never replays
 * for a listener added afterward, so onError alone silently never runs for
 * that case. Checking `complete && naturalWidth === 0` in the ref callback
 * (which fires on every mount, including hydration) catches exactly that
 * gap; onError still covers slower/later failures.
 */
export function hideImgIfBroken(el: HTMLImageElement | null) {
  if (el && el.complete && el.naturalWidth === 0) el.style.display = "none";
}
