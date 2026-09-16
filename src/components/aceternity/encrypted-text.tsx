import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@*<>/\\";

/**
 * EncryptedText — Aceternity UI, ported to this stack.
 *
 * The heading resolves left to right out of scrambled characters when it first
 * enters view. The DOM always holds the REAL string — only the rendered
 * characters are swapped — so the text is correct to a screen reader, to a
 * crawler and with JavaScript off, and `prefers-reduced-motion` prints it
 * straight away.
 */
export default function EncryptedText({
  text,
  className,
  encryptedClassName,
  revealedClassName,
  revealDelayMs = 45,
}: {
  text: string;
  className?: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [revealed, setRevealed] = useState(text.length);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (still.matches || !ref.current) return;
    const node = ref.current;
    let frame = 0;
    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setRevealed(0);
        timer = window.setInterval(() => {
          frame += 1;
          setTick((t) => t + 1);
          if (frame % 2 === 0) {
            setRevealed((current) => {
              if (current >= text.length) {
                window.clearInterval(timer);
                return text.length;
              }
              return current + 1;
            });
          }
        }, revealDelayMs);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [revealDelayMs, text.length]);

  return (
    <span ref={ref} className={cn(className)}>
      {/* The accessible copy: always the real string, never the scramble. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split("").map((char, index) => {
          if (index < revealed || char === " ") {
            return (
              <span key={index} className={revealedClassName}>
                {char}
              </span>
            );
          }
          const scrambled = CHARS[(index * 31 + tick * 7) % CHARS.length] ?? char;
          return (
            <span key={index} className={encryptedClassName}>
              {scrambled}
            </span>
          );
        })}
      </span>
    </span>
  );
}
