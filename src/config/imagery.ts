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
    alt: "A founder at work on an early business plan",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-37.jpg.webp",
    alt: "Notes and figures from a business teardown",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2026/08/business-ideas-tree-for-startup-invention-low-cost-business-ideas-latest-zero-investement.jpg",
    alt: "The business ideas tree, drawn as branching categories",
  },
];

/** The photo for slot `index`, cycling through the library. */
export function photoAt(index: number): Photo {
  const pool = EF_LIBRARY;
  if (pool.length === 0) return { src: "", alt: "" };
  return pool[((index % pool.length) + pool.length) % pool.length] as Photo;
}

/** `count` photos starting at `offset`, cycling through the library. */
export function photoRun(count: number, offset = 0): Photo[] {
  return Array.from({ length: count }, (_, i) => photoAt(offset + i));
}
