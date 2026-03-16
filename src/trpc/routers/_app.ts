import { count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { roasts, submissions } from "../../db/schema";
import { procedure, router } from "../init";

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
});

export type AppRouter = typeof appRouter;
