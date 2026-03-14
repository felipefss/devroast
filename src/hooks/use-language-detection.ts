import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
// Import only the languages we need for detection to keep bundle size small
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml"; // for HTML
import { useEffect, useState } from "react";

import {
  DEFAULT_LANGUAGE,
  HLJS_TO_SHIKI_MAP,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "../lib/languages";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);

export function useLanguageDetection(code: string, isAuto: boolean) {
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!isAuto || !code.trim()) {
      if (!code.trim()) {
        setDetectedLanguage(DEFAULT_LANGUAGE);
      }
      return;
    }

    const detect = async () => {
      setIsDetecting(true);

      try {
        // Small delay to act as a debounce
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Only detect from the languages we support
        const subset = SUPPORTED_LANGUAGES.map((l) => l.id).filter(
          (id) => id !== "plaintext" && id !== "jsx" && id !== "tsx",
        );

        // Only use the first 5000 chars for detection to avoid main thread freeze
        const codeToDetect = code.length > 5000 ? code.slice(0, 5000) : code;
        const result = hljs.highlightAuto(codeToDetect, subset);
        const lang = result.language || "plaintext";

        // Map highlight.js output to our shiki supported IDs if needed
        const mappedLang = HLJS_TO_SHIKI_MAP[lang] || lang;

        // Verify it's a supported language, fallback to plaintext
        const finalLang = SUPPORTED_LANGUAGES.find((l) => l.id === mappedLang)
          ? mappedLang
          : DEFAULT_LANGUAGE;

        setDetectedLanguage(finalLang as SupportedLanguage);
      } catch (err) {
        console.error("Language detection failed", err);
        setDetectedLanguage(DEFAULT_LANGUAGE);
      } finally {
        setIsDetecting(false);
      }
    };

    const timeoutId = setTimeout(detect, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [code, isAuto]);

  return { detectedLanguage, isDetecting };
}
