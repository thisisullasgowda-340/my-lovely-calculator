import { useEffect, useState } from "react";
import { Delete, Divide, Minus, Moon, Percent, Plus, Sun, X } from "lucide-react";
import { useCalculator } from "@/hooks/use-calculator";
import { CalculatorDisplay } from "./calculator-display";
import { CalculatorHistory } from "./calculator-history";
import { CalculatorKey } from "./calculator-key";

const THEME_KEY = "my-calculator-theme";

/** Full calculator: header, display, keypad, and session history. */
export function CalculatorApp() {
  const calc = useCalculator();
  // Always start dark so SSR and the first client render match; the saved /
  // system preference is applied right after mount (see effect below).
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    setDark(saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 transition-colors">
      <div className="mb-6 flex w-full max-w-sm items-center justify-between lg:max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Calculator</h1>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-full border border-border bg-card p-2.5 text-muted-foreground shadow-sm transition-all hover:text-foreground active:scale-95"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4 lg:max-w-3xl lg:flex-row">
        <section
          aria-label="Calculator"
          className="w-full rounded-3xl border border-border bg-card p-4 shadow-xl shadow-foreground/5 sm:p-5"
        >
          <CalculatorDisplay
            expression={calc.expression}
            display={calc.display}
            isError={calc.isError}
          />

          <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
            <CalculatorKey label="Clear all" variant="utility" onClick={calc.clear}>
              AC
            </CalculatorKey>
            <CalculatorKey label="Backspace" variant="utility" onClick={calc.backspace}>
              <Delete className="h-6 w-6" aria-hidden="true" />
            </CalculatorKey>
            <CalculatorKey label="Percent" variant="utility" onClick={calc.percent}>
              <Percent className="h-6 w-6" aria-hidden="true" />
            </CalculatorKey>
            <CalculatorKey label="Divide" variant="operator" onClick={() => calc.inputOperator("/")}>
              <Divide className="h-6 w-6" aria-hidden="true" />
            </CalculatorKey>

            {["7", "8", "9"].map((d) => (
              <CalculatorKey key={d} label={d} onClick={() => calc.inputDigit(d)}>
                {d}
              </CalculatorKey>
            ))}
            <CalculatorKey label="Multiply" variant="operator" onClick={() => calc.inputOperator("*")}>
              <X className="h-6 w-6" aria-hidden="true" />
            </CalculatorKey>

            {["4", "5", "6"].map((d) => (
              <CalculatorKey key={d} label={d} onClick={() => calc.inputDigit(d)}>
                {d}
              </CalculatorKey>
            ))}
            <CalculatorKey label="Subtract" variant="operator" onClick={() => calc.inputOperator("-")}>
              <Minus className="h-6 w-6" aria-hidden="true" />
            </CalculatorKey>

            {["1", "2", "3"].map((d) => (
              <CalculatorKey key={d} label={d} onClick={() => calc.inputDigit(d)}>
                {d}
              </CalculatorKey>
            ))}
            <CalculatorKey label="Add" variant="operator" onClick={() => calc.inputOperator("+")}>
              <Plus className="h-6 w-6" aria-hidden="true" />
            </CalculatorKey>

            <CalculatorKey label="Toggle sign" onClick={calc.toggleSign}>
              +/−
            </CalculatorKey>
            <CalculatorKey label="0" onClick={() => calc.inputDigit("0")}>
              0
            </CalculatorKey>
            <CalculatorKey label="Decimal point" onClick={calc.inputDot}>
              .
            </CalculatorKey>
            <CalculatorKey label="Equals" variant="equals" onClick={calc.equals}>
              =
            </CalculatorKey>
          </div>
        </section>

        <CalculatorHistory history={calc.history} onClear={calc.clearHistory} />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Keyboard supported — type numbers, + − × ÷, Enter for equals, Backspace, Esc to clear.
      </p>
    </main>
  );
}
