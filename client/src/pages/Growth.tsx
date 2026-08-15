import {
  AlertTriangle,
  BarChart3,
  Database,
  FileCheck2,
  Gift,
  Rocket,
  Share2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted user, referral, campaign, and reward records",
    icon: Database,
    detail:
      "Authenticated and tenant-isolated services for users, referrals, attribution, campaigns, creators, subscriptions, payments, rewards, tokens, discounts, eligibility, approvals, settlement, privacy, deletion, and reconciliation are required before retrieving or reporting a user, referral, conversion, revenue, campaign, creator, reward, token, discount, or payout.",
  },
  {
    title: "Verified attribution, eligibility, and financial semantics",
    icon: ShieldCheck,
    detail:
      "Documented attribution windows, source and medium rules, duplicate and fraud detection, consent, eligibility, terms, fee and tax treatment, currency handling, refunds and chargebacks, token issuance controls, payout authorization, and reproducible calculations are required before promising, calculating, issuing, or reporting commissions, airdrops, incentives, revenue shares, discounts, creator rewards, or other financial or token outcomes.",
  },
  {
    title: "Secure referral and growth-action workflows",
    icon: Share2,
    detail:
      "Authenticated ownership, server-side link generation, abuse prevention, rate limits, privacy safeguards, anti-self-referral controls, signed or scoped actions, audit trails, notification delivery, dispute handling, rollback, and evidence that controls operate as designed are required before creating, copying, sharing, joining, redeeming, automating, or representing a referral, campaign, incentive, or reward action as authorized, protected, available, or successful.",
  },
  {
    title: "Evidence-based growth and operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable source data, metric definitions, cohort and time-window semantics, monitoring, performance and failure testing, synchronization behavior, support procedures, and independently verifiable records are required before reporting active users, rewards paid, conversion rate, viral coefficient, revenue, response times, success rates, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function Growth() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Growth service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Growth Hub
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified user, referral, campaign, payment, reward, token, discount,
            creator incentive, attribution, analytics, automation, operational,
            and support services are not configured for this deployment. No
            user, referral, campaign, reward, token, discount, revenue,
            conversion, coefficient, payout, metric, or service status is
            represented as current, complete, verified, active, eligible, safe,
            available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated growth metrics, rewards, or referral outcomes
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or create users, referral links,
                campaigns, airdrops, creator incentives, subscriptions,
                payments, discounts, commissions, tokens, rewards, payouts,
                analytics, or operational metrics. It does not provide financial
                or token advice and does not claim that any growth, referral,
                incentive, or payment action exists or succeeded.
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

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <TrendingUp className="h-4 w-4" /> Growth programs and reporting will
          remain disabled until the required services are configured and
          verified.
          <BarChart3 className="h-4 w-4" />
          <Gift className="h-4 w-4" />
          <Rocket className="h-4 w-4" />
        </div>
      </div>
    </main>
  );
}
