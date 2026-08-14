import {
  AlertTriangle,
  ChartNoAxesCombined,
  Database,
  History,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized account and transaction-record access",
    icon: Database,
    detail:
      "Authenticated account ownership, tenant isolation, scoped authorization, durable order and fill records, transaction integrity, timestamp preservation, secure pagination, deletion and correction workflows, audit logging, and clear empty and error states are required before displaying any trading, order, fill, balance, settlement, or transaction history.",
  },
  {
    title: "Verified market and performance reconciliation",
    icon: ChartNoAxesCombined,
    detail:
      "Authorized market-data providers, documented symbols, source attribution, venue reconciliation, settlement confirmation, cost-basis rules, fee handling, freshness controls, calculation-version records, quality monitoring, and independently verifiable methods are required before reporting prices, profit and loss, performance, returns, volumes, balances, or trading analytics.",
  },
  {
    title: "Privacy, security, and financial-record protection",
    icon: ShieldCheck,
    detail:
      "Role-based access, sensitive-data minimization, encrypted storage where appropriate, secure logging, error handling, retention limits, incident response, customer-support escalation, jurisdictional controls where applicable, and independently evidenced protections are required before exposing financial activity or account history.",
  },
  {
    title: "Evidence-based operational reporting",
    icon: History,
    detail:
      "Source-attributed telemetry, documented metric definitions, observability, capacity monitoring, performance testing, incident management, and independent evidence are required before claiming live data, real-time updates, advanced analytics, automation, active users, transactions, success rates, response times, or production readiness.",
  },
];

export default function TradingHistory() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Trading-history service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trading History
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Trading history, orders, fills, balances, transactions, prices,
            performance, analytics, active user counts, live updates,
            automation, success rates, and response times are not configured for
            this deployment. No financial record, trade, order, fill, balance,
            price, transaction, metric, or service result is represented as
            current, complete, verified, or available.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated trade, order, fill, balance, transaction,
                performance result, metric, or live update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a trading record, access a balance,
                calculate performance, reconcile a fill, expose a transaction,
                stream an update, or report that a financial action succeeded.
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
