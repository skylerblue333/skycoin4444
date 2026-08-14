import {
  AlertTriangle,
  Database,
  ShieldCheck,
  Siren,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified observability and service-health data",
    icon: Database,
    detail:
      "Instrumented services, authenticated telemetry sources, documented service boundaries, health-check definitions, timestamped metrics, retention and privacy controls, data-quality validation, access restrictions, alert routing, and auditable dashboards are required before displaying service health, uptime, latency, errors, restarts, capacity, performance, infrastructure state, or platform availability.",
  },
  {
    title: "Controlled remediation and deployment automation",
    icon: Workflow,
    detail:
      "Documented automation runbooks, scoped credentials, environment separation, change approval, deployment controls, rollback procedures, idempotency, rate limits, service ownership, test coverage, safeguards against cascading failure, human review, and audit logs are required before enabling or representing auto-restarts, auto-scaling, resource changes, garbage collection, pool expansion, query optimization, scans, or other self-healing actions.",
  },
  {
    title: "Security and incident-response governance",
    icon: ShieldCheck,
    detail:
      "Security monitoring, incident classification, alert verification, access controls, secrets management, encryption and key handling, response playbooks, escalation paths, forensics, post-incident review, and appropriate privacy protections are required before claiming a security scan, anomaly, threat, incident, resolution, infrastructure protection, or security status.",
  },
  {
    title: "Reliable operational accountability",
    icon: Siren,
    detail:
      "Named owners, service-level objectives, service-level indicators, operational review, resilient logging, business-continuity plans, disaster-recovery testing, error budgets, communication procedures, and independently reviewable records are required before reporting that an incident was resolved, an event succeeded, a service recovered, or infrastructure operates autonomously.",
  },
];

export default function SelfHealingInfra() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Infrastructure-automation
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Self-Healing Infrastructure
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Service health, uptime, latency, restarts, system-health scores,
            degraded-service counts, automated resolutions, anomaly logs, scans,
            auto-restarts, auto-scaling, capacity changes, resource remediation,
            incident records, stream and database state, and security monitoring
            are not configured for this deployment. No infrastructure metric,
            scan, event, automated remediation, service health state, or
            incident outcome is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated monitoring, scan, remediation, or operational
                success
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not query infrastructure telemetry, scan a
                system, modify resources, restart a service, scale a workload,
                resolve an anomaly, update an incident, or report that any
                infrastructure action or automated recovery occurred.
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
