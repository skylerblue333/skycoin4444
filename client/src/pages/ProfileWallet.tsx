import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Link } from "wouter";

const CAPABILITIES = [
  "Verified profile statistics",
  "Wallet balance and ownership proof",
  "Persisted transaction activity",
  "Creator earnings and reward history",
  "Secure wallet actions",
] as const;

export default function ProfileWallet() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Profile & Wallet</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped profile information.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Profile & Wallet</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Partially available</Badge>
        </header>
        <Card>
          <CardHeader><CardTitle>Authenticated account</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Signed-in account context is available.</p>
            <p className="font-medium">{user.username ?? "Account holder"}</p>
            <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Profile and wallet details unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Verified profile and wallet procedures are not currently exposed for this application. This page does not display balances, addresses, mock activity, follower counts, earnings, rewards, transaction history, or claims that wallet actions are secured or completed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <div key={capability} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 p-3">
                <span className="text-sm text-muted-foreground">{capability}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Link href="/settings"><Button variant="outline">Open account settings</Button></Link>
      </div>
    </main>
  );
}
