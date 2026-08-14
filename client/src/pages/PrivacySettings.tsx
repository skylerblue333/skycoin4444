import {
  AlertTriangle,
  Database,
  EyeOff,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated preference records and consent management",
    icon: Database,
    detail:
      "Authenticated ownership, tenant isolation, validated preference records, explicit consent capture, effective-date history, source attribution, durable persistence, retention controls, correction and deletion workflows, audit logging, and clear success and failure states are required before displaying, changing, revoking, or reporting a privacy preference or consent choice.",
  },
  {
    title: "Transparent data-use and sharing controls",
    icon: EyeOff,
    detail:
      "Documented data categories and purposes, granular visibility and sharing rules, downstream enforcement, data-minimization controls, third-party integration review, export and deletion workflows, user-access mechanisms, and independently verified application of each policy are required before representing data as private, hidden, deleted, restricted, shared, or protected.",
  },
  {
    title: "Security, access, and governance safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, secure handling of personal data, encryption controls where applicable, secure secret management, access reviews, incident response, retention governance, policy review, logging safeguards, vulnerability management, and evidence-based security controls are required before exposing or changing an account's privacy, identity, personal-data, or security configuration.",
  },
  {
    title: "Verified privacy operations and reporting",
    icon: FileCheck2,
    detail:
      "Validated service integrations, durable telemetry, documented metric definitions, policy enforcement testing, request tracking, observability, error handling, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, automation, active users, transaction totals, success rates, response times, privacy compliance, or production readiness.",
  },
];

export default function PrivacySettings() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Privacy-settings service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Privacy preferences, consent choices, data-use controls, visibility
            settings, deletion requests, data exports, compliance controls, live
            updates, analytics, automation, active user counts, transaction
            totals, success rates, and response times are not configured for
            this deployment. No privacy setting, consent choice, data-handling
            outcome, metric, or service result is represented as current,
            complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated privacy preference or data-control result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve an account preference, record
                consent, change data sharing, process an export or deletion
                request, apply a privacy policy, trigger automation, stream an
                update, or report that a privacy operation succeeded.
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
