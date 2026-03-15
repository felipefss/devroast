import { Suspense } from "react";
import { CodeEditorWrapper } from "./components/code-editor-wrapper";
import { LeaderboardPreview } from "./components/leaderboard-preview";
import { LeaderboardPreviewSkeleton } from "./components/leaderboard-preview-skeleton";
import { Metrics } from "./components/metrics";

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

        <Metrics />
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

        <Suspense
          fallback={
            <div className="border border-border-primary bg-bg-surface">
              <div className="grid grid-cols-[40px_60px_1fr_80px] gap-4 border-b border-border-primary px-4 py-3 text-[10px] uppercase tracking-widest text-text-tertiary font-black">
                <span>#</span>
                <span>score</span>
                <span>code</span>
                <span className="text-right">lang</span>
              </div>
              <LeaderboardPreviewSkeleton />
            </div>
          }
        >
          <LeaderboardPreview />
        </Suspense>
      </section>
    </div>
  );
}
