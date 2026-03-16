import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import type { AIRoastResponse } from "@/lib/ai-schema";
import { trpc } from "@/trpc/server";

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

    const codeLines = submission.code.split("\n").length;

    return (
      <div className="mx-auto max-w-4xl px-8 py-16 flex flex-col gap-12">
        {/* Score Hero */}
        <section className="flex flex-col md:flex-row items-center gap-12">
          {/* Score Ring */}
          <div className="relative w-[180px] h-[180px] flex items-center justify-center shrink-0">
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
              aria-label={`Score ${roast.score} out of 10`}
            >
              <title>Score {roast.score} out of 10</title>
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                stroke="var(--color-border-primary)"
                strokeWidth="4"
              />
              {/* Progress Track */}
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
              <span className="text-[48px] font-bold text-accent-amber leading-none">
                {roast.score}
              </span>
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
            {aiData.details.map((detail) => (
              <div
                key={detail.title}
                className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface"
              >
                <Badge variant={detail.type as "good" | "warning" | "critical"}>
                  {detail.type}
                </Badge>
                <h3 className="text-[13px] font-medium text-text-primary">{detail.title}</h3>
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
  } catch (_error) {
    notFound();
  }
}
