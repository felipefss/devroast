import { type HTMLAttributes, forwardRef } from "react";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className="mt-3" {...props} />;
  },
);

CardContent.displayName = "CardContent";
