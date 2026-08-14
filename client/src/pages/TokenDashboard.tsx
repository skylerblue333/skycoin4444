import {
  AlertTriangle,
  Database,
  Flame,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified token and chain integration",
    icon: WalletCards,
    detail:
      "A configured network, independently verifiable contract or chain records, network validation, trusted indexing, address validation, confirmed transaction states, reconciliation, provider monitoring, and clear chain disclosures are required before displaying a token, wallet, holder count, supply, transfer, or on-chain activity.",
  },
  {
    title: "Authoritative supply, allocation, and burn accounting",
    icon: Database,
    detail:
      "Documented issuance rules, source-of-truth accounting, immutable transaction references, reconciliation controls, allocation governance, vesting and unlock verification, treasury controls, error correction, and an auditable methodology are required before representing total supply, circulating supply, allocations, burns, or reserves.",
  },
  {
    title: "Staking and governance safeguards",
    icon: ShieldCheck,
    detail:
      "Authorized staking contracts, reward rules, validator or custody architecture, eligibility checks, vote verification, quorum rules, transaction confirmation, access controls, risk disclosures, incident handling, and independent review are required before offering staking, rewards, governance, or participation metrics.",
  },
  {
    title: "Transparent market and risk disclosures",
    icon: Flame,
    detail:
      "Reliable market-data providers, timestamped methodology, data-quality checks, legal and financial review, risk warnings, operational monitoring, and a correction process are required before presenting token performance, value, yield, market health, or economic conclusions.",
  },
];

export default function TokenDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Token service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Token Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Token identity, supply, circulation, allocation, public-sale
            details, staking metrics, rewards, holder counts, wallet counts,
            governance votes, liquidity, treasury reserves, burns, burn history,
            market performance, and tokenomics claims are not configured for
            this deployment. No financial, blockchain, wallet, governance, or
            market value is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated token supply, allocation, staking, burn, or market
                data
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not issue a token, calculate a balance or supply,
                represent an allocation or reserve, stake an asset, record a
                governance vote, confirm a burn, display a holder count, or
                present market or economic information as verified.
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
