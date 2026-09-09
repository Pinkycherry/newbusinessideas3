import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

import { cn, hideImgIfBroken } from "@/lib/utils";

export type ParallaxCard = {
  title: string;
  meta?: string;
  src: string;
  alt: string;
  to: string;
  params: Record<string, string>;
};

/**
 * HeroParallax — Aceternity UI, ported to this stack.
 *
 * Two rows of plates travelling in opposite directions as the band scrolls
 * past. Upstream this is three rows over roughly 180vh, which on a page that
 * has already been cut for length would be another long section; two rows over
 * a little more than one screen says the same thing in half the height.
 *
 * Every plate is a real category link, so the band is navigation rather than
 * decoration, and it is keyboard-reachable in reading order.
 */
function Row({
  cards,
  translate,
  className,
}: {
  cards: ParallaxCard[];
  translate: MotionValue<number>;
  className?: string;
}) {
  return (
    <motion.div className={cn("flex gap-5", className)} style={{ x: translate }}>
      {cards.map((card) => (
        <Link
          key={`${card.title}-${card.to}-${card.params["categorySlug"] ?? ""}`}
          to={card.to}
          params={card.params}
          className="group/plate relative h-52 w-[22rem] shrink-0 overflow-hidden rounded-md border border-border bg-card md:h-64 md:w-[28rem]"
        >
          <img
            src={card.src}
            alt={card.alt}
            loading="lazy"
            ref={hideImgIfBroken}
            onError={(event) => hideImgIfBroken(event.currentTarget)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/plate:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/88 via-foreground/30 to-transparent opacity-90 transition-opacity duration-300 group-hover/plate:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="block text-lg font-semibold leading-snug text-background">
              {card.title}
            </span>
            {card.meta ? (
              <span className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-background/70">
                {card.meta}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </motion.div>
  );
}

export default function HeroParallax({
  cards,
  eyebrow,
  heading,
  children,
}: {
  cards: ParallaxCard[];
  eyebrow: string;
  heading: string;
  children?: React.ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ["start end", "end start"],
  });
  const spring = useSpring(scrollYProgress, { stiffness: 220, damping: 34, bounce: 0 });
  const left = useTransform(spring, [0, 1], [0, 380]);
  const right = useTransform(spring, [0, 1], [0, -380]);

  const half = Math.ceil(cards.length / 2);
  const topRow = cards.slice(0, half);
  const bottomRow = cards.slice(half);

  return (
    <section
      ref={hostRef}
      data-anchor="library"
      data-anchor-label="The library"
      className="overflow-hidden py-14"
      aria-label={heading}
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        <p className="t-eyebrow">{eyebrow}</p>
        <h2 className="mt-2 max-w-2xl">{heading}</h2>
        {children ? <div className="mt-3 max-w-2xl">{children}</div> : null}
      </div>
      <div className="mt-9 flex flex-col gap-5">
        <Row cards={topRow} translate={left} className="-ml-24" />
        <Row cards={bottomRow} translate={right} className="-ml-64" />
      </div>
    </section>
  );
}
