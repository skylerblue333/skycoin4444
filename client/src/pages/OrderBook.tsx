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
    title: "Authorized market-data and order-book integration",
    icon: Landmark,
    detail:
      "Authorized venue and market-data integration, documented instrument coverage, validated symbol and contract definitions, timestamped source attribution, bid and offer normalization, stale-data detection, sequence integrity, outage handling, reconciliation, defined empty states, and independently verifiable provider status are required before displaying, calculating, or reporting an order book, quote, depth level, spread, liquidity, market price, volume, trade, or market-data result.",
  },
  {
    title: "Authenticated account, order, and execution controls",
    icon: ShieldCheck,
    detail:
      "Authenticated account ownership, least-privilege authorization, validated order parameters, supported-market and network checks, pre-execution safeguards, idempotency, duplicate prevention, transaction-status verification, cancellation and failure handling, secure audit logging, secure secret handling, and independently evidenced controls are required before creating, modifying, cancelling, executing, or reporting an order, trade, position, balance, transfer, or other financial operation.",
  },
  {
    title: "Governed market-service operations",
    icon: FileCheck2,
    detail:
      "Documented legal and policy review, authorized provider relationships, applicable eligibility and jurisdictional controls, risk-governance procedures, incident response, recordkeeping, escalation paths, independent review, and evidence-based operating policies are required before enabling or representing a market, trading, order-book, liquidity, execution, account, or related financial service as available, authorized, compliant, or operational.",
  },
  {
    title: "Evidence-based analytics and operational reporting",
    icon: Workflow,
    detail:
      "Verified service integrations, documented metric definitions and calculation basis, durable telemetry, source attribution, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, insights, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function OrderBook() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Order-book service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Order Book
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Market-data feeds, order books, quotes, liquidity, prices, trade
            activity, accounts, balances, orders, transactions, analytics,
            insights, automation, active user counts, transaction totals,
            success rates, and response times are not configured for this
            deployment. No market, order, quote, account, transaction, metric,
            or service result is represented as current, complete, verified,
            active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated market, order book, account, order, or trade
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a quote or order book, calculate
                liquidity or a market metric, access an account or balance,
                create, cancel, or execute an order, record a transaction,
                trigger automation, or report that a financial operation
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
