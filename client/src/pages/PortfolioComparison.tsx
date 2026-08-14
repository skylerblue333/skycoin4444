import {
  AlertTriangle,
  Database,
  FileCheck2,
  GitCompare,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized portfolio, account, and transaction records",
    icon: GitCompare,
    detail:
      "Authenticated ownership, tenant isolation, validated account, asset, position, allocation, and transaction records, authorized source integration, durable history, reconciliation, currency and network validation, correction workflows, audit logging, defined empty states, and clear error handling are required before displaying or comparing a portfolio, position, allocation, balance, transaction, or account result.",
  },
  {
    title: "Verified market data and comparison methodology",
    icon: Database,
    detail:
      "Authorized market-data providers, documented instrument and benchmark coverage, validated symbol mapping, timestamped source attribution, stale-data detection, consistent period and currency treatment, documented metric definitions, calculation lineage, corporate-action handling where applicable, and independent data-quality checks are required before displaying a price, valuation, return, allocation difference, benchmark, comparison, chart, metric, or analytical result.",
  },
  {
    title: "Financial privacy, access, and governance controls",
    icon: ShieldCheck,
    detail:
      "Least-privilege financial access, secure secret handling, sensitive-data minimization, access reviews, secure audit logging, account and transaction authorization, policy enforcement, incident response, retention limits, and independently evidenced safeguards are required before exposing account, transaction, asset, portfolio, balance, allocation, performance, or personal financial information.",
  },
  {
    title: "Evidence-based reporting and service operations",
    icon: FileCheck2,
    detail:
      "Verified service integrations, documented metric definitions and calculation basis, durable telemetry, reconciliation records, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function PortfolioComparison() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Portfolio-comparison
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Portfolio Comparison
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Portfolio holdings, balances, transactions, market prices,
            valuations, benchmark results, comparison results, performance
            analytics, live updates, automation, active user counts, transaction
            totals, success rates, and response times are not configured for
            this deployment. No account, asset, balance, transaction, portfolio,
            comparison, metric, or service result is represented as current,
            complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated portfolio, benchmark, valuation, or comparison
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access an account, retrieve a balance,
                retrieve market data, calculate a valuation or return, compare
                portfolios or benchmarks, stream an update, trigger automation,
                or report that a financial operation succeeded.
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
