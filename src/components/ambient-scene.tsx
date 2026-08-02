/**
 * Background 3D spheres and rings.
 * Kept deliberately subtle (opacity 0.25–0.35) so glass cards and text stay
 * perfectly readable. Animation durations are ~3× faster than before so the
 * movement is noticeable without becoming distracting.
 */
export function AmbientScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: "var(--ambient-opacity, 1)" }}
    >
      <div className="orb h-[26rem] w-[26rem] -right-32 -top-40" style={{ opacity: 0.3, animationDuration: "1.7s" }} />
      <div className="orb h-40 w-40 left-[6%] top-[38%]" style={{ opacity: 0.28, animationDuration: "1.35s", animationDelay: "-0.4s" }} />
      <div className="orb h-64 w-64 -left-24 bottom-[6%]" style={{ opacity: 0.25, animationDuration: "2s", animationDelay: "-0.85s" }} />
      <div className="orb h-24 w-24 right-[18%] top-[58%]" style={{ opacity: 0.3, animationDuration: "1.15s", animationDelay: "-0.27s" }} />
      <div
        className="absolute left-[18%] top-[14%] h-56 w-56 rounded-full border-[26px] border-[oklch(0.723_0.161_56)] blur-[3px]"
        style={{ opacity: 0.25, animation: "float-orb 2.15s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[30%] bottom-[8%] h-40 w-40 rounded-full border-[20px] border-[oklch(0.805_0.135_65)] blur-[3px]"
        style={{ opacity: 0.25, animation: "float-orb 2.5s ease-in-out infinite reverse" }}
      />
    </div>
  );
}
