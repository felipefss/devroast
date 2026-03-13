import { type HTMLAttributes, forwardRef } from "react";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className="flex items-center gap-2" {...props} />;
  },
);

CardHeader.displayName = "CardHeader";
