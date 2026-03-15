import { LeaderboardRow } from "./leaderboard-row";

export function LeaderboardPreviewSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <LeaderboardRow key={i}>
          <div className="font-black text-text-tertiary">#{i}</div>
          <div>
            <div className="h-6 w-10 bg-border-primary/50 animate-pulse rounded" />
          </div>
          <div className="min-w-0">
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-border-primary/50 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-border-primary/50 animate-pulse rounded" />
            </div>
          </div>
          <div className="text-right">
            <div className="h-4 w-16 bg-border-primary/50 animate-pulse rounded inline-block" />
          </div>
        </LeaderboardRow>
      ))}
    </>
  );
}
