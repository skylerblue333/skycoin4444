import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Allowlisted procedures with server-side authorization",
  "Validated JSON input and output schemas",
  "Persisted event logs with retention controls",
  "Read-only database inspection with redaction",
  "Evidence-backed service and deployment status",
] as const;

export default function UnhiddenInterface() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-background p-8 text-foreground">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Unhidden Interface</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped diagnostic tools.</p>
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
          <h1 className="text-3xl font-bold">Unhidden Interface</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Diagnostic tools unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No verified, authorized diagnostic contract is currently exposed. This page does not execute arbitrary procedure names, simulate successful queries, generate live-looking event logs, expose database rows, or claim healthy services, routes, tests, token supply, or simulation state.
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
          The authenticated account context is available, but no diagnostic operation is initiated. Future tools must be least-privilege, read-only by default, redacted, rate-limited, audited, and covered by authorization tests.
        </p>
      </div>
    </main>
  );
}
