import {
  AlertTriangle,
  Award,
  Database,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted and auditable engagement events",
    icon: Database,
    detail:
      "Documented event definitions, server-side activity recording, deduplication, time-zone handling, availability safeguards, relationship to authenticated users, data-retention controls, and audit records are required before calculating a check-in, activity count, streak, or progress measure.",
  },
  {
    title: "Rewards, points, and benefit ledger",
    icon: Trophy,
    detail:
      "Clear program terms, eligibility rules, an auditable ledger, server-side reward issuance, duplicate-prevention controls, reversals, abuse monitoring, tax or financial review where applicable, and support procedures are required before awarding points, tokens, rewards, tiers, shields, XP, or benefits.",
  },
  {
    title: "Quests, badges, and milestone verification",
    icon: Award,
    detail:
      "Verified completion criteria, durable quest definitions, secure progress calculation, challenge lifecycle controls, a badge-issuance process, transparent eligibility, correction procedures, and user support are required before presenting a quest, badge, rank, level, milestone, or completion status.",
  },
  {
    title: "Privacy, fairness, and abuse safeguards",
    icon: ShieldCheck,
    detail:
      "Consent-aware collection, anti-automation controls, rate limits, fairness review, clear disclosures, protected account access, privacy controls, incident response, and an appeal process are required before operating a retention or loyalty program.",
  },
];

export default function Retention() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Retention and loyalty
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Retention &amp; Loyalty
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Check-ins, day streaks, loyalty tiers, points, XP, levels, ranks,
            multipliers, streak shields, quests, badges, milestone rewards,
            token rewards, wallet-linked achievements, and engagement progress
            are not configured for this deployment. No activity, achievement,
            reward, rank, balance, entitlement, or completion result is
            represented as current, verified, or persisted.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated engagement, loyalty, or token rewards
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not record a check-in, extend or protect a
                streak, calculate progress, create a quest, grant a badge,
                assign a rank, issue XP or a reward, or represent a
                digital-asset reward as earned.
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
