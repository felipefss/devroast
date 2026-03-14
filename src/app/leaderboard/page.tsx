import { CodeBlock } from "@/components/ui/code-block";

type LeaderboardEntry = {
  id: string;
  rank: number;
  score: number;
  language: string;
  lines: number;
  code: string;
};

// Mock static data for the leaderboard
const entries: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    score: 1.2,
    language: "javascript",
    lines: 3,
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
  },
  {
    id: "2",
    rank: 2,
    score: 1.8,
    language: "typescript",
    lines: 4,
    code: `const sum = (a: any, b: any) => {
  return parseInt(a) + parseInt(b);
}
// i love any`,
  },
  {
    id: "3",
    rank: 3,
    score: 2.5,
    language: "python",
    lines: 2,
    code: `except Exception as e:
    pass # works fine`,
  },
  {
    id: "4",
    rank: 4,
    score: 3.1,
    language: "java",
    lines: 5,
    code: `public boolean isTrue(boolean val) {
    if (val == true) {
        return true;
    } else {
        return false;
    }
}`,
  },
  {
    id: "5",
    rank: 5,
    score: 4.2,
    language: "csharp",
    lines: 3,
    code: `string str = "True";
bool b = bool.Parse(str);
// convert string to bool`,
  },
];

export const metadata = {
  title: "Shame Leaderboard | devroast",
  description: "The most roasted code on the internet.",
};

export default function LeaderboardPage() {
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
          <span>2,847 submissions</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col border border-border-primary rounded-md overflow-hidden bg-bg-surface"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-primary bg-bg-surface">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-tertiary text-sm">#</span>
                  <span className="text-accent-amber font-bold text-sm">{entry.rank}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-tertiary text-xs">score:</span>
                  <span className="text-accent-red font-bold text-sm">
                    {entry.score.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text-secondary text-xs">{entry.language}</span>
                <span className="text-text-tertiary text-xs">{entry.lines} lines</span>
              </div>
            </div>

            <CodeBlock code={entry.code} language={entry.language} className="bg-bg-input" />
          </div>
        ))}
      </div>
    </div>
  );
}
