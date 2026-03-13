import type { HTMLAttributes, ReactNode } from "react";

export interface LeaderboardRowCodeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function parseCodeWithComments(code: string): ReactNode {
  const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
  const parts = code.split(commentRegex);

  return parts.map((part) => {
    if (part?.startsWith("//") || part?.startsWith("/*")) {
      return (
        <span key={part} className="text-text-tertiary">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function LeaderboardRowCode({ children, className, ...props }: LeaderboardRowCodeProps) {
  const codeString = typeof children === "string" ? children : "";

  return (
    <div className="min-w-0" {...props}>
      <code className="font-mono text-xs text-text-primary whitespace-pre leading-relaxed block">
        {parseCodeWithComments(codeString)}
      </code>
    </div>
  );
}
