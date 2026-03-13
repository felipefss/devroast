import type { HTMLAttributes, ReactNode } from "react";

export interface LeaderboardRowLanguageProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function LeaderboardRowLanguage({
  children,
  className,
  ...props
}: LeaderboardRowLanguageProps) {
  return (
    <span
      className="text-[10px] text-text-tertiary uppercase tracking-widest font-black italic text-right"
      {...props}
    >
      {children}
    </span>
  );
}
