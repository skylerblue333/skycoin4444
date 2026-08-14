import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified creator identity and content governance",
    icon: BadgeCheck,
    detail:
      "Authenticated creator records, content ownership controls, eligibility review, role-based authorization, consent and privacy protections, community standards, moderation, reporting and appeals, retention rules, and correction workflows are required before granting creator status or attributing content, membership, or audience activity.",
  },
  {
    title: "Authorized payments, subscriptions, and payouts",
    icon: CreditCard,
    detail:
      "Configured payment and settlement providers, tax and merchant-of-record review, verified pricing, subscription lifecycle handling, provider-webhook verification, chargeback and refund controls, payout eligibility, anti-fraud monitoring, reconciliation, and audit records are required before accepting or reporting a subscription, tip, donation, sale, payout, fee, reward, token value, or creator earnings.",
  },
  {
    title: "Trustworthy analytics and audience records",
    icon: BarChart3,
    detail:
      "Source-attributed and privacy-reviewed analytics, documented metric definitions, durable event records, deduplication, bot and abuse filtering, data-quality checks, access controls, retention policies, and correction paths are required before showing a view, subscriber, supporter, audience, revenue, engagement, or growth metric.",
  },
  {
    title: "Monetization safety and consumer disclosures",
    icon: ShieldCheck,
    detail:
      "Clear consumer terms, creator policies, age and jurisdictional controls where applicable, financial risk disclosures, pricing and fee transparency, content-access controls, service reliability monitoring, dispute procedures, and support operations are required before enabling or representing a monetization feature, creator plan, reward, platform fee, or financial entitlement.",
  },
];

export default function CreatorDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Creator service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Creator Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Creator status, audience records, content views, subscriptions,
            tiers, tips, donations, token rewards, marketplace sales, earnings,
            revenue, fees, payout information, revenue breakdowns, conversion
            metrics, growth guidance, and monetization settings are not
            configured for this deployment. No creator identity, financial
            event, payment state, audience statistic, earning, plan, or metric
            is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated creator revenue, subscriptions, or analytics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create a creator account, publish or gate
                content, accept a subscription or tip, initiate a payment or
                payout, grant a token reward, calculate a fee, record a sale, or
                report an audience, revenue, or engagement outcome.
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
