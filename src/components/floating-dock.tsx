import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Compass } from "lucide-react";

type Anchor = { id: string; label: string };

/**
 * Bottom-right layout anchors. Sections opt in by adding
 * `data-anchor="some-id" data-anchor-label="Label"` — nothing is hardcoded.
 */
export function FloatingDock() {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Back-to-top must work on every route, anchors or not. A fixed pixel
    // threshold (400px) meant it appeared almost immediately on a short page
    // and barely ever on a long one -- scroll depth as a percentage of the
    // page's own scrollable height is consistent across every page.
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollable > 0 ? window.scrollY / scrollable : 0;
      setScrolled(depth > 0.15);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-anchor]"));
    setAnchors(
      nodes.map((n) => ({
        id: n.dataset["anchor"] ?? "",
        label: n.dataset["anchorLabel"] ?? n.dataset["anchor"] ?? "",
      })),
    );
    if (nodes.length === 0) {
      return () => window.removeEventListener("scroll", onScroll);
    }
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.getAttribute("data-anchor") ?? "");
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <div className="bbi-overlay fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-7 sm:right-6">
      <AnimatePresence>
        {open && anchors.length > 0 && (
          <motion.nav
            key="dock-nav"
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Page sections"
            className="glass-nav w-56 rounded-2xl p-2"
          >
            {anchors.map((a, i) => (
              <motion.button
                key={a.id}
                type="button"
                onClick={() => go(a.id)}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className={`block w-full truncate rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                  active === a.id
                    ? "bg-primary/25 text-foreground"
                    : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {a.label}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {scrolled && (
            <motion.button
              key="to-top"
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileHover={{ scale: 1.045, y: -2 }}
              whileTap={{ scale: 0.96 }}
              // Was window.scrollTo({ top: 0, behavior: "smooth" }). Confirmed
              // live: on routes with active GSAP ScrollTrigger instances (every
              // idea page has several), the native smooth-scroll animation
              // fights the trigger recalculations those instances run on their
              // own scroll listeners -- caught it outright stalling mid-flight,
              // and once caught it reversing direction partway through. An
              // instant jump finishes inside one frame, before any trigger gets
              // a chance to react, so there is nothing left to fight it.
              onClick={() => window.scrollTo(0, 0)}
              aria-label="Back to top"
              /* `rounded-full` alone does not win here. The unlayered
                 `.glass-btn, .glass-pill, …` block in styles.css sets
                 `border-radius: 0.375rem`, and an unlayered rule beats every
                 Tailwind utility regardless of specificity -- so this rendered
                 as a rounded square, and the pill-shaped `::before` specular
                 highlight (border-radius 9999px, height 46%, drawn for wide
                 capsules) sat inside it as a separate floating blob. An inline
                 style is the one thing that wins without editing the shared
                 block, which every button on the site depends on. */
              style={{ borderRadius: "9999px" }}
              className="glass-btn bbi-dock-btn grid h-11 w-11 place-items-center rounded-full"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {anchors.length > 0 && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.045, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Jump to a section"
            /* Same override as the back-to-top button above. */
            style={{ borderRadius: "9999px" }}
            className="glass-btn bbi-dock-btn grid h-11 w-11 place-items-center rounded-full"
          >
            <motion.span
              animate={{ rotate: open ? 135 : 0 }}
              transition={{ duration: 0.3 }}
              className="grid place-items-center"
            >
              <Compass className="h-4 w-4" />
            </motion.span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
