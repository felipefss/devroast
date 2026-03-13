import { Badge } from "@/components/ui/badge";
import type { HTMLAttributes, ReactNode } from "react";

export interface LeaderboardRowScoreProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function LeaderboardRowScore({ children, className, ...props }: LeaderboardRowScoreProps) {
  return (
    <Badge variant="critical" {...props}>
      {children}
    </Badge>
  );
}
