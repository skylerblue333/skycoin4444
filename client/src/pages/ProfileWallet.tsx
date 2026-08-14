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
    title: "Authorized wallet and custody infrastructure",
    icon: WalletCards,
    detail:
      "Configured wallet ownership verification, secure key or custody controls, network validation, address derivation safeguards, transaction signing rules, confirmation tracking, balance reconciliation, duplicate-submission protection, incident response, and clear custody disclosures are required before showing a wallet, address, balance, transfer, token, or transaction state.",
  },
  {
    title: "Verified token, payment, and reward operations",
    icon: Landmark,
    detail:
      "Authorized settlement providers, verified price and exchange-rate data, settlement confirmation, anti-fraud controls, financial and tax review, refund and dispute handling, source-of-truth ledgers, eligibility checks, and audit trails are required before representing a tip, purchase, subscription, swap, staking yield, reward, earned amount, spent amount, or monetary value.",
  },
  {
    title: "Authenticated activity and social-statistics records",
    icon: Database,
    detail:
      "Persisted and authorized profile records, durable activity events, documented metric definitions, privacy controls, access restrictions, source attribution, retention policies, moderation, data-quality checks, and correction workflows are required before displaying follower counts, post counts, messages, AI actions, profile achievements, activity history, or social metrics.",
  },
  {
    title: "Security, privacy, and monetization governance",
    icon: ShieldCheck,
    detail:
      "Consent, account-security protections, permissions, role enforcement, privacy review, age and jurisdictional controls where applicable, consumer disclosures, content and transaction policy enforcement, abuse prevention, monitoring, and appeals are required before enabling monetization, referrals, subscriptions, creator payments, or personalized financial actions.",
  },
];

export default function ProfileWallet() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Profile wallet service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Profile &amp; Wallet
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Wallets, balances, token values, fiat conversions, transfers,
            receiving, swaps, tips, purchases, subscriptions, staking, yields,
            rewards, referrals, financial activity, social statistics, AI-action
            counts, profile achievements, and monetization options are not
            configured for this deployment. No asset, wallet, financial event,
            reward, social metric, profile statistic, or transaction is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated wallet, financial activity, or monetization
                outcomes
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not derive an address, retrieve a balance, quote
                a conversion, initiate or confirm a transfer, swap or stake an
                asset, calculate earnings, record a tip, process a subscription,
                grant a reward, or report a social or account activity metric.
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
