import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified protocol and on-chain integration",
    icon: WalletCards,
    detail:
      "An identified and reviewed protocol, correct network configuration, contract-address validation, independently reviewed smart contracts, transaction simulation, signature verification, confirmation and reorganization handling, duplicate-submission prevention, withdrawal safety, and incident response are required before offering deposits, withdrawals, pools, staking, farming, liquidity, or token movement.",
  },
  {
    title: "Accurate balances, rewards, and accounting",
    icon: Database,
    detail:
      "Authoritative chain or custody data, account ownership checks, source-attributed balance calculation, reward rules, accrual reconciliation, accounting controls, supply integrity, transaction records, error recovery, and independent auditability are required before presenting a balance, yield, reward, position, transaction, total value, or financial outcome.",
  },
  {
    title: "Risk, disclosure, and user-protection controls",
    icon: ShieldCheck,
    detail:
      "Clear risk disclosures, eligibility and jurisdiction controls, appropriate legal and compliance review, custody boundaries, anti-fraud measures, user confirmations, rate limits, support procedures, and human escalation are required before encouraging, recommending, or enabling a user to supply assets, earn yield, stake tokens, or undertake a financial transaction.",
  },
  {
    title: "Evidence-based operations and monitoring",
    icon: Activity,
    detail:
      "Source-attributed telemetry, documented methodology, freshness policy, quality monitoring, secure error handling, observability, availability tracking, and independently evidenced performance measurement are required before claiming live data, automation, active users, transactions, success rates, latency, analytics, or production status.",
  },
];

export default function YieldFarming() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Yield service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Yield Farming
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Yield pools, liquidity, deposits, withdrawals, staking, token
            balances, accrued rewards, interest rates, APY, total value,
            transactions, analytics, automation, live updates, user counts,
            performance figures, and financial outcomes are not configured for
            this deployment. No asset, wallet, position, transaction, balance,
            reward, rate, or result is represented as current, verified,
            available, or actionable.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated pool, yield, balance, transaction, reward, or
                withdrawal
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not connect a wallet, access a protocol, display
                an asset balance, quote a yield, create a transaction, deposit
                or withdraw funds, calculate rewards, execute automation, or
                report that a financial action succeeded.
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
