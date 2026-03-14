import { faker } from "@faker-js/faker";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 5433,
  user: "devroast",
  password: "devroast",
  database: "devroast",
});

const languages = [
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
];

const roastTemplates = [
  "This code is so bad, even your mother wouldn't accept it.",
  "I've seen better code in a Hello World tutorial.",
  "This is why we can't have nice things in production.",
  "Your variable naming convention is a crime against humanity.",
  "Congratulations, you've invented job security through code obfuscation.",
  "This code has more red flags than a Soviet parade.",
  "Stack Overflow called, they want their copy-paste back.",
  "Your git history must be a horror movie.",
  "This is peak entropy - maximum chaos, minimum readability.",
  "I've seen CAPTCHA solvers with better logic than this.",
  "Your code is like a maze - no way out, only dead ends.",
  "This deserves its own special place in the Hall of Shame.",
  "The person who wrote this should be banned from programming.",
  "I'm genuinely impressed by how wrong everything is.",
  "This code is a masterclass in how NOT to solve problems.",
  "Your PR reviewer just died a little inside.",
  "This is the programming equivalent of a crime scene.",
  "Even my grandma codes better than this, and she's dead.",
  "The linter just committed sepukku looking at this.",
  "This code would fail a CS101 midterm exam.",
];

const codeSnippets: Record<string, string[]> = {
  javascript: [
    "var data = JSON.parse(str);",
    "function check(x) { if (x == true) return true; else if (x == false) return false; }",
    "for (var i = 0; i < items.length; i++) { setTimeout(() => console.log(items[i]), 1000); }",
    "const foo = {}; foo.bar = foo;",
    "if (value != null && value != undefined) { }",
  ],
  typescript: [
    "const data: any = JSON.parse(str) as any;",
    "interface Foo { [key: string]: any }",
    "function foo(x: unknown) { return (x as any).bar; }",
    "type Foo = { [K in string]: any };",
    "let x: any = 'hello'; x = 123;",
  ],
  python: [
    "def foo(x): return x if x else None",
    "from collections import *",
    "except: pass",
    "global x; x = 1",
    "list = [i for i in range(10)]",
  ],
  rust: [
    "unsafe { *ptr.as_ref().unwrap() }",
    "let mut v: Vec<u8> = Vec::new();",
    "impl<T> Foo<T> { fn bar(&self) -> &T { &self.0 } }",
    "unwrap() everywhere",
    "use std::collections::*;",
  ],
  go: [
    "if err != nil { return err }",
    "go func() { defer wg.Done() }()",
    "var m map[string]interface{}",
    "resp, _ := http.Get(url)",
    "for i := 0; i < len(items); i++ {}",
  ],
};

function getCodeSnippet(lang: string): string {
  const snippets = codeSnippets[lang] || codeSnippets.javascript;
  return faker.helpers.arrayElement(snippets);
}

function generateIpHash(): string {
  return faker.string.alphanumeric(64);
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("🌱 Seeding database...");

    const submissionIds: string[] = [];

    for (let i = 0; i < 100; i++) {
      const lang = faker.helpers.arrayElement(languages);
      const code = getCodeSnippet(lang);
      const ipHash = generateIpHash();
      const createdAt = faker.date.recent({ days: 30 });

      const result = await client.query<{ id: string }>(
        "INSERT INTO submissions (code, language, ip_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING id",
        [code, lang, ipHash, createdAt],
      );

      submissionIds.push(result.rows[0].id);
      if (i === 0) {
        console.log("First submission inserted:", result.rows[0].id);
      }
    }

    console.log(`✅ Created ${submissionIds.length} submissions`);

    for (const subId of submissionIds) {
      const score = parseFloat(
        faker.number.float({ min: 0, max: 10, fractionDigits: 2 }).toFixed(2),
      );
      const content = faker.helpers.arrayElement(roastTemplates);
      const roastMode = faker.helpers.arrayElement(["normal", "brutal"]);
      const createdAt = faker.date.recent({ days: 30 });

      await client.query(
        "INSERT INTO roasts (submission_id, content, score, roast_mode, created_at) VALUES ($1, $2, $3, $4, $5)",
        [subId, content, score.toString(), roastMode, createdAt],
      );
    }

    console.log(`✅ Created 100 roasts`);

    await client.query("COMMIT");
    console.log("🎉 Seeding complete!");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
