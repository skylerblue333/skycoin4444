import {
  AlertTriangle,
  Database,
  FileCheck2,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized account, asset, and transaction records",
    icon: Landmark,
    detail:
      "Authenticated ownership, tenant isolation, validated account, asset, position, balance, and transaction records, authorized source integration, durable history, reconciliation, currency and network validation, correction workflows, audit logging, defined empty states, and clear error handling are required before displaying or changing a holding, balance, asset, transaction, allocation, wallet result, or portfolio summary.",
  },
  {
    title: "Verified market data and valuation methodology",
    icon: Database,
    detail:
      "Authorized market-data providers, documented instrument and venue coverage, validated symbol mapping, timestamped source attribution, stale-data detection, currency conversion rules, corporate-action handling where applicable, documented valuation definitions, calculation lineage, and independent data-quality checks are required before displaying a token price, holding value, allocation, performance, gain, loss, chart, history, or price-derived calculation.",
  },
  {
    title: "Financial security, custody, and access controls",
    icon: ShieldCheck,
    detail:
      "Approved custody architecture, least-privilege access, secure secret handling, transaction approval controls where applicable, input validation, access reviews, sensitive-data minimization, secure audit logging, incident response, retention limits, and independently evidenced safeguards are required before exposing account, transaction, portfolio, asset, balance, or personal financial information or initiating any financial action.",
  },
  {
    title: "Evidence-based reporting and service operations",
    icon: FileCheck2,
    detail:
      "Verified service integrations, documented metric definitions and calculation basis, durable telemetry, reconciliation records, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Portfolio service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Portfolio
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Portfolio holdings, balances, token prices, allocations, transaction
            history, wallet results, valuations, gains, losses, performance,
            market charts, live updates, analytics, automation, and service
            metrics are not configured for this deployment. No account, asset,
            balance, transaction, portfolio, price, metric, or service result is
            represented as current, complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated portfolio, balance, price, trade, or performance
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access an account or wallet, retrieve a
                balance, retrieve market data, calculate a valuation or return,
                add an asset, create a transaction, initiate a swap, stream an
                update, trigger automation, or report that a financial operation
                succeeded.
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
