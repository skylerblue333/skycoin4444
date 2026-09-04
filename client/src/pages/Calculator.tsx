import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  calculateArithmetic,
  type ArithmeticOperator,
} from "@/lib/betaUtilities";
import { Calculator as CalculatorIcon, RotateCcw } from "lucide-react";

const HISTORY_KEY = "sky4444.beta-calculator-history";
const operators: Array<{ value: ArithmeticOperator; label: string }> = [
  { value: "add", label: "+" },
  { value: "subtract", label: "−" },
  { value: "multiply", label: "×" },
  { value: "divide", label: "÷" },
];

type HistoryItem = {
  expression: string;
  result: number;
};

export default function Calculator() {
  const [left, setLeft] = useState("12");
  const [right, setRight] = useState("4");
  const [operator, setOperator] = useState<ArithmeticOperator>("add");
  const [result, setResult] = useState<number | null>(16);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        setHistory(
          saved
            .filter(
              item =>
                item &&
                typeof item.expression === "string" &&
                Number.isFinite(item.result)
            )
            .slice(0, 12)
        );
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const run = () => {
    setError("");
    try {
      const next = calculateArithmetic(Number(left), Number(right), operator);
      setResult(next);
      const symbol = operators.find(item => item.value === operator)?.label ?? "?";
      const item = { expression: `${left} ${symbol} ${right}`, result: next };
      setHistory(current => {
        const updated = [item, ...current].slice(0, 12);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Calculation failed.");
    }
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <Badge variant="outline" className="mb-3">
            Launchable beta · local utility
          </Badge>
          <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight">
            <CalculatorIcon className="h-8 w-8 text-primary" />
            Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Deterministic four-operation arithmetic with browser-local history.
            It does not fetch market data, give financial advice, or send input
            to a server.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <Card>
            <CardHeader>
              <CardTitle>Calculate</CardTitle>
              <CardDescription>
                Enter two finite numbers and choose an operation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                <label className="space-y-2 text-sm font-medium">
                  First number
                  <Input
                    inputMode="decimal"
                    value={left}
                    onChange={event => setLeft(event.target.value)}
                  />
                </label>
                <div className="flex flex-wrap gap-2 sm:pb-0.5">
                  {operators.map(item => (
                    <Button
                      key={item.value}
                      type="button"
                      variant={operator === item.value ? "default" : "outline"}
                      size="icon"
                      aria-label={item.value}
                      onClick={() => setOperator(item.value)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
                <label className="space-y-2 text-sm font-medium">
                  Second number
                  <Input
                    inputMode="decimal"
                    value={right}
                    onChange={event => setRight(event.target.value)}
                  />
                </label>
              </div>

              <Button onClick={run} className="w-full sm:w-auto">
                Calculate result
              </Button>

              <div
                className="rounded-2xl border bg-muted/35 p-6"
                aria-live="polite"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Result
                </p>
                {error ? (
                  <p className="mt-2 text-sm text-destructive">{error}</p>
                ) : (
                  <p className="mt-2 text-4xl font-black">
                    {result === null ? "—" : result}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Local history</CardTitle>
                  <CardDescription>
                    Stored only in this browser.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={clearHistory}
                  disabled={history.length === 0}
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                  Run a calculation to build local history.
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div
                      key={item.expression + index}
                      className="flex items-center justify-between gap-4 rounded-xl border px-3 py-2.5 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.expression}
                      </span>
                      <strong>{item.result}</strong>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
