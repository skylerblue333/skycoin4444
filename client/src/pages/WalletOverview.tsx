import { useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CHECKS = [
  ["Protect secrets", "Recovery phrases and private keys stay offline and private."],
  ["Verify destination", "Check the full address, network, asset, and intended action before signing."],
  ["Check approvals", "Review connected applications and revoke permissions you no longer need."],
  ["Plan recovery", "Keep a private backup and a trusted incident plan before you need it."],
] as const;

const TIPS = [
  ["Public address", "A public address may be shared for receiving. It does not prove who controls it."],
  ["Signing request", "A wallet prompt is an authorization request, not a harmless login. Read the details."],
  ["Support scam", "No legitimate support workflow needs your seed phrase or private key."],
  ["Test environment", "Use a local or test network to learn unfamiliar flows before considering valuable assets."],
] as const;

export default function WalletOverview() {
  const [completed, setCompleted] = useState<string[]>([]);
  const progress = Math.round((completed.length / CHECKS.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><Badge variant="outline" className="border-emerald-300/30 text-emerald-200">Safety education</Badge><Badge variant="outline" className="border-white/15 text-white/45">No custody</Badge></div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Wallet safety center</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Learn the decisions that protect a wallet before connecting one. This page does not connect, import, generate, sign, or transfer anything.</p>
          </div>
          <Link href="/tip-jar"><Button variant="outline" className="border-white/15 text-white">Open crypto-tip safety</Button></Link>
        </header>

        <Card className="border-amber-300/25 bg-amber-300/[0.05]"><CardContent className="flex items-start gap-3 p-5"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" /><div><p className="font-semibold text-amber-100">Never enter secrets here</p><p className="mt-1 text-sm leading-6 text-slate-300">Do not paste a recovery phrase, private key, password, or one-time code into this site or into support chat.</p></div></CardContent></Card>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-white/[0.03]"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-200" /> Readiness checklist <span className="ml-auto text-sm font-normal text-white/45">{progress}%</span></CardTitle></CardHeader><CardContent className="space-y-3">{CHECKS.map(([title, detail]) => { const done = completed.includes(title); return <button key={title} type="button" onClick={() => setCompleted(current => done ? current.filter(item => item !== title) : [...current, title])} className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-left hover:border-emerald-300/30"><CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${done ? "text-emerald-300" : "text-white/25"}`} /><span><strong className="block text-white">{title}</strong><span className="mt-1 block text-sm leading-6 text-slate-400">{detail}</span></span></button>; })}</CardContent></Card>
          <Card className="border-violet-300/20 bg-violet-300/[0.04]"><CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-violet-200" /> Four wallet tips</CardTitle></CardHeader><CardContent className="space-y-4">{TIPS.map(([title, detail]) => <div key={title}><p className="font-semibold text-white">{title}</p><p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p></div>)}</CardContent></Card>
        </section>

        <Card className="border-sky-300/20 bg-sky-300/[0.04]"><CardContent className="p-5 text-sm leading-6 text-sky-100/75"><strong className="text-sky-100">Beta boundary:</strong> wallet connection, balances, token tips, selling, swaps, staking, and blockchain writes are intentionally unavailable until verified providers, permissions, transaction review, receipt handling, and incident controls are implemented.</CardContent></Card>
      </div>
    </main>
  );
}
