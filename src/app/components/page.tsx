import { Suspense } from "react";
import { ServerComponentsPage } from "./server-components-page";
import { ClientToggleSection } from "./client-toggle-section";

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-12">
        <header>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">UI Components</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Catálogo de componentes visuais genéricos
          </p>
        </header>

        <ServerComponentsPage />

        <Suspense
          fallback={<div className="animate-pulse h-48 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />}
        >
          <ClientToggleSection />
        </Suspense>
      </div>
    </div>
  );
}
