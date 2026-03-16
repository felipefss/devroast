import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { languageEnum, roastModeEnum, roasts, submissions } from "../../db/schema";
import { aiRoastSchema } from "../../lib/ai-schema";
import { procedure, router } from "../init";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const appRouter = router({
  getMetrics: procedure.query(async () => {
    const [[totalRoasts], [averageScore]] = await Promise.all([
      db.select({ value: count() }).from(roasts),
      db
        .select({
          value: sql<number>`AVG(CAST(${roasts.score} AS numeric))`,
        })
        .from(roasts),
    ]);

    return {
      roastedCodes: totalRoasts?.value ?? 0,
      avgScore: Number(Number(averageScore?.value ?? 0).toFixed(1)),
    };
  }),

  getLeaderboard: procedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional().default(3),
        })
        .optional()
        .default({ limit: 3 }),
    )
    .query(async ({ input }) => {
      if (input.limit <= 3) {
        // Wait slightly to simulate delay and display skeleton in the frontend
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const worstRoasts = await db
        .select({
          id: roasts.id,
          score: roasts.score,
          code: submissions.code,
          language: submissions.language,
        })
        .from(roasts)
        .innerJoin(submissions, eq(roasts.submissionId, submissions.id))
        .orderBy(sql`CAST(${roasts.score} AS numeric) ASC`)
        .limit(input.limit);

      return worstRoasts;
    }),

  createRoast: procedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.enum(languageEnum.enumValues),
        roastMode: z.enum(roastModeEnum.enumValues),
      }),
    )
    .mutation(async ({ input }) => {
      // 1. IP Hash for rate limiting
      // In a real app we'd get this from headers (x-forwarded-for). For now, we mock it or use a default.
      const ipHash = "mock-ip-hash";

      // 2. Rate Limiting Check (max 5 per hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentSubmissions = await db
        .select({ value: count() })
        .from(submissions)
        .where(and(eq(submissions.ipHash, ipHash), gte(submissions.createdAt, oneHourAgo)));

      if ((recentSubmissions[0]?.value ?? 0) >= 5) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You've been roasted too much today. Give it a rest (limit 5 per hour).",
        });
      }

      // 3. Call Gemini API
      const schemaDescription = `
Expected JSON schema:
{
  "score": number (0 to 10),
  "verdict": string (2-4 word slug like 'needs_serious_help'),
  "summary": string (1-2 sentence overall summary),
  "details": Array<{
    "type": "good" | "warning" | "critical",
    "title": string (under 5 words),
    "description": string (1-2 sentences)
  }> (3 to 6 items),
  "suggestedFix": string (The completely rewritten code)
}
`;

      const systemPrompt =
        input.roastMode === "brutal"
          ? `You are an absolutely ruthless, sarcastic, and deeply technical senior engineer. Roast the provided code without mercy. Be highly technical, pedantic, and devastatingly accurate. You MUST reply ONLY with a valid JSON matching the exact schema. Do not wrap the JSON in markdown blocks like \`\`\`json.\n${schemaDescription}`
          : `You are a slightly grumpy senior engineer reviewing a junior's PR. Provide a sarcastic but ultimately helpful review of the code. You MUST reply ONLY with a valid JSON matching the exact schema. Do not wrap the JSON in markdown blocks like \`\`\`json.\n${schemaDescription}`;

      const { text: generatedText } = await generateText({
        model: google("gemini-2.5-flash"),
        system: systemPrompt,
        prompt: `Language: ${input.language}\n\nCode:\n${input.code}`,
      });

      let jsonString = generatedText.trim();
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString.replace(/^```json/, "");
      } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```/, "");
      }
      if (jsonString.endsWith("```")) {
        jsonString = jsonString.replace(/```$/, "");
      }

      const parsedJson = JSON.parse(jsonString.trim());
      const roastResult = aiRoastSchema.parse(parsedJson);

      // 4. Save to Database
      const [submission] = await db
        .insert(submissions)
        .values({
          code: input.code,
          language: input.language,
          ipHash: ipHash,
        })
        .returning({ id: submissions.id });

      const [roast] = await db
        .insert(roasts)
        .values({
          submissionId: submission.id,
          content: roastResult,
          score: roastResult.score.toString(),
          roastMode: input.roastMode,
        })
        .returning({ id: roasts.id });

      return { roastId: roast.id };
    }),

  getRoastById: procedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
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

export type AppRouter = typeof appRouter;
