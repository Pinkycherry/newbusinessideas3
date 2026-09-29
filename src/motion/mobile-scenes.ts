/** One observer for mobile entrances; readable SSR, no scroll/render loop. */
export function observeMobileScenes(root: HTMLElement): () => void {
  const mobile = matchMedia("(max-width: 1023px), (pointer: coarse)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let stop = () => {};
  const sync = () => {
    stop();
    if (!mobile.matches || reduced.matches || typeof IntersectionObserver === "undefined") return;
    const registered = new Set<HTMLElement>();
    const generated = new Set<HTMLElement>();
    const rules = [
      [".cm-section-head, .cm-head", "chapter"],
      [".cm-blueprint-panel", "blueprint"],
      [".cm-side-pro, .cm-side-con", "verdict"],
      [".cm-ledger-side", "ledger"],
      [".cm-mission, .cm-timeline", "playbook"],
      [".cm-deck-card, .mo-card", "archive"],
    ] as const;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting && !document.hidden) {
            el.dataset["scrollActive"] = "true";
            el.removeAttribute("data-scroll-paused");
          } else if (el.dataset["scrollActive"]) {
            el.dataset["scrollPaused"] = "true";
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    const register = (branch: HTMLElement) => {
      for (const [selector, scene] of rules) {
        const elements = [...branch.querySelectorAll<HTMLElement>(selector)];
        if (branch.matches(selector)) elements.push(branch);
        for (const el of elements) {
          if (el.dataset["scrollScene"]) continue;
          el.dataset["scrollScene"] = scene;
          generated.add(el);
        }
      }
      const scenes = [...branch.querySelectorAll<HTMLElement>("[data-scroll-scene]")];
      if (branch.matches("[data-scroll-scene]")) scenes.push(branch);
      for (const el of scenes) {
        if (registered.has(el)) continue;
        registered.add(el);
        io.observe(el);
      }
    };
    register(root);
    // Lazy sections and route data can appear after the shell has hydrated.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) if (node instanceof HTMLElement) register(node);
        for (const node of record.removedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          for (const el of registered) {
            if (el === node || node.contains(el)) {
              io.unobserve(el);
              registered.delete(el);
              generated.delete(el);
            }
          }
        }
      }
    });
    mutations.observe(root, { childList: true, subtree: true });
    const visibility = () => {
      for (const el of registered) {
        if (document.hidden) el.dataset["scrollPaused"] = "true";
        else {
          io.unobserve(el);
          io.observe(el);
        }
      }
    };
    document.addEventListener("visibilitychange", visibility);
    stop = () => {
      io.disconnect();
      mutations.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      for (const el of registered) {
        el.removeAttribute("data-scroll-active");
        el.removeAttribute("data-scroll-paused");
      }
      for (const el of generated) el.removeAttribute("data-scroll-scene");
    };
  };
  sync();
  mobile.addEventListener("change", sync);
  reduced.addEventListener("change", sync);
  return () => {
    stop();
    mobile.removeEventListener("change", sync);
    reduced.removeEventListener("change", sync);
  };
}
