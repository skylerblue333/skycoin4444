import {
  AlertTriangle,
  Database,
  FileCheck2,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified service inventory and health integrations",
    icon: Database,
    detail:
      "An authoritative service inventory, authenticated health checks, dependency mapping, validated environment scope, uptime definitions, consistent time sources, failure-state modeling, and independently verifiable service probes are required before identifying a service, displaying health, or reporting a system, provider, database, storage, authentication, AI, blockchain, messaging, media, or network status.",
  },
  {
    title: "Evidence-based telemetry and metric definitions",
    icon: Workflow,
    detail:
      "Durable telemetry, documented measurement methods, source attribution, timestamped data, sampling and aggregation definitions, stale-data detection, retention controls, alert thresholds, error-budget policy, independent validation, and clear data-quality states are required before reporting latency, uptime, availability, traffic, performance, error rates, monitoring state, or real-time operational metrics.",
  },
  {
    title: "Controlled incident and public-status operations",
    icon: FileCheck2,
    detail:
      "Documented incident governance, authorized incident creation and review, severity definitions, time-bound updates, stakeholder approval, post-incident review, correction workflows, change records, and durable audit history are required before publishing, updating, resolving, or presenting an incident, degradation, outage, maintenance window, recovery statement, or other operational event.",
  },
  {
    title: "Secure observability and access safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege access, secure handling of operational data and credentials, environment isolation, audit logging, secret management, abuse protections, dependency review, incident response, and independently evidenced safeguards are required before exposing service topology, monitoring data, diagnostic information, incident details, or operational controls.",
  },
];

export default function PlatformStatus() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Platform-status service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Platform Status
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Platform health, service status, uptime, latency, availability,
            incident history, maintenance state, real-time monitoring,
            operational metrics, and recovery status are not configured for this
            deployment. No service, dependency, incident, metric, or platform
            result is represented as current, complete, verified, active,
            operational, degraded, resolved, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated health, uptime, latency, or incident record
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not check a service, query a dependency, retrieve
                telemetry, calculate an uptime or latency metric, create or
                update an incident, report an outage, stream an update, or
                report that a platform operation succeeded.
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
