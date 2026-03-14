"use client";

import { clsx } from "clsx";
import {
  forwardRef,
  type TextareaHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import type { SupportedLanguage } from "@/lib/languages";
import { getShikiHighlighter } from "@/lib/shiki";
import { LanguageSelector } from "./language-selector";

export interface CodeEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  filename?: string;
  value: string;
  charLimit?: number;
}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ className, filename, value, onChange, charLimit, ...props }, ref) => {
    const [manualLanguage, setManualLanguage] = useState<SupportedLanguage | "auto">("auto");
    const { detectedLanguage, isDetecting } = useLanguageDetection(
      value,
      manualLanguage === "auto",
    );

    const activeLanguage = manualLanguage === "auto" ? detectedLanguage : manualLanguage;
    const [highlightedHtml, setHighlightedHtml] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLPreElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    // Provide the ref correctly to both local and forwarded ref
    const handleRef = (el: HTMLTextAreaElement | null) => {
      // biome-ignore lint/suspicious/noExplicitAny: React ref typing
      (textareaRef as any).current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    const lines = useMemo(() => {
      const text = (value as string) || "";
      // Limit to 1000 lines?
      // It's better to just count them but slice if we want a limit.
      // We will rely on user not pasting more than 1000 lines.
      return text.split("\n").length || 1;
    }, [value]);

    const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);

    useEffect(() => {
      let isMounted = true;

      const renderHighlight = async () => {
        if (!value.trim()) {
          setHighlightedHtml("");
          return;
        }

        try {
          const highlighter = await getShikiHighlighter();
          const html = highlighter.codeToHtml(value, {
            lang: activeLanguage,
            theme: "vitesse-dark",
            structure: "inline", // We don't need the wrapper <pre><code> from shiki
          });

          if (isMounted) {
            setHighlightedHtml(html);
          }
        } catch (err) {
          console.error("Highlighting error", err);
          // Fallback to plain HTML escaping
          if (isMounted) {
            const escaped = value
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            setHighlightedHtml(escaped);
          }
        }
      };

      renderHighlight();

      return () => {
        isMounted = false;
      };
    }, [value, activeLanguage]);

    const handleScroll = () => {
      const el = textareaRef.current;
      if (!el) return;

      const { scrollTop, scrollLeft } = el;

      if (highlightRef.current) {
        highlightRef.current.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
      }
      if (lineNumbersRef.current) {
        lineNumbersRef.current.style.transform = `translateY(${-scrollTop}px)`;
      }
    };

    return (
      <div className="w-full rounded-none border border-border-primary bg-bg-surface overflow-hidden shadow-2xl transition-all focus-within:border-accent-green/50">
        <div className="flex h-10 items-center gap-3 border-b border-border-primary px-4 bg-bg-elevated/50 justify-between">
          <div className="flex gap-1.5 items-center">
            <span className="h-3 w-3 rounded-full bg-accent-red/80" />
            <span className="h-3 w-3 rounded-full bg-accent-amber/80" />
            <span className="h-3 w-3 rounded-full bg-accent-green/80" />
            {filename && (
              <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                {filename}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector
              value={manualLanguage}
              onChange={setManualLanguage}
              detectedLanguage={detectedLanguage}
              isDetecting={isDetecting}
            />
          </div>
        </div>

        <div className="relative flex group min-h-[320px] max-h-[500px]">
          {/* Line Numbers Overlay */}
          <div className="absolute top-0 left-0 bottom-0 w-12 border-r border-border-primary bg-bg-elevated/30 py-4 text-right select-none overflow-hidden z-10 pointer-events-none">
            <div ref={lineNumbersRef} className="will-change-transform">
              {lineNumbers.map((num) => (
                <span
                  key={num}
                  className="block pr-3 font-mono text-xs text-text-tertiary leading-6"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Editor Container */}
          <div className="relative flex-1 ml-12 overflow-hidden bg-bg-surface">
            {/* Highlight Overlay */}
            <pre
              ref={highlightRef}
              className="absolute top-0 left-0 w-full min-h-full p-4 pl-3 m-0 font-mono text-sm leading-6 pointer-events-none whitespace-pre overflow-visible will-change-transform text-text-primary"
              aria-hidden="true"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is safe
              dangerouslySetInnerHTML={{ __html: highlightedHtml || `${value}\n` }}
            />

            {/* Textarea Input */}
            <textarea
              ref={handleRef}
              value={value}
              onChange={onChange}
              onScroll={handleScroll}
              className={clsx(
                "relative w-full h-full min-h-[320px] p-4 pl-3 bg-transparent text-transparent font-mono text-sm outline-none resize-none placeholder:text-text-tertiary/50 leading-6 selection:bg-accent-green/20 selection:text-transparent whitespace-pre overflow-auto z-20 caret-white",
                className,
              )}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder="// paste your garbage code here..."
              {...props}
            />

            <div className="absolute bottom-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none z-30 flex items-center gap-2">
              {charLimit !== undefined && (
                <span
                  className={clsx(
                    "text-[10px] tracking-widest font-mono",
                    value.length > charLimit ? "text-accent-red" : "text-text-tertiary",
                  )}
                >
                  {value.length}/{charLimit}
                </span>
              )}
              <span className="text-[10px] text-accent-green animate-pulse tracking-tighter font-bold">
                {"_"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

CodeEditor.displayName = "CodeEditor";
