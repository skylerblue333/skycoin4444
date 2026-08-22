import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Shield, Vote, AlertTriangle } from "lucide-react";

const REQUIREMENTS = [
  "Persisted proposal and vote records with authenticated ownership",
  "Defined voting power, quorum, delegation, and duplicate-vote rules",
  "Auditable treasury balances and proposal execution boundaries",
  "Authorization, anti-manipulation, and emergency governance controls",
  "Tests proving proposal lifecycle, tally, and execution outcomes",
] as const;

export default function Governance() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-purple-400" />Governance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Sign in to view account-scoped governance services.</p>
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
          <Shield className="h-7 w-7 text-purple-400" />
          <h1 className="text-3xl font-bold">Governance</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Governance service unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  No verified proposal, voting, treasury, or execution service is currently exposed. This page does not display synthetic proposals, vote totals, quorum progress, treasury balances, token approvals, participation rates, or successful proposal creation and voting actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle className="flex items-center gap-2"><Vote className="h-5 w-5 text-purple-400" />Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="text-sm text-slate-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-slate-500">
          No proposal query, treasury query, vote mutation, proposal mutation, tally calculation, token action, or synthetic success path is initiated by this page. Any future activation requires persisted governance records, authorization controls, and tested execution semantics.
        </p>
      </div>
    </main>
  );
}
