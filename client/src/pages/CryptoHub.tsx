import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { AlertTriangle, Cpu, Wallet } from "lucide-react";

const REQUIREMENTS = [
  "Authoritative wallet and balance service with server-side authorization",
  "Verified market-data oracles with timestamps, source, and stale-data handling",
  "Audited transaction execution for mining, swaps, staking, burns, and transfers",
  "Private-key and custody controls that never expose secrets to the client",
  "Idempotency, replay protection, reconciliation, and failed-transaction states",
  "Integration tests for financial invariants and authorization boundaries",
] as const;

export default function CryptoHub() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#0a0a0f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-8 text-white">
        <Card className="w-full max-w-md border-[#1e1e2e] bg-[#111118]">
          <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-indigo-400" />CryptoHub</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">Sign in to view account-scoped financial services.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <Cpu className="h-7 w-7 text-indigo-400" />
          <h1 className="text-3xl font-bold">CryptoHub</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Financial services unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  No verified wallet, custody, market-data, or transaction execution service is currently exposed. This page does not display synthetic token prices, balances, portfolio values, mining rewards, swap quotes, staking APYs, burn results, transaction history, or successful financial actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1e1e2e] bg-[#111118]">
          <CardHeader><CardTitle>Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-[#1e1e2e] bg-[#0d0d14] p-3">
                <span className="text-sm text-zinc-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-zinc-500">
          No balance query, price query, mining mutation, swap, stake, burn, transfer, wallet operation, or synthetic success path is initiated by this page. Any future activation requires a security review, server-side custody boundary, real data sources, transaction reconciliation, and tested financial invariants.
        </p>
      </div>
    </main>
  );
}
