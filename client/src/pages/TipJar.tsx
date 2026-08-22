import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Verified creator identity and recipient selection",
  "Authenticated payment and balance authorization",
  "Currency, amount, and fee validation",
  "Idempotent settlement with provider confirmation",
  "Persisted receipt, refund, and dispute handling",
] as const;

export default function TipJar() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#0a0a0f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-black/40">
          <CardHeader><CardTitle>Tip Jar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">Sign in to view account-scoped creator-support tools.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Tip Jar</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">Creator tips unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              No verified creator directory, payment provider, wallet settlement, or receipt backend is currently exposed. This page does not display mock creators, leaderboards, recent tips, balances, exchange values, or successful payment messages, and it cannot submit a tip.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/40">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <span className="text-sm text-gray-300">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-gray-500">
          No payment mutation, wallet operation, creator lookup, balance query, or synthetic success path is initiated by this page. Any future activation requires explicit user confirmation, provider webhooks, duplicate protection, refunds, and tested failure handling.
        </p>
      </div>
    </main>
  );
}
