import {
  AlertTriangle,
  Database,
  Droplets,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified pool, asset, market, and account-data services",
    icon: Database,
    detail:
      "Authorized and traceable blockchain, market-data, asset, pool, wallet, account, and transaction providers with network validation, documented coverage and licensing, source provenance, timestamped records, token and contract verification, data-quality controls, indexing guarantees, reconciliation, and retention policies are required before retrieving or reporting a pool, asset, reserve, price, liquidity amount, share, balance, wallet, position, fee, transaction, or market-data result.",
  },
  {
    title: "Validated liquidity, pricing, and transaction-risk controls",
    icon: Droplets,
    detail:
      "A documented and tested pool and pricing architecture with invariant and accounting rules, slippage and fee treatment, price-impact calculations, impermanent-loss disclosures, liquidity-share accounting, transaction simulation, gas and nonce handling, signature verification, confirmation tracking, failure and retry handling, and independently verifiable test evidence are required before calculating, quoting, adding, removing, swapping, settling, or reporting any liquidity, pool, share, price, fee, position, or transaction result.",
  },
  {
    title: "Custody, authorization, and financial-safety safeguards",
    icon: ShieldCheck,
    detail:
      "Authenticated account ownership, explicit authorization, secure custody or wallet integration, server-side secret handling, transaction-signing controls, anti-replay and duplicate-submission protections, network and contract allowlists, rate limits, audit logging, privacy safeguards, incident response, and evidence that controls operate as designed are required before representing a liquidity action, financial transaction, account update, settlement, or user-specific result as safe, protected, available, or successful.",
  },
  {
    title: "Evidence-based pool reporting and operational support",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, on-chain or provider-backed reconciliation, monitoring, alerting, capacity and latency testing, documented synchronization semantics, support procedures, and independently verifiable operational evidence are required before reporting active users, transactions, success rates, response times, total value locked, pool volume, fee income, provider activity, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function LiquidityPools() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Liquidity pools service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Liquidity Pools
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified pool and asset data, reserves, prices, balances, liquidity
            shares, positions, fees, swaps, transactions, provider activity,
            analytics, automation, operational metrics, and support
            documentation are not configured for this deployment. No pool,
            asset, reserve, price, balance, position, fee, transaction, user,
            metric, financial outcome, or service status is represented as
            current, complete, verified, active, safe, available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated liquidity, pool, or financial transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve, calculate, quote, add, remove,
                swap, settle, sign, submit, confirm, synchronize, or report a
                pool, asset, reserve, price, balance, liquidity share, position,
                fee, transaction, provider result, analytic, or operational
                metric. It does not offer investment advice and does not claim
                that any liquidity-related operation succeeded.
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
