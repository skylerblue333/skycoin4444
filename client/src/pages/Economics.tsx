import {
  AlertTriangle,
  Database,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified token and blockchain records",
    icon: Database,
    detail:
      "A configured and validated network, verified contract addresses, source-attributed on-chain records, transaction indexing, reorganization handling, supply methodology, holder and balance reconciliation, price provenance, freshness controls, and independent auditability are required before presenting a token, supply, burn, stake, holder, price, liquidity, transaction, or market metric.",
  },
  {
    title: "Governed treasury and allocation operations",
    icon: Landmark,
    detail:
      "Documented allocation policy, approved governance controls, authorized signatories, custody safeguards, durable accounting, reconciliation, disclosures, audit trails, conflict-of-interest controls, and reporting procedures are required before representing a treasury, reserve, development fund, community reward pool, marketing allocation, team allocation, liquidity allocation, or other financial designation.",
  },
  {
    title: "Authorized financial utility and transaction flows",
    icon: ShieldCheck,
    detail:
      "Secure custody or wallet infrastructure, validated addresses and network parameters, signature verification, transaction simulation, duplicate-submission prevention, status monitoring, failure handling, consumer protections, and clear risk disclosures are required before enabling or claiming governance voting, staking rewards, payments, donations, premium access, gaming rewards, token transfers, or any financial outcome.",
  },
  {
    title: "Compliance and market-disclosure controls",
    icon: Scale,
    detail:
      "Appropriate legal and regulatory review, jurisdictional controls, issuer authorization, market-data licensing, investor and consumer disclosures, policy enforcement, tax considerations, privacy safeguards, and incident response are required before describing a token economy, investment characteristic, market condition, expected utility, reward, financial return, or availability of financial services.",
  },
];

export default function Economics() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Token economics service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Token Economics
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Tokenomics, token distribution, total supply, burned supply, staked
            supply, holder totals, treasury and allocation categories, liquidity
            pools, live price history, financial market data, governance voting,
            staking rewards, marketplace payments, donations, gaming rewards,
            and premium utility claims are not configured for this deployment.
            No token, contract, account, balance, supply, allocation, price,
            reward, transaction, financial service, or market outcome is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated supply, allocation, price, reward, or financial
                utility
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not read blockchain data, inspect an address,
                calculate supply, determine a balance, quote a price, derive a
                holder count, allocate a treasury, execute a transfer, create a
                vote, open a stake, issue a reward, accept a payment, or report
                that any financial action has succeeded.
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
