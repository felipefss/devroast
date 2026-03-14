import { clsx } from "clsx";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/languages";

interface LanguageSelectorProps {
  value: SupportedLanguage | "auto";
  onChange: (value: SupportedLanguage | "auto") => void;
  detectedLanguage?: SupportedLanguage;
  isDetecting?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  detectedLanguage,
  isDetecting,
}: LanguageSelectorProps) {
  // Using native select for simplicity and robustness for now
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SupportedLanguage | "auto")}
        className={clsx(
          "appearance-none bg-bg-surface border border-border-primary rounded px-3 py-1.5 pr-8",
          "text-sm font-mono text-text-secondary focus:outline-none focus:border-accent-green/50",
          "transition-colors cursor-pointer",
        )}
      >
        <option value="auto">
          {isDetecting
            ? "Auto (Detecting...)"
            : `Auto${detectedLanguage && detectedLanguage !== "plaintext" ? ` (${SUPPORTED_LANGUAGES.find((l) => l.id === detectedLanguage)?.name || detectedLanguage})` : ""}`}
        </option>
        <optgroup label="Languages">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </optgroup>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
