import { useRef, useState } from "react";

import { usePinProgress } from "@/lib/scroll-devices";

/**
 * The brand arc — the founder's four frames as ONE pinned stage where the
 * scroll wheel is the playhead.
 *
 * The four images are frames of a single continuous shot: the idea appears
 * inside them, goes external, gets sorted, gets released. So the scroll moves
 * *through* the sequence rather than past four separate sections — the stage
 * pins, and scroll progress cross-dissolves and scales one frame into the
 * next while the matching line of copy fades through with it.
 *
 * Nothing is layered on the artwork. An earlier build pasted category pills
 * over the capsules already painted in frame 2 and a nine-card grid over the
 * panels already painted in frame 3, which doubled the artwork's own elements
 * and read as UI dumped on a photograph. Category navigation lives in its own
 * plain section further down the page, not on top of the images.
 *
 * Nothing is drawn on top of the artwork. An earlier version stamped the
 * library's total idea count over the frames as a large numeral, purely
 * because the number happened to be in scope. It said nothing the frames were
 * saying, and it was the founder's generated artwork with a statistic pasted
 * across it. The frames carry the section on their own.
 *
 * All motion is driven from `--sc-p` (0 to 1) published by `usePinProgress`,
 * so every frame of it corresponds to a real scroll position rather than
 * firing once on entry.
 */

type Frame = { src: string; eyebrow: string; line: string };

const FRAMES: Frame[] = [
  {
    src: "/01-mind-begins.webp",
    eyebrow: "It starts",
    line: "A thought you cannot put down.",
  },
  {
    src: "/02-global-scan.webp",
    eyebrow: "You look",
    line: "So you go looking at what is actually out there.",
  },
  {
    src: "/03-validation-cascade.webp",
    eyebrow: "It sorts",
    line: "Sorted, scored, and honest about the downside.",
  },
  {
    src: "/04-open-pathways.webp",
    eyebrow: "It opens",
    line: "Then the road stops being theoretical.",
  },
];

export function BrandArc() {
  const stageRef = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);

  // One viewport-height of travel per frame, plus one to land on. The pin
  // publishes --sc-p for the CSS and mirrors it into React state so the
  // copy layer can pick the active frame without a second scroll listener.
  usePinProgress(stageRef, { spanVh: FRAMES.length + 1, onUpdate: setP });

  const active = Math.min(FRAMES.length - 1, Math.floor(p * FRAMES.length));

  return (
    <section
      ref={stageRef}
      className="bbi-arc"
      data-anchor="arc"
      data-anchor-label="The arc"
      aria-label="How a business idea goes from thought to something you can act on"
    >
      <div className="bbi-arc-stage">
        {FRAMES.map((f, i) => (
          <img
            key={f.src}
            src={f.src}
            alt=""
            aria-hidden
            width={1280}
            height={720}
            className="bbi-arc-frame"
            data-state={i === active ? "on" : i < active ? "past" : "next"}
            loading={i === 0 ? "eager" : "lazy"}
            {...(i === 0 ? { fetchPriority: "high" as const } : {})}
          />
        ))}

        <div className="bbi-arc-veil" aria-hidden />

        <div className="bbi-arc-copy">
          {FRAMES.map((f, i) => (
            <p key={f.src} className="bbi-arc-line" data-state={i === active ? "on" : "off"}>
              <span className="bbi-arc-eyebrow">{f.eyebrow}</span>
              <span className="bbi-arc-text">{f.line}</span>
            </p>
          ))}
        </div>

        {/* Progress through the sequence, drawn straight from scroll position. */}
        <div className="bbi-arc-rail" aria-hidden>
          {FRAMES.map((f, i) => (
            <span key={f.src} className="bbi-arc-tick" data-state={i <= active ? "on" : "off"} />
          ))}
        </div>
      </div>
    </section>
  );
}
