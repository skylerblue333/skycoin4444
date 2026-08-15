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
    title: "Authorized options data and account integration",
    icon: Landmark,
    detail:
      "Authorized provider and market-data integration, authenticated account ownership, validated contract and instrument definitions, documented venue and jurisdiction coverage, timestamped source attribution, options-chain validation, stale-data detection, durable account and transaction records, reconciliation, defined empty states, and clear error recovery are required before displaying or processing an options contract, market value, quote, account, balance, position, order, premium, expiration, or transaction result.",
  },
  {
    title: "Legal, compliance, and derivatives-governance controls",
    icon: FileCheck2,
    detail:
      "Documented legal and regulatory review, eligibility and jurisdictional controls, approved customer and product policies, risk-governance procedures, required recordkeeping, escalation workflows, independent review, and evidence-based operating policies are required before enabling or representing an options, derivative, trading, account, or related financial service as available, authorized, compliant, or operational.",
  },
  {
    title: "Secure order execution and account safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, secure secret handling, validated order and transaction parameters, pre-execution safeguards, idempotency, duplicate prevention, transaction-status verification, cancellation and failure handling, secure audit logging, incident response, and independently evidenced controls are required before submitting, executing, cancelling, exercising, assigning, or reporting an order, position, transfer, transaction, or other financial operation.",
  },
  {
    title: "Evidence-based analytics and performance reporting",
    icon: Workflow,
    detail:
      "Verified service integrations, documented metric definitions and calculation basis, durable telemetry, source attribution, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting real-time data, AI insights, autonomous automation, account activity, trading analytics, processing speed, uptime, latency, throughput, service availability, or production readiness.",
  },
];

export default function OptionsTrading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Options-trading service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Options Trading
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Options contracts, market data, accounts, balances, positions,
            orders, premiums, expirations, transactions, trading analytics, AI
            insights, automation, processing speed, uptime, latency, throughput,
            and service availability are not configured for this deployment. No
            market, contract, account, order, transaction, metric, or service
            result is represented as current, complete, verified, active, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated market, contract, account, order, or trade
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve an options chain, quote, account,
                balance, or position; create, cancel, or execute an order;
                exercise or assign a contract; trigger automation; calculate a
                trading result; or report that a financial operation succeeded.
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
