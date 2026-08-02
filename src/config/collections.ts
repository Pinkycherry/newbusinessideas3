/**
 * COLLECTIONS — the "Collections" section of the header categories dropdown.
 *
 * Add, remove or reorder entries below to change that menu. Nothing else in
 * the codebase needs to change. `url` is any in-app path (e.g. "/browse",
 * "/search?q=automation") or an absolute external URL.
 */
export type Collection = { label: string; url: string };

export const COLLECTIONS: Collection[] = [
  { label: "Top ideas for women", url: "/browse" },
  { label: "Zero investment ideas", url: "/browse" },
  { label: "Work from home ideas", url: "/browse" },
];