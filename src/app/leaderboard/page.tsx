import { trpc } from "@/trpc/server";
import { LeaderboardRow } from "../components/leaderboard-row";
import { LeaderboardRowCode } from "../components/leaderboard-row-code";
import { LeaderboardRowLanguage } from "../components/leaderboard-row-language";
import { LeaderboardRowRank } from "../components/leaderboard-row-rank";
import { LeaderboardRowScore } from "../components/leaderboard-row-score";

export const metadata = {
  title: "Shame Leaderboard | devroast",
  description: "The most roasted code on the internet.",
};

export const revalidate = 3600;

export default async function LeaderboardPage() {
  const [leaderboard, metrics] = await Promise.all([
    trpc.getLeaderboard({ limit: 20 }),
    trpc.getMetrics(),
  ]);

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
          <span>{metrics.roastedCodes} submissions</span>
          <span>·</span>
          <span>avg score: {metrics.avgScore}/10</span>
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
    </div>
  );
}
