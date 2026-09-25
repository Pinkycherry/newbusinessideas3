import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** One action surface. CSS handles hover/press; no idle timers or backing plate. */
export default function HoverBorderGradient({
  children,
  className,
  containerClassName,
  asChild = false,
  duration: _duration,
  still: _still,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  containerClassName?: string;
  asChild?: boolean;
  /** Retained for existing callers; motion is now interaction-only CSS. */
  duration?: number;
  still?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <span className={cn("bbi-action-wrap inline-flex", containerClassName)}>
      <Comp
        className={cn(
          "ins-action relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200",
          className,
        )}
        {...rest}
      >
        {children}
      </Comp>
    </span>
  );
}
