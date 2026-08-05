import { useEffect, useState, useRef } from "react";

/* ----------------------------------------------------------------
   1. SCROLL-TRIGGERED COUNT-UP (Only counts when visible on screen)
   ---------------------------------------------------------------- */
export function ScrollTriggeredCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1600; // 1.6 seconds
          const increment = target / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(currentElement);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
}

/* ----------------------------------------------------------------
   2. 3D GLOSSY SIGNAL HARVEST PIPELINE
   ---------------------------------------------------------------- */
export function SignalHarvestSection() {
  const sources = [
    {
      name: "Reddit Founder Signals",
      tag: "Live Stream",
      svg: (
        <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.587 1.328-1.377 1.638.02.193.03.389.03.588 0 2.99-3.791 5.414-8.47 5.414-4.678 0-8.47-2.424-8.47-5.414 0-.199.01-.395.03-.588-.79-.31-1.377-.922-1.377-1.638 0-.968.786-1.754 1.754-1.754.477 0 .899.182 1.207.491 1.194-.856 2.85-1.419 4.674-1.488l.942-4.411 3.28.692c.036.635.567 1.14 1.217 1.14z"/>
        </svg>
      ),
    },
    {
      name: "Product Hunt Trends",
      tag: "Daily Feed",
      svg: (
        <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.604 8.4h-3.405v3.6h3.405c.995 0 1.801-.806 1.801-1.8s-.806-1.8-1.801-1.8zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.604 14.4h-3.405V18H7.799V6h5.805c2.982 0 5.401 2.419 5.401 5.4 0 2.981-2.419 5.4-5.401 5.4z"/>
        </svg>
      ),
    },
    {
      name: "X (Twitter) Mentions",
      tag: "Realtime",
      svg: (
        <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: "Search Demand Signal",
      tag: "Verified",
      svg: (
        <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="mx-auto my-12 sm:my-20 max-w-6xl px-3 sm:px-4">
      <div className="glass rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-10 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-accent border border-accent/20">
            Signal Pipeline
          </div>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-4xl tracking-tight leading-tight">
            Reddit, X & Search signals. <br />
            <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
              Where true founder pain lives.
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We don&apos;t generate generic AI hallucinations. Our blueprints aggregate real market signals across live web sources into plain-English unit economics and blunt founder-fit verdicts.
          </p>

          {/* FIXED NO-OVERLAP GRID */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sources.map((s) => (
              <div key={s.name} className="glass rounded-xl border border-white/10 p-3 flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs font-medium text-foreground flex items-center gap-2 truncate">
                  {s.svg}
                  <span className="truncate">{s.name}</span>
                </span>
                <span className="text-[9px] font-bold text-accent uppercase tracking-wider shrink-0 bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3D GLOSSY COUNTER CARD */}
        <div className="glass bbi-card-glow rounded-2xl border border-white/15 p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Cross-Source Validation</p>
            <h3 className="mt-1 text-base sm:text-lg font-bold text-foreground">Active Market Demand Score</h3>
          </div>

          <div className="my-6 flex items-center justify-between gap-4">
            {/* 3D Sphere Orb Display */}
            <div className="bbi-glossy-orb w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <ScrollTriggeredCount target={94} suffix="%" />
              </span>
            </div>

            <div className="text-right">
              <span className="block text-xl sm:text-2xl font-extrabold text-accent">
                <ScrollTriggeredCount target={4182} />
              </span>
              <span className="text-xs text-muted-foreground">Datapoints Filtered Today</span>
            </div>
          </div>

          {/* Glowing Neon Bar */}
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-primary via-accent to-warm h-full w-[94%] transition-all duration-1000 shadow-[0_0_12px_rgba(255,170,77,0.8)]" />
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground italic">
            Live research pipeline • Verified on bestbusinessideas.net
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   3. THE 5-STEP FOUNDER JOURNEY (3D Neumorphic Step Cards)
   ---------------------------------------------------------------- */
export function FounderJourneyRoadmap() {
  const steps = [
    { num: "01", title: "Browse Free Idea", desc: "Access researched blueprints across 30+ sectors." },
    { num: "02", title: "Review Economics", desc: "Named buyer, margin, and 1st-year failure risks." },
    { num: "03", title: "Run Gemini AI Audit", desc: "Live market sizing & competitor analysis on Pro." },
    { num: "04", title: "Go Lifetime Pass", desc: "Pay once for lifetime access. No subscription." },
    { num: "05", title: "Launch Blueprint", desc: "90-day go-to-market plan ready for execution." },
  ];

  return (
    <section className="mx-auto my-16 sm:my-24 max-w-6xl px-3 sm:px-4">
      <div className="glass rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            How BBI Works
          </p>
          <h2 className="mt-1.5 text-xl sm:text-3xl font-bold tracking-tight">
            From raw research to market launch
          </h2>
        </div>

        {/* 3D NEUMORPHIC STEP GRID */}
        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
          {steps.map((s) => (
            <div 
              key={s.num} 
              className="glass bbi-glossy-step rounded-2xl border border-white/15 p-5 text-center transition-all duration-300 hover:scale-[1.03] hover:border-accent/60"
            >
              {/* 3D Glossy Diamond Number Badge */}
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary text-black font-black text-xs mb-3 shadow-[0_4px_12px_rgba(240,140,43,0.4)]">
                {s.num}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   4. VERIFIED ACTIVITY TOAST
   ---------------------------------------------------------------- */
export function LiveActivityToast() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 glass rounded-xl border border-white/15 p-3.5 shadow-2xl flex items-center gap-3 max-w-xs sm:max-w-sm animate-bbi-toast">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      <div className="text-xs">
        <p className="font-medium text-foreground">Founder from New York unlocked Lifetime Access</p>
        <p className="text-[10px] text-muted-foreground">3 minutes ago • bestbusinessideas.net</p>
      </div>
      <button 
        onClick={() => setVisible(false)} 
        className="text-muted-foreground hover:text-foreground text-xs ml-auto p-1"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
