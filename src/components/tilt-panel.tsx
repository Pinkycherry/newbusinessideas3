import { useRef, type ReactNode } from "react";

export function TiltPanel({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (el) el.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
      }}
      style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      className={className}
    >
      {children}
    </div>
  );
}
