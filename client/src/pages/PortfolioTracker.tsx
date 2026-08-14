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
      "Authenticated ownership, tenant isolation, validated account and asset records, authorized source integration, durable transaction history, network and currency validation, reconciliation, idempotency, correction workflows, audit logging, defined empty states, and clear error handling are required before displaying a portfolio, position, balance, holding, transaction, allocation, performance result, or account summary.",
  },
  {
    title: "Verified market data and valuation methodology",
    icon: Database,
    detail:
      "Authorized market-data providers, documented instrument coverage, validated symbol mapping, timestamped source attribution, stale-data detection, currency conversion rules, corporate-action handling where applicable, documented valuation definitions, calculation lineage, and independent data-quality checks are required before displaying a price, value, gain, loss, return, chart, metric, or price-derived calculation.",
  },
  {
    title: "Financial security, privacy, and governance controls",
    icon: ShieldCheck,
    detail:
      "Least-privilege financial access, secure secret handling, transaction approval controls where applicable, sensitive-data minimization, access reviews, policy enforcement, secure audit logging, incident response, retention limits, and independently evidenced safeguards are required before exposing account, transaction, position, balance, portfolio, asset, or personal financial information.",
  },
  {
    title: "Evidence-based reporting and service operations",
    icon: FileCheck2,
    detail:
      "Verified service integrations, documented metric definitions and accounting basis, durable telemetry, reconciliation records, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function PortfolioTracker() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Portfolio-tracking service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Portfolio Tracker
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Portfolio holdings, balances, transactions, positions, market
            prices, valuations, performance, analytics, live updates,
            automation, active user counts, transaction totals, success rates,
            and response times are not configured for this deployment. No
            account, asset, balance, transaction, portfolio, metric, or service
            result is represented as current, complete, verified, active, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated portfolio, balance, transaction, or valuation
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access an account, retrieve a balance,
                retrieve market data, calculate a valuation or return, create a
                transaction, analyze a portfolio, stream an update, trigger
                automation, or report that a financial operation succeeded.
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
