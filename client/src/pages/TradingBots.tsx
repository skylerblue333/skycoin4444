import {
  AlertTriangle,
  Bot,
  ChartNoAxesCombined,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Governed automated-strategy controls",
    icon: Bot,
    detail:
      "Explicit user authorization, validated strategy parameters, sandboxing, risk and exposure limits, monitoring, kill switches, incident response, historical-record integrity, and suitability and compliance review are required before enabling, recommending, configuring, or representing a trading bot, strategy, automated order, arbitrage process, or financial outcome.",
  },
  {
    title: "Verified market-data and execution integrations",
    icon: ChartNoAxesCombined,
    detail:
      "Authorized market-data providers, documented symbols, source attribution, timestamps, freshness controls, venue connectivity, order-state reconciliation, outage handling, rate limits, and independently verified contracts are required before displaying a price, market signal, trend, liquidity condition, analytics result, or execution status.",
  },
  {
    title: "Secure wallet, order, and transaction lifecycle",
    icon: WalletCards,
    detail:
      "Authenticated account and custody boundaries, wallet authorization, network and venue validation, signed order flows, idempotency, confirmations, settlement and failure handling, transaction records, audit logs, cancellation and recovery controls, and clear risk disclosures are required before connecting a wallet, submitting an order, accessing balances, or reporting a transaction result.",
  },
  {
    title: "Security, compliance, and customer-protection controls",
    icon: ShieldCheck,
    detail:
      "Role-based access, security monitoring, sanctions and jurisdictional controls where applicable, privacy safeguards, secure error handling, auditability, support escalation, clear disclosures, and independently evidenced controls are required before offering or presenting financial automation, execution, custody, risk management, or account-protection capabilities.",
  },
];

export default function TradingBots() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Trading-automation service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trading Bots
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Automated strategies, bot configuration, market data, wallet
            connections, balances, orders, transaction states, financial
            outcomes, user counts, analytics, live updates, success rates, and
            response times are not configured for this deployment. No bot,
            strategy, market result, wallet, order, transaction, financial
            outcome, metric, or service result is represented as current,
            executable, verified, or successful.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated bot, strategy, market signal, wallet, order,
                transaction, metric, or live update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not configure a bot, retrieve a market signal,
                connect a wallet, access a balance, submit an order, execute a
                trade, calculate financial performance, or report that a
                financial action succeeded.
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
