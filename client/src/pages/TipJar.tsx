import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

const REQUIREMENTS = [
  "Verified creator identity and recipient selection",
  "Authenticated payment and balance authorization",
  "Currency, amount, and fee validation",
  "Idempotent settlement with provider confirmation",
  "Persisted receipt, refund, and dispute handling",
] as const;

const TIP_SAFETY_CHECKS = [
  "Confirm the recipient through an independent profile or known channel.",
  "Treat crypto tips as irreversible unless the provider explicitly supports recovery.",
  "Never share a seed phrase, private key, password, or one-time code to send a tip.",
  "Review network, destination, amount, and fee before any future confirmation.",
] as const;

const EDUCATIONAL_TIPS = [
  ["Small test first", "If a provider is eventually connected, learn its test flow with an amount you can afford to lose."],
  ["No guaranteed returns", "A creator tip is support, not an investment, yield promise, or claim on future work."],
  ["Verify the route", "A familiar logo or copied username is not proof that an address belongs to the intended recipient."],
] as const;

export default function TipJar() {
  const { user, loading, isAuthenticated } = useAuth();
  const [checked, setChecked] = useState<string[]>([]);

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
        <Card className="border-amber-300/25 bg-amber-300/[0.05]">
          <CardHeader><CardTitle className="flex items-center gap-2 text-amber-100"><AlertTriangle className="h-5 w-5" /> Crypto-tip safety center</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-gray-300">Use this checklist to rehearse safe decisions. It records only your checklist state in this page and does not connect a wallet or send an asset.</p>
            <div className="grid gap-2">
              {TIP_SAFETY_CHECKS.map(check => {
                const done = checked.includes(check);
                return <button key={check} type="button" onClick={() => setChecked(current => done ? current.filter(item => item !== check) : [...current, check])} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-left hover:border-amber-300/30"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${done ? "text-emerald-300" : "text-white/25"}`} /><span className="text-sm text-gray-300">{check}</span></button>;
              })}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {EDUCATIONAL_TIPS.map(([title, detail]) => <Card key={title} className="border-white/10 bg-black/40"><CardHeader><CardTitle className="text-base text-white">{title}</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-gray-400">{detail}</p></CardContent></Card>)}
        </div>
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
        <div className="flex items-start gap-3 rounded-xl border border-sky-300/20 bg-sky-300/[0.04] p-4 text-xs leading-5 text-sky-100/70"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" /><span>Safety mode is the only active mode. No wallet operation, payment mutation, balance query, exchange-rate claim, or synthetic success path is initiated.</span></div>
        <p className="text-xs leading-5 text-gray-500">
          No payment mutation, wallet operation, creator lookup, balance query, or synthetic success path is initiated by this page. Any future activation requires explicit user confirmation, provider webhooks, duplicate protection, refunds, and tested failure handling.
        </p>
      </div>
    </main>
  );
}
