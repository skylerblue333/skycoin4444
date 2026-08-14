import {
  AlertTriangle,
  BarChart3,
  Coins,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified market-data service",
    icon: BarChart3,
    detail:
      "Reliable licensed market-data sources, source provenance, timestamping, stale-data handling, validation, and clear disclosures are required before showing token prices, percentage changes, market values, yields, or TVL figures.",
  },
  {
    title: "Wallet and blockchain infrastructure",
    icon: Wallet,
    detail:
      "Supported-network configuration, address validation, transaction signing, status verification, private-key protections, duplicate-submission controls, audit records, and incident response are required before displaying a wallet, balance, or transaction history.",
  },
  {
    title: "Swaps, transfers, and DeFi operations",
    icon: Coins,
    detail:
      "Verified liquidity and routing, quote validation, slippage and fee disclosure, transaction simulation, customer confirmation, settlement monitoring, and failure recovery are required before enabling a swap, transfer, yield product, or other DeFi action.",
  },
  {
    title: "Custody, risk, and consumer safeguards",
    icon: ShieldCheck,
    detail:
      "Custody architecture, clear responsibility boundaries, security review, eligibility controls, risk disclosures, compliant third-party arrangements, and support processes are required before offering portfolio tracking, insurance, staking, or asset-protection claims.",
  },
];

export default function Crypto() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Crypto service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Crypto
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Token prices, portfolio values, wallet balances, transaction
            history, swaps, deposits, withdrawals, transfers, yield farming,
            insurance pools, rewards, and market performance are not configured
            for this deployment. No financial balance, crypto asset, price,
            transaction, yield, or protection status is represented as real,
            current, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated wallet, market, or DeFi activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a market quote, create a wallet,
                show a balance, record a transaction, calculate portfolio value,
                execute a swap, send or receive crypto, provide a yield product,
                or offer asset coverage.
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
