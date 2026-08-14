import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Database,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified market-data integration",
    icon: BarChart3,
    detail:
      "Licensed and reliable market-data sources, timestamped provenance, source validation, stale-data handling, clear methodology, and appropriate disclosures are required before presenting a market price, trend, momentum, sentiment, or signal.",
  },
  {
    title: "AI analysis and decision controls",
    icon: BrainCircuit,
    detail:
      "A configured server-side model provider, research-grounding controls, monitored evaluation, transparent limitations, human review, and safe output handling are required before generating market commentary, confidence scores, or recommendations.",
  },
  {
    title: "Financial-product and fundraising controls",
    icon: ShieldCheck,
    detail:
      "Legal offering review, eligibility controls, investor protections, verified transaction records, risk disclosures, and regulated payment or custody workflows are required before connecting market content to a purchase, token sale, investment, or reward claim.",
  },
  {
    title: "Agent operations and auditability",
    icon: Database,
    detail:
      "Authenticated agent configuration, scoped permissions, durable activity records, access controls, human approval, monitoring, rollback, and incident response are required before reporting an autonomous cycle, agent status, generated signal, or operational impact.",
  },
];

export default function AIMarketAgents() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> AI market-agent service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Market Agents
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI market agents, market signals, confidence scores, sentiment
            analysis, market prices, token-sale metrics, investment activity,
            staking rewards, agent status, autonomous cycles, and activity logs
            are not configured for this deployment. No financial information,
            recommendation, signal, or agent outcome is represented as current,
            verified, or actionable.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated market intelligence or investment activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve market data, generate a buy, sell,
                hold, watch, or alert signal, calculate sentiment or confidence,
                execute an agent cycle, track a fundraise, quote a token price,
                or direct anyone to invest.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {serviceRequirements.map(requirement => {
            const Icon = requirement.icon;
            return (
              <Card
                key={requirement.title}
                className="border-slate-700 bg-slate-900"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base text-white">
                    <span className="rounded-lg bg-slate-800 p-2 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    {requirement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-300">
                    {requirement.detail}
                  </p>
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    Status: not configured
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
