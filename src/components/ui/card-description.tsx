import { type HTMLAttributes, forwardRef } from "react";

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className="mt-3 font-mono text-xs font-normal leading-relaxed text-zinc-500 dark:text-zinc-400"
        {...props}
      />
    );
  },
);

CardDescription.displayName = "CardDescription";
