import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalcError,
  evaluateTokens,
  formatNumber,
  tokensToExpression,
  type Operator,
  type Token,
} from "@/lib/calculator";

export interface HistoryEntry {
  id: number;
  expression: string;
  result: string;
}

const HISTORY_KEY = "my-calculator-history";
const MAX_DIGITS = 15;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

/** All calculator state and actions, including session history and keyboard input. */
export function useCalculator() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  // Persist history for the current browser session.
  useEffect(() => {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Storage unavailable (private mode) — history just won't persist.
    }
  }, [history]);

  const reset = useCallback(() => {
    setTokens([]);
    setResult(null);
    setError(null);
  }, []);

  /** Append a digit to the number currently being typed. */
  const inputDigit = useCallback(
    (digit: string) => {
      if (error) reset();
      setResult(null);
      setTokens((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.type === "num") {
          const digits = last.value.replace(/[^0-9]/g, "");
          if (digits.length >= MAX_DIGITS) return prev;
          // Avoid leading zeros like "007".
          const value = last.value === "0" ? digit : last.value === "-0" ? "-" + digit : last.value + digit;
          return [...prev.slice(0, -1), { type: "num", value }];
        }
        return [...prev, { type: "num", value: digit }];
      });
    },
    [error, reset],
  );

  const inputDot = useCallback(() => {
    if (error) reset();
    setResult(null);
    setTokens((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.type === "num") {
        if (last.value.includes(".")) return prev; // one dot per number
        return [...prev.slice(0, -1), { type: "num", value: last.value + "." }];
      }
      return [...prev, { type: "num", value: "0." }];
    });
  }, [error, reset]);

  const inputOperator = useCallback(
    (op: Operator) => {
      if (error) reset();
      setTokens((prev) => {
        // Starting a new calculation from a previous result.
        if (result !== null) return [{ type: "num", value: result }, { type: "op", value: op }];
        const last = prev[prev.length - 1];
        if (!last) {
          // Allow a leading minus for negative numbers only.
          return op === "-" ? [{ type: "num", value: "-" }] : prev;
        }
        if (last.type === "op") return [...prev.slice(0, -1), { type: "op", value: op }];
        // Don't turn a lone "-" into "− ×".
        if (last.type === "num" && last.value === "-") {
          return op === "-" ? prev : prev.slice(0, -1);
        }
        return [...prev, { type: "op", value: op }];
      });
      setResult(null);
    },
    [error, reset, result],
  );

  /** Flip the sign of the current number (or the last result). */
  const toggleSign = useCallback(() => {
    if (error) return;
    if (result !== null) {
      setResult(result.startsWith("-") ? result.slice(1) : "-" + result);
      return;
    }
    setTokens((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.type !== "num" || last.value === "0") return prev;
      const value = last.value.startsWith("-") ? last.value.slice(1) : "-" + last.value;
      return [...prev.slice(0, -1), { type: "num", value }];
    });
  }, [error, result]);

  /** Convert the current number to its percentage (÷ 100). */
  const percent = useCallback(() => {
    if (error) return;
    if (result !== null) {
      setResult(formatNumber(Number.parseFloat(result) / 100));
      return;
    }
    setTokens((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.type !== "num") return prev;
      const value = formatNumber(Number.parseFloat(last.value) / 100);
      return [...prev.slice(0, -1), { type: "num", value }];
    });
  }, [error, result]);

  const backspace = useCallback(() => {
    if (error) {
      reset();
      return;
    }
    if (result !== null) {
      setResult(null);
      return;
    }
    setTokens((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      if (last.type === "op" || last.value.length <= 1 || (last.value.length === 2 && last.value.startsWith("-"))) {
        return prev.slice(0, -1);
      }
      return [...prev.slice(0, -1), { type: "num", value: last.value.slice(0, -1) }];
    });
  }, [error, reset, result]);

  const equals = useCallback(() => {
    if (error || tokens.length === 0) return;
    try {
      const value = evaluateTokens(tokens);
      const formatted = formatNumber(value);
      const expression = tokensToExpression(tokens);
      setResult(formatted);
      setTokens([]);
      setHistory((prev) => [
        { id: Date.now(), expression, result: formatted },
        ...prev.slice(0, 49), // keep the 50 most recent
      ]);
    } catch (e) {
      setError(e instanceof CalcError ? e.message : "Invalid calculation");
    }
  }, [error, tokens]);

  const clearHistory = useCallback(() => setHistory([]), []);

  // Full keyboard support.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
      else if (e.key === "." || e.key === ",") inputDot();
      else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        e.preventDefault();
        inputOperator(e.key as Operator);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        equals();
      } else if (e.key === "Backspace") backspace();
      else if (e.key === "Escape") reset();
      else if (e.key === "%") percent();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inputDigit, inputDot, inputOperator, equals, backspace, reset, percent]);

  // What the big display shows: the number being typed, the result, or an error.
  const display = useMemo(() => {
    if (error) return error;
    if (result !== null) return result;
    const last = tokens[tokens.length - 1];
    if (last && last.type === "num") return last.value;
    return "0";
  }, [error, result, tokens]);

  const expression = useMemo(() => {
    if (error) return "Press AC to clear";
    if (result !== null) return "Ans = " + result;
    return tokensToExpression(tokens);
  }, [error, result, tokens]);

  return {
    display,
    expression,
    isError: error !== null,
    history,
    inputDigit,
    inputDot,
    inputOperator,
    toggleSign,
    percent,
    backspace,
    clear: reset,
    equals,
    clearHistory,
  };
}
