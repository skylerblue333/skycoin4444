import {
  AlertTriangle,
  Database,
  Link2,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Referral attribution and program rules",
    icon: Link2,
    detail:
      "Published affiliate terms, authorized referral tracking, consent-aware attribution, source validation, fraud prevention, eligibility rules, reversal handling, and support workflows are required before creating a referral link or crediting a referral.",
  },
  {
    title: "Commission and earnings ledger",
    icon: Database,
    detail:
      "A durable auditable ledger, server-side event reconciliation, commission calculations, adjustment controls, tax treatment, reporting periods, dispute handling, and access controls are required before displaying an earning, rate, tier, pending amount, or referral count.",
  },
  {
    title: "Withdrawals, payouts, and asset safeguards",
    icon: WalletCards,
    detail:
      "A verified payout provider or custody system, identity and eligibility checks where needed, account authorization, transaction controls, confirmation, failure handling, reconciliation, and customer support are required before accepting a withdrawal or presenting a payout as available.",
  },
  {
    title: "Abuse prevention and consumer protection",
    icon: ShieldCheck,
    detail:
      "Anti-fraud monitoring, rate limits, prohibited-activity enforcement, privacy review, clear disclosures, audit logs, incident response, and an appeal process are required before operating an affiliate or incentive program.",
  },
];

export default function AffiliateDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Affiliate service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Affiliate Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Referral links, tracked invitations, affiliate tiers, commission
            rates, earned or pending balances, withdrawal requests, payouts, and
            participant status are not configured for this deployment. No
            referral, earning, reward, financial balance, payout, or participant
            relationship is represented as active, current, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated referrals, commissions, or withdrawals
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not generate an affiliate link, track an
                invitation, calculate a tier or commission, show an earnings
                balance, label an account as active, create a withdrawal
                request, or pay an affiliate reward.
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
