import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { AlertTriangle, Building2, Shield } from "lucide-react";

const REQUIREMENTS = [
  "Verified offering documentation and jurisdictional compliance review",
  "Authoritative token-sale, investor, vesting, and referral records",
  "Server-side KYC/AML, payment, custody, and refund controls",
  "Auditable fundraising, treasury, and allocation data",
  "Independent review of all financial claims and user-facing disclosures",
] as const;

export default function InvestorPortal() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-slate-800 bg-slate-950/70">
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-violet-400" />Investor Portal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Sign in to view account-scoped investor information.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <Building2 className="h-7 w-7 text-violet-400" />
          <h1 className="text-3xl font-bold">Investor Portal</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Investor services unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  No verified token offering, investor, payment, KYC/AML, vesting, referral, or custody service is currently exposed. This page does not display synthetic sale tiers, tokenomics, prices, bonuses, fundraising totals, investor counts, vesting promises, referral rewards, future listings, or successful checkout and claim actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-violet-400" />Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <span className="text-sm text-slate-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-slate-500">
          No ICO query, payment checkout, investment action, referral lookup, vesting claim, wallet credit, financial calculation, or synthetic success path is initiated by this page. Any future activation requires legal/compliance review, real payment controls, and independently auditable records.
        </p>
      </div>
    </main>
  );
}
