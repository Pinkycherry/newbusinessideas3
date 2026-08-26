/**
 * Cinematic word reveal — blur-to-sharp, staggered, on mount.
 *
 * Wraps existing headline content without changing a single word: string
 * children are split into words, element children (a gradient <span>, etc.)
 * are kept intact and treated as one unit. Pure CSS animation, transform +
 * opacity + filter only, so there is no JS on the critical path and the copy
 * is fully present in the SSR HTML for crawlers.
 */
import { Children, Fragment, isValidElement, type ReactNode } from "react";

export function CineWords({
  children,
  delay = 0,
  step = 55,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  step?: number;
  className?: string;
}) {
  let i = 0;
  const nodes: ReactNode[] = [];

  const push = (node: ReactNode, key: string) => {
    const d = delay + i * step;
    i += 1;
    nodes.push(
      <span key={key} className="cine-word" style={{ animationDelay: `${d}ms` }}>
        {node}
      </span>,
    );
  };

  Children.toArray(children).forEach((child, ci) => {
    if (typeof child === "string" || typeof child === "number") {
      String(child)
        .split(/(\s+)/)
        .forEach((chunk, wi) => {
          if (!chunk.trim()) {
            nodes.push(<Fragment key={`s-${ci}-${wi}`}> </Fragment>);
            return;
          }
          push(chunk, `w-${ci}-${wi}`);
        });
      return;
    }
    if (isValidElement(child)) push(child, `e-${ci}`);
    else nodes.push(child);
  });

  return <span className={className}>{nodes}</span>;
}
