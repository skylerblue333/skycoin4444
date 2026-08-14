import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated progression and entitlement records",
    icon: Database,
    detail:
      "Authenticated ownership, durable season and tier definitions, versioned reward rules, validated experience events, eligibility controls, idempotent claims, reconciliation, correction procedures, audit trails, and access restrictions are required before showing a season, tier, experience total, premium status, claimed reward, badge, progression, or eligibility result.",
  },
  {
    title: "Verified reward and token settlement",
    icon: ShieldCheck,
    detail:
      "Authorized issuer controls, secure inventory or token custody, transaction validation, duplicate-submission prevention, balance and supply reconciliation, confirmation handling, fraud controls, failure recovery, clear disclosures, and independent auditability are required before awarding a reward, token, badge, item, benefit, or financial value.",
  },
  {
    title: "Safe premium purchase and subscription operations",
    icon: ShoppingCart,
    detail:
      "Authorized payment processing, price and tax configuration, purchase authorization, consumer disclosures, refund and cancellation workflows, entitlement reconciliation, payment-failure handling, receipt records, and support procedures are required before offering a premium pass, accepting payment, granting premium access, or reporting a completed purchase.",
  },
  {
    title: "Accurate gamification measurement and monitoring",
    icon: Activity,
    detail:
      "Documented scoring methodology, attributable events, anti-abuse controls, rate limits, data-quality monitoring, privacy safeguards, error handling, observability, and policy enforcement are required before calculating experience, milestones, leaderboard-like status, challenge completion, unlock state, or gamification metrics.",
  },
];

export default function BattlePass() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Season pass service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Battle Pass
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Seasons, tiers, progression, experience, free or premium tracks,
            premium entitlements, badges, token rewards, claimed and locked
            states, milestones, unlocks, season status, purchase offers, prices,
            subscriptions, and reward settlement are not configured for this
            deployment. No user has a pass, tier, balance, reward, entitlement,
            purchase, item, token, badge, or progression result represented as
            current, earned, available, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated progress, premium pass, reward, token, or purchase
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not authenticate a player, load season data,
                calculate experience, assign a tier, reveal a reward, claim an
                item, award a token, unlock a badge, determine premium
                eligibility, accept payment, issue a receipt, or report that a
                gamification or purchase action succeeded.
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
