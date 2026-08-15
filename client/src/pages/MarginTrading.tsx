import {
  AlertTriangle,
  Database,
  FileCheck2,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Licensed market, instrument, and account-data service",
    icon: Database,
    detail:
      "Authorized and traceable market-data, instrument, margin-account, position, collateral, balance, funding, and transaction providers, documented coverage and licensing terms, timestamped source records, data-quality controls, corporate-action handling, and defined refresh and retention policies are required before displaying or using a price, quote, order-book value, balance, position, collateral amount, leverage ratio, funding rate, margin requirement, account state, or market-data result.",
  },
  {
    title: "Risk, leverage, liquidation, and execution controls",
    icon: Scale,
    detail:
      "A validated risk engine with documented leverage limits, collateral eligibility, maintenance and initial-margin formulas, liquidation and close-out rules, fee and funding treatment, price-source protections, stress testing, circuit breakers, idempotent order handling, reconciliation, and independently verifiable test evidence are required before calculating, submitting, accepting, modifying, cancelling, liquidating, settling, or reporting a margin position, order, trade, collateral movement, or account result.",
  },
  {
    title: "Custody, authorization, and financial-safety controls",
    icon: ShieldCheck,
    detail:
      "Authenticated account ownership, explicit authorization, secure custody or broker/exchange integration, server-side secret handling, transaction signing and status verification, anti-replay and duplicate-submission controls, rate limits, audit logging, privacy safeguards, incident response, and evidence that controls operate as designed are required before representing a margin action, financial transaction, account update, settlement, liquidation, or user-specific result as safe, protected, available, or successful.",
  },
  {
    title: "Evidence-based reporting and operational support",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, transaction and position reconciliation, monitoring, alerting, capacity and latency testing, failure and retry handling, support procedures, financial-record retention, and independently verifiable operational evidence are required before reporting active users, transactions, success rates, response times, margin utilization, liquidation events, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function MarginTrading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Margin trading service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Margin Trading
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Margin accounts, leverage, collateral, positions, orders, trades,
            liquidation, funding, live market data, analytics, automation,
            financial transactions, operational metrics, and support
            documentation are not configured for this deployment. No price,
            quote, balance, position, collateral amount, leverage ratio, margin
            requirement, order, trade, liquidation, transaction, metric,
            financial outcome, or service status is represented as current,
            complete, verified, active, safe, available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated margin position or financial transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve, calculate, recommend, submit,
                modify, cancel, execute, liquidate, settle, synchronize, or
                report a margin order, position, trade, collateral movement,
                balance, leverage, liquidation result, financial transaction,
                market result, analytic, or operational metric. It does not
                offer investment advice and does not claim that any
                margin-related operation succeeded.
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
