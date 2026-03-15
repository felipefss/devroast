import { CodeBlock } from "@/components/ui/code-block";
import { LeaderboardRowCodeClient } from "./leaderboard-row-code-client";

export interface LeaderboardRowCodeProps {
  code: string;
  language: string;
}

export async function LeaderboardRowCode({ code, language }: LeaderboardRowCodeProps) {
  // Fix escaped newlines that might be stored literally in the database
  const normalizedCode = code.replace(/\\n/g, "\n");
  const lines = normalizedCode.split("\n");
  const isLong = lines.length > 5;
  const truncatedCode = isLong ? lines.slice(0, 5).join("\n") : normalizedCode;

  if (!isLong) {
    return (
      <div className="min-w-0">
        <CodeBlock
          code={normalizedCode}
          language={language}
          className="!bg-transparent [&>div]:!p-0"
          showLineNumbers={false}
        />
      </div>
    );
  }

  return (
    <LeaderboardRowCodeClient
      preview={
        <CodeBlock
          code={truncatedCode}
          language={language}
          className="!bg-transparent [&>div]:!p-0"
          showLineNumbers={false}
        />
      }
      full={
        <CodeBlock
          code={normalizedCode}
          language={language}
          className="!bg-transparent [&>div]:!p-0"
          showLineNumbers={false}
        />
      }
    />
  );
}
