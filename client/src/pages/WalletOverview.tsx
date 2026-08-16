import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock3, ExternalLink } from "lucide-react";

export default function WalletOverview() {
  const { isAuthenticated } = useAuth();
  const overview = trpc.wallet.overview.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background p-6">
        <Card className="mx-auto mt-16 max-w-xl">
          <CardHeader><CardTitle>Sign in to view your wallet</CardTitle></CardHeader>
          <CardContent><a href={getLoginUrl()}><Button>Sign in</Button></a></CardContent>
        </Card>
      </main>
    );
  }

  if (overview.isLoading) {
    return <main className="min-h-screen bg-background p-6"><p className="mx-auto mt-16 max-w-xl text-muted-foreground">Loading wallet records…</p></main>;
  }

  if (overview.isError) {
    return (
      <main className="min-h-screen bg-background p-6">
        <Alert variant="destructive" className="mx-auto mt-16 max-w-xl">
          <AlertTitle>Wallet records could not be loaded</AlertTitle>
          <AlertDescription>{overview.error.message}</AlertDescription>
        </Alert>
      </main>
    );
  }

  if (!overview.data) {
    return <main className="min-h-screen bg-background p-6"><p className="mx-auto mt-16 max-w-xl text-muted-foreground">Wallet response was empty.</p></main>;
  }

  const wallet = overview.data.wallet;
  const transactions = overview.data.transactions;

  if (!wallet) {
    return (
      <main className="min-h-screen bg-background p-6">
        <Card className="mx-auto mt-16 max-w-xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" /> No wallet record</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>No wallet has been provisioned for this account. No balance or address is shown because no verified record exists.</p>
            <Link href="/"><Button variant="outline">Return to launch hub</Button></Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Wallet overview</h1>
          <p className="mt-1 text-muted-foreground">Read-only records from your verified account ledger.</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Current record</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div><p className="text-sm text-muted-foreground">Balance</p><p className="text-2xl font-semibold">{wallet.balance ?? "—"} {wallet.currency ?? ""}</p></div>
            <div><p className="text-sm text-muted-foreground">Address</p><p className="break-all font-mono text-sm">{wallet.address ?? "—"}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Transaction ledger</CardTitle></CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground">No transaction records exist for this account.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      {transaction.type === "deposit" ? <ArrowDownLeft className="h-4 w-4 text-emerald-600" /> : <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
                      <div><p className="font-medium">{transaction.type ?? "Transaction"}</p><p className="text-xs text-muted-foreground">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : "Date unavailable"}</p></div>
                    </div>
                    <div className="flex items-center gap-3 text-sm"><span>{transaction.amount ?? "—"}</span><span className="inline-flex items-center gap-1 text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{transaction.status ?? "status unavailable"}</span>{transaction.txHash && <a href={transaction.txHash} target="_blank" rel="noreferrer" aria-label="Open transaction reference"><ExternalLink className="h-3.5 w-3.5" /></a>}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
