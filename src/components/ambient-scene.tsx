/**
 * Background 3D spheres and rings.
 * Overall strength is controlled by the `--ambient-opacity` CSS variable
 * in src/styles.css (`:root`). Set it to e.g. 0.4 to calm the background.
 */
export function AmbientScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: "var(--ambient-opacity, 1)" }}
    >
      <div className="orb h-[26rem] w-[26rem] -right-32 -top-40 opacity-90" style={{ animationDuration: "5s" }} />
      <div className="orb h-40 w-40 left-[6%] top-[38%] opacity-80" style={{ animationDuration: "4s", animationDelay: "-1.2s" }} />
      <div className="orb h-64 w-64 -left-24 bottom-[6%] opacity-70" style={{ animationDuration: "6s", animationDelay: "-2.5s" }} />
      <div className="orb h-24 w-24 right-[18%] top-[58%] opacity-80" style={{ animationDuration: "3.5s", animationDelay: "-0.8s" }} />
      <div
        className="absolute left-[18%] top-[14%] h-56 w-56 rounded-full border-[26px] border-[oklch(0.723_0.161_56)] opacity-40 blur-[3px]"
        style={{ animation: "float-orb 6.5s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[30%] bottom-[8%] h-40 w-40 rounded-full border-[20px] border-[oklch(0.805_0.135_65)] opacity-30 blur-[3px]"
        style={{ animation: "float-orb 7.5s ease-in-out infinite reverse" }}
      />
    </div>
  );
}
