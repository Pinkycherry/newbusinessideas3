/**
 * AdSlot — a single reusable advertising / promotion placeholder.
 *
 * Renders NOTHING (no wrapper, no spacing) while `adCode` is empty, so pages
 * stay clean until ads are ready. Pass a raw HTML ad tag as `adCode` to
 * activate a slot.
 *
 * <AdSlot position="homepage-hero-below" size="banner" />
 * <AdSlot position="homepage-hero-below" size="banner" adCode={'<ins ... />'} />
 */
export type AdSize = "banner" | "rectangle" | "square" | "sticky";

/** Dimensions per size, applied to the rendered ad container. */
const SIZE_CLASS: Record<AdSize, string> = {
  banner: "mx-auto w-full max-w-[728px] min-h-[90px]",
  rectangle: "mx-auto w-full max-w-[336px] min-h-[280px]",
  square: "mx-auto w-full max-w-[250px] min-h-[250px]",
  sticky: "w-full max-w-[300px] min-h-[600px]",
};

export function AdSlot({
  position,
  size,
  adCode,
  className = "",
}: {
  position: string;
  size: AdSize;
  adCode?: string;
  className?: string;
}) {
  if (!adCode || !adCode.trim()) return null;

  return (
    <div
      data-ad-position={position}
      className={`overflow-hidden rounded-2xl ${SIZE_CLASS[size]} ${className}`}
      // Ad markup is supplied by the site owner in src config/props, not by users.
      dangerouslySetInnerHTML={{ __html: adCode }}
    />
  );
}