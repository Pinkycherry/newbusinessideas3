import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

import { searchTaxonomy } from "@/lib/catalog";

/**
 * Live suggest search over the 100 categories and 1,000 subcategories. The
 * name index is small and static, so matching runs in the browser.
 */
export function LiveSearch({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 220);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = useMemo(
    () => (debounced.length >= 2 ? searchTaxonomy(debounced, 6) : []),
    [debounced],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setOpen(false);
    onNavigate?.();
    navigate({ to: "/search", search: { q: term.trim() } });
  };

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <form onSubmit={submit} className="glass flex items-center gap-2 rounded-full px-3.5 py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search categories…"
          aria-label="Search business categories"
          className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>

      <AnimatePresence>
        {open && debounced.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-nav absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(24rem,80vw)] overflow-hidden rounded-2xl p-1.5"
          >
            {items.length === 0 && (
              <p className="px-3 py-2.5 text-xs text-muted-foreground">No matches yet.</p>
            )}
            {items.map((hit) => (
              <button
                key={hit.kind === "category" ? hit.categorySlug : hit.subcategorySlug}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                  if (hit.kind === "category") {
                    navigate({
                      to: "/category/$categorySlug",
                      params: { categorySlug: hit.categorySlug },
                    });
                  } else {
                    navigate({
                      to: "/category/$categorySlug/$subcategorySlug",
                      params: { categorySlug: hit.categorySlug, subcategorySlug: hit.subcategorySlug },
                    });
                  }
                }}
                className="block w-full truncate rounded-xl px-3 py-2 text-left text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {hit.name}
                {hit.kind === "subcategory" && (
                  <span className="ml-1.5 font-normal opacity-70">· {hit.categoryName}</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
