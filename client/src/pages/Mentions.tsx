import {
  AlertTriangle,
  AtSign,
  BellRing,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated social-graph and content data service",
    icon: AtSign,
    detail:
      "Authenticated account ownership, tenant isolation, durable profiles, content, mention, conversation, event, and relationship records, verified author and audience permissions, input and output validation, pagination, defined empty states, deletion and retention policies, and reliable recovery are required before listing, creating, changing, removing, searching, or reporting a mention, user, relationship, conversation, content item, or social result.",
  },
  {
    title: "Privacy-preserving notification and real-time delivery service",
    icon: BellRing,
    detail:
      "Mention eligibility rules, recipient consent and preferences, abuse controls, rate limits, durable notification records, authenticated delivery channels, retry and failure handling, idempotency, read-state synchronization, privacy controls, and independently verifiable delivery evidence are required before creating or reporting a notification, real-time update, alert, message, delivery, read state, or user activity result.",
  },
  {
    title: "Secure moderation, automation, and integration safeguards",
    icon: ShieldCheck,
    detail:
      "Authorization checks, content and identity moderation, anti-spam and anti-harassment protections, audit logging, secure integration contracts, validation for all external inputs and outputs, access reviews, incident response, and evidence that the controls operate as designed are required before representing a social workflow, automated action, integration, account, content item, or user data as protected, available, or successfully processed.",
  },
  {
    title: "Evidence-based analytics and operational reporting",
    icon: FileCheck2,
    detail:
      "Defined metric calculations, traceable data sources, observability, monitoring, alerting, documented sampling and retention methods, performance testing, and independently verifiable operational evidence are required before reporting active users, transactions, success rates, response times, analytics, insights, automation outcomes, service availability, or production readiness.",
  },
];

export default function Mentions() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Mentions service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Mentions
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Authenticated mention records, user and content data, real-time
            updates, notifications, analytics, insights, automation,
            integrations, operational metrics, documentation, and social actions
            are not configured for this deployment. No mention, account, content
            item, notification, user activity, delivery, automation result,
            analytic, insight, metric, or service status is represented as
            current, complete, verified, active, available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated social, notification, or analytics result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create, list, search, modify, remove, or
                report a mention; access user or content records; deliver a
                notification or real-time update; run automation; invoke an
                integration; report user, transaction, success-rate,
                response-time, or other performance data; or claim an operation
                succeeded.
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
