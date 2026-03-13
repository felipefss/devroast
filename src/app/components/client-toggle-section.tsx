"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function ClientToggleSection() {
  const [toggleChecked, setToggleChecked] = useState(false);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Toggle</h2>
      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Estados</h3>
          <div className="flex flex-wrap items-center gap-6">
            <Toggle checked={false} label="roast mode" />
            <Toggle checked={true} label="roast mode" />
            <Toggle checked={false} disabled label="roast mode" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Interativo</h3>
          <Toggle
            checked={toggleChecked}
            onCheckedChange={setToggleChecked}
            label="roast mode"
          />
          <p className="text-sm text-zinc-500">Estado: {toggleChecked ? "on" : "off"}</p>
        </div>
      </div>
    </section>
  );
}
