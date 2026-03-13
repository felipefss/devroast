import { type HTMLAttributes, forwardRef } from "react";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className="font-mono text-sm font-normal text-zinc-900 dark:text-zinc-100"
        {...props}
      />
    );
  },
);

CardTitle.displayName = "CardTitle";
