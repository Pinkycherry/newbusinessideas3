import { useEffect } from "react";
import { highlightKeywords } from "@/lib/keyword-highlight";

/**
 * Palette guard (founder, 8 Nov 2026): older pages still carried colours from the light theme
 * (navy text, white borders, violet, blue, green, light panels). After each page renders, every
 * element inside the ember frame is checked once and anything off the black / white / red palette
 * is mapped onto it. Runs in idle time, a few thousand elements, once per page plus two late passes.
 */
// Speed (8 Nov 2026): remember checked elements in memory, not in a data attribute (writing an
// attribute on thousands of elements made the browser restyle the whole page).
const guarded = new WeakSet<Element>();
function paletteGuard(scope: Element) {
  const parse = (c: string) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1]!.split(",").map(Number); return { r: v[0]!, g: v[1]!, b: v[2]!, a: v.length > 3 ? v[3]! : 1 }; };
  const hsl = (c: { r: number; g: number; b: number }) => { const r = c.r / 255, g = c.g / 255, b = c.b / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return { h, s, l }; };
  const offHue = (h: number, s: number) => s > 0.28 && h > 18 && h < 340;
  [scope as HTMLElement, ...Array.from(scope.querySelectorAll<HTMLElement>("*"))].forEach((el) => {
    if (el.closest("svg,canvas,img,video,picture,.eh-stage,.cn,[data-keep-colour]") && el.tagName !== "svg") return;
    if (guarded.has(el)) return;
    guarded.add(el);
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
        // Near-white tints (cream, pale blue) become plain white, not red (founder, 9 Nov 2026: hero title).
        else if (offHue(h, s)) el.style.setProperty("color", l > 0.8 ? "#ffffff" : "#ff4f4f", "important");
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
    let mo: MutationObserver | null = null;
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
      const guard = () => { try { highlightKeywords(frame); paletteGuard(frame); } catch (e) { console.error("palette guard", e); } };
      // Anything added later (toasts, trays, pop-ups, loaded cards) is checked too, in small batches.
      let pending: Element[] = []; let later = 0;
      mo = new MutationObserver((ms) => {
        ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) pending.push(n as Element); }));
        if (!later) later = window.setTimeout(() => { later = 0; const list = pending; pending = []; try { list.forEach((el) => { if (el.isConnected) paletteGuard(el); }); highlightKeywords(frame); } catch (e) { console.error("palette guard", e); } }, 150);
      });
      mo.observe(frame, { childList: true, subtree: true });
      const idle = (window as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
      idle(guard);
      timers.push(window.setTimeout(() => idle(guard), 2500));
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
    return () => { mo?.disconnect(); io?.disconnect(); anim?.disconnect(); rowsSeen?.disconnect(); timers.forEach((t) => { window.clearInterval(t); window.clearTimeout(t); }); root.classList.remove("rv-on"); document.removeEventListener("copy", onCopy); document.removeEventListener("contextmenu", onMenu); };
  }, []);
}
