import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Verified live-stream and recipient directory",
  "Authenticated gift balance and payment authorization",
  "Persisted gift catalog, delivery, and receipt records",
  "Real-time stream event delivery with deduplication",
  "Refund, abuse, and moderation handling",
] as const;

export default function StreamGifting() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-[#0e0a1a]">
          <CardHeader><CardTitle>Live Gifting</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Sign in to view account-scoped gifting tools.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Live Gifting</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">Gifting services unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              No verified gifting, stream, balance, or settlement backend is currently exposed. This page does not display mock streams, viewer counts, gift animations, creator names, gift balances, gift prices, top-gifter rankings, recent gifts, or local success and top-up messages.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#0e0a1a]">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="text-sm text-slate-300">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-slate-500">
          No gift mutation, balance update, stream request, polling loop, animation, or synthetic success path is initiated by this page. Any future activation requires explicit confirmation, idempotent settlement, provider or ledger evidence, and tested failure and refund handling.
        </p>
      </div>
    </main>
  );
}
