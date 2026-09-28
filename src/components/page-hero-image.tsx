import type { CategoryImage } from "@/config/category-imagery";
import { hideImgIfBroken } from "@/lib/utils";

/**
 * The featured image under an index page's heading. Same figure the category
 * pages render (category.$categorySlug.index.tsx): 21:9 plate, eager load,
 * gradient scrim and the caption from the image config. `.mo-media` gives it
 * the site's standard hover zoom, nothing bespoke.
 */
export function PageHeroImage({ image }: { image: CategoryImage }) {
  return (
    <figure className="mo-media glass relative mt-6 aspect-[21/9] w-full overflow-hidden">
      <img
        ref={hideImgIfBroken}
        src={image.src}
        alt={image.alt}
        width={1280}
        height={549}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
      <figcaption className="absolute bottom-3 left-4 right-4 text-[11px] leading-snug text-[var(--ins-read)]">
        {image.description}
      </figcaption>
    </figure>
  );
}
