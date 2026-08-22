import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { BarChart3, ShieldAlert } from "lucide-react";

const REQUIREMENTS = [
  "Authoritative event and metric sources with timestamps",
  "Tenant-scoped analytics authorization and data isolation",
  "Reproducible KPI, retention, economy, and security calculations",
  "Observability data for latency, errors, uptime, and agent execution",
  "Tests proving dashboards never fall back to generated or placeholder metrics",
] as const;

export default function EnterpriseAnalytics() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-zinc-950 p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-8 text-white">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/60">
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-blue-400" />Enterprise Analytics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">Sign in to view account-scoped analytics services.</p>
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
          <BarChart3 className="h-7 w-7 text-blue-400" />
          <h1 className="text-3xl font-bold">Enterprise Analytics</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Enterprise analytics unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  No verified tenant-scoped analytics, economy, security, retention, or AI-agent observability contract is currently exposed. This page does not display generated charts, fallback KPIs, revenue, burn, token, treasury, retention, threat, security, task, success-rate, latency, uptime, or performance claims.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader><CardTitle>Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                <span className="text-sm text-zinc-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-zinc-500">
          No analytics query, security query, economy query, chart calculation, refresh action, metric fallback, or synthetic success path is initiated by this page. Any future activation requires real event data, tenant isolation, reproducible formulas, and observability tests.
        </p>
      </div>
    </main>
  );
}
