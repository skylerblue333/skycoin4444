import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Persisted simulation state and snapshots",
  "Authenticated scenario controls",
  "Synthetic-user isolation and cleanup",
  "Verified economy and wallet telemetry",
  "Scenario outcome and failure reporting",
] as const;

export default function WorldSimulationControl() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-background p-8 text-foreground">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>World Simulation Control</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped simulation controls.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">World Simulation Control</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Simulation controls unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No verified simulation-control backend is currently exposed. This page does not claim active AI personas, synthetic users, world ticks, snapshots, economy flow, token circulation, treasury balances, user counts, scenario risk, or completed scenario execution.
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
          No tick, trend injection, synthetic-user action, economy mutation, snapshot restore, or scenario execution is initiated by this page. Any future implementation requires isolated test data, authorization, audit logging, deterministic fixtures, and explicit failure-state verification.
        </p>
      </div>
    </main>
  );
}
