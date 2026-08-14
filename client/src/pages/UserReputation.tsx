import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized and auditable reputation records",
    icon: Database,
    detail:
      "Authenticated subject ownership, durable reputation events, documented source provenance, clear eligibility rules, event deduplication, timestamp integrity, correction and appeal workflows, audit logs, data-retention controls, and robust consistency checks are required before calculating or displaying a reputation score, trust event, badge, level, ranking, or user standing.",
  },
  {
    title: "Fairness, privacy, and abuse safeguards",
    icon: ShieldCheck,
    detail:
      "Transparent methodology, privacy-aware visibility rules, access controls, anti-fraud and anti-gaming protections, bias and misuse review, rate limits, user notification, dispute handling, human escalation, and policy enforcement are required before applying, exposing, comparing, or acting on a reputation-related assessment.",
  },
  {
    title: "Verified analytics and ranking methodology",
    icon: Star,
    detail:
      "Documented calculation versions, source-attributed inputs, quality controls, update cadence, uncertainty handling, reproducibility, monitoring, independent review, and clear limitations are required before reporting a score, percentile, rank, trend, insight, engagement amount, active user count, transaction, or analytic result.",
  },
  {
    title: "Evidence-based operation and performance reporting",
    icon: Activity,
    detail:
      "Source-attributed telemetry, secure error handling, observability, incident response, capacity monitoring, documented performance tests, and independent evidence are required before claiming live data, real-time updates, automation, success rates, response times, or production readiness.",
  },
];

export default function UserReputation() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Reputation service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            User Reputation
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Reputation scores, trust events, badges, rankings, standing,
            analytics, active user counts, transactions, live updates,
            automation, success rates, and response times are not configured for
            this deployment. No person, score, event, badge, rank, insight,
            metric, or service result is represented as current, fair, complete,
            verified, or available.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated score, trust event, badge, rank, standing, metric,
                or live update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a reputation record, calculate a
                score, assign a badge, rank a person, create a trust event,
                expose a user insight, stream an update, or report that a
                reputation action succeeded.
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
