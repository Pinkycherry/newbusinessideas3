import { useEffect } from "react";

/**
 * Palette guard (founder, 8 Nov 2026): older pages still carried colours from the light theme
 * (navy text, white borders, violet, blue, green, light panels). After each page renders, every
 * element inside the ember frame is checked once and anything off the black / white / red palette
 * is mapped onto it. Runs in idle time, a few thousand elements, once per page plus two late passes.
 */
function paletteGuard(scope: Element) {
  const parse = (c: string) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1]!.split(",").map(Number); return { r: v[0]!, g: v[1]!, b: v[2]!, a: v.length > 3 ? v[3]! : 1 }; };
  const hsl = (c: { r: number; g: number; b: number }) => { const r = c.r / 255, g = c.g / 255, b = c.b / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return { h, s, l }; };
  const offHue = (h: number, s: number) => s > 0.28 && h > 18 && h < 340;
  scope.querySelectorAll<HTMLElement>("*").forEach((el) => {
    if (el.closest("svg,canvas,img,video,picture,.eh-stage,[data-keep-colour]") && el.tagName !== "svg") return;
    if (el.dataset["pg"]) return;
    el.dataset["pg"] = "1";
    const cs = getComputedStyle(el);
    const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
    if (hasText) {
      const c = parse(cs.color);
      if (c && c.a > 0.3) {
        const { h, s, l } = hsl(c);
        // Red text on a red surface is unreadable: find the surface behind the text first.
        let surface: { r: number; g: number; b: number; a: number } | null = null;
        for (let p: HTMLElement | null = el; p && p !== scope; p = p.parentElement) { const b = parse(getComputedStyle(p).backgroundColor); const img = getComputedStyle(p).backgroundImage; if ((b && b.a > 0.35) || img.includes("gradient")) { surface = b && b.a > 0.35 ? b : (parse((img.match(/rgba?\([^)]+\)/) ?? [""])[0]!) ?? null); break; } }
        const sRed = surface ? (() => { const x = hsl(surface); return x.s > 0.35 && (x.h < 18 || x.h > 340) && x.l > 0.18; })() : false;
        const tRed = s > 0.35 && (h < 18 || h > 340);
        if (sRed && (tRed || l < 0.6)) el.style.setProperty("color", "#ffffff", "important");
        else if (l < 0.42) el.style.setProperty("color", "#ece3e3", "important");
        else if (offHue(h, s)) el.style.setProperty("color", "#ff4f4f", "important");
      }
    }
    // Editorial pages (about, founders, contact, policies): sections are plain, never boxed.
    if (el.matches(".gl-editorial :is(.gl-editorial-unit,.gl-editorial-section,.gl-editorial-hero,.v2p-section,.v2p-hero,.gl-editorial-stack)")) return;
    const bg = parse(cs.backgroundColor);
    if (bg && bg.a > 0.25) { const { h, s, l } = hsl(bg); if (l > 0.7) el.style.setProperty("background-color", el.tagName === "SECTION" || el.getBoundingClientRect().width > window.innerWidth * 0.7 ? "transparent" : "#161313", "important"); else if (offHue(h, s)) el.style.setProperty("background-color", l > 0.35 ? "#c8141a" : "#2a1416", "important"); }
    if (cs.backgroundImage.includes("gradient")) {
      const cols = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) ?? []).map(parse).filter(Boolean) as { r: number; g: number; b: number; a: number }[];
      if (cols.some((c) => { const { h, s, l } = hsl(c); return c.a > 0.3 && (l > 0.78 || (offHue(h, s) && l > 0.12)); })) el.style.setProperty("background-image", el.tagName === "SECTION" || el.getBoundingClientRect().width > window.innerWidth * 0.7 ? "none" : "linear-gradient(160deg,#1c1818,#100d0d)", "important");
    }
    if (parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0) {
      const bc = parse(cs.borderTopColor) ?? parse(cs.borderLeftColor);
      if (bc && bc.a > 0.3) { const { h, s, l } = hsl(bc); if (l > 0.7 || offHue(h, s)) el.style.setProperty("border-color", "rgba(235,30,36,.35)", "important"); }
    }
  });
}

/**
 * Key words in red (founder, 8 Nov 2026): in every big heading the important word or phrase is red and
 * the rest stays white. Headings that already carry a red word are left alone. One phrase per heading,
 * picked from the site's own vocabulary in priority order; a heading with none gets its last word.
 */
const KEYWORDS = ["business ideas", "business idea", "go wrong", "money to start", "pays? you", "money comes", "need", "guides?", "questions?", "tools?", "calculators?", "lists?", "resources", "side hustles?", "startup ideas?", "1 lakh women", "women", "validate", "free", "calculators?", "blueprints?", "ideas?", "India(?:'s)?", "money", "profit", "income", "startups?", "founders?", "verdict", "risks?", "guides?", "library", "categor(?:y|ies)", "compare", "answers?", "customers?", "buyers?", "costs?", "loans?", "GST", "map"];
const KW_RES = KEYWORDS.map((k) => new RegExp(`\\b(${k})\\b`, "i"));
function redKeywords(scope: Element) {
  // CSS Custom Highlight: paints the words red without touching the DOM React owns.
  const H = (window as unknown as { Highlight?: new (...r: Range[]) => { add(r: Range): void } }).Highlight;
  const reg = (CSS as unknown as { highlights?: Map<string, unknown> }).highlights;
  if (!H || !reg) return;
  const hl = (reg.get("kw-red") as { add(r: Range): void } | undefined) ?? (() => { const x = new H(); reg.set("kw-red", x); return x; })();
  // Founder, 8 Nov 2026: card headings (h3) too, two colours: up to two key words red, the rest white.
  scope.querySelectorAll<HTMLElement>("main :is(h1,h2,h3,h4)").forEach((h) => {
    if (h.dataset["kw"] || h.closest(".eh-stage,[data-keep-colour],.eh-hero")) return;
    h.dataset["kw"] = "1";
    const isRed = (el: Element) => { const m = getComputedStyle(el).color.match(/\d+/g); return !!m && +m[0]! > 150 && +m[1]! < 90 && +m[2]! < 90; };
    if (Array.from(h.querySelectorAll("*:not(svg):not(svg *)")).some(isRed) || isRed(h)) return;
    const texts: Text[] = [];
    const walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) if ((n.textContent ?? "").trim()) texts.push(n as Text);
    if (!texts.length) return;
    const mark = (t: Text, start: number, len: number) => { const r = document.createRange(); r.setStart(t, start); r.setEnd(t, start + len); hl.add(r); };
    const max = h.tagName === "H3" || h.tagName === "H4" ? 2 : 1; let n = 0; const used: [Text, number, number][] = [];
    for (const re of KW_RES) for (const t of texts) {
      const m = re.exec(t.data);
      if (m && !used.some(([u, a, b]) => u === t && m.index < b && m.index + m[0].length > a)) { mark(t, m.index, m[0].length); used.push([t, m.index, m.index + m[0].length]); if (++n >= max) return; break; }
    }
    if (n) return;
    const last = texts[texts.length - 1]!; const m = /([\p{L}\p{N}'’-]+)[^\p{L}\p{N}]*$/u.exec(last.data);
    if (m) mark(last, m.index, m[1]!.length);
  });
}

/** Scroll reveal (fade up) for every page in the shared frame. Content stays visible without JS. */
export function useGlassMotion() {
  useEffect(() => {
    const root = document.documentElement;
    let io: IntersectionObserver | null = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window && !reduceMotion) {
      root.classList.add("rv-on");
      // Site-wide (7 Nov 2026): every section after the first fades up as it enters, like /calculator.
      document.querySelectorAll<HTMLElement>("main section").forEach((sec, i) => {
        if (i === 0 || sec.hasAttribute("data-reveal") || sec.closest("[data-reveal]") || sec.getBoundingClientRect().top < window.innerHeight) return;
        sec.setAttribute("data-reveal", "");
      });
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      // Founder, 8 Nov 2026: cards inside a section arrive one after another, alternating from the left
      // and the right (once, on the way down).
      els.forEach((el) => {
        const kids = el.querySelectorAll<HTMLElement>("[data-stagger]").length ? Array.from(el.querySelectorAll<HTMLElement>("[data-stagger]"))
          : Array.from(el.querySelectorAll<HTMLElement>(":scope > div > ul:not([data-loop-copy]) > li, :scope > div > div > ul > li, :scope > div > ol > li, :scope > div > div[class*='grid'] > *")).filter((k) => !k.closest(".g-marquee")).slice(0, 24);
        kids.forEach((c, i) => {
          c.setAttribute("data-stagger", "");
          c.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
          // Grids of four or more cards (categories, lists) wipe in one after another; small groups slide in.
          if (!c.dataset["from"]) c.dataset["from"] = kids.length >= 4 ? "wipe" : i % 3 === 0 ? "left" : i % 3 === 1 ? "up" : "right";
          if (kids.length >= 4) c.style.transitionDelay = `${Math.min(i, 12) * 100}ms`;
        });
      });
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          // Founder, 8 Nov 2026 (later): one way only. A section plays once as it comes in, then stays.
          if (e.isIntersecting) { el.classList.add("rv-in"); el.classList.remove("rv-above"); io?.unobserve(el); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
      els.forEach((el) => io!.observe(el));
    }
    // Speed (7 Nov 2026): looping animations run only while on screen.
    let anim: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      anim = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting));
      }, { rootMargin: "100px 0px" });
      const looping = new Set<Element>(document.querySelectorAll(".g-marquee, .g-hub, .g-shine, .bbi-float-lg"));
      document.querySelectorAll(".g-flow").forEach((f) => { const svg = f.closest("svg"); if (svg) looping.add(svg); });
      looping.forEach((el) => anim!.observe(el));
    }
    // Site-wide auto slide (7 Nov 2026): any sideways card row (scroll-snap) moves on its own, one card
    // at a time, loops back to the start, pauses while the reader touches it or it is off screen.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let rowsSeen: IntersectionObserver | null = null;
    const visible = new WeakSet<Element>();
    const wired = new WeakSet<Element>();
    const wireRows = () => {
      if (reduce || !("IntersectionObserver" in window)) return;
      rowsSeen ??= new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))), { threshold: 0.4 });
      document.querySelectorAll<HTMLElement>("main ul, main ol, main div, footer ul").forEach((row) => {
        if (wired.has(row)) return;
        const cs = getComputedStyle(row);
        if (!((cs.overflowX === "auto" || cs.overflowX === "scroll") && cs.scrollSnapType.startsWith("x") && row.scrollWidth > row.clientWidth + 24)) return;
        wired.add(row);
        rowsSeen!.observe(row);
        let held = 0;
        const hold = () => { held = Date.now(); };
        row.addEventListener("pointerdown", hold, { passive: true });
        row.addEventListener("touchstart", hold, { passive: true });
        row.addEventListener("wheel", hold, { passive: true });
        // Founder, 8 Nov 2026: rows drift on their own, right to left and back again, so readers see they scroll.
        let dir = 1;
        let pos = row.scrollLeft;
        timers.push(window.setInterval(() => {
          if (!visible.has(row) || Date.now() - held < 4000 || row.scrollWidth <= row.clientWidth + 24) { pos = row.scrollLeft; return; }
          const max = row.scrollWidth - row.clientWidth;
          pos += dir * 0.6;
          if (pos >= max) { pos = max; dir = -1; } else if (pos <= 0) { pos = 0; dir = 1; }
          row.style.scrollSnapType = "none";
          row.scrollLeft = pos;
        }, 16));
        row.addEventListener("touchend", () => { row.style.scrollSnapType = ""; }, { passive: true });
      });
    };
    wireRows();
    timers.push(window.setTimeout(wireRows, 2500), window.setTimeout(wireRows, 6000));
    const frame = document.querySelector(".ember");
    if (frame) {
      const guard = () => { try { redKeywords(frame); paletteGuard(frame); } catch (e) { console.error("palette guard", e); } };
      const idle = (window as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      idle(guard);
      timers.push(window.setTimeout(guard, 1800), window.setTimeout(guard, 5000));
    }
    // Slideshow loop copies stay clickable but out of the keyboard order.
    document.querySelectorAll<HTMLElement>("[data-loop-copy] a, [data-loop-copy] button").forEach((el) => { el.tabIndex = -1; });
    // Content protection (7 Nov 2026): long copies carry the source link; images have no save menu.
    const onCopy = (ev: ClipboardEvent) => {
      const text = window.getSelection()?.toString() ?? "";
      if (text.length < 200 || !ev.clipboardData) return;
      ev.clipboardData.setData("text/plain", `${text.slice(0, 600)}…\n\nRead the full page at ${location.href} (bbusiness.online). Copying the content is not allowed.`);
      ev.preventDefault();
    };
    const onMenu = (ev: MouseEvent) => { if ((ev.target as HTMLElement | null)?.closest("img")) ev.preventDefault(); };
    document.addEventListener("copy", onCopy);
    document.addEventListener("contextmenu", onMenu);
    return () => { io?.disconnect(); anim?.disconnect(); rowsSeen?.disconnect(); timers.forEach((t) => { window.clearInterval(t); window.clearTimeout(t); }); root.classList.remove("rv-on"); document.removeEventListener("copy", onCopy); document.removeEventListener("contextmenu", onMenu); };
  }, []);
}
