import { Link } from "wouter";
import { ArrowRight, BarChart3, Database, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { investorMetricRequirements } from "@/data/investorReadiness";

const publicationRules = [
  "Show the named source, exact data source, and accounting/telemetry system.",
  "Show the measurement period and last-updated timestamp.",
  "Define the numerator, denominator, exclusions, and test-data policy.",
  "Keep forecasts visually separate from historical actuals.",
  "Do not infer token price, market cap, treasury value, revenue, or users from demo data.",
] as const;

export default function InvestorMetrics() {
  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="rounded-3xl border border-violet-300/15 bg-gradient-to-br from-violet-500/[0.09] via-white/[0.025] to-blue-500/[0.06] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-300 text-black">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200/70">
                Investor evidence
              </p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">Metrics Methodology</h1>
            </div>
            <Badge className="ml-auto border border-violet-300/25 bg-violet-300/10 text-violet-100">
              No synthetic KPIs
            </Badge>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            This page defines what must be connected before SKYCOIN4444 publishes
            investor-facing operating or token metrics. Until those sources are
            verified, the correct value is “not measured,” not a placeholder number.
          </p>
          <div className="mt-6">
            <Link
              href="/investor-portal"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-black"
            >
              Back to investor portal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {investorMetricRequirements.map(item => (
            <Card key={item.id} className="border-white/10 bg-white/[0.03]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{item.metric}</CardTitle>
                  <Badge className="border border-amber-300/25 bg-amber-300/10 text-amber-100">
                    Evidence not connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <Database className="h-3.5 w-3.5" />
                    Source
                  </div>
                  <p className="mt-1 leading-6 text-slate-300">{item.source}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Period
                  </div>
                  <p className="mt-1 leading-6 text-slate-300">{item.period}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Verification rule
                  </div>
                  <p className="mt-1 leading-6 text-slate-400">{item.verification}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-emerald-300/15 bg-emerald-300/[0.035]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Publication contract
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {publicationRules.map(rule => (
              <div
                key={rule}
                className="rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm leading-6 text-slate-300"
              >
                {rule}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
