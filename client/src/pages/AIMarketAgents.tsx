import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { AlertTriangle, Brain, Shield } from "lucide-react";

const REQUIREMENTS = [
  "Verified market-data sources with timestamps and stale-data handling",
  "Documented AI-agent model, provenance, and signal-generation policy",
  "Server-side authorization, rate limits, and financial-risk controls",
  "Auditable ICO, investor, treasury, and staking records",
  "Tests proving signals and metrics are informational and never fabricated",
] as const;

export default function AIMarketAgents() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-cyan-400" />AI Market Agents</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped market services.</p>
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
          <Brain className="h-7 w-7 text-cyan-400" />
          <h1 className="text-3xl font-bold">AI Market Agents</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">AI market-agent services unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  No verified AI-agent, ICO, market-signal, investor, or staking service is currently exposed. This page does not display synthetic agents, live status, investor counts, raised amounts, token prices, APY, reward pools, sentiment, rarity, signals, activity, or investment prompts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Required controls before activation</CardTitle></CardHeader>
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
          No market query, agent cycle, signal generation, investment navigation, price calculation, or synthetic success path is initiated by this page. Any future activation requires real data sources, explicit AI provenance, financial controls, and integration tests.
        </p>
      </div>
    </main>
  );
}
