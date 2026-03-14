import { procedure, router } from "../init";

export const appRouter = router({
  getMetrics: procedure.query(async () => {
    // Simulated delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      roastedCodes: 2349,
      avgScore: 4.2,
    };
  }),
});

export type AppRouter = typeof appRouter;
