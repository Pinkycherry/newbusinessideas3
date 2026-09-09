import { useEffect, useState } from "react";

import { hideImgIfBroken } from "@/lib/utils";

/**
 * The hero's single image frame.
 *
 * It was a three-slide carousel on a 16:10 frame filling half the hero. The
 * founder asked for something simple and smaller, and for the hero to stop
 * paying to load it: three photographs, a rotation timer, framer-motion
 * cross-fades and a row of dot controls have all gone. One image, eager, at a
 * fraction of the height.
 *
 * The two captions that belonged to the removed slides went with them; the
 * Golden Tree's own caption is unchanged.
 */
const HERO_IMAGE = {
  src: "https://ethicalfounder.com/wp-content/uploads/2026/08/business-ideas-tree-for-startup-invention-low-cost-business-ideas-latest-zero-investement.jpg",
  alt: "The Golden Tree of Business Growth — business ideas mapped across branches",
  caption: "The Golden Tree — every branch is a live category",
};

export function HeroFrame() {
  return (
    <figure className="mo-media iv-hero-frame glass relative aspect-[4/3] w-full">
      <img
        ref={hideImgIfBroken}
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
      <figcaption className="absolute bottom-3 left-4 right-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
        {HERO_IMAGE.caption}
      </figcaption>
    </figure>
  );
}

/** Typewriter branding line — types once on load, then leaves a blinking caret. */
export function Typewriter({
  text,
  className = "",
  speed = 55,
  startDelay = 250,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={`inline-flex items-center ${className}`} aria-label={text}>
      <span aria-hidden>{text.slice(0, shown)}</span>
      <span aria-hidden className="iv-caret" />
    </span>
  );
}
