import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default:
        "bg-accent-green text-text-primary hover:bg-accent-green/90 active:bg-accent-green/80",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
      outline:
        "border-2 border-zinc-200 bg-transparent hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800",
      ghost:
        "bg-transparent hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700",
      destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
      link: "bg-transparent text-accent-green underline-offset-4 hover:underline",
    },
    size: {
      default: "px-6 py-2.5",
      sm: "px-4 py-1.5 text-xs",
      lg: "px-8 py-3 text-base",
      icon: "p-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";
