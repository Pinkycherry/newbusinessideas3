import { createPortal } from "react-dom";
import { SiClaude, SiPerplexity } from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
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
 * Compare up to four ideas. Only the ideas' public keys are stored, in
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

  // Saved ideas from another page or set: fetch just those (max four).
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
        setStatus("Your shortlist holds four ideas. Remove one to add another.");
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
  const comparisonRows: [string, (idea: IndiaIdea) => string][] = [
    ["Who pays", (idea) => idea.customer],
    ["Problem", (idea) => idea.problem],
    ["The offer", (idea) => idea.offer],
    ["How to reach the buyer", (idea) => idea.customerReach],
    ["Revenue model", (idea) => idea.revenueModel],
    [
      "Budget estimate",
      (idea) => {
        const basis = idea.budgetBasis ? `. ${idea.budgetBasis}` : "";
        const excludes = idea.budgetExcludes ? ` Excludes: ${idea.budgetExcludes}` : "";
        return budgetLabel(idea) + basis + excludes;
      },
    ],
    ["Assumptions", (idea) => idea.assumptions || "Not estimated"],
    ["Effort", (idea) => hoursLabel(idea)],
    ["Skills", (idea) => (idea.skillTags.length ? idea.skillTags.join(", ") : "Not estimated")],
    ["First test", (idea) => idea.firstTest],
    ["Main risk", (idea) => idea.mainRisk],
  ];
  const comparisonPrompt = [
    "Compare these selected business ideas for a founder in India. Use the same criteria for every idea. Distinguish source details, current evidence, estimates and assumptions. Do not invent demand, costs, customer results, market size or success probabilities. Cite current sources with URLs and dates.",
    ...selected.map((idea, index) => [
      "IDEA " + (index + 1) + ": " + idea.title,
      "Buyer: " + idea.customer,
      "Problem: " + idea.problem,
      "Offer: " + idea.offer,
      "Customer reach: " + idea.customerReach,
      "Revenue model: " + idea.revenueModel,
      "Budget: " + budgetLabel(idea) + (idea.budgetBasis ? " — " + idea.budgetBasis : ""),
      "Assumptions: " + (idea.assumptions || "Not estimated"),
      "Time: " + hoursLabel(idea),
      "Skills: " + (idea.skillTags.join(", ") || "Not estimated"),
      "First test: " + idea.firstTest,
      "Main risk: " + idea.mainRisk,
    ].join("\n")),
    "Compare buyer access, evidence of a real problem, alternatives, revenue, cash needed before collection, delivery effort, risks and the cheapest next test. Identify missing evidence instead of filling gaps with guesses. Do not declare a winner unless the evidence supports a clear, qualified recommendation.",
  ].join("\n\n");
  const grokComparisonPrompt = [
    "Compare these business ideas for an Indian founder. Use current sources with URLs and dates. Separate facts, assumptions and unknowns; never invent demand or success odds.",
    ...selected.map((idea) => [
      "IDEA: " + idea.title,
      "Buyer: " + idea.customer.slice(0, 75),
      "Problem: " + idea.problem.slice(0, 75),
      "Offer: " + idea.offer.slice(0, 75),
      "Revenue: " + idea.revenueModel.slice(0, 75),
      "Budget: " + budgetLabel(idea),
      "First test: " + idea.firstTest.slice(0, 75),
      "Risk: " + idea.mainRisk.slice(0, 75),
    ].join("\n")),
    "Compare buyer access, demand evidence, cash, revenue, effort and risk. Recommend the cheapest next test; do not invent facts.",
  ].join("\n\n");

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
          <table className="ia-compare ia-compare-desktop">
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
              {comparisonRows.map(([label, get]) => (
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
        <div className="ia-compare-mobile" aria-label="Mobile idea comparison">
          {selected.map((idea) => (
            <article key={idea.key} className="ia-compare-card">
              <h3>{idea.title}</h3>
              <dl>
                {comparisonRows.map(([label, get]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{get(idea)}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                className="bbi-bare ia-remove"
                onClick={() => toggle(idea)}
              >
                Remove this idea
              </button>
            </article>
          ))}
        </div>
        {selected.length >= 2 && (
          <section className="ia-ai-handoff" aria-labelledby="ia-ai-handoff-title">
            <h3 id="ia-ai-handoff-title">Research this comparison with AI</h3>
            <p>Choose a tool. The prepared question includes all selected ideas and asks it to compare the same evidence across each one.</p>
            <div className="ia-ai-providers">
              <a href={`https://chatgpt.com/?q=${encodeURIComponent(comparisonPrompt)}`} target="_blank" rel="noopener noreferrer">
                <RiOpenaiFill aria-hidden="true" /> <span>ChatGPT</span>
              </a>
              <a href={`https://claude.ai/new?q=${encodeURIComponent(comparisonPrompt)}`} target="_blank" rel="noopener noreferrer">
                <SiClaude aria-hidden="true" /> <span>Claude</span>
              </a>
              <a href={`https://www.perplexity.ai/search?q=${encodeURIComponent(comparisonPrompt)}`} target="_blank" rel="noopener noreferrer">
                <SiPerplexity aria-hidden="true" /> <span>Perplexity</span>
              </a>
              <a href={`https://grok.com/?q=${encodeURIComponent(grokComparisonPrompt)}`} target="_blank" rel="noopener noreferrer">
                <img src="https://grok.com/images/favicon.svg" alt="" aria-hidden="true" width={22} height={22} />
                <span>Grok</span>
              </a>
            </div>
            <p className="ia-ai-note">Review the question in the selected tool and send it there. Provider access and URL-prefill behaviour can vary.</p>
          </section>
        )}
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
