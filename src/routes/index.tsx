import { createFileRoute } from "@tanstack/react-router";
import { CalculatorApp } from "@/components/calculator/calculator-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Calculator — Fast, Free Online Calculator" },
      {
        name: "description",
        content:
          "A modern, free online calculator with order of operations, percentages, keyboard support, and a session calculation history. Works on desktop, tablet, and mobile.",
      },
      { property: "og:title", content: "My Calculator — Fast, Free Online Calculator" },
      {
        property: "og:description",
        content:
          "A modern, free online calculator with order of operations, keyboard support, and calculation history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CalculatorApp,
});
