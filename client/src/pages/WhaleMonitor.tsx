import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Named blockchain networks and indexed transaction source",
  "Validated large-transaction detection thresholds",
  "Privacy-safe wallet address handling",
  "Current market valuation with source timestamps",
  "Persisted alerts, deduplication, and delivery status",
] as const;

export default function WhaleMonitor() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#050508] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050508] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Whale Monitor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped monitoring information.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050508] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Whale Monitor</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">Large-transaction monitoring unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              No verified blockchain indexing or alert backend is currently exposed. This page does not display simulated transactions, wallet addresses, token amounts, USD values, impact classifications, live-feed state, volume totals, or largest-transaction claims.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="text-sm text-gray-300">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-gray-500">
          No token query, blockchain request, polling loop, alert mutation, or financial calculation is initiated by this page. Any future activation requires source attribution, privacy controls, deduplication, rate limits, and tested stale-data and failure states.
        </p>
      </div>
    </main>
  );
}
