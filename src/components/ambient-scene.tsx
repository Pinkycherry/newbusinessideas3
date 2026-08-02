/**
 * Background 3D spheres and rings.
 *
 * Each element travels a long, unique curved path across a large portion of the
 * viewport (using vw/vh so mobile and desktop both get the full journey), at its
 * own speed, gently scaling up and down for a depth-of-field feel. Paths are
 * closed loops, so an element that drifts off one edge re-enters smoothly.
 * Opacity stays in the 0.25–0.32 range so glass cards and text remain readable.
 * Brand colours are unchanged.
 */
const DRIFT_KEYFRAMES = `
@keyframes drift-a {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  20%  { transform: translate3d(-28vw, 18vh, 0) scale(1.14); }
  40%  { transform: translate3d(-58vw, 48vh, 0) scale(0.86); }
  60%  { transform: translate3d(-34vw, 82vh, 0) scale(1.1); }
  80%  { transform: translate3d(-6vw, 46vh, 0) scale(0.94); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes drift-b {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  25%  { transform: translate3d(42vw, -22vh, 0) scale(0.82); }
  50%  { transform: translate3d(74vw, 16vh, 0) scale(1.18); }
  75%  { transform: translate3d(30vw, 40vh, 0) scale(0.9); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes drift-c {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  30%  { transform: translate3d(36vw, -34vh, 0) scale(1.2); }
  55%  { transform: translate3d(68vw, -62vh, 0) scale(0.88); }
  80%  { transform: translate3d(22vw, -30vh, 0) scale(1.06); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes drift-d {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  22%  { transform: translate3d(-30vw, -26vh, 0) scale(0.85); }
  48%  { transform: translate3d(-54vw, 22vh, 0) scale(1.22); }
  70%  { transform: translate3d(-18vw, 52vh, 0) scale(0.92); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes drift-e {
  0%   { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
  33%  { transform: translate3d(48vw, 34vh, 0) rotate(120deg) scale(1.12); }
  66%  { transform: translate3d(16vw, 72vh, 0) rotate(240deg) scale(0.9); }
  100% { transform: translate3d(0, 0, 0) rotate(360deg) scale(1); }
}
@keyframes drift-f {
  0%   { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
  35%  { transform: translate3d(-44vw, -30vh, 0) rotate(-140deg) scale(0.88); }
  65%  { transform: translate3d(-12vw, -66vh, 0) rotate(-240deg) scale(1.16); }
  100% { transform: translate3d(0, 0, 0) rotate(-360deg) scale(1); }
}
`;

export function AmbientScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: "var(--ambient-opacity, 1)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: DRIFT_KEYFRAMES }} />

      {/* Large top-right sphere: drifts slowly down and to the left. */}
      <div
        className="orb h-[26rem] w-[26rem] -right-32 -top-40"
        style={{ opacity: 0.3, animation: "drift-a 54s linear infinite" }}
      />
      <div
        className="orb h-40 w-40 left-[6%] top-[38%]"
        style={{ opacity: 0.28, animation: "drift-b 38s linear infinite", animationDelay: "-9s" }}
      />
      <div
        className="orb h-64 w-64 -left-24 bottom-[6%]"
        style={{ opacity: 0.25, animation: "drift-c 66s linear infinite", animationDelay: "-21s" }}
      />
      <div
        className="orb h-24 w-24 right-[18%] top-[58%]"
        style={{ opacity: 0.32, animation: "drift-d 29s linear infinite", animationDelay: "-5s" }}
      />
      <div
        className="absolute left-[18%] top-[14%] h-56 w-56 rounded-full border-[26px] border-[oklch(0.723_0.161_56)] blur-[3px]"
        style={{ opacity: 0.25, animation: "drift-e 47s linear infinite" }}
      />
      <div
        className="absolute right-[30%] bottom-[8%] h-40 w-40 rounded-full border-[20px] border-[oklch(0.805_0.135_65)] blur-[3px]"
        style={{ opacity: 0.25, animation: "drift-f 61s linear infinite", animationDelay: "-14s" }}
      />
    </div>
  );
}
