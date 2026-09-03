# My Calculator

A modern, responsive calculator web app — fast, keyboard-friendly, and polished enough to use every day.

## Features

- **Core arithmetic** — addition, subtraction, multiplication, division, and decimals
- **Correct order of operations** — `2 + 3 × 4` evaluates to `14` (shunting-yard algorithm)
- **Percentage (%)** and **sign toggle (+/−)** buttons
- **AC (clear all)** and **backspace** keys
- **Chained calculations** — keep calculating from the last result after pressing `=`
- **Graceful errors** — division by zero and invalid input show a clear message instead of breaking
- **Full keyboard support** — digits, `+ - * /`, `Enter`/`=` for equals, `Backspace`, `%`, `Esc` to clear
- **Calculation history** — recent expressions and results, stored for the session, with a Clear History button
- **Dark / light mode** — follows your system preference, toggleable in the header
- **Fully responsive** — comfortable on desktop, tablet, and mobile; history stacks below the calculator on small screens

## Technologies

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TanStack Start](https://tanstack.com/start) (routing + SSR)
- [Tailwind CSS v4](https://tailwindcss.com/) with a semantic design-token theme
- [Lucide](https://lucide.dev/) icons
- [Vite](https://vite.dev/) build tooling

## Running locally

```bash
# install dependencies
bun install        # or: npm install

# start the dev server
bun run dev        # or: npm run dev

# production build
bun run build      # or: npm run build
```

Then open http://localhost:8080 (or the port printed in the terminal).

## How to use

- Click the on-screen keys or just type on your keyboard.
- Operators apply with proper precedence — no need to calculate step by step.
- After pressing `=`, press an operator to continue from the result, or start typing a number for a fresh calculation.
- Your last 50 calculations appear in the History panel for the current session; use **Clear History** to wipe them.

## Project structure

```
src/
  lib/calculator.ts                    # token model + shunting-yard evaluator (pure, testable)
  hooks/use-calculator.ts              # state, keyboard input, session history
  components/calculator/
    calculator-app.tsx                 # page layout, theme toggle, keypad wiring
    calculator-display.tsx             # expression + result readout
    calculator-key.tsx                 # reusable button with variants
    calculator-history.tsx             # session history panel
  routes/index.tsx                     # route + SEO head metadata
```
