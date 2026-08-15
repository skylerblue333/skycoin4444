import {
  AlertTriangle,
  Banknote,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified lending, borrowing, collateral, and account services",
    icon: Database,
    detail:
      "Authorized and traceable protocol, blockchain, market-data, asset, wallet, account, and transaction providers with network and contract verification, source provenance, timestamped records, collateral and position reconciliation, debt and repayment semantics, oracle coverage, liquidation rules, and retention policies are required before retrieving or reporting a loan, borrow position, collateral, balance, rate, utilization, health factor, liquidation state, fee, or transaction.",
  },
  {
    title: "Validated credit, pricing, risk, and settlement controls",
    icon: Banknote,
    detail:
      "A documented and tested lending architecture with eligibility rules, interest and fee treatment, collateral valuation, loan-to-value and health-factor calculations, oracle failure handling, liquidation and auction behavior, repayment accounting, transaction simulation, gas and nonce handling, signature verification, confirmation tracking, and independently verifiable test evidence are required before calculating, quoting, opening, modifying, repaying, liquidating, settling, or reporting any credit, position, rate, balance, fee, or transaction result.",
  },
  {
    title: "Custody, authorization, and financial-safety safeguards",
    icon: ShieldCheck,
    detail:
      "Authenticated account ownership, explicit authorization, secure custody or wallet integration, server-side secret handling, transaction-signing controls, anti-replay and duplicate-submission protections, network and contract allowlists, rate limits, abuse prevention, privacy safeguards, audit logging, incident response, and evidence that controls operate as designed are required before representing a lending action, financial transaction, account update, repayment, liquidation, or user-specific result as safe, protected, available, or successful.",
  },
  {
    title: "Evidence-based credit and operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, on-chain or provider-backed reconciliation, monitoring, alerting, risk and failure testing, documented synchronization semantics, support procedures, and independently verifiable operational evidence are required before reporting active users, loans, borrows, transactions, utilization, collateral, rates, liquidations, success rates, response times, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function LendingBorrow() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Lending and borrowing
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Lending &amp; Borrowing
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified lending, borrowing, credit, collateral, rates, balances,
            repayments, liquidations, wallet, transaction, analytics,
            automation, operational, and support services are not configured for
            this deployment. No loan, borrow position, collateral, balance,
            rate, fee, liquidation, transaction, user, metric, financial
            outcome, or service status is represented as current, complete,
            verified, active, safe, available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated credit, collateral, or financial transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not connect to a protocol, retrieve or calculate
                rates, open or repay a loan, borrow, deposit collateral,
                liquidate, sign, submit, confirm, synchronize, automate, or
                report a credit, position, balance, fee, transaction, analytic,
                risk, or operational metric. It does not offer lending or
                investment advice and does not claim that any lending-related
                operation succeeded.
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
