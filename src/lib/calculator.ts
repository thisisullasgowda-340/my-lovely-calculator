/**
 * Core calculator engine.
 *
 * The calculator state is modeled as a flat list of tokens:
 *   { type: "num", value: "12.5" } | { type: "op", value: "+" | "-" | "*" | "/" }
 *
 * Evaluation uses the shunting-yard algorithm so multiplication/division
 * bind tighter than addition/subtraction (proper order of operations).
 */

export type Operator = "+" | "-" | "*" | "/";

export type Token = { type: "num"; value: string } | { type: "op"; value: Operator };

export const OP_SYMBOLS: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

const PRECEDENCE: Record<Operator, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

export class CalcError extends Error {}

/** Apply one binary operation. Throws CalcError on division by zero. */
function applyOp(a: number, b: number, op: Operator): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) throw new CalcError("Cannot divide by zero");
      return a / b;
  }
}

/** Evaluate a token list respecting mathematical order of operations. */
export function evaluateTokens(tokens: Token[]): number {
  // Drop a trailing operator so "5 +" still evaluates to 5.
  const cleaned = [...tokens];
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].type === "op") cleaned.pop();
  if (cleaned.length === 0) throw new CalcError("Nothing to calculate");

  // Shunting-yard: build RPN output + operator stacks.
  const output: number[] = [];
  const ops: Operator[] = [];

  for (const token of cleaned) {
    if (token.type === "num") {
      const n = Number.parseFloat(token.value);
      if (Number.isNaN(n)) throw new CalcError("Invalid number");
      output.push(n);
    } else {
      while (ops.length > 0 && PRECEDENCE[ops[ops.length - 1]] >= PRECEDENCE[token.value]) {
        const op = ops.pop()!;
        const b = output.pop()!;
        const a = output.pop()!;
        output.push(applyOp(a, b, op));
      }
      ops.push(token.value);
    }
  }

  while (ops.length > 0) {
    const op = ops.pop()!;
    const b = output.pop()!;
    const a = output.pop()!;
    if (a === undefined || b === undefined) throw new CalcError("Invalid expression");
    output.push(applyOp(a, b, op));
  }

  const result = output.pop();
  if (result === undefined || !Number.isFinite(result)) {
    throw new CalcError("Invalid calculation");
  }
  return result;
}

/** Format a number for display: trim float noise, keep it readable. */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  // 12 significant digits kills floating point noise (0.1 + 0.2, etc.)
  const rounded = Number.parseFloat(n.toPrecision(12));
  if (rounded !== 0 && (Math.abs(rounded) >= 1e13 || Math.abs(rounded) < 1e-9)) {
    return rounded.toExponential(6);
  }
  return String(rounded);
}

/** Render tokens as a human-readable expression, e.g. "2 + 3 × 4". */
export function tokensToExpression(tokens: Token[]): string {
  return tokens
    .map((t) => (t.type === "num" ? t.value : OP_SYMBOLS[t.value]))
    .join(" ");
}
