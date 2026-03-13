import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-mono text-xs",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      verdict: "text-accent-red",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

const dotVariants = tv({
  base: "shrink-0 rounded-full",
  variants: {
    variant: {
      critical: "h-2 w-2 bg-accent-red",
      warning: "h-2 w-2 bg-accent-amber",
      good: "h-2 w-2 bg-accent-green",
      verdict: "h-2 w-2 bg-accent-red",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot = true, children, ...props }, ref) => {
    return (
      <div ref={ref} className={badgeVariants({ variant, className })} {...props}>
        {dot && <span className={dotVariants({ variant })} />}
        <span>{children}</span>
      </div>
    );
  },
);

Badge.displayName = "Badge";
