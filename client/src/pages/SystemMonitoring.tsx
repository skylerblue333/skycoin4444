import {
  AlertTriangle,
  BellRing,
  Database,
  ShieldCheck,
  TowerControl,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized telemetry and infrastructure-data access",
    icon: Database,
    detail:
      "Authenticated administrator identity, tenant isolation, role-based access, source-attributed telemetry, documented service and resource inventory, data freshness controls, safe retention, secure pagination, audit logging, and clear empty and error states are required before displaying any system, service, infrastructure, log, trace, metric, event, status, or operational-data result.",
  },
  {
    title: "Verified monitoring and alerting integration",
    icon: BellRing,
    detail:
      "Authorized monitoring providers, validated ingestion, documented thresholds, alert routing, deduplication, escalation policies, delivery-status handling, incident workflows, configuration controls, error recovery, and evidence-based availability monitoring are required before creating, delivering, or reporting an alert, incident, health check, uptime state, or monitoring result.",
  },
  {
    title: "Secure operational-data governance",
    icon: ShieldCheck,
    detail:
      "Least-privilege access, sensitive-data minimization, secret redaction, secure logging, retention limits, incident response, environment separation, change-management controls, privacy protections, and independently evidenced safeguards are required before exposing system configuration, logs, infrastructure state, or operational activity.",
  },
  {
    title: "Evidence-based system reporting",
    icon: TowerControl,
    detail:
      "Documented metric definitions, source attribution, calculation-version records, observability, capacity monitoring, performance testing, incident management, service-level objectives, and independent evidence are required before claiming live data, real-time updates, active users, transactions, success rates, response times, advanced analytics, automation, system health, or production readiness.",
  },
];

export default function SystemMonitoring() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> System-monitoring service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            System Monitoring
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Telemetry, infrastructure status, alerts, logs, metrics, system
            health, analytics, active user counts, transaction totals, live
            updates, automation, success rates, and response times are not
            configured for this deployment. No monitoring record, alert, metric,
            status, health result, or service result is represented as current,
            complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated telemetry, alert, metric, or health result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve logs or telemetry, access
                infrastructure state, create or deliver an alert, calculate a
                metric, report a health check, stream an update, or claim that
                an operational action succeeded.
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
