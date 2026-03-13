import { createHighlighter, type Highlighter } from "shiki";
import type { HTMLAttributes } from "react";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: "javascript" | "typescript" | "js" | "ts";
  showLineNumbers?: boolean;
  filename?: string;
}

async function getHighlighter(): Promise<Highlighter> {
  return createHighlighter({
    themes: ["vesper"],
    langs: ["javascript", "typescript"],
  });
}

export async function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
  filename,
  className,
  ...props
}: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: "vesper",
  });

  const lineNumbers = Array.from({ length: code.split("\n").length }, (_, i) => i + 1);

  return (
    <div
      className="rounded-none border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
      {...props}
    >
      <div className="flex h-10 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
        <span className="flex-1" />
        {filename && <span className="font-mono text-xs text-zinc-400">{filename}</span>}
      </div>
      <div className="flex font-mono text-sm">
        {showLineNumbers && (
          <div className="flex flex-col border-r border-zinc-200 bg-zinc-100 px-2.5 py-3 text-right text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/50">
            {lineNumbers.map((num) => (
              <span key={num} className="leading-6">
                {num}
              </span>
            ))}
          </div>
        )}
        <div
          className="flex-1 overflow-x-auto p-3 leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
