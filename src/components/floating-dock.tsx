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
    // Back-to-top must work on every route, anchors or not.
    const onScroll = () => setScrolled(window.scrollY > 400);
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
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-7 sm:right-6">
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
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="glass-btn grid h-11 w-11 place-items-center rounded-full"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {anchors.length > 0 && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Jump to a section"
            className="glass-btn grid h-11 w-11 place-items-center rounded-full"
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
