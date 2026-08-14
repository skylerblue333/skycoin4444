import {
  AlertTriangle,
  Database,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized recommendation data sources",
    icon: Database,
    detail:
      "Authenticated ownership, tenant isolation, validated content and interaction records, source attribution, retention controls, reconciliation, audit logging, defined empty states, and clear error handling are required before displaying a recommendation, ranking, content result, user activity record, transaction result, or analytics result.",
  },
  {
    title: "Privacy-preserving personalization controls",
    icon: SlidersHorizontal,
    detail:
      "Documented consent, transparent preference controls, data minimization, access controls, deletion workflows, sensitive-data protections, explainability requirements, and human review are required before collecting or using personal activity, preferences, relationships, messages, location, financial information, or behavioral signals to personalize a result.",
  },
  {
    title: "Safety, quality, and abuse prevention",
    icon: ShieldCheck,
    detail:
      "Content policies, source validation, abuse detection, moderation workflows, escalation paths, appeal and correction processes, security review, audit trails, and independently evidenced safeguards are required before recommending content, people, products, financial actions, communities, or other user-generated and third-party material.",
  },
  {
    title: "Evidence-based delivery and performance reporting",
    icon: UsersRound,
    detail:
      "Verified service integrations, durable telemetry, documented metric definitions, attribution, observability, performance testing, incident management, and independently verifiable methods are required before reporting active users, transactions, success rates, response times, real-time updates, automation, advanced analytics, or production readiness.",
  },
];

export default function Recommendations() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Recommendation service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Recommendations
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Personalized recommendations, rankings, live content, user activity,
            financial results, analytics, automation, active user counts,
            transaction totals, success rates, and response times are not
            configured for this deployment. No recommendation, metric, account
            result, or service result is represented as current, complete,
            verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated recommendations, data, or metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a user profile or data feed, create
                a ranking, analyze activity, process a transaction, trigger
                automation, stream an update, or report that a recommendation
                operation succeeded.
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
