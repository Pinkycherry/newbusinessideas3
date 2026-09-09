/**
 * The business-model icon row.
 *
 * A full-bleed band of outlined icons that bob on staggered offsets — the
 * movement from the approved design. Every icon names something the library
 * actually covers: an idea, the research, the money, the storefront, delivery,
 * the laptop business, the customer, the verdict.
 *
 * Inline SVG rather than an icon font: a webfont that fails to arrive renders
 * its ligature names as literal text across the page.
 */

const ICONS: Array<{ label: string; d: string }> = [
  {
    label: "idea",
    d: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.3.3.5.7.5 1.1h6c0-.4.2-.8.5-1.1A6 6 0 0 0 12 3Z",
  },
  { label: "research", d: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4" },
  {
    label: "blueprint",
    d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5M9 13h6M9 17h4",
  },
  { label: "growth", d: "M3 17l5-5 4 3 8-8M20 7v5h-5" },
  { label: "money", d: "M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { label: "home business", d: "M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5M10 20v-6h4v6" },
  {
    label: "delivery",
    d: "M2 6h14v10H2zM16 10h3l3 3v3h-6M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  },
  {
    label: "retail",
    d: "M4 7h16l-1.5 12.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5ZM9 7V5a3 3 0 0 1 6 0v2",
  },
  { label: "online", d: "M3 4h18v12H3zM2 20h20" },
  {
    label: "customer",
    d: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",
  },
  { label: "low capital", d: "M4 10h16v11H4zM8 10V7a4 4 0 0 1 8 0v3" },
  { label: "verdict", d: "m4 12 5 5L20 6" },
  {
    label: "services",
    d: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z",
  },
  { label: "property", d: "M3 20V9l9-6 9 6v11M3 20h18M9 20v-6h6v6" },
  { label: "manufacturing", d: "M6 4h12l-1 7H7ZM7 11v9h10v-9M10 20v-4h4v4" },
  { label: "side hours", d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2" },
  { label: "numbers", d: "M4 19V5M4 19h16M8 15V9M12 15V6M16 15v-4" },
  { label: "trust", d: "M12 3 4 7v6c0 5 3.4 7.6 8 8 4.6-.4 8-3 8-8V7Zm-3 9 2 2 4-4" },
];

export function BusinessIcons() {
  return (
    <div className="bbi-icons" aria-hidden>
      {/* doubled so the band still fills a wide viewport */}
      {[...ICONS, ...ICONS].map((icon, i) => (
        <div className="bbi-icon" key={`${icon.label}-${i}`}>
          <svg viewBox="0 0 24 24">
            <path d={icon.d} />
          </svg>
        </div>
      ))}
    </div>
  );
}
