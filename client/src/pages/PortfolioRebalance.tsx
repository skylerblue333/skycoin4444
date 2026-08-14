import {
  AlertTriangle,
  FileCheck2,
  Landmark,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized account, portfolio, and market-data records",
    icon: Landmark,
    detail:
      "Authenticated ownership, tenant isolation, validated account, asset, position, and transaction records, authorized market-data integration, timestamped source attribution, reconciliation, currency and network validation, defined empty states, and clear error recovery are required before displaying a portfolio, allocation, balance, position, value, price, market-data result, or rebalance input.",
  },
  {
    title: "Documented allocation policy and approval controls",
    icon: FileCheck2,
    detail:
      "A documented allocation policy, explicit user or organization authorization, validated objectives and constraints, versioned inputs, conflict and stale-data checks, human review where appropriate, calculation lineage, reviewable proposed actions, and durable approval records are required before generating, presenting, accepting, or applying a rebalance proposal or allocation change.",
  },
  {
    title: "Secure execution, custody, and risk safeguards",
    icon: ShieldCheck,
    detail:
      "Approved custody architecture, transaction approval controls, least-privilege access, secure secret handling, provider authorization, asset and network validation, pre-execution safeguards, idempotency, duplicate prevention, failure handling, transaction-status verification, audit logging, and incident response are required before submitting, executing, or reporting a trade, asset transfer, order, or other financial action.",
  },
  {
    title: "Evidence-based operations and reporting",
    icon: Workflow,
    detail:
      "Verified service integrations, documented metric definitions and calculation basis, durable telemetry, reconciliation records, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function PortfolioRebalance() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Portfolio-rebalancing
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Portfolio Rebalance
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Portfolio holdings, market data, allocation targets, rebalance
            proposals, order creation, trade execution, performance analytics,
            live updates, automation, active user counts, transaction totals,
            success rates, and response times are not configured for this
            deployment. No account, portfolio, allocation, trade, transaction,
            metric, or service result is represented as current, complete,
            verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated rebalance proposal, order, trade, or execution
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access an account, retrieve a portfolio or
                market price, calculate an allocation, generate a rebalance
                proposal, create or submit an order, execute a trade, stream an
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
