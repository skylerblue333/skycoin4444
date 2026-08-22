import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Authenticated token balance",
  "Persisted economic ledger",
  "Verified fee schedule",
  "Treasury accounting",
  "Public rich list",
] as const;

export default function EconomicLayer() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-gray-900">
          <CardHeader><CardTitle>Economic Layer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">Sign in to view account-scoped economic information.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">Economic Layer</h1>
            <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
          </div>
          <p className="text-sm text-gray-400">A transparent boundary for balances, ledger events, and treasury reporting.</p>
        </header>

        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Economic services unavailable</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-300">
              No verified economic router is currently exposed for this application. The page does not display token balances, market values, fee charges, treasury totals, rewards, rich-list rankings, or successful economic mutations.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader><CardTitle>Planned capabilities</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <div key={capability} className="flex items-center justify-between rounded-lg border border-gray-800 bg-black/20 p-3">
                <span className="text-sm text-gray-300">{capability}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs leading-5 text-gray-500">
          No financial or blockchain action is initiated by this page. Any future implementation must be backed by authenticated persistence, validation, transaction safety, and remote test evidence.
        </p>
      </div>
    </main>
  );
}
