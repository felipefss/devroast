import { CodeBlock } from "@/components/ui/code-block";
import { LeaderboardRowCodeClient } from "./leaderboard-row-code-client";

export interface LeaderboardRowCodeProps {
  code: string;
  language: string;
}

export async function LeaderboardRowCode({ code, language }: LeaderboardRowCodeProps) {
  const lines = code.split("\n");
  const isLong = lines.length > 5;
  const truncatedCode = isLong ? lines.slice(0, 5).join("\n") : code;

  if (!isLong) {
    return (
      <div className="min-w-0">
        <CodeBlock
          code={code}
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
          code={code}
          language={language}
          className="!bg-transparent [&>div]:!p-0"
          showLineNumbers={false}
        />
      }
    />
  );
}
