"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import type { ReactNode } from "react";

interface LeaderboardRowCodeClientProps {
  preview: ReactNode;
  full: ReactNode;
}

export function LeaderboardRowCodeClient({ preview, full }: LeaderboardRowCodeClientProps) {
  return (
    <Collapsible.Root className="group min-w-0 flex flex-col items-start w-full">
      <div className="w-full group-data-[state=open]:hidden">{preview}</div>

      <Collapsible.Panel className="w-full">{full}</Collapsible.Panel>

      <Collapsible.Trigger className="mt-2 text-[10px] uppercase tracking-widest text-text-tertiary hover:text-accent-green transition-colors font-black underline underline-offset-4 decoration-border-primary hover:decoration-accent-green cursor-pointer">
        <span className="group-data-[state=open]:hidden">show_more</span>
        <span className="group-data-[state=closed]:hidden">show_less</span>
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
