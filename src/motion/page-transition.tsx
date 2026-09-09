import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import { prefersReducedMotion } from "./gsap";

/**
 * Route-change transition.
 *
 * Deliberately enter-only. A true cross-fade has to keep the outgoing tree
 * mounted while the incoming one animates in, which delays the new page's
 * largest paint and hurts LCP on exactly the low-end devices this site has
 * already had reported problems on. Instead the new route paints immediately
 * and plays a short lift-and-fade on top of a paint that has already happened.
 *
 * Implementation is a CSS animation restarted by toggling a data attribute,
 * not a JS tween: no library loads, nothing runs on the main thread beyond an
 * attribute write, and it costs nothing on first load because the effect skips
 * its own initial run.
 *
 * Progress of the router itself is published as `--route-pending` (0 or 1) so
 * a skeleton, a top progress bar, or a dimmed body can hang off it in CSS
 * without any component needing to subscribe to router state.
 */
export function PageTransition({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const ref = useRef<HTMLDivElement | null>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Never animate the first paint — that is the initial page load, and the
    // content should simply be there.
    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion()) return;

    el.removeAttribute("data-route-enter");
    // Force a reflow so removing and re-adding the attribute restarts the
    // animation rather than being coalesced into a no-op.
    void el.offsetWidth;
    el.setAttribute("data-route-enter", "");

    const done = () => el.removeAttribute("data-route-enter");
    el.addEventListener("animationend", done, { once: true });
    return () => el.removeEventListener("animationend", done);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.setProperty("--route-pending", isLoading ? "1" : "0");
  }, [isLoading]);

  return (
    <div ref={ref} className="mo-route">
      {children}
    </div>
  );
}
