import { Trash2 } from "lucide-react";
import type { HistoryEntry } from "@/hooks/use-calculator";

interface CalculatorHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

/** Recent calculations for the current session. */
export function CalculatorHistory({ history, onClear }: CalculatorHistoryProps) {
  return (
    <aside className="flex w-full flex-col rounded-3xl border border-border bg-card p-5 shadow-xl shadow-foreground/5 lg:w-80">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          History
        </h2>
        <button
          type="button"
          onClick={onClear}
          disabled={history.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Clear History
        </button>
      </div>

      {history.length === 0 ? (
        <p className="flex flex-1 items-center justify-center py-8 text-sm text-muted-foreground">
          No calculations yet
        </p>
      ) : (
        <ul className="max-h-64 flex-1 space-y-1 overflow-y-auto pr-1 lg:max-h-[26rem]">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl px-3 py-2 text-right transition-colors hover:bg-muted/60"
            >
              <div className="truncate text-xs text-muted-foreground">{entry.expression} =</div>
              <div className="truncate font-mono text-lg font-medium text-foreground">
                {entry.result}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
