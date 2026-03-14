export const SUPPORTED_LANGUAGES = [
  { id: "typescript", name: "TypeScript" },
  { id: "javascript", name: "JavaScript" },
  { id: "jsx", name: "JSX" },
  { id: "tsx", name: "TSX" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "python", name: "Python" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "sql", name: "SQL" },
  { id: "json", name: "JSON" },
  { id: "bash", name: "Bash" },
  { id: "plaintext", name: "Plaintext" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["id"];

// Maps highlight.js detected language names to shiki language IDs
export const HLJS_TO_SHIKI_MAP: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  golang: "go",
  rs: "rust",
  sh: "bash",
};

export const DEFAULT_LANGUAGE: SupportedLanguage = "plaintext";
