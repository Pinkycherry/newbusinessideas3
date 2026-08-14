import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { usePillInteraction } from "@/hooks/use-pill-interaction";

/**
 * Every non-link, non-ghost variant is a rounded-full pill — there is no
 * "square button" variant left. Motion (hover scale/lift, press spring) is
 * owned by usePillInteraction (GSAP), not a CSS transition, so it stays in
 * sync with every other pill-shaped element site-wide (glass-pill links,
 * category badges) that uses the same hook.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "glass-btn",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "glass-btn",
        secondary: "glass-btn",
        ghost: "rounded-full hover:bg-accent hover:text-accent-foreground",
        link: "rounded-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Icon rendered before the label — the "icon-forward" pill layout. */
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      children,
      onMouseEnter,
      onMouseLeave,
      onPointerDown,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const pill = usePillInteraction<HTMLButtonElement>();
    const noMotion = variant === "ghost" || variant === "link";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={(node: HTMLButtonElement | null) => {
          if (!noMotion) pill.ref(node);
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        {...props}
        onMouseEnter={
          noMotion
            ? onMouseEnter
            : (e) => {
                pill.onMouseEnter();
                onMouseEnter?.(e);
              }
        }
        onMouseLeave={
          noMotion
            ? onMouseLeave
            : (e) => {
                pill.onMouseLeave();
                onMouseLeave?.(e);
              }
        }
        onPointerDown={
          noMotion
            ? onPointerDown
            : (e) => {
                pill.onPointerDown();
                onPointerDown?.(e);
              }
        }
        onPointerUp={
          noMotion
            ? onPointerUp
            : (e) => {
                pill.onPointerUp();
                onPointerUp?.(e);
              }
        }
      >
        {asChild ? (
          children
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
