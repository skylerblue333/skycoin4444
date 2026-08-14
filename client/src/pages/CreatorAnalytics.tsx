import {
  AlertTriangle,
  BarChart3,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated creator analytics collection",
    icon: BarChart3,
    detail:
      "Verified content and engagement events, clearly defined metrics, consent-aware collection, privacy protections, retention rules, quality controls, and reproducible calculations are required before reporting creator views, followers, reach, engagement, ratings, or audience growth.",
  },
  {
    title: "Earnings, tips, subscriptions, and payouts",
    icon: Database,
    detail:
      "A live payment and payout provider, server-side reconciliation, entitlement checks, tax and refund handling, customer support, fraud controls, and durable order records are required before showing revenue, tips, subscriptions, earnings, or payout information.",
  },
  {
    title: "Forecasting and ranking safeguards",
    icon: UsersRound,
    detail:
      "Validated historical data, a documented methodology, evaluation controls, uncertainty disclosures, privacy review, ranking fairness checks, and a user appeal process are required before forecasting revenue or ranking subscribers, fans, or audience members.",
  },
  {
    title: "Reward and account-protection controls",
    icon: ShieldCheck,
    detail:
      "Clear milestone rules, award authorization, anti-abuse controls, ledger integrity, role-based access, audit logs, incident response, and support processes are required before awarding a benefit, badge, token, or creator milestone.",
  },
];

export default function CreatorAnalytics() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Creator analytics
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Creator Analytics
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Creator performance, audience insights, follower growth, views,
            reach, engagement, ratings, earnings, subscriptions, tips, revenue
            forecasts, milestones, rewards, and fan rankings are not configured
            for this deployment. No metric, payment, forecast, audience
            relationship, reward, or creator result is represented as collected,
            current, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated growth, revenue, forecasts, or fan data
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not generate placeholder charts, fabricate social
                metrics, assign creator milestones, calculate a revenue
                forecast, rank fans, show tips, or represent subscriptions,
                earnings, or payouts as available.
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
