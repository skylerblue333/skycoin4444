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
    title: "Authorized payout, payment, and account integration",
    icon: Landmark,
    detail:
      "Authorized payment and financial-provider integration, authenticated account ownership, validated payout destinations, durable earnings and transaction records, currency and network validation, idempotency, duplicate prevention, reconciliation, transaction-status verification, correction workflows, defined empty states, and clear error handling are required before displaying, calculating, requesting, processing, or reporting a balance, earning, payout, payment method, fee, transfer, transaction, or account result.",
  },
  {
    title: "Legal, tax, and payout-governance controls",
    icon: FileCheck2,
    detail:
      "Documented legal and regulatory review, approved payout policies, jurisdictional and eligibility controls, required reporting workflows, recordkeeping procedures, tax-document governance where applicable, escalation paths, independent review, and evidence-based operating policies are required before enabling or representing a payout, payment, earnings, tax-reporting, financial account, or transfer service as available, compliant, approved, or operational.",
  },
  {
    title: "Secure payment and financial-data safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege access, secure secret handling, protected financial actions, validated account and transaction parameters, destination verification, sensitive-data minimization, secure audit logging, fraud and abuse controls, incident response, retention limits, and independently evidenced safeguards are required before handling account, payment, payout, earnings, transaction, financial, or personal information.",
  },
  {
    title: "Evidence-based reporting and operations",
    icon: Workflow,
    detail:
      "Verified service integrations, documented ledger and metric definitions, durable telemetry, source attribution, reconciliation records, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting earnings, fees, payout history, transaction status, payout timing, balances, processing results, analytics, automation, service availability, or production readiness.",
  },
];

export default function PayoutDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Payout service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Payout Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Earnings, balances, payout methods, payout requests, transaction
            history, transfer status, fees, financial-account information,
            payment processing, and tax-reporting information are not configured
            for this deployment. No balance, earning, payout, payment,
            transaction, tax, financial, metric, or service result is
            represented as current, complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated balance, earning, payout, payment, or transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access a financial account, retrieve a
                balance or earning, calculate a fee, create or request a payout,
                submit a payment or transfer, retrieve a transaction, determine
                tax reporting, or report that a financial operation succeeded.
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
