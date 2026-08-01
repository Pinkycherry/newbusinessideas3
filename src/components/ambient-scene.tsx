export function AmbientScene() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="orb h-[26rem] w-[26rem] -right-32 -top-40 opacity-90" />
      <div className="orb h-40 w-40 left-[6%] top-[38%] opacity-80" style={{ animationDelay: "-3s" }} />
      <div className="orb h-64 w-64 -left-24 bottom-[6%] opacity-70" style={{ animationDelay: "-6s" }} />
      <div className="orb h-24 w-24 right-[18%] top-[58%] opacity-80" style={{ animationDelay: "-9s" }} />
      <div
        className="absolute left-[18%] top-[14%] h-56 w-56 rounded-full border-[26px] border-[oklch(0.723_0.161_56)] opacity-40 blur-[3px]"
        style={{ animation: "float-orb 15s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[30%] bottom-[8%] h-40 w-40 rounded-full border-[20px] border-[oklch(0.805_0.135_65)] opacity-30 blur-[3px]"
        style={{ animation: "float-orb 18s ease-in-out infinite reverse" }}
      />
    </div>
  );
}
