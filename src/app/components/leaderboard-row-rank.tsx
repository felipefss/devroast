import type { HTMLAttributes, ReactNode } from "react";

export interface LeaderboardRowRankProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function LeaderboardRowRank({ children, className, ...props }: LeaderboardRowRankProps) {
  return (
    <span className="text-lg font-black text-orange-500 leading-none" {...props}>
      {children}
    </span>
  );
}
