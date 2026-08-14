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
    title: "Authorized asset, market-data, and account access",
    icon: Database,
    detail:
      "Authorized providers, documented assets and symbols, source attribution, authenticated account ownership, tenant isolation, scoped authorization, freshness controls, response validation, durable records, safe pagination, audit logging, and clear empty and error states are required before displaying any synthetic asset, price, quote, account, position, balance, transaction, market, or provider result.",
  },
  {
    title: "Verified pricing, valuation, and risk reconciliation",
    icon: ChartNoAxesCombined,
    detail:
      "Documented valuation and pricing methods, calculation-version records, provider reconciliation, collateral and fee handling where applicable, risk controls, quality monitoring, correction workflows, and independently verifiable methods are required before reporting a price, value, return, yield, liquidity, exposure, volatility, market metric, or performance result.",
  },
  {
    title: "Secure financial and operational controls",
    icon: ShieldCheck,
    detail:
      "Role-based access, sensitive-data minimization, secure credential and key handling, transaction validation and status verification where applicable, duplicate-submission prevention, secure logging, incident response, jurisdictional controls where applicable, and independently evidenced protections are required before creating, confirming, or exposing an asset operation, transaction, automation, or account result.",
  },
  {
    title: "Evidence-based service reporting",
    icon: Workflow,
    detail:
      "Source-attributed telemetry, documented service-level definitions, observability, capacity monitoring, performance testing, incident management, and independent evidence are required before claiming live data, real-time updates, AI insights, automation, uptime, latency, throughput, transactions, success rates, active users, advanced analytics, or production readiness.",
  },
];

export default function Synthetics() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Synthetic-assets service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Synthetic Assets
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Synthetic assets, market data, prices, valuations, transactions,
            account records, analytics, automation, uptime, latency, throughput,
            live updates, AI insights, success rates, and response times are not
            configured for this deployment. No asset, price, transaction, market
            result, performance metric, or service result is represented as
            current, complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated asset, price, transaction, or performance
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve market or account data, calculate a
                valuation, create a transaction, automate an operation, access a
                balance, stream an update, or report that a financial or service
                action succeeded.
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
