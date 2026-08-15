import {
  AlertTriangle,
  Bell,
  Database,
  FileCheck2,
  Heart,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted social graph and engagement records",
    icon: Database,
    detail:
      "Authenticated, tenant-isolated services for users, profiles, content, reactions, likes, unlike operations, deduplication, timestamps, deletion, privacy, and reconciliation are required before retrieving, creating, updating, counting, or reporting a like, unlike, engagement record, content item, user, follower relationship, notification, or activity history.",
  },
  {
    title: "Authorized interaction and notification delivery",
    icon: Bell,
    detail:
      "Validated authorization, object ownership, idempotency, rate limits, abuse prevention, event ordering, notification preferences, delivery and retry semantics, unread-state handling, and auditability are required before presenting a social interaction, notification, automation, feed update, moderation signal, or user action as accepted, delivered, current, complete, or successful.",
  },
  {
    title: "Privacy and safety controls for social activity",
    icon: ShieldCheck,
    detail:
      "Role-based access, least-privilege data access, privacy and deletion controls, sensitive-data minimization, content and abuse safeguards, secure session handling, audit trails, incident response, and evidence that controls operate as designed are required before exposing, aggregating, exporting, moderating, or representing social activity, user behavior, engagement, or notification data as protected or safely disclosed.",
  },
  {
    title: "Evidence-based engagement reporting",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, source-backed aggregation, time-window semantics, duplicate and missing-event detection, monitoring, performance testing, operational support, and independently verifiable records are required before reporting active users, like counts, engagement rates, transactions, response times, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function Likes() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Likes service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Likes
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Persisted social records, like and unlike actions, user and content
            data, notifications, live updates, analytics, automation,
            operational metrics, and support documentation are not configured
            for this deployment. No like, unlike, engagement count, user,
            content item, notification, metric, or service status is represented
            as current, complete, verified, active, private, available, or
            successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated social records or engagement metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve, create, remove, count, notify,
                stream, moderate, aggregate, automate, or report likes, unlikes,
                users, content, engagement, notifications, transactions,
                analytics, or operational outcomes. It does not claim that a
                social action or notification succeeded.
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
          <Heart className="h-4 w-4" /> Like interactions will remain disabled
          until the required services are configured and verified.
        </div>
      </div>
    </main>
  );
}
