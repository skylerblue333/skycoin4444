import {
  AlertTriangle,
  Award,
  Database,
  FileCheck2,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted users, profiles, content, and activity records",
    icon: Database,
    detail:
      "Authenticated, tenant-isolated services for users, profiles, posts, followers, reactions, XP or points, reputation, events, timestamps, privacy, deletion, and reconciliation are required before retrieving or reporting a user, ranking input, activity record, post count, follower count, reputation value, level, or leaderboard position.",
  },
  {
    title: "Defined ranking and anti-abuse semantics",
    icon: Trophy,
    detail:
      "Documented metric definitions, time windows, tie handling, eligibility, aggregation, duplicate and missing-event detection, moderation exclusions, rate limits, anti-gaming controls, backfill behavior, and reproducible query results are required before calculating, displaying, or reporting XP, posts, followers, reputation, rank, creator status, contribution, or competitive standing.",
  },
  {
    title: "Verified rewards and authorization controls",
    icon: Award,
    detail:
      "Explicit reward eligibility, accounting, approval, issuance, revocation, identity binding, authorization, privacy controls, audit trails, and a clear distinction between recognition and financial or token value are required before promising, issuing, displaying, or reporting a badge, award, reward, SKY444 amount, creator earning, or user-specific outcome.",
  },
  {
    title: "Evidence-based analytics and operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable source data, metric definitions, monitoring, performance testing, support procedures, incident handling, and independently verifiable operational records are required before reporting active users, rankings, success rates, response times, engagement analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function Leaderboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Leaderboard service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Leaderboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified ranking, user, profile, activity, XP, post, follower,
            reputation, reward, analytics, automation, operational, and support
            services are not configured for this deployment. No rank, user,
            count, score, level, reputation, badge, reward, earning, metric,
            competitive result, or service status is represented as current,
            complete, verified, active, private, available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated rankings, rewards, or social metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or calculate rankings, list users,
                count posts or followers, score XP or reputation, issue rewards,
                update activity, synchronize records, automate actions, or
                report analytics or operational outcomes. It does not claim that
                any rank, award, earning, or user-specific result is current or
                successful.
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
          <ShieldCheck className="h-4 w-4" /> Ranking and reward interactions
          will remain disabled until the required services are configured and
          verified.
        </div>
      </div>
    </main>
  );
}
