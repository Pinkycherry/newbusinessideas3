import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

/**
 * One list of section destinations, and every control that navigates it.
 *
 * `CinemaSection[]` is built once per page (idea-cinema.tsx) and handed to
 * both the hero's "On this page" control and the header's contents control,
 * so the two can never offer different destinations again. Every entry is a
 * real `href="#id"`: the browser does the scrolling (smooth via CSS, instant
 * under reduced motion), history and deep links keep working, and a wheel or
 * touch interrupts it the way any native scroll is interrupted.
 */
export type CinemaSection = { id: string; label: string };

/* The active section, shared by every contents control through one small
   store instead of React state on the page: a change re-renders only the
   two menus, never the article. */
let activeId = "";
const listeners = new Set<() => void>();
function setActive(id: string) {
  if (id === activeId) return;
  activeId = id;
  for (const l of listeners) l();
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const getActive = () => activeId;
const getServerActive = () => "";

/** One IntersectionObserver for the page's sections. Call once per page. */
export function useTrackSections(sections: CinemaSection[]) {
  const key = sections.map((s) => s.id).join(",");
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // The first section in document order that sits in the reading band.
        const first = nodes.find((n) => visible.has(n.id));
        setActive(first ? first.id : "");
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      setActive("");
    };
  }, [key]);
}

/**
 * The compact "On this page" control. A button with aria-expanded opens a
 * short list of links; picking one, pressing Escape or clicking elsewhere
 * closes it. The current section is marked with aria-current and a visible
 * text marker, not colour alone.
 */
export function CinemaContents({
  sections,
  variant,
}: {
  sections: CinemaSection[];
  variant: "hero" | "header";
}) {
  const [open, setOpen] = useState(false);
  const active = useSyncExternalStore(subscribe, getActive, getServerActive);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const activeLabel = sections.find((s) => s.id === active)?.label;

  return (
    <div
      ref={rootRef}
      className={`cm-contents cm-contents-${variant}`}
      data-open={open || undefined}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="cm-contents-toggle bbi-bare"
        aria-expanded={open}
        aria-label="On this page"
        aria-controls={listId}
        data-contents-toggle
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cm-contents-bars" aria-hidden="true" />
        <span className="cm-contents-label">
          {variant === "header" ? "Contents" : "On this page"}
        </span>
        {variant === "header" && activeLabel && (
          <span className="cm-contents-now">
            <span className="sr-only">, now reading </span>
            {activeLabel}
          </span>
        )}
      </button>
      <nav id={listId} className="cm-contents-panel" aria-label="On this page" hidden={!open}>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={s.id === active ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{s.label}</span>
                {s.id === active && <span className="cm-contents-here">(you are here)</span>}
              </a>
            </li>
          ))}
        </ol>
        <a className="cm-contents-top" href="#top" onClick={() => setOpen(false)}>
          Back to top
        </a>
      </nav>
    </div>
  );
}
