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
    title: "Authorized earnings, payment, and ledger integration",
    icon: Landmark,
    detail:
      "Authorized payment, marketplace, subscription, advertising, wallet, or other monetization-provider integration; authenticated account ownership; documented commercial terms; validated payment and transaction parameters; durable earnings, balance, fee, tax, and ledger records; reconciliation; idempotency; transaction-status verification; failure handling; and independently verifiable source data are required before displaying or processing earnings, revenue, fees, balances, payments, subscriptions, purchases, payouts, transfers, transactions, or financial results.",
  },
  {
    title: "Authenticated creator, account, and entitlement records",
    icon: Database,
    detail:
      "Authenticated account ownership, tenant isolation, validated creator and entitlement records, durable product and plan definitions, account-status checks, authorization boundaries, duplicate prevention, defined empty states, and clear error recovery are required before displaying, creating, changing, granting, revoking, or reporting a creator program, monetization setting, entitlement, plan, account, subscriber, customer, product, or activity result.",
  },
  {
    title: "Secure financial-operation safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, secure secret handling, validated payment and account parameters, duplicate-submission prevention, protected administrative actions, secure audit logging, sensitive-data minimization, fraud and abuse controls, incident response, retention limits, and independently evidenced controls are required before handling earnings, payments, balances, fees, transactions, payouts, tax data, account information, or other sensitive financial operations.",
  },
  {
    title: "Governed reporting and operational controls",
    icon: FileCheck2,
    detail:
      "Documented legal and policy review, required commercial and tax governance, verified service integrations, durable telemetry, source attribution, observability, performance testing, incident management, and independently verifiable methods are required before reporting live data, revenue, earnings, transactions, analytics, insights, automation, active users, success rates, response times, service availability, or production readiness.",
  },
];

export default function Monetization() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Monetization service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Monetization
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Creator monetization, earnings, revenue, balances, fees, payment
            methods, subscriptions, purchases, payouts, transfers, transactions,
            tax reporting, analytics, insights, automation, active user counts,
            success rates, and response times are not configured for this
            deployment. No earnings, balance, payment, transaction, payout,
            metric, or service result is represented as current, complete,
            verified, active, available, paid, processed, or settled.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated earnings, balance, payment, payout, or transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access a creator or financial account,
                retrieve an earnings or balance record, calculate a fee or tax
                result, create or modify a monetization setting, submit a
                payment or payout, transfer funds, record a transaction, trigger
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
