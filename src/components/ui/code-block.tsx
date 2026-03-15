import type { HTMLAttributes } from "react";
import { createHighlighter, type Highlighter } from "shiki";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

// Global cache for Shiki highlighter to prevent multiple instances
const globalForShiki = globalThis as unknown as {
  __shikiHighlighter?: Promise<Highlighter>;
};

async function getHighlighter(): Promise<Highlighter> {
  if (!globalForShiki.__shikiHighlighter) {
    globalForShiki.__shikiHighlighter = createHighlighter({
      themes: ["vesper"],
      langs: [
        "javascript",
        "typescript",
        "python",
        "rust",
        "go",
        "java",
        "c",
        "cpp",
        "csharp",
        "ruby",
        "php",
        "swift",
        "kotlin",
        "sql",
        "html",
        "css",
        "bash",
        "json",
        "yaml",
        "markdown",
        "jsx",
        "tsx",
      ],
    });
  }
  return globalForShiki.__shikiHighlighter;
}

export async function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
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
    <div className={`flex font-mono text-sm bg-bg-input ${className || ""}`} {...props}>
      {showLineNumbers && (
        <div className="flex flex-col items-end gap-1 px-3 py-4 border-r border-border-primary bg-bg-surface/50 min-w-[40px] select-none text-text-tertiary">
          {lineNumbers.map((num) => (
            <span key={num} className="leading-6">
              {num}
            </span>
          ))}
        </div>
      )}
      <div
        className="flex-1 overflow-x-auto p-4 leading-6 [&>pre]:bg-transparent! [&>pre]:m-0 [&>pre]:p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
