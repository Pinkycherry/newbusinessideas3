import { Children, isValidElement, type ReactNode } from "react";

/**
 * Per-word wave reveal, rendered by React.
 *
 * The earlier version split headings by mutating the DOM in an effect. That
 * raced React's lazy route hydration: React compared its SSR HTML against DOM
 * we had already rewritten, threw a hydration mismatch, regenerated the tree
 * and wiped the spans — which is why the desktop homepage showed zero of them.
 *
 * React renders the spans here instead, so server and client agree and there is
 * nothing to race. Delays are a pure function of word index, so SSR and client
 * produce byte-identical markup.
 *
 * Only string children are split. Element children (a gradient `<span>`, a
 * link) are kept whole and animated as one unit.
 */

function wordSpans(text: string, start: number) {
  const out: ReactNode[] = [];
  let i = start;
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      // An inline-block span swallows its own trailing whitespace, so every
      // gap between words stays a plain text node outside the spans.
      out.push(part);
      continue;
    }
    const ph = Math.sin(i * 0.9);
    out.push(
      <span
        key={`w${i}`}
        className="rv"
        style={{
          transitionDelay: `${(Math.min(i * 24, 340) + ph * 26).toFixed(0)}ms`,
          ["--rv-y" as string]: `${(0.16 + 0.14 * (0.5 + 0.5 * ph)).toFixed(3)}em`,
        }}
      >
        {part}
      </span>,
    );
    i += 1;
  }
  return { nodes: out, next: i };
}

export function WaveText({ children }: { children: ReactNode }) {
  const out: ReactNode[] = [];
  let i = 0;
  Children.forEach(children, (child, idx) => {
    if (typeof child === "string" || typeof child === "number") {
      const { nodes, next } = wordSpans(String(child), i);
      out.push(...nodes);
      i = next;
    } else if (isValidElement(child)) {
      const ph = Math.sin(i * 0.9);
      out.push(
        <span
          key={`e${idx}`}
          className="rv"
          style={{ transitionDelay: `${(Math.min(i * 24, 340) + ph * 26).toFixed(0)}ms` }}
        >
          {child}
        </span>,
      );
      i += 1;
    } else if (child != null) {
      out.push(child);
    }
  });
  return <>{out}</>;
}
