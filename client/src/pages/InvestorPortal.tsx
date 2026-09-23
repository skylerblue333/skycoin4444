import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Building2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  investorDataRoomLinks,
  offeringReadinessGates,
} from "@/data/investorReadiness";

const evidenceRules = [
  "Publish a source, period, and last-updated timestamp beside every investor metric.",
  "Separate engineering-beta evidence from production, revenue, customer, and token-market claims.",
  "Never label a token sale, audit, KYC flow, payment path, listing, custody service, or raise as live until the named external system is verified.",
  "Keep scenario math visibly separate from approved tokenomics, forecasts, valuation, or an offering.",
] as const;

export default function InvestorPortal() {
  const unresolvedGates = offeringReadinessGates.length;

  return (
    <main className="min-h-screen bg-[#07050f] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="overflow-hidden rounded-3xl border border-amber-300/15 bg-gradient-to-br from-amber-300/[0.08] via-white/[0.03] to-violet-500/[0.08] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-black">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/70">
                SKYCOIN4444 capital readiness
              </p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">Investor Portal</h1>
            </div>
            <Badge className="ml-auto border border-amber-300/25 bg-amber-300/10 text-amber-100">
              Controlled beta
            </Badge>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            A due-diligence workspace for product evidence, token planning, metrics
            methodology, risk controls, and financing readiness. It is not a live
            securities offering, token sale, exchange, wallet-custody service, or
            promise of returns.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Offering status</div>
              <div className="mt-1 font-bold text-amber-200">Planning only</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Unresolved launch gates</div>
              <div className="mt-1 font-bold text-white">{unresolvedGates}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Investor-number policy</div>
              <div className="mt-1 font-bold text-emerald-200">Evidence first</div>
            </div>
          </div>
        </header>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <h2 className="text-xl font-bold">Data room</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {investorDataRoomLinks.map(item => (
              <Link
                key={item.route}
                href={item.route}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-amber-300/25 hover:bg-amber-300/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-amber-200" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.035]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-violet-300" />
                Evidence standard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {evidenceRules.map(rule => (
                <div key={rule} className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-slate-300">{rule}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-amber-300/15 bg-amber-300/[0.035]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-300" />
                What makes this investor-ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
              <p>
                Strong investor material should distinguish verified operating
                facts, management hypotheses, and future targets. Every important
                number should be reproducible from a named source.
              </p>
              <p>
                For SKYCOIN4444, the next step is not another synthetic valuation
                card. It is connecting product telemetry, accounting records,
                treasury evidence, token-contract evidence, and legal/compliance
                documentation to the same review surface.
              </p>
              <div className="rounded-xl border border-amber-300/20 bg-black/20 p-4 text-xs text-amber-100/80">
                No investment action, wallet connection, payment, token claim, KYC,
                custody, or blockchain transaction is initiated from this portal.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
