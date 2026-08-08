import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Hero imagery slider. Slides use the imagery already used across the site
 * (the Golden Tree artwork first) — purely visual, no clickable nodes on top.
 */
const SLIDES = [
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2026/08/business-ideas-tree-for-startup-invention-low-cost-business-ideas-latest-zero-investement.jpg",
    alt: "The Golden Tree of Business Growth — business ideas mapped across branches",
    caption: "The Golden Tree — every branch is a live category",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-16.jpg.webp",
    alt: "Founder working at a laptop in a warmly lit workspace",
    caption: "Blueprints written for the person who has to build it",
  },
  {
    src: "https://ethicalfounder.com/wp-content/uploads/2025/10/image-37.jpg.webp",
    alt: "Close-up of hands typing on a laptop keyboard",
    caption: "Free validation on every blueprint",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5200);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index]!;

  return (
    <div className="relative">
      <div className="iv-hero-frame glass relative aspect-[16/10] w-full overflow-hidden rounded-[2rem]">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading="lazy"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
        <AnimatePresence mode="wait">
          <motion.p
            key={slide.caption}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-4 left-4 right-16 text-xs font-semibold uppercase tracking-[0.18em] text-foreground sm:text-[13px]"
          >
            {slide.caption}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-7 bg-primary" : "w-2.5 bg-foreground/35 hover:bg-foreground/60"
            }`}
          />
        ))}
      </div>
    </div>
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
