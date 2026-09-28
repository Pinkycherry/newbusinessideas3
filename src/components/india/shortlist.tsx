import { createPortal } from "react-dom";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getIndiaIdeas } from "@/lib/india.functions";
import { INDIA_SHORTLIST_MAX, budgetLabel, hoursLabel, type IndiaIdea } from "@/lib/india-shared";

/**
 * Compare up to three ideas. Only the ideas' public keys are stored, in
 * localStorage, and storage that throws (private mode, blocked) just means the
 * shortlist lasts for this page view. No sign-in, nothing sent anywhere.
 */
const STORAGE_KEY = "bbi-india-shortlist";

function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed
          .filter((k): k is string => typeof k === "string" && /^[a-z0-9-]+$/.test(k))
          .slice(0, INDIA_SHORTLIST_MAX)
      : [];
  } catch {
    return [];
  }
}

function writeStored(keys: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    /* storage unavailable: keep it in memory only */
  }
}

type Ctx = {
  keys: string[];
  toggle: (idea: IndiaIdea) => void;
  isSaved: (key: string) => boolean;
};
const ShortlistContext = createContext<Ctx | null>(null);

export function useShortlist(): Ctx {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist outside ShortlistProvider");
  return ctx;
}

export function ShortlistProvider({
  pageIdeas,
  children,
}: {
  pageIdeas: IndiaIdea[];
  children: ReactNode;
}) {
  const [keys, setKeys] = useState<string[]>([]);
  const [known, setKnown] = useState<Record<string, IndiaIdea>>({});
  const [status, setStatus] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Hydrate after mount so server and client render the same markup.
  useEffect(() => setKeys(readStored()), []);

  useEffect(() => {
    setKnown((prev) => {
      const next = { ...prev };
      for (const idea of pageIdeas) next[idea.key] = idea;
      return next;
    });
  }, [pageIdeas]);

  // Saved ideas from another page or set: fetch just those (max three).
  useEffect(() => {
    const missing = keys.filter((k) => !known[k]);
    if (!missing.length) return;
    let alive = true;
    getIndiaIdeas({ data: { keys: missing } })
      .then((ideas) => {
        if (!alive) return;
        setKnown((prev) =>
          Object.fromEntries([...Object.entries(prev), ...ideas.map((i) => [i.key, i])]),
        );
        // Keys that no longer resolve (withdrawn ideas) drop out quietly.
        const found = new Set(ideas.map((i) => i.key));
        setKeys((prev) => {
          const kept = prev.filter((k) => known[k] || found.has(k));
          if (kept.length !== prev.length) writeStored(kept);
          return kept;
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [keys, known]);

  const update = useCallback((next: string[]) => {
    setKeys(next);
    writeStored(next);
  }, []);

  const toggle = useCallback(
    (idea: IndiaIdea) => {
      if (keys.includes(idea.key)) {
        update(keys.filter((k) => k !== idea.key));
        setStatus(`Removed "${idea.title}".`);
      } else if (keys.length >= INDIA_SHORTLIST_MAX) {
        setStatus("Your shortlist holds three ideas. Remove one to add another.");
      } else {
        update([...keys, idea.key]);
        setStatus(`Added "${idea.title}". ${keys.length + 1} of ${INDIA_SHORTLIST_MAX} selected.`);
      }
    },
    [keys, update],
  );

  const ctx = useMemo<Ctx>(
    () => ({ keys, toggle, isSaved: (k) => keys.includes(k) }),
    [keys, toggle],
  );
  const selected = keys.map((k) => known[k]).filter((i): i is IndiaIdea => Boolean(i));

  useEffect(() => {
    if (!keys.length && dialogRef.current?.open) dialogRef.current.close();
  }, [keys.length]);

  return (
    <ShortlistContext.Provider value={ctx}>
      {children}
      {keys.length > 0 && <div className="ia-tray-space" aria-hidden="true" />}
      {/* Portalled to <body>: the shell's later sections form their own
          stacking contexts and painted over a fixed tray nested in the page.
          The wrapper repeats the atlas root classes so the scoped styles apply. */}
      {keys.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="india-atlas ia ia-portal">
            <section className="ia-tray" aria-label="Your shortlist">
              <p className="ia-tray-title">
                Shortlist · {keys.length}/{INDIA_SHORTLIST_MAX}
              </p>
              <ul className="ia-tray-items">
                {selected.map((idea) => (
                  <li key={idea.key}>
                    <button
                      type="button"
                      className="bbi-bare ia-chip"
                      onClick={() => toggle(idea)}
                      aria-label={`Remove ${idea.title} from shortlist`}
                    >
                      {idea.title} ×
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="bbi-bare ia-btn"
                onClick={() => dialogRef.current?.showModal()}
                disabled={selected.length === 0}
              >
                Compare{" "}
                <span className="ia-arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <button
                type="button"
                className="bbi-bare ia-chip"
                onClick={() => {
                  update([]);
                  setStatus("Shortlist cleared.");
                }}
              >
                Clear all
              </button>
              <p className="ia-status" role="status" aria-live="polite">
                {status}
              </p>
            </section>
          </div>,
          document.body,
        )}
      {keys.length === 0 && (
        <p
          className="ia-status"
          role="status"
          aria-live="polite"
          style={{ position: "absolute", left: -9999 }}
        >
          {status}
        </p>
      )}
      <dialog ref={dialogRef} className="ia-dialog" aria-labelledby="ia-compare-h">
        <div className="ia-dialog-head">
          <h2 id="ia-compare-h" className="ia-dialog-title">
            Which beginning fits you?
          </h2>
          <button
            type="button"
            className="bbi-bare ia-close"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close comparison"
          >
            ×
          </button>
        </div>
        <p className="ia-dialog-note">
          These are proposals to test, not validated opportunities. Anything without an estimate
          says so.
        </p>
        <div className="ia-compare-scroll">
          <table className="ia-compare">
            <thead>
              <tr>
                <td />
                {selected.map((idea) => (
                  <th key={idea.key} scope="col">
                    {idea.title}
                    <button
                      type="button"
                      className="bbi-bare ia-remove"
                      onClick={() => toggle(idea)}
                    >
                      Remove this idea
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Who pays", (i) => i.customer],
                  ["The offer", (i) => i.offer],
                  [
                    "Budget estimate",
                    (i) => (i.budgetBasis ? `${budgetLabel(i)}. ${i.budgetBasis}` : budgetLabel(i)),
                  ],
                  ["Assumptions", (i) => i.assumptions ?? "Not estimated"],
                  ["Effort", (i) => hoursLabel(i)],
                  [
                    "Skills",
                    (i) => (i.skillTags.length ? i.skillTags.join(", ") : "Not estimated"),
                  ],
                  ["First test", (i) => i.firstTest],
                  ["Main risk", (i) => i.mainRisk],
                ] as [string, (i: IndiaIdea) => string][]
              ).map(([label, get]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {selected.map((idea) => (
                    <td key={idea.key}>{get(idea)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </dialog>
    </ShortlistContext.Provider>
  );
}

export function SaveToggle({ idea }: { idea: IndiaIdea }) {
  const { isSaved, toggle } = useShortlist();
  const saved = isSaved(idea.key);
  return (
    <button
      type="button"
      className="bbi-bare ia-save"
      aria-pressed={saved}
      onClick={() => toggle(idea)}
      aria-label={`${saved ? "Remove from" : "Add to"} shortlist: ${idea.title}`}
    >
      {saved ? "✓ Saved" : "+ Compare"}
    </button>
  );
}
