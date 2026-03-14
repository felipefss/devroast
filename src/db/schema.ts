import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language_enum", [
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
]);

export const roastModeEnum = pgEnum("roast_mode_enum", ["normal", "brutal"]);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull(),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roasts = pgTable("roasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull(),
  content: text("content").notNull(),
  score: text("score").notNull(),
  roastMode: roastModeEnum("roast_mode").notNull().default("normal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
