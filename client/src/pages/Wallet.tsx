import { BookOpen, Link as LinkIcon, ShieldCheck, WalletCards } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const CAPABILITIES = [
  "Verified wallet connection and ownership proof",
  "On-chain balance reads from a named network",
  "Transaction history with confirmed status",
  "Fee estimation and recipient validation",
  "Signed send transactions and failure handling",
] as const;

export default function WalletPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const content = loading ? (
    <SurfaceCard className="grid min-h-48 place-items-center p-8 text-sm text-slate-500">Loading account state…</SurfaceCard>
  ) : !isAuthenticated || !user ? (
    <SurfaceCard className="mx-auto max-w-xl border-violet-200 bg-violet-50/70 p-6">
      <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" /><div><h2 className="font-black text-violet-950">Account context required</h2><p className="mt-2 text-sm leading-6 text-violet-900/75">Sign in to view account-scoped wallet information. Sign-in does not connect an external wallet or authorize a transaction.</p><Button onClick={() => startLogin()} className="mt-4 rounded-xl bg-violet-600 hover:bg-violet-700">Sign in</Button></div></div>
    </SurfaceCard>
  ) : (
    <div className="space-y-5">
      <SurfaceCard className="border-amber-200 bg-amber-50/70 p-6"><div className="flex gap-3"><WalletCards className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><h2 className="font-black text-amber-950">Wallet services unavailable</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-amber-900/80">No verified wallet backend is currently exposed for this application. This page does not display balances, token prices, USD values, external-wallet connection state, transaction history, fee estimates, or successful send results.</p></div></div></SurfaceCard>
      <SurfaceCard className="p-5"><CardHeader className="p-0"><CardTitle>Required capabilities before activation</CardTitle></CardHeader><CardContent className="grid gap-3 p-0 pt-5 sm:grid-cols-2">{CAPABILITIES.map(capability => <div key={capability} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><span className="text-sm text-slate-700">{capability}</span><Badge variant="secondary">Unavailable</Badge></div>)}</CardContent></SurfaceCard>
      <SurfaceCard className="p-5"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><h2 className="font-bold text-slate-900">Safe next steps</h2></div><p className="mt-2 text-sm leading-6 text-slate-600">Learn wallet safety without connecting custody or signing material. The beta keeps education separate from financial execution.</p><div className="mt-4 flex flex-wrap gap-2"><Link href="/beta-web3"><Button variant="outline" className="rounded-xl"><LinkIcon className="mr-2 h-4 w-4" />Open Web3 evidence room</Button></Link><Link href="/course-catalog"><Button variant="outline" className="rounded-xl"><BookOpen className="mr-2 h-4 w-4" />Study wallet security</Button></Link></div></SurfaceCard>
      <p className="text-xs leading-5 text-slate-500">No wallet provider request, address generation, transaction submission, or financial calculation is initiated by this page. Any future activation requires server-contract verification, network-specific validation, replay protection, and tested failure states.</p>
    </div>
  );

  return <ExperienceShell title="Wallet" subtitle="Account context and wallet safety boundaries." icon={WalletCards} accent="violet" badge="Safety-first beta" quickLinks={[{ href: "/beta-web3", label: "Web3 evidence", detail: "Inspect safe boundaries", icon: LinkIcon }, { href: "/course-catalog", label: "Security course", detail: "Learn before connecting", icon: BookOpen }, { href: "/route-health", label: "Route health", detail: "Recovery and readiness", icon: ShieldCheck }]}>{content}</ExperienceShell>;
}
