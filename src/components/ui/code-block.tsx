import type { HTMLAttributes } from "react";
import { createHighlighter, type Highlighter } from "shiki";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

async function getHighlighter(): Promise<Highlighter> {
  return createHighlighter({
    themes: ["vesper"],
    langs: ["javascript", "typescript", "python", "java", "csharp", "jsx", "tsx"],
  });
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
