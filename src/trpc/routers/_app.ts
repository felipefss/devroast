import { count, sql } from "drizzle-orm";
import { db } from "../../db";
import { roasts } from "../../db/schema";
import { procedure, router } from "../init";

export const appRouter = router({
  getMetrics: procedure.query(async () => {
    // Get total roasts count
    const [totalRoasts] = await db.select({ value: count() }).from(roasts);

    // Get average score
    const [averageScore] = await db
      .select({
        value: sql<number>`AVG(CAST(${roasts.score} AS numeric))`,
      })
      .from(roasts);

    return {
      roastedCodes: totalRoasts?.value ?? 0,
      avgScore: Number(Number(averageScore?.value ?? 0).toFixed(1)),
    };
  }),
});

export type AppRouter = typeof appRouter;
