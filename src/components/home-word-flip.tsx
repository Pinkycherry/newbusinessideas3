import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { onVisible } from "@/motion/engine";

/** A homepage word plate whose timer exists only while a reader can see it. */
export default function HomeWordFlip({
  words,
  text,
  interval = 2800,
  className,
  wordClassName,
}: {
  words: string[];
  text?: string;
  interval?: number;
  className?: string;
  wordClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [index, setIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const count = words.length;

  useEffect(() => {
    const el = ref.current;
    if (!el || count < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: number | undefined;
    const sync = () => {
      const active = visible && !document.hidden && !reduced.matches;
      setMoving(active);
      if (!active && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      } else if (active && timer === undefined) {
        timer = window.setInterval(() => setIndex((value) => (value + 1) % count), interval);
      }
    };
    const release = onVisible(el, (value) => {
      visible = value;
      sync();
    });
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      release();
      window.clearInterval(timer);
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [count, interval]);

  // Reserve the widest label in a shared grid cell. Rotation never shifts
  // the surrounding heading, and labels can wrap within a narrow phone.
  const widest = words.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    "",
  );
  const word = words[index] ?? words[0] ?? "";
  return (
    <span ref={ref} className={cn("home-word-flip", className)}>
      {text ? <span>{text}</span> : null}
      <span className={cn("home-word-plate", wordClassName)}>
        <span className="home-word-reserve" aria-hidden>
          {widest}
        </span>
        <span key={word} className={moving ? "home-word-current is-moving" : "home-word-current"}>
          {word}
        </span>
      </span>
    </span>
  );
}
