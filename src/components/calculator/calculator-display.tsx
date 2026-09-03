import { cn } from "@/lib/utils";

interface CalculatorDisplayProps {
  expression: string;
  display: string;
  isError: boolean;
}

/** The readout screen: small expression line on top, big value below. */
export function CalculatorDisplay({ expression, display, isError }: CalculatorDisplayProps) {
  const long = display.length > 11;
  return (
    <div className="flex min-h-28 flex-col items-end justify-end gap-1 overflow-hidden rounded-2xl bg-display px-5 py-4 shadow-inner">
      <div className="h-6 max-w-full truncate text-sm text-muted-foreground" aria-live="polite">
        {expression || "\u00A0"}
      </div>
      <div
        className={cn(
          "max-w-full truncate font-mono font-medium tracking-tight text-display-foreground",
          long ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
          isError && "text-destructive text-2xl sm:text-3xl",
        )}
        role="status"
      >
        {display}
      </div>
    </div>
  );
}
