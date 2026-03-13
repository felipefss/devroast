import { CodeEditorWrapper } from "./components/code-editor-wrapper";
import { LeaderboardRow } from "./components/leaderboard-row";
import { LeaderboardRowRank } from "./components/leaderboard-row-rank";
import { LeaderboardRowScore } from "./components/leaderboard-row-score";
import { LeaderboardRowCode } from "./components/leaderboard-row-code";
import { LeaderboardRowLanguage } from "./components/leaderboard-row-language";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-16 space-y-24">
      {/* Hero + Editor */}
      <section className="space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-text-primary">
            <span className="text-accent-green">$</span> paste your code. get roasted.
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-medium">
            drop your code below and we&apos;ll rate it — brutally honest at full roast mode
          </p>
        </header>

        <CodeEditorWrapper />

        <div className="flex justify-center items-center gap-4 text-[10px] text-text-tertiary uppercase tracking-widest font-black">
          <span>2,349 codes roasted</span>
          <span className="h-1 w-1 rounded-full bg-text-tertiary" />
          <span>avg roast: 4.2/10</span>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="space-y-8 pb-20">
        <div className="flex items-end justify-between border-b border-border-primary pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-text-primary tracking-tighter">
              <span className="text-accent-green">#</span> shame_leaderboard
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md font-medium">
              the worst code on the internet, ranked by shame
            </p>
          </div>
          <a
            href="/leaderboard"
            className="text-[10px] uppercase tracking-widest text-text-tertiary hover:text-accent-green transition-colors font-black underline underline-offset-8 decoration-border-primary hover:decoration-accent-green"
          >
            view_all
          </a>
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
          <LeaderboardRow>
            <LeaderboardRowRank>1</LeaderboardRowRank>
            <LeaderboardRowScore>1.2</LeaderboardRowScore>
            <LeaderboardRowCode>{`function check(x) {
  if (x == true) return true;
  else if (x == false) return false;
}`}</LeaderboardRowCode>
            <LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
          </LeaderboardRow>
          <LeaderboardRow>
            <LeaderboardRowRank>2</LeaderboardRowRank>
            <LeaderboardRowScore>2.1</LeaderboardRowScore>
            <LeaderboardRowCode>{`const data: any = JSON.parse(str) as any;`}</LeaderboardRowCode>
            <LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
          </LeaderboardRow>
          <LeaderboardRow>
            <LeaderboardRowRank>3</LeaderboardRowRank>
            <LeaderboardRowScore>3.5</LeaderboardRowScore>
            <LeaderboardRowCode>{`for (var i = 0; i < items.length; i++) {
  setTimeout(() => console.log(items[i]), 1000);
}`}</LeaderboardRowCode>
            <LeaderboardRowLanguage>js</LeaderboardRowLanguage>
          </LeaderboardRow>
        </div>

        <div className="pt-8 text-center">
          <a
            href="/leaderboard"
            className="text-[10px] uppercase tracking-widest text-text-tertiary hover:text-accent-green transition-colors font-black italic group"
          >
            showing top 3 of 2,347 —{" "}
            <span className="group-hover:underline underline-offset-4">
              view full leaderboard {">>"}
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
