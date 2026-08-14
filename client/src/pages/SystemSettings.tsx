import {
  AlertTriangle,
  Database,
  KeyRound,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized configuration and administration records",
    icon: Database,
    detail:
      "Authenticated administrator identity, tenant isolation, role-based access, scoped authorization, durable configuration records, change history, validation, safe defaults, rollback workflows, audit logging, and clear error states are required before reading, changing, or reporting any system setting, account setting, organization setting, configuration value, policy, or administrative result.",
  },
  {
    title: "Secure secrets and integration management",
    icon: KeyRound,
    detail:
      "Server-side secret storage, credential rotation, least-privilege scopes, integration authorization, encrypted handling where appropriate, request validation, rate limits, secure logging, failure recovery, and independently evidenced controls are required before connecting, modifying, enabling, testing, or claiming availability for an external service or integration.",
  },
  {
    title: "Protected change management and governance",
    icon: ShieldCheck,
    detail:
      "Approval controls where applicable, separation of duties, access reviews, security monitoring, incident response, privacy controls, retention limits, policy enforcement, documented ownership, and independently evidenced protections are required before applying or representing production configuration changes.",
  },
  {
    title: "Evidence-based system and operational reporting",
    icon: Settings2,
    detail:
      "Source-attributed telemetry, documented metric definitions, observability, capacity monitoring, performance testing, incident management, integration health checks, and independent evidence are required before claiming active users, transactions, success rates, response times, live data, real-time updates, automation, advanced analytics, or production readiness.",
  },
];

export default function SystemSettings() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> System-settings service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            System Settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            System configuration, administrative controls, integrations,
            analytics, active user counts, transaction totals, live updates,
            automation, success rates, and response times are not configured for
            this deployment. No setting, integration, configuration change,
            metric, or service result is represented as current, complete,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated setting, integration, or system update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a setting, expose a secret, connect
                an integration, change a policy, apply a configuration update,
                stream an operational result, or report that an administrative
                action succeeded.
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
