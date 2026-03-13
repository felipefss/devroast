import { forwardRef, useMemo, type TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CodeEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  filename?: string;
}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ className, filename, value, ...props }, ref) => {
    const lines = useMemo(() => {
      const text = (value as string) || "";
      return text.split("\n").length || 1;
    }, [value]);

    const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);

    return (
      <div className="w-full rounded-none border border-border-primary bg-bg-surface overflow-hidden shadow-2xl transition-all focus-within:border-accent-green/50">
        <div className="flex h-10 items-center gap-3 border-b border-border-primary px-4 bg-bg-elevated/50">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-accent-red/80" />
            <span className="h-3 w-3 rounded-full bg-accent-amber/80" />
            <span className="h-3 w-3 rounded-full bg-accent-green/80" />
          </div>
          <div className="flex-1" />
          {filename && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {filename}
            </span>
          )}
        </div>
        <div className="relative flex group">
          <div className="flex flex-col border-r border-border-primary bg-bg-elevated/30 py-4 pr-3 pl-4 text-right select-none">
            {lineNumbers.map((num) => (
              <span
                key={num}
                className="font-mono text-xs text-text-tertiary leading-6"
              >
                {num}
              </span>
            ))}
          </div>
          <div className="relative flex-1">
            <textarea
              ref={ref}
              value={value}
              className={clsx(
                "w-full min-h-[320px] p-4 pl-3 bg-transparent font-mono text-sm text-text-primary outline-none resize-none placeholder:text-text-tertiary/50 leading-6 selection:bg-accent-green/20 selection:text-accent-green",
                className
              )}
              spellCheck={false}
              placeholder="// paste your garbage code here..."
              {...props}
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
              <span className="text-[10px] text-accent-green animate-pulse tracking-tighter font-bold">
                {"_"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CodeEditor.displayName = "CodeEditor";
