import {
  AlertTriangle,
  CalendarClock,
  FileCheck2,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized content, ownership, and queue records",
    icon: FileCheck2,
    detail:
      "Authenticated ownership, tenant isolation, validated content records, publishing permissions, durable queue state, source attribution, version history, audit logging, retention controls, conflict handling, defined empty states, and clear error recovery are required before displaying, editing, scheduling, prioritizing, approving, or publishing a content item.",
  },
  {
    title: "Verified destination and scheduling integration",
    icon: CalendarClock,
    detail:
      "Authorized destination accounts, scoped credentials, destination policy validation, time-zone handling, rate limits, idempotent scheduling, retry and cancellation workflows, delivery confirmation, duplicate prevention, failure handling, and evidence-based status monitoring are required before creating, updating, delivering, or reporting a publication, schedule, queue event, workflow, or integration result.",
  },
  {
    title: "Safety, moderation, and operational controls",
    icon: ShieldCheck,
    detail:
      "Content policy enforcement, moderation workflows, access controls, least privilege, secure secret handling, change approval, abuse prevention, incident response, auditing, and documented escalation paths are required before publishing user or organization content, automating a publication action, exposing destination activity, or reporting that a publishing operation succeeded.",
  },
  {
    title: "Evidence-based delivery and performance reporting",
    icon: Workflow,
    detail:
      "Durable telemetry, documented metric definitions, attribution, observability, provider-status monitoring, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, advanced analytics, automation, active users, transaction totals, success rates, response times, or production readiness.",
  },
];

export default function PublishingQueue() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Publishing-queue service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Publishing Queue
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Queue items, schedules, approvals, publication delivery, destination
            integrations, live updates, analytics, automation, active user
            counts, transaction totals, success rates, and response times are
            not configured for this deployment. No content item, schedule,
            publication, metric, or service result is represented as current,
            complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated publication, schedule, or delivery result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a content queue, create a schedule,
                submit content, approve a publication, connect a destination,
                deliver a post, stream an update, trigger automation, or report
                that a publishing operation succeeded.
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
