import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Authoritative token supply and allocation source",
  "Network- or contract-backed vesting schedules",
  "Account-specific vesting positions",
  "Claim eligibility and transaction status",
  "Audit trail for token unlock events",
] as const;

export default function VestingSchedule() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-white">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
          <CardHeader><CardTitle>Token Vesting</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">Sign in to view account-scoped vesting information.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Token Vesting</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">Vesting data unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              No authoritative tokenomics, contract-backed vesting schedule, or verified claim procedure is currently exposed. This page does not publish a supply, allocation percentages, circulating amount, unlock dates, account balances, or successful claim results.
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <div key={capability} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/20 p-3">
                <span className="text-sm text-zinc-300">{capability}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-zinc-500">
          No vesting query, token claim, wallet action, or financial calculation is initiated by this page. Any future activation requires a named authoritative source, contract verification, account authorization, replay protection, and tested failed-claim handling.
        </p>
      </div>
    </main>
  );
}
