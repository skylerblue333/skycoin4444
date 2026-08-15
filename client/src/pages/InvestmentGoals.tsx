import {
  AlertTriangle,
  Calculator,
  Database,
  FileCheck2,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted goals, accounts, and portfolio records",
    icon: Database,
    detail:
      "Authenticated and tenant-isolated services for users, goals, accounts, wallets, portfolios, holdings, deposits, withdrawals, transactions, prices, timestamps, privacy, deletion, and reconciliation are required before retrieving or reporting a goal, balance, contribution, holding, position, transaction, account, or portfolio state.",
  },
  {
    title: "Validated projections and financial calculations",
    icon: Calculator,
    detail:
      "Documented calculation semantics, source-backed prices and rates, fee and tax treatment, cash-flow timing, inflation and currency assumptions, scenario definitions, rounding rules, uncertainty handling, and independently tested calculations are required before estimating, projecting, comparing, or reporting returns, targets, timelines, risk, performance, progress, or any financial outcome.",
  },
  {
    title: "Authorization and financial-safety safeguards",
    icon: ShieldCheck,
    detail:
      "Authenticated account ownership, explicit authorization, secure custody or wallet integration, server-side secret handling, transaction-signing controls, anti-replay and duplicate-submission protections, provider and network allowlists, rate limits, privacy safeguards, audit logging, incident response, and evidence that controls operate as designed are required before representing a financial action, account update, transaction, recommendation, automation, or user-specific result as safe, protected, available, or successful.",
  },
  {
    title: "Evidence-based financial and operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable source data, metric definitions, provider-backed reconciliation, monitoring, alerting, performance and failure testing, documented synchronization semantics, support procedures, and independently verifiable operational evidence are required before reporting active users, transactions, success rates, response times, analytics, automated outcomes, documentation availability, or production readiness.",
  },
];

export default function InvestmentGoals() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Investment goals service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Investment Goals
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified goals, accounts, portfolios, holdings, balances, prices,
            returns, projections, risk, transactions, analytics, automation,
            operational, and support services are not configured for this
            deployment. No goal, target, balance, contribution, holding,
            position, return, projection, risk value, transaction, user, metric,
            financial outcome, recommendation, or service status is represented
            as current, complete, verified, active, safe, available, or
            successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated financial targets, projections, or transactions
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or create goals, connect to accounts
                or wallets, calculate or project returns, quote prices or rates,
                track contributions, sign or submit transactions, provide
                recommendations, automate financial actions, or report
                financial, analytics, or operational outcomes. It does not offer
                investment advice and does not claim that any financial
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

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <Target className="h-4 w-4" /> Goal tracking and financial
          calculations will remain disabled until the required services are
          configured and verified.
        </div>
      </div>
    </main>
  );
}
