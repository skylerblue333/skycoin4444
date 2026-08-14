import {
  AlertTriangle,
  BarChart3,
  FileText,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized financial event and reporting records",
    icon: FileText,
    detail:
      "Authenticated ownership, tenant isolation, scoped authorization, durable revenue and transaction records, defined accounting periods, source attribution, data lineage, reconciliation workflows, accounting review, audit logging, retention controls, and clear empty and error states are required before displaying any revenue, transaction, balance, invoice, payout, customer, product, period, statement, or financial-reporting result.",
  },
  {
    title: "Verified billing, payment, and payout integration",
    icon: Landmark,
    detail:
      "Authorized payment and billing providers, validated financial event ingestion, idempotent webhook processing, currency and network validation, settlement and reconciliation workflows, duplicate prevention, failure handling, dispute and refund handling where applicable, payout verification, and evidence-based status monitoring are required before creating, receiving, reconciling, paying, releasing, or reporting a financial transaction, balance, revenue event, invoice, payment, or payout.",
  },
  {
    title: "Financial controls, privacy, and governance",
    icon: ShieldCheck,
    detail:
      "Least-privilege financial access, segregation of duties, change approval, secure handling of payment and personal data, sensitive-data minimization, secure logging, retention limits, incident response, access reviews, policy and accounting review, and independently evidenced safeguards are required before exposing financial, account, payment, revenue, balance, payout, customer, or administrative information.",
  },
  {
    title: "Evidence-based revenue and operational reporting",
    icon: BarChart3,
    detail:
      "Source-attributed financial events, documented metric definitions and accounting basis, period alignment, durable reconciliation records, observability, performance testing, incident management, and independently verifiable methods are required before reporting revenue, growth, margin, balances, payouts, active users, transaction totals, success rates, response times, live updates, automation, advanced analytics, or production readiness.",
  },
];

export default function RevenueTracking() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Revenue-tracking service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Revenue Tracking
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Revenue records, balances, transactions, invoices, payments,
            payouts, accounting periods, performance analytics, active user
            counts, live updates, automation, success rates, and response times
            are not configured for this deployment. No financial record,
            balance, payment, payout, revenue result, metric, or service result
            is represented as current, complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated revenue, balance, transaction, payment, or payout
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a financial record or balance,
                calculate revenue, create a payment or payout, reconcile a
                transaction, calculate a metric, stream an update, or report
                that a financial operation succeeded.
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
