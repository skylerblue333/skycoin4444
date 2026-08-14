import {
  AlertTriangle,
  ChartNoAxesCombined,
  Database,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized token and market-data access",
    icon: Database,
    detail:
      "Authorized providers, documented assets and symbols, source attribution, entitlement controls, freshness limits, rate-limit handling, response validation, historical-data retention, error recovery, and safe empty states are required before displaying any token, price, volume, supply, market-capitalization, transaction, wallet, or market-data result.",
  },
  {
    title: "Verified metric and analytics reconciliation",
    icon: ChartNoAxesCombined,
    detail:
      "Documented metric definitions, calculation methods, fee and cost-basis rules where applicable, calculation-version records, provider reconciliation, correction workflows, quality monitoring, and independently verifiable methods are required before reporting market, portfolio, performance, liquidity, activity, user, transaction, or analytical metrics.",
  },
  {
    title: "Secure financial-data governance",
    icon: ShieldCheck,
    detail:
      "Role-based access, sensitive-data minimization, tenant isolation, secure logging, retention limits, incident response, jurisdictional controls where applicable, support escalation, and independently evidenced protections are required before exposing financial, account, wallet, token, or transaction information.",
  },
  {
    title: "Evidence-based operational reporting",
    icon: Workflow,
    detail:
      "Source-attributed telemetry, documented service-level definitions, observability, capacity monitoring, performance testing, incident management, and independent evidence are required before claiming live data, real-time updates, advanced analytics, automation, active users, transactions, success rates, response times, or production readiness.",
  },
];

export default function TokenMetrics() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Token-metrics service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Token Metrics
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Token data, market prices, transaction records, analytics, user
            counts, performance, live updates, automation, success rates, and
            response times are not configured for this deployment. No token,
            price, transaction, market metric, user metric, performance result,
            or service result is represented as current, complete, verified, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated token data, analytics, or live metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a token price, transaction, wallet
                record, market result, user count, performance calculation, live
                update, or claim that a financial or service action succeeded.
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
