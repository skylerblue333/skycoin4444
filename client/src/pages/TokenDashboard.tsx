import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "A deployed token contract and verified network address",
  "Indexed supply, holder, and transaction data",
  "Source-attributed burn transactions with confirmations",
  "Published allocation and vesting documentation",
  "Authenticated governance and staking procedures",
] as const;

export default function TokenDashboard() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>SKY444 Token</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped token information.</p>
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
          <h1 className="text-3xl font-bold"><span className="font-mono">SKY444</span> Token</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">Token data unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No verified token contract, indexer, or governance backend is currently exposed. This page does not claim a token deployment, supply, circulating amount, burned amount, allocation, holder count, staking ratio, governance activity, or burn history.
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
          No token query, blockchain request, burn-history request, wallet operation, staking operation, or governance action is initiated by this page. Any future activation requires network and contract verification, transaction hashes, indexed data timestamps, and tested failure states.
        </p>
      </div>
    </main>
  );
}
