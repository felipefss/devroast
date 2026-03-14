import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

const buttonVariants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;
const buttonSizes = ["sm", "default", "lg", "icon"] as const;
const badgeVariants = ["critical", "warning", "good", "verdict"] as const;

const sampleCode = `function calculate(a, b) {
  return a + b;
}

const result = calculate(10, 5);
console.log(result);`;

export function ServerComponentsPage() {
  return (
    <>
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Button</h2>
        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Variantes</h3>
            <div className="flex flex-wrap gap-3">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tamanhos</h3>
            <div className="flex flex-wrap items-center gap-3">
              {buttonSizes.map((size) => (
                <Button key={size} size={size}>
                  {size}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Estados</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button className="hover:brightness-90">Hover</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Badge</h2>
        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Variantes</h3>
            <div className="flex flex-wrap gap-4">
              {badgeVariants.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Sem dot</h3>
            <div className="flex flex-wrap gap-4">
              {badgeVariants.map((variant) => (
                <Badge key={variant} variant={variant} dot={false}>
                  {variant}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Card</h2>
        <div className="grid max-w-2xl gap-4">
          <Card>
            <CardHeader>
              <Badge variant="critical" />
              <span className="text-zinc-900 dark:text-zinc-100">
                using var instead of const/let
              </span>
            </CardHeader>
            <CardDescription>
              the var keyword is function-scoped rather than block-scoped, which can lead to
              unexpected behavior and bugs. modern javascript uses const for immutable bindings and
              let for mutable ones.
            </CardDescription>
          </Card>
          <Card variant="destructive">
            <CardHeader>
              <Badge variant="critical" />
              <span className="text-zinc-900 dark:text-zinc-100">Error example</span>
            </CardHeader>
            <CardDescription>This is a destructive card variant for error states.</CardDescription>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">CodeBlock</h2>
        <div className="space-y-4">
          <div className="rounded-md border border-border-primary bg-bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-primary bg-bg-surface">
              <div className="flex h-10 items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
              </div>
              <span className="font-mono text-xs text-text-tertiary">calculate.js</span>
            </div>
            <CodeBlock code={sampleCode} />
          </div>
          <div className="rounded-md border border-border-primary bg-bg-surface overflow-hidden">
            <CodeBlock code={sampleCode} showLineNumbers={false} />
          </div>
        </div>
      </section>
    </>
  );
}
