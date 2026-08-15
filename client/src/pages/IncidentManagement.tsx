import {
  AlertTriangle,
  Bell,
  Database,
  FileCheck2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted incident, alert, and service records",
    icon: Database,
    detail:
      "Authenticated and access-controlled services for incidents, alerts, services, components, severity, ownership, timelines, evidence, comments, actions, status changes, resolution, postmortems, and retention are required before retrieving, creating, updating, assigning, closing, or reporting an incident, alert, service state, or operational event.",
  },
  {
    title: "Verified detection, routing, and notification delivery",
    icon: Bell,
    detail:
      "Instrumented telemetry, event correlation, alert rules, deduplication, severity semantics, escalation policies, on-call ownership, notification preferences, delivery and retry behavior, auditability, and tested failure handling are required before representing an alert, escalation, notification, incident trigger, response, or service condition as current, delivered, acknowledged, or successful.",
  },
  {
    title: "Authorized remediation and change controls",
    icon: Wrench,
    detail:
      "Authenticated authorization, least-privilege access, approval and change-management controls, runbook evidence, rollback procedures, deployment safeguards, command audit trails, secret protection, incident response, and evidence that controls operate as designed are required before executing or representing a remediation, automation, configuration change, deployment action, recovery, or incident resolution as safe, authorized, available, or complete.",
  },
  {
    title: "Evidence-based operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable source data, metric definitions, monitoring, uptime and performance testing, incident timelines, error budgets, support procedures, post-incident review, and independently verifiable records are required before reporting active users, incidents, alerts, response times, success rates, transactions, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function IncidentManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Incident management
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Incident Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified incidents, alerts, telemetry, notifications, on-call
            routing, remediation, automation, analytics, operational metrics,
            and support documentation are not configured for this deployment. No
            incident, alert, service condition, response, remediation,
            resolution, user, metric, transaction, or service status is
            represented as current, complete, verified, active, authorized,
            available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated incidents, alerts, or recovery outcomes
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not collect telemetry, retrieve or create
                incidents, send alerts, notify responders, assign owners,
                execute remediation, change configuration, automate recovery,
                close incidents, or report analytics or operational outcomes. It
                does not claim that any incident response or recovery action
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

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <ShieldCheck className="h-4 w-4" /> Incident response and recovery
          actions will remain disabled until the required services are
          configured and verified.
        </div>
      </div>
    </main>
  );
}
