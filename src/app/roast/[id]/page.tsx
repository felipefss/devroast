import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoastResultPage({ params }: PageProps) {
  // Await the params to satisfy Next.js 15+ requirements
  const resolvedParams = await params;
  const _id = resolvedParams.id;

  // Static data matching the Pencil design
  const code = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

  return (
    <div className="mx-auto max-w-4xl px-8 py-16 flex flex-col gap-12">
      {/* Score Hero */}
      <section className="flex flex-col md:flex-row items-center gap-12">
        {/* Score Ring */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center shrink-0">
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
            aria-label="Score 3.5 out of 10"
          >
            <title>Score 3.5 out of 10</title>
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
              stroke="var(--color-border-primary)"
              strokeWidth="4"
            />
            {/* Progress Track (35% filled) */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
              stroke="url(#score-gradient)"
              strokeWidth="4"
              strokeDasharray="289"
              strokeDashoffset="188"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-accent-red)" />
                <stop offset="100%" stopColor="var(--color-accent-amber)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex items-baseline gap-1">
            <span className="text-[48px] font-bold text-accent-amber leading-none">3.5</span>
            <span className="text-[16px] text-text-tertiary">/10</span>
          </div>
        </div>

        {/* Roast Summary */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="text-[13px] font-medium text-accent-red tracking-tight">
              verdict: needs_serious_help
            </span>
          </div>
          <h1 className="text-[20px] font-sans text-text-primary leading-relaxed max-w-xl">
            "this code looks like it was written during a power outage... in 2005."
          </h1>
          <div className="flex items-center gap-4 text-[12px] text-text-tertiary">
            <span>lang: javascript</span>
            <span>·</span>
            <span>7 lines</span>
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
          <CodeBlock code={code} language="javascript" />
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
          {/* Card 1 */}
          <div className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface">
            <Badge variant="critical">critical</Badge>
            <h3 className="text-[13px] font-medium text-text-primary">
              using var instead of const/let
            </h3>
            <p className="text-[12px] text-text-secondary leading-relaxed font-sans max-w-[90%]">
              var is function-scoped and leads to hoisting bugs. use const by default, let when
              reassignment is needed.
            </p>
          </div>
          {/* Card 2 */}
          <div className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface">
            <Badge variant="warning">warning</Badge>
            <h3 className="text-[13px] font-medium text-text-primary">imperative loop pattern</h3>
            <p className="text-[12px] text-text-secondary leading-relaxed font-sans max-w-[90%]">
              for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional
              transformations.
            </p>
          </div>
          {/* Card 3 */}
          <div className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface">
            <Badge variant="good">good</Badge>
            <h3 className="text-[13px] font-medium text-text-primary">clear naming conventions</h3>
            <p className="text-[12px] text-text-secondary leading-relaxed font-sans max-w-[90%]">
              calculateTotal and items are descriptive, self-documenting names that communicate
              intent without comments.
            </p>
          </div>
          {/* Card 4 */}
          <div className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface">
            <Badge variant="good">good</Badge>
            <h3 className="text-[13px] font-medium text-text-primary">single responsibility</h3>
            <p className="text-[12px] text-text-secondary leading-relaxed font-sans max-w-[90%]">
              the function does one thing well — calculates a total. no side effects, no mixed
              concerns, no hidden complexity.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-border-primary" />

      {/* Diff Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[14px] font-bold">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">suggested_fix</span>
        </div>

        <div className="border border-border-primary bg-[#111111] flex flex-col font-mono text-[12px] leading-relaxed">
          <div className="px-4 py-3 border-b border-border-primary text-text-secondary font-medium">
            your_code.ts → improved_code.ts
          </div>
          <div className="flex flex-col py-1">
            <div className="flex px-4 py-1 hover:bg-white/5 transition-colors">
              <span className="w-6 text-text-tertiary select-none"> </span>
              <span className="text-[#A0A0A0]">
                function <span className="text-[#FFC799]">calculateTotal</span>(
                <span className="text-white">items</span>) {"{"}
              </span>
            </div>

            <div className="flex px-4 py-1 bg-accent-red/15 text-accent-red">
              <span className="w-6 select-none">- </span>
              <span> var total = 0;</span>
            </div>
            <div className="flex px-4 py-1 bg-accent-red/15 text-accent-red">
              <span className="w-6 select-none">- </span>
              <span> for (var i = 0; i &lt; items.length; i++) {"{"}</span>
            </div>
            <div className="flex px-4 py-1 bg-accent-red/15 text-accent-red">
              <span className="w-6 select-none">- </span>
              <span> total = total + items[i].price;</span>
            </div>
            <div className="flex px-4 py-1 bg-accent-red/15 text-accent-red">
              <span className="w-6 select-none">- </span>
              <span> {"}"}</span>
            </div>
            <div className="flex px-4 py-1 bg-accent-red/15 text-accent-red">
              <span className="w-6 select-none">- </span>
              <span> return total;</span>
            </div>

            <div className="flex px-4 py-1 bg-accent-green/15 text-accent-green">
              <span className="w-6 select-none">+ </span>
              <span> return items.reduce((sum, item) =&gt; sum + item.price, 0);</span>
            </div>

            <div className="flex px-4 py-1 hover:bg-white/5 transition-colors">
              <span className="w-6 text-text-tertiary select-none"> </span>
              <span className="text-[#A0A0A0]">{"}"}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
