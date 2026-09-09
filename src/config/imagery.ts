/**
 * Every photograph on this site comes from ethicalfounder.com, BBI's parent
 * site. Nothing here is invented, stock, or generated — the list below holds
 * only URLs that are known to resolve.
 *
 * To add more: paste the media URLs from the WordPress library into
 * `EF_LIBRARY`. Each entry needs a `src` and an `alt`; the helpers below take
 * care of distributing them across the site so no single image repeats twice
 * in a row inside one grid.
 *
 * Every consumer pairs its <img> with `hideImgIfBroken`, so a URL that later
 * disappears degrades to the plate's ink ground rather than a broken icon.
 */
export type Photo = { src: string; alt: string };

export const EF_LIBRARY: Photo[] = [
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-16.jpg.webp",
    alt: "Founder working at a laptop in a warmly lit workspace",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-37.jpg.webp",
    alt: "Close-up of hands typing on a laptop keyboard",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2026/08/business-ideas-tree-for-startup-invention-low-cost-business-ideas-latest-zero-investement.jpg",
    alt: "The Golden Tree of Business Growth, business ideas mapped across branches",
  },
];

/**
 * The photo for slot `index`, or null once the library runs out.
 *
 * It used to cycle. On a page with 60 image slots and three real photographs
 * that produced the same two pictures twenty-one and twenty times over, which
 * reads as a broken loop rather than as photography. A slot with no photo of
 * its own gets a typographic plate instead, and starts showing one the moment
 * a URL for it exists in EF_LIBRARY.
 */
export function photoAt(index: number): Photo | null {
  if (index < 0 || index >= EF_LIBRARY.length) return null;
  return EF_LIBRARY[index] as Photo;
}

/** How many slots can currently be given a distinct photograph. */
export const PHOTO_COUNT = EF_LIBRARY.length;
