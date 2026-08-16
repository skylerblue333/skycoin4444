import { Link } from "wouter";
import { ArrowRight, BookOpen, LayoutDashboard, LockKeyhole, Settings, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";

const gatedCapabilities = [
  { title: "Wallet and portfolio", description: "Requires verified wallet custody, ledger persistence, and market data.", icon: WalletCards },
  { title: "AI services", description: "Requires configured providers, authorization, usage controls, and monitoring.", icon: Sparkles },
  { title: "Education records", description: "Requires learner-owned activity, assessment rules, and durable records.", icon: BookOpen },
];

export default function MainDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4 text-white">
      <div className="mx-auto max-w-6xl py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">SKYCOIN4444 launch hub</p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">A truthful starting point for the ecosystem</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Account navigation and release boundaries are available now. Financial, AI, and education capabilities remain clearly gated until their providers and operational controls are verified.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/profile" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"><Settings className="h-4 w-4" /> Profile</Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-100"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
          </div>
        </div>

        <Card className="mb-6 border-cyan-300/20 bg-cyan-300/5 p-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-cyan-300" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">Code-green stabilization checkpoint</h2>
              <p className="mt-1 text-sm leading-6 text-slate-300">The application currently has zero strict TypeScript diagnostics, a passing production build, and passing automated tests. This status does not claim that production infrastructure or external services are live.</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {gatedCapabilities.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="border-white/10 bg-slate-900/80 p-6">
              <LockKeyhole className="mb-4 h-5 w-5 text-amber-300" aria-hidden="true" />
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200">View launch boundary <ArrowRight className="h-4 w-4" /></Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
