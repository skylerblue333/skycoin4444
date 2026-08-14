import {
  Activity,
  AlertTriangle,
  Clock,
  Database,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated timeline and activity records",
    icon: Database,
    detail:
      "Authenticated account ownership, tenant isolation, authorization-aware visibility rules, durable event records, timestamp integrity, content provenance, secure deletion, correction workflows, pagination, audit logging, and clear empty and error states are required before displaying a person’s timeline, activity event, history, relationship, or account information.",
  },
  {
    title: "Privacy and social-graph protections",
    icon: ShieldCheck,
    detail:
      "Privacy settings, consent-aware relationship visibility, blocking and reporting controls, data minimization, sensitive-event handling, access controls, abuse prevention, retention limits, policy enforcement, and user support procedures are required before showing social activity, connections, interactions, profiles, or behavioral information.",
  },
  {
    title: "Verified event and engagement measurement",
    icon: Clock,
    detail:
      "Source-attributed events, documented metric definitions, deduplication, ordering rules, freshness checks, quality monitoring, reconciliation, privacy safeguards, and independently verifiable methods are required before reporting an activity, event count, engagement total, active user count, transaction, timeline update, or user insight.",
  },
  {
    title: "Evidence-based live operations and performance reporting",
    icon: Activity,
    detail:
      "Source-attributed telemetry, observability, secure error handling, incident response, capacity monitoring, documented performance tests, and independent evidence are required before claiming live data, real-time updates, automation, success rates, response times, or production readiness.",
  },
];

export default function UserTimeline() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> User timeline service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            User Timeline
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            User timelines, activity events, history, profile data, relationship
            activity, engagement metrics, active user counts, transactions, live
            updates, automation, success rates, and response times are not
            configured for this deployment. No person, activity, relationship,
            event, metric, timeline, or service result is represented as
            current, complete, verified, or available.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated user, profile, activity, timeline event, metric, or
                live update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a user record, access a timeline,
                display an activity event, expose relationship information,
                calculate engagement, stream an update, create an event, or
                report that a user-data action succeeded.
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
