import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KeyVariant = "number" | "operator" | "equals" | "utility";

const variantStyles: Record<KeyVariant, string> = {
  number:
    "bg-key text-key-foreground hover:bg-key-hover shadow-[inset_0_-2px_0_0_var(--key-shadow)]",
  operator:
    "bg-primary/15 text-primary font-semibold hover:bg-primary/25",
  equals:
    "bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30",
  utility:
    "bg-muted text-muted-foreground hover:bg-muted/70",
};

interface CalculatorKeyProps {
  children: ReactNode;
  onClick: () => void;
  variant?: KeyVariant;
  span?: 1 | 2;
  label: string;
}

/** A single calculator button with press/hover animations. */
export function CalculatorKey({ children, onClick, variant = "number", span = 1, label }: CalculatorKeyProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-16 select-none items-center justify-center rounded-2xl text-2xl transition-all duration-100",
        "active:scale-95 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "sm:h-[4.25rem]",
        variantStyles[variant],
        span === 2 && "col-span-2",
      )}
    >
      {children}
    </button>
  );
}
