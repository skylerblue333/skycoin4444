import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Named market-data and execution providers",
  "Reproducible strategy and benchmark methodology",
  "Risk limits, approvals, and account authorization",
  "Order, settlement, and failed-execution records",
  "Independent performance and drawdown evidence",
] as const;

export default function AITrading() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>AI Trading Engine</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped trading information.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">AI Trading Engine</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">AI trading services unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No verified trading, market-data, or model-evaluation backend is currently exposed. This page does not claim live signals, automated strategies, risk protection, execution speed, market intelligence, win rate, returns, Sharpe ratio, drawdown, or portfolio optimization.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 p-3">
                <span className="text-sm text-muted-foreground">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-muted-foreground">
          No token query, wallet connection, strategy execution, order submission, or financial calculation is initiated by this page. Any future activation requires paper-trading tests, risk controls, idempotent execution, and independently reproducible results.
        </p>
      </div>
    </main>
  );
}
