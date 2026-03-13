import { type HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export { CardHeader } from "./card-header";
export { CardTitle } from "./card-title";
export { CardDescription } from "./card-description";
export { CardContent } from "./card-content";

const cardVariants = tv({
  base: "rounded-none border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900",
  variants: {
    variant: {
      default: "",
      destructive: "border-red-200 dark:border-red-900",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return <div ref={ref} className={cardVariants({ variant, className })} {...props} />;
  },
);

Card.displayName = "Card";
