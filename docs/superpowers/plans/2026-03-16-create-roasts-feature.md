# Create Roasts Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Roast My Code" feature using Gemini 2.5 Flash via Vercel AI SDK to generate structured, sarcastic code reviews.

**Architecture:** A tRPC mutation takes the user's code, calls the Gemini API to get a structured JSON response matching our Zod schema, saves it to a `jsonb` column in Drizzle ORM, and redirects the user to the result page which queries and displays this real data instead of mock data.

**Tech Stack:** Next.js (App Router), tRPC, Drizzle ORM, PostgreSQL, `@ai-sdk/google`, `ai`

---

## Chunk 1: Database and Dependencies Setup

### Task 1: Install Dependencies & Setup Schema

**Files:**
- Modify: `package.json`
- Modify: `src/db/schema.ts`
- Create: `src/lib/ai-schema.ts`

- [ ] **Step 1: Install AI SDK dependencies**

```bash
pnpm add ai @ai-sdk/google
```

- [ ] **Step 2: Update database schema**

Edit `src/db/schema.ts` to change the `content` column of `roasts` from `text` to `jsonb`.
Also export the structure that the `jsonb` column will hold using Zod for type inference in TypeScript.

*Note: Since the project uses Drizzle, we will use `jsonb` which maps to `any` in TypeScript for Drizzle, but we will type cast it later. To make things safer, let's create the Zod schema first.*

```typescript
// in src/db/schema.ts
import { pgEnum, pgTable, text, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";

// ... existing code ...

export const roasts = pgTable("roasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull(),
  content: jsonb("content").notNull(), // <--- CHANGED FROM text TO jsonb
  score: text("score").notNull(),
  roastMode: roastModeEnum("roast_mode").notNull().default("normal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

- [ ] **Step 3: Generate and Run Drizzle Migration**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```
*(Note: As this is a prototype, `push` is acceptable. If `push` prompts for data loss warning due to type change, accept it or drop the table manually via psql if needed since it's dev data).*

- [ ] **Step 4: Create AI Zod Schema**

Create `src/lib/ai-schema.ts` to hold the structured output definition.

```typescript
// src/lib/ai-schema.ts
import { z } from "zod";

export const roastDetailsSchema = z.object({
  type: z.enum(["good", "warning", "critical"]).describe("The severity or type of the feedback."),
  title: z.string().describe("A short, punchy title for this specific feedback point. Keep it under 5 words."),
  description: z.string().describe("A detailed, sarcastic, and brutal explanation of what is wrong or right. 1-2 sentences max."),
});

export const aiRoastSchema = z.object({
  score: z.number().min(0).max(10).describe("A brutal score from 0 to 10. 10 means terrible, 0 means perfect. Can have one decimal place (e.g. 8.5)."),
  verdict: z.string().describe("A 2-4 word slug summarizing the roast, formatted with underscores like 'needs_serious_help' or 'straight_to_jail'."),
  summary: z.string().describe("A brutal 1-2 sentence overall summary of the code. Sarcastic, condescending, but technically accurate."),
  details: z.array(roastDetailsSchema).min(3).max(6).describe("Specific points of feedback. Include mostly warnings/criticals, maybe one good thing if they are lucky."),
  suggestedFix: z.string().describe("The completely rewritten, optimal version of their code. Only return the raw code, no markdown formatting or backticks around it."),
});

export type AIRoastResponse = z.infer<typeof aiRoastSchema>;
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/db/schema.ts src/lib/ai-schema.ts drizzle/
git commit -m "feat: setup ai dependencies and update roasts table schema to jsonb"
```

---

## Chunk 2: Backend tRPC Procedures

### Task 2: Implement `createRoast` and `getRoastById` Procedures

**Files:**
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Add new procedures to the router**

Edit `src/trpc/routers/_app.ts` to include the rate limiting, AI call, and DB operations.

```typescript
// src/trpc/routers/_app.ts
import { count, eq, sql, and, gte } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "../../db";
import { roasts, submissions, languageEnum, roastModeEnum } from "../../db/schema";
import { procedure, router } from "../init";
import { aiRoastSchema } from "../../lib/ai-schema";

export const appRouter = router({
  // ... existing getMetrics and getLeaderboard ...

  createRoast: procedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.enum(languageEnum.enumValues),
        roastMode: z.enum(roastModeEnum.enumValues),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1. IP Hash for rate limiting
      // In a real app we'd get this from headers (x-forwarded-for). For now, we mock it or use a default.
      // If we don't have access to headers in this basic tRPC setup, we'll use a static string for testing.
      const ipHash = "mock-ip-hash"; 
      
      // 2. Rate Limiting Check (max 5 per hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentSubmissions = await db
        .select({ value: count() })
        .from(submissions)
        .where(
          and(
            eq(submissions.ipHash, ipHash),
            gte(submissions.createdAt, oneHourAgo)
          )
        );

      if ((recentSubmissions[0]?.value ?? 0) >= 5) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You've been roasted too much today. Give it a rest (limit 5 per hour).",
        });
      }

      // 3. Call Gemini API
      const systemPrompt = input.roastMode === "brutal" 
        ? "You are an absolutely ruthless, sarcastic, and deeply technical senior engineer. Roast the provided code without mercy. Be highly technical, pedantic, and devastatingly accurate."
        : "You are a slightly grumpy senior engineer reviewing a junior's PR. Provide a sarcastic but ultimately helpful review of the code.";

      const { object: roastResult } = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: aiRoastSchema,
        system: systemPrompt,
        prompt: \`Language: \${input.language}\\n\\nCode:\\n\${input.code}\`,
      });

      // 4. Save to Database
      const [submission] = await db.insert(submissions).values({
        code: input.code,
        language: input.language,
        ipHash: ipHash,
      }).returning({ id: submissions.id });

      const [roast] = await db.insert(roasts).values({
        submissionId: submission.id,
        content: roastResult,
        score: roastResult.score.toString(),
        roastMode: input.roastMode,
      }).returning({ id: roasts.id });

      return { roastId: roast.id };
    }),

  getRoastById: procedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [result] = await db
        .select({
          roast: roasts,
          submission: submissions,
        })
        .from(roasts)
        .innerJoin(submissions, eq(roasts.submissionId, submissions.id))
        .where(eq(roasts.id, input.id));

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roast not found",
        });
      }

      return result;
    }),
});
```

- [ ] **Step 2: Commit**

```bash
git add src/trpc/routers/_app.ts
git commit -m "feat(backend): add createRoast mutation and getRoastById query"
```

---

## Chunk 3: Frontend Integration

### Task 3: Wire up the Code Editor

**Files:**
- Modify: `src/app/components/code-editor-wrapper.tsx`

- [ ] **Step 1: Use tRPC mutation in client component**

Edit `src/app/components/code-editor-wrapper.tsx` to handle the submission state and redirect.

```tsx
// src/app/components/code-editor-wrapper.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { trpc } from "@/trpc/client";

export function CodeEditorWrapper() {
  const router = useRouter();
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const charLimit = 2500;

  const createRoast = trpc.createRoast.useMutation({
    onSuccess: (data) => {
      router.push(\`/roast/\${data.roastId}\`);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    if (newCode.split("\\n").length <= 1000) {
      setCode(newCode);
    } else {
      const truncated = newCode.split("\\n").slice(0, 1000).join("\\n");
      setCode(truncated);
    }
  };

  const handleRoast = () => {
    setError(null);
    createRoast.mutate({
      code,
      language: "javascript", // TODO: In a real scenario we'd detect or select this
      roastMode: roastMode ? "brutal" : "normal"
    });
  };

  const isOverLimit = code.length > charLimit;
  const isButtonDisabled = !code.trim() || isOverLimit || createRoast.isPending;

  return (
    <div className="space-y-6">
      <CodeEditor
        value={code}
        onChange={handleCodeChange}
        filename="roasted_code.js"
        charLimit={charLimit}
      />
      
      {error && (
        <div className="text-accent-red text-sm font-mono border border-accent-red/20 bg-accent-red/5 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
        <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
        <Button
          className="w-full sm:w-auto font-black italic tracking-tighter"
          disabled={isButtonDisabled}
          onClick={handleRoast}
        >
          {createRoast.isPending ? "roasting..." : "> roast_my_code"}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/code-editor-wrapper.tsx
git commit -m "feat(frontend): wire code editor to createRoast mutation"
```

### Task 4: Make Roast Result Page Dynamic

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Fetch dynamic data and inject into the view**

Update the dynamic page to fetch from tRPC and use the type `AIRoastResponse`. We need to handle the calculation for the SVG circle (progress).

```tsx
// src/app/roast/[id]/page.tsx
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { trpc } from "@/trpc/server";
import { AIRoastResponse } from "@/lib/ai-schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoastResultPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  try {
    const { roast, submission } = await trpc.getRoastById({ id: resolvedParams.id });
    const aiData = roast.content as AIRoastResponse;
    const scoreNum = parseFloat(roast.score);
    
    // SVG Circle calculation
    // Circle circumference is 2 * pi * r = 2 * 3.1415 * 46 = ~289
    // Max stroke is 289 (empty), 0 is full.
    // If score is 10/10, we fill it. So offset = 289 - (score/10 * 289)
    const strokeDasharray = 289;
    const strokeDashoffset = Math.max(0, 289 - (scoreNum / 10) * 289);
    
    const codeLines = submission.code.split("\\n").length;

    return (
      <div className="mx-auto max-w-4xl px-8 py-16 flex flex-col gap-12">
        {/* Score Hero */}
        <section className="flex flex-col md:flex-row items-center gap-12">
          {/* Score Ring */}
          <div className="relative w-[180px] h-[180px] flex items-center justify-center shrink-0">
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
              aria-label={\`Score \${roast.score} out of 10\`}
            >
              <title>Score {roast.score} out of 10</title>
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                stroke="var(--color-border-primary)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                stroke="url(#score-gradient)"
                strokeWidth="4"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-accent-red)" />
                  <stop offset="100%" stopColor="var(--color-accent-amber)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="text-[48px] font-bold text-accent-amber leading-none">{roast.score}</span>
              <span className="text-[16px] text-text-tertiary">/10</span>
            </div>
          </div>

          {/* Roast Summary */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-[13px] font-medium text-accent-red tracking-tight">
                verdict: {aiData.verdict}
              </span>
            </div>
            <h1 className="text-[20px] font-sans text-text-primary leading-relaxed max-w-xl">
              "{aiData.summary}"
            </h1>
            <div className="flex items-center gap-4 text-[12px] text-text-tertiary">
              <span>lang: {submission.language}</span>
              <span>·</span>
              <span>{codeLines} lines</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="font-mono text-xs">
                $ share_roast
              </Button>
            </div>
          </div>
        </section>

        <hr className="border-border-primary" />

        {/* Submitted Code Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[14px] font-bold">
            <span className="text-accent-green">{"//"}</span>
            <span className="text-text-primary">your_submission</span>
          </div>
          <div className="rounded-none border border-border-primary overflow-hidden">
            <CodeBlock code={submission.code} language={submission.language} />
          </div>
        </section>

        <hr className="border-border-primary" />

        {/* Analysis Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[14px] font-bold">
            <span className="text-accent-green">{"//"}</span>
            <span className="text-text-primary">detailed_analysis</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {aiData.details.map((detail, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface">
                <Badge variant={detail.type}>{detail.type}</Badge>
                <h3 className="text-[13px] font-medium text-text-primary">
                  {detail.title}
                </h3>
                <p className="text-[12px] text-text-secondary leading-relaxed font-sans max-w-[90%]">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border-primary" />

        {/* Improved Code Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[14px] font-bold">
            <span className="text-accent-green">{"//"}</span>
            <span className="text-text-primary">suggested_fix</span>
          </div>

          <div className="rounded-none border border-border-primary overflow-hidden">
            <CodeBlock code={aiData.suggestedFix} language={submission.language} />
          </div>
        </section>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat(frontend): make roast details page fully dynamic using AI response"
```
