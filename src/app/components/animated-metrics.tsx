"use client";

import NumberFlow from "@number-flow/react";

interface AnimatedMetricsProps {
  roastedCodes: number;
  avgScore: number;
}

export function AnimatedMetrics({ roastedCodes, avgScore }: AnimatedMetricsProps) {
  return (
    <div className="flex justify-center items-center gap-4 text-[10px] text-text-tertiary uppercase tracking-widest font-black">
      <div className="flex items-center gap-1">
        <NumberFlow value={roastedCodes} format={{ useGrouping: true }} />
        <span>codes roasted</span>
      </div>
      <span className="h-1 w-1 rounded-full bg-text-tertiary" />
      <div className="flex items-center gap-1">
        <span>avg roast:</span>
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        <span>/10</span>
      </div>
    </div>
  );
}
