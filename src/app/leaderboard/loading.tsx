import { LeaderboardRow } from "../components/leaderboard-row";

export default function LeaderboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <div className="flex flex-col gap-4 mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-text-primary">
          <span className="text-accent-green">{">"}</span> shame_leaderboard
        </h1>
        <p className="text-sm text-text-secondary font-mono">
          {`// the most roasted code on the internet`}
        </p>
        <div className="flex items-center gap-2 text-xs text-text-tertiary font-mono mt-2">
          <div className="h-4 w-24 bg-border-primary/50 animate-pulse rounded" />
          <span>·</span>
          <div className="h-4 w-32 bg-border-primary/50 animate-pulse rounded" />
        </div>
      </div>

      <div className="border border-border-primary bg-bg-surface">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_60px_1fr_80px] gap-4 border-b border-border-primary px-4 py-3 text-[10px] uppercase tracking-widest text-text-tertiary font-black">
          <span>#</span>
          <span>score</span>
          <span>code</span>
          <span className="text-right">lang</span>
        </div>

        {/* Table Rows Skeleton */}
        {Array.from({ length: 20 }).map((_, i) => {
          const key = `skeleton-${i}`;
          return (
            <LeaderboardRow key={key}>
              <div className="font-black text-text-tertiary">#{i + 1}</div>
              <div>
                <div className="h-6 w-10 bg-border-primary/50 animate-pulse rounded" />
              </div>
              <div className="min-w-0">
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-border-primary/50 animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-border-primary/50 animate-pulse rounded" />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="h-4 w-16 bg-border-primary/50 animate-pulse rounded" />
              </div>
            </LeaderboardRow>
          );
        })}
      </div>
    </div>
  );
}
