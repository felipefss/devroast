import type { ReactNode } from "react";
import { Switch } from "@base-ui/react/switch";
import { clsx } from "clsx";

export interface ToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const trackBase =
  "relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const thumbBase =
  "pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform";

export function Toggle({
  checked = false,
  onCheckedChange,
  label,
  disabled,
  className,
}: ToggleProps) {
  return (
    <div className={clsx("inline-flex items-center gap-3", className)}>
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={clsx(
          trackBase,
          checked
            ? "bg-accent-green border-transparent"
            : "bg-transparent border-zinc-300 dark:border-zinc-600",
        )}
      >
        <Switch.Thumb
          className={clsx(
            thumbBase,
            checked ? "translate-x-4.5 bg-text-primary" : "translate-x-0 bg-text-secondary",
          )}
        />
      </Switch.Root>
      {label && (
        <span
          className={clsx(
            "font-mono text-xs",
            checked ? "text-accent-green" : "text-text-secondary",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
