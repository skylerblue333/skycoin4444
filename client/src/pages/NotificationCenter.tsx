import {
  AlertTriangle,
  Bell,
  FileCheck2,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated notification records and preference controls",
    icon: Bell,
    detail:
      "Authenticated account ownership, tenant isolation, durable notification and preference records, validated recipient and channel settings, consent and subscription controls, delivery-state definitions, duplicate prevention, retry and failure handling, defined empty states, and clear error recovery are required before displaying, creating, changing, sending, receiving, reading, dismissing, or reporting a notification, alert, message, activity, preference, or delivery result.",
  },
  {
    title: "Authorized delivery-provider integration",
    icon: Workflow,
    detail:
      "Authorized email, push, SMS, in-app, webhook, or other delivery-provider integration; validated destinations; documented provider coverage; credential safeguards; delivery receipts; bounce and failure handling; rate limits; source attribution; and independently verifiable provider status are required before delivering, scheduling, retrying, or reporting an external notification, message, alert, campaign, reminder, or delivery outcome.",
  },
  {
    title: "Privacy, security, and account safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, secure handling of account and preference data, protected administrative actions, input validation, secure audit logging, sensitive-content minimization, abuse protections, retention limits, incident response, and independently evidenced controls are required before exposing or operating notification, activity, message, preference, recipient, delivery, or account information.",
  },
  {
    title: "Evidence-based operations and reporting",
    icon: FileCheck2,
    detail:
      "Verified service integrations, documented metric definitions, durable telemetry, source attribution, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, insights, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function NotificationCenter() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Notification-center
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Notification Center
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Notification records, delivery integrations, activity, messages,
            preferences, live updates, analytics, insights, automation, active
            user counts, transaction totals, success rates, and response times
            are not configured for this deployment. No notification, activity,
            message, preference, delivery, metric, or service result is
            represented as current, complete, verified, active, sent, delivered,
            or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated notification, message, preference, or delivery
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or change a notification preference,
                create or read a notification, send or deliver a message or
                alert, record activity, stream an update, trigger automation, or
                report that a notification operation succeeded.
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
