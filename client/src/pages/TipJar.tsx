import {
  AlertTriangle,
  BadgeDollarSign,
  Database,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized creator, sender, and payment records",
    icon: Database,
    detail:
      "Authenticated account ownership, verified recipients, tenant isolation, durable payment-intent and ledger records, transaction idempotency, timestamp preservation, reconciliation workflows, secure pagination, correction handling, audit logging, and clear empty and error states are required before displaying a creator, sender, recipient, tip, message, transaction, receipt, leaderboard, or payment record.",
  },
  {
    title: "Verified payment and settlement integration",
    icon: WalletCards,
    detail:
      "Authorized payment processors or blockchain infrastructure, verified payment destinations, validated currencies and networks, signature and status verification where applicable, fee handling, duplicate-submission prevention, settlement reconciliation, failed-payment handling, customer support escalation, and transaction-hash or processor evidence are required before accepting, confirming, or reporting a tip or payout.",
  },
  {
    title: "Financial security and compliance controls",
    icon: ShieldCheck,
    detail:
      "Role-based access, sensitive-data minimization, secure key and credential handling, encrypted storage where appropriate, anti-fraud controls, secure logging, retention limits, incident response, privacy controls, jurisdictional and compliance review where applicable, and independently evidenced protections are required before processing or exposing payments, balances, wallets, or payouts.",
  },
  {
    title: "Evidence-based financial and operational reporting",
    icon: BadgeDollarSign,
    detail:
      "Source-attributed ledger events, documented metric definitions, calculation-version records, reconciliation evidence, observability, capacity monitoring, incident management, and independently verifiable methods are required before reporting tip amounts, balances, totals, rankings, active users, transactions, success rates, response times, live updates, or production readiness.",
  },
];

export default function TipJar() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Tipping service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tip Jar
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Creator records, payment destinations, currency balances, tips,
            transactions, receipts, leaderboards, payouts, live updates,
            automation, success rates, and response times are not configured for
            this deployment. No payment, transfer, balance, recipient, creator,
            transaction, metric, or service result is represented as current,
            complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated tip, payment, transfer, balance, or payout
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not select a recipient, accept a payment,
                transfer value, access a wallet or balance, create a transaction
                or receipt, calculate a ranking, stream an update, or report
                that a financial action succeeded.
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
