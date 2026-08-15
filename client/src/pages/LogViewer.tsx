import {
  AlertTriangle,
  Database,
  FileCheck2,
  ListFilter,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated, tenant-isolated log collection and retention",
    icon: Database,
    detail:
      "A documented server-side logging pipeline with authenticated access, tenant isolation, structured event schemas, durable storage, retention and deletion policies, redaction of credentials and sensitive personal data, time synchronization, source attribution, ingestion guarantees, and tested recovery are required before retrieving, storing, searching, exporting, or reporting an application, API, authentication, database, security, user, transaction, or operational log.",
  },
  {
    title: "Validated query, filtering, and incident-context controls",
    icon: ListFilter,
    detail:
      "Validated query and filtering contracts, pagination and ordering semantics, time-window definitions, access-controlled field selection, secure export handling, correlation and trace identifiers, event provenance, duplicate and missing-event detection, and documented error and retry behavior are required before presenting log entries, filters, searches, alerts, correlations, incident context, or diagnostic results as complete, current, or reliable.",
  },
  {
    title: "Security, privacy, and operational access governance",
    icon: ShieldCheck,
    detail:
      "Role-based authorization, least-privilege access, secure secret handling, audit trails for log access and exports, privacy review, redaction verification, rate limits, abuse prevention, monitoring, incident response, access reviews, and evidence that controls operate as designed are required before representing logs, operational data, user activity, transactions, security events, or diagnostics as protected, available, or safely disclosed.",
  },
  {
    title: "Evidence-based observability and reporting",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, monitoring and alerting, ingestion and query performance testing, capacity evidence, availability objectives, failure handling, support procedures, and independently verifiable operational records are required before reporting active users, transactions, success rates, response times, log volume, event counts, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function LogViewer() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Log viewer service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Log Viewer
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Authenticated log collection, search, filtering, live updates,
            analytics, incident context, automation, user and transaction
            events, operational metrics, and support documentation are not
            configured for this deployment. No log entry, event, alert, user,
            transaction, metric, query result, diagnostic result, or service
            status is represented as current, complete, verified, protected,
            available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated log records or operational metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not collect, retrieve, stream, search, filter,
                export, correlate, summarize, alert on, automate, or report
                application logs, security events, user activity, transactions,
                performance data, incident context, analytics, or service
                health. It does not claim that logs are stored, complete,
                current, private, or available.
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
