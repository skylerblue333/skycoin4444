import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ShoppingBag, ShieldAlert } from "lucide-react";

const REQUIREMENTS = [
  "Authoritative catalog and seller ownership contracts",
  "Verified prices, inventory, ratings, reviews, and delivery data",
  "Server-side checkout, payment, refund, and order-state handling",
  "Validated product media and external marketplace integration",
  "Authorization, fraud controls, and auditable commission accounting",
] as const;

export default function Marketplace() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" />Marketplace</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped marketplace services.</p>
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
          <ShoppingBag className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Marketplace services unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  No verified catalog, seller, inventory, payment, order, or external marketplace service is currently exposed. This page does not display synthetic products, NFTs, sellers, prices, ratings, review counts, sold counts, delivery promises, auction bids, commission claims, or successful orders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Required controls before activation</CardTitle></CardHeader>
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
          No product query, checkout, payment, order mutation, external redirect, commission calculation, or synthetic success path is initiated by this page. Any future activation requires real catalog data, secure payment integration, and tested order reconciliation.
        </p>
      </div>
    </main>
  );
}
