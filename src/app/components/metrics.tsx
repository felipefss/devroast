"use client";

import { trpc } from "@/trpc/client";
import { AnimatedMetrics } from "./animated-metrics";

export function Metrics() {
  const { data } = trpc.getMetrics.useQuery();

  return <AnimatedMetrics roastedCodes={data?.roastedCodes ?? 0} avgScore={data?.avgScore ?? 0} />;
}
