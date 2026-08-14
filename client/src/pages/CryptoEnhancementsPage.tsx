import {
  AlertTriangle,
  Database,
  Landmark,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified wallet and custody integration",
    icon: WalletCards,
    detail:
      "Supported networks, securely managed wallet connections, transaction signing, address and network validation, asset reconciliation, transaction status verification, failure handling, and clear custody disclosures are required before offering wallet or portfolio functions.",
  },
  {
    title: "Market data, trading, and swap infrastructure",
    icon: Database,
    detail:
      "An authorized price-data source, source attribution, liquidity and routing integration, quote validation, fee disclosure, order or transaction verification, risk controls, and incident monitoring are required before showing a market price, enabling a swap, or presenting trading information.",
  },
  {
    title: "Mining, staking, and yield safeguards",
    icon: ShieldCheck,
    detail:
      "Verified eligibility, audited smart contracts or mining infrastructure, transparent reward rules, operational monitoring, loss and failure handling, risk disclosure, and independently verifiable results are required before claiming a mining, staking, yield, or reward opportunity.",
  },
  {
    title: "Financial, legal, and governance controls",
    icon: Landmark,
    detail:
      "Applicable compliance review, documented governance authority, policy controls, customer disclosures, authorization boundaries, audit trails, complaint handling, and support procedures are required before operating a digital-asset financial service.",
  },
];

export default function CryptoEnhancementsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Crypto enhancements
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Crypto Enhancements
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Mining, wallet management, portfolio values, swaps, trading tools,
            market prices, AI trading agents, staking, yield farming, token
            rewards, hardware-wallet support, multi-signature custody,
            governance, and transaction history are not configured for this
            deployment. No asset, price, account, order, yield, mining output,
            balance, transaction, or financial result is represented as current,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated crypto operations or financial outcomes
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not connect a wallet, quote or execute a swap,
                provide a market price, allocate a reward, run a mining process,
                represent a stake, calculate yield, offer trading guidance, or
                confirm a blockchain transaction.
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
