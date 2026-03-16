import { trpc } from "@/trpc/server";
import { LeaderboardRow } from "./leaderboard-row";
import { LeaderboardRowCode } from "./leaderboard-row-code";
import { LeaderboardRowLanguage } from "./leaderboard-row-language";
import { LeaderboardRowRank } from "./leaderboard-row-rank";
import { LeaderboardRowScore } from "./leaderboard-row-score";

export async function LeaderboardPreview() {
  const [leaderboard, metrics] = await Promise.all([
    trpc.getLeaderboard({ limit: 3 }),
    trpc.getMetrics(),
  ]);

  return (
    <>
      <div className="border border-border-primary bg-bg-surface">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_60px_1fr_80px] gap-4 border-b border-border-primary px-4 py-3 text-[10px] uppercase tracking-widest text-text-tertiary font-black">
          <span>#</span>
          <span>score</span>
          <span>code</span>
          <span className="text-right">lang</span>
        </div>

        {/* Table Rows */}
        {leaderboard.map((roast, index) => (
          <LeaderboardRow key={roast.id}>
            <LeaderboardRowRank>{index + 1}</LeaderboardRowRank>
            <LeaderboardRowScore>{roast.score}</LeaderboardRowScore>
            <LeaderboardRowCode code={roast.code} language={roast.language} />
            <LeaderboardRowLanguage>{roast.language}</LeaderboardRowLanguage>
          </LeaderboardRow>
        ))}
      </div>

      <div className="pt-8 text-center">
        <a
          href="/leaderboard"
          className="text-[10px] uppercase tracking-widest text-text-tertiary hover:text-accent-green transition-colors font-black italic group"
        >
          showing top 3 of {metrics.roastedCodes} —{" "}
          <span className="group-hover:underline underline-offset-4">
            view full leaderboard {">>"}
          </span>
        </a>
      </div>
    </>
  );
}
