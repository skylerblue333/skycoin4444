import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { AlertTriangle, Shield, Wallet } from "lucide-react";

const REQUIREMENTS = [
  "Authoritative wallet and balance contract",
  "Timestamped market data from verified external sources",
  "Server-side transaction and custody boundaries",
  "Audited DeFi integrations with actual liquidity and risk disclosures",
  "Typed transaction status, reconciliation, and failure handling",
  "Tests for authorization, financial invariants, and stale data",
] as const;

export default function Crypto() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" />Crypto Wallet</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped financial information.</p>
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
          <Wallet className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Crypto Wallet</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Wallet and market services unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  No verified wallet, market-data, transaction, or DeFi service is currently exposed. This page does not display hard-coded token prices, balances, portfolio values, transaction status, yield APYs, liquidity TVL, coverage claims, or successful send, receive, swap, farming, or insurance actions.
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
          No balance query, price query, transaction query, custody operation, DeFi action, or synthetic success path is initiated by this page. Any future activation requires real data sources, secure server-side controls, and tested financial invariants.
        </p>
      </div>
    </main>
  );
}
