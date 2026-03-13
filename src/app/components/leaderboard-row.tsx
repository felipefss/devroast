import type { HTMLAttributes } from "react";

export interface LeaderboardRowProps extends HTMLAttributes<HTMLDivElement> {}

export function LeaderboardRow({ children, className, ...props }: LeaderboardRowProps) {
  return (
    <div
      className="grid grid-cols-[40px_60px_1fr_80px] gap-4 px-4 py-4 border-b border-border-primary items-start last:border-0 hover:bg-bg-elevated/30 transition-colors"
      {...props}
    >
      {children}
    </div>
  );
}
