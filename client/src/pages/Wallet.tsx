import {
  AlertTriangle,
  Database,
  KeyRound,
  Send,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Wallet connection and account authorization",
    icon: KeyRound,
    detail:
      "Supported-wallet verification, network validation, authenticated address ownership, signature checks, permission scoping, disconnect handling, and explicit privacy disclosures are required before connecting or identifying an external wallet.",
  },
  {
    title: "Transaction creation and settlement verification",
    icon: Send,
    detail:
      "Recipient-address validation, network and fee estimation, transaction signing, duplicate-submission prevention, on-chain status checks, failure recovery, and transaction-hash tracking are required before sending or receiving an asset.",
  },
  {
    title: "Balances, history, and portfolio records",
    icon: Database,
    detail:
      "Verified on-chain or custodial data sources, durable ledger records, reconciliation, price provenance, timestamping, authorization checks, and error handling are required before showing balances, transaction history, rewards, or portfolio values.",
  },
  {
    title: "Custody, DeFi, and security safeguards",
    icon: ShieldCheck,
    detail:
      "Secure custody boundaries, key-management controls, audited protocol integrations, risk disclosure, approvals, monitoring, incident response, and customer support are required before offering staking, mining, yield, DeFi, or asset-security claims.",
  },
];

export default function WalletPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Wallet service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Wallet
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Wallet connections, account addresses, token balances, USD values,
            transaction history, transfers, deposits, withdrawals, staking,
            mining, rewards, DeFi actions, and custody controls are not
            configured for this deployment. No wallet, asset, transaction,
            price, reward, or on-chain status is represented as created,
            connected, current, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated wallet or blockchain activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not connect MetaMask or another wallet, create a
                platform address, show a balance, reconstruct a history,
                calculate a portfolio value, sign a transaction, or let a user
                send, earn, stake, mine, or deploy an asset.
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
