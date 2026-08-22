import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Verified wallet registration",
  "On-chain balance reads",
  "Address validation",
  "Transaction signing",
  "Network broadcast and status tracking",
] as const;

export default function BlockchainCustody() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-zinc-950 p-8 text-white">Loading wallet account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-8 text-white">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
          <CardHeader><CardTitle>Blockchain Wallet</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">Sign in to view account-scoped wallet information.</p>
            <Button onClick={() => startLogin()} className="w-full bg-amber-500 text-black hover:bg-amber-400">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">Blockchain Wallet</h1>
            <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
          </div>
          <p className="text-sm text-zinc-400">A safety boundary for wallet and blockchain operations.</p>
        </header>

        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">Blockchain custody services unavailable</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-300">
              No verified wallet, custody, signing, or network-broadcast backend is currently exposed for this application. This page does not claim non-custodial key handling, HD derivation, on-chain balances, transaction hashes, confirmation state, or successful broadcasts.
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
          No private keys, seed phrases, wallet addresses, transaction parameters, or financial actions are collected or initiated by this page. Any future implementation requires independently reviewed key management, network validation, signed-transaction verification, replay protection, and failure-state testing.
        </p>
      </div>
    </main>
  );
}
