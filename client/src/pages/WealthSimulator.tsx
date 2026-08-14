import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified account and financial-data sources",
    icon: Database,
    detail:
      "Authenticated ownership, authorized account connections, source-attributed balances and transactions, current market data, correct asset and currency mapping, data freshness controls, reconciliation, correction workflows, and privacy protections are required before showing a portfolio, balance, holding, income, liability, asset, transaction, or net-worth value.",
  },
  {
    title: "Validated projection and calculation methodology",
    icon: TrendingUp,
    detail:
      "Documented assumptions, versioned calculation logic, evidence-based inputs, uncertainty treatment, representative testing, independent validation, data-quality checks, reproducibility, and transparent limitations are required before calculating a return, projection, future value, allocation, risk score, scenario, wealth outcome, or personalized financial insight.",
  },
  {
    title: "Financial safeguards and user protections",
    icon: ShieldCheck,
    detail:
      "Appropriate legal and compliance review, clear non-advisory boundaries, authorization, eligibility controls, risk disclosures, secure handling of financial information, anti-fraud controls, support and dispute procedures, audit logs, and human escalation are required before recommending, promoting, or enabling an investment, transfer, purchase, sale, allocation, or financial action.",
  },
  {
    title: "Evidence-based operation and monitoring",
    icon: Activity,
    detail:
      "Source-attributed telemetry, documented metric definitions, data-quality monitoring, secure error handling, observability, incident response, and independently evidenced performance testing are required before claiming live data, automation, active users, transactions, success rates, response times, analytics, or production readiness.",
  },
];

export default function WealthSimulator() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Wealth simulation service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Wealth Simulator
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Financial accounts, portfolios, net-worth calculations, investment
            projections, market data, return assumptions, allocations, risk
            estimates, future wealth scenarios, personalized financial insight,
            automation, and performance metrics are not configured for this
            deployment. No financial record, price, projection, investment
            result, transaction, recommendation, or financial outcome is
            represented as current, verified, available, or actionable.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated wealth, portfolio, market price, projection,
                return, or financial advice
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access a financial account, retrieve a market
                price, calculate a portfolio, forecast wealth, model an
                investment, recommend an allocation, create a transaction, or
                report that a financial calculation or action succeeded.
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
