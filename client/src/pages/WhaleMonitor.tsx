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
    title: "Authoritative blockchain and market data sources",
    icon: Database,
    detail:
      "Validated network configuration, source-attributed node or indexer data, contract and asset verification, transaction confirmation handling, reorganization processing, timestamp accuracy, freshness indicators, consistent data mapping, quality monitoring, and error recovery are required before displaying a transfer, trade, stake, asset, amount, value, wallet activity, or market event.",
  },
  {
    title: "Responsible wallet attribution and privacy controls",
    icon: WalletCards,
    detail:
      "Documented attribution methodology, confidence thresholds, appropriate privacy review, public-data boundaries, correction procedures, abuse prevention, doxxing safeguards, audit logs, and clear disclosure are required before labeling, profiling, ranking, or associating a wallet, account, holder, investor, customer, or person with a transaction or behavior.",
  },
  {
    title: "Verified market analytics and alert methodology",
    icon: Activity,
    detail:
      "Documented calculation methods, reliable pricing sources, currency conversion rules, deduplication, volume definitions, alert thresholds, latency and coverage monitoring, source consistency checks, and clear uncertainty handling are required before reporting live status, transaction counts, 24-hour volume, largest transaction, market impact, buy or sell classification, or price-sensitive analytics.",
  },
  {
    title: "Secure financial data operations",
    icon: ShieldCheck,
    detail:
      "Access controls, rate limits, secrets management, input validation, logging that avoids sensitive information, incident response, monitoring, legal and compliance review, and user-facing risk disclosures are required before operating a financial-data alerting service or presenting information that may influence financial decisions.",
  },
];

export default function WhaleMonitor() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Large-transaction
            monitoring service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Whale Monitor
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Large-transaction alerts, real-time wallet activity, buy, sell,
            transfer, and staking classifications, asset amounts, fiat values,
            wallet identifiers, market impact, transaction volume, live status,
            wallet counts, and market metrics are not configured for this
            deployment. No blockchain transaction, wallet, holder, price,
            volume, asset, market signal, or financial result is represented as
            current, verified, or actionable.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated wallet activity, large transaction, price, market
                impact, or live alert
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not query a blockchain, identify a wallet,
                calculate an asset value, classify a trade, measure market
                impact, show a live transaction, issue an alert, or report that
                financial monitoring succeeded.
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
