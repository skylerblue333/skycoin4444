import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Verified staking pools",
  "Authenticated positions",
  "Reward accounting",
  "Unlock schedules",
  "On-chain or ledger settlement",
] as const;

export default function StakingPortal() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-white">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Staking Portal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped staking information.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold">Staking Portal</h1>
            <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
          </div>
          <p className="text-muted-foreground">A transparent boundary for token-locking and reward infrastructure.</p>
        </header>

        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Staking services unavailable</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              No verified staking backend is currently exposed for this application. This page does not display APY, reward projections, pool totals, participant counts, audit status, unlock dates, or successful staking and reward-claim actions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Planned capabilities</CardTitle></CardHeader>
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
          No token lock, reward calculation, wallet transaction, or financial commitment is initiated by this page. Any future implementation requires authenticated persistence, explicit risk disclosures, transaction safety, and remote test evidence.
        </p>
      </div>
    </main>
  );
}
