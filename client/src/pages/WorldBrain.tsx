import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Authenticated world-state reads",
  "Simulation event persistence",
  "Market data from a verified source",
  "Behavior and trend methodology",
  "Action execution and outcome tracking",
] as const;

export default function WorldBrain() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-background p-8 text-foreground">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>World Brain</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped world intelligence.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">World Brain</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">World intelligence services unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No verified simulation or market-intelligence backend is currently exposed. This page does not claim live entities, world ticks, event activity, market prices, sentiment, forecasts, behavior predictions, action confidence, expected impact, or executed outcomes.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <div key={capability} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 p-3">
                <span className="text-sm text-muted-foreground">{capability}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-muted-foreground">
          No simulation tick, market request, recommendation, or action mutation is initiated by this page. Any future implementation must identify data sources, persist events, validate financial data, and test execution and failure states independently.
        </p>
      </div>
    </main>
  );
}
