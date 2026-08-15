import {
  AlertTriangle,
  Activity,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Configured traffic-management and service-discovery layer",
    icon: Activity,
    detail:
      "A configured and documented load-balancing or traffic-management layer with service discovery, routing policy, backend registration, connection handling, timeout semantics, session behavior, capacity limits, and deployment ownership is required before representing request distribution, routing, failover, traffic policy, service availability, or backend health as active or verified.",
  },
  {
    title: "Authenticated telemetry, health checks, and capacity data",
    icon: Database,
    detail:
      "Authenticated and tenant-scoped telemetry, validated health checks, time-synchronized request and backend metrics, capacity and saturation measurements, error classification, retention controls, data provenance, and tested recovery are required before reporting traffic, active users, transactions, response times, utilization, success rates, backend state, availability, or performance results.",
  },
  {
    title: "Security and change-control safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege infrastructure access, secure secret handling, authorization, network controls, rate limits, abuse prevention, configuration review, audit trails, rollback procedures, incident response, and evidence that controls operate as designed are required before applying or representing a routing change, backend registration, failover, automation, integration, or operational action as safe, protected, available, or successful.",
  },
  {
    title: "Evidence-based observability and operations",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, monitoring, alerting, load and failure testing, capacity evidence, service-level objectives, retry and degradation behavior, support procedures, and independently verifiable operational records are required before reporting infrastructure analytics, automation outcomes, documentation availability, production readiness, or a healthy load-balancing service.",
  },
];

export default function LoadBalancing() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Load balancing service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Load Balancing
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Traffic management, service discovery, backend registration,
            routing, health checks, failover, capacity telemetry, live updates,
            analytics, automation, infrastructure integrations, operational
            metrics, and support documentation are not configured for this
            deployment. No traffic result, backend state, user count,
            transaction count, success rate, response time, utilization,
            availability, or service status is represented as current, complete,
            verified, active, healthy, available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated traffic, health, or infrastructure result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not register backends, route traffic, perform
                health checks, fail over services, stream telemetry, calculate
                capacity, apply automation, modify infrastructure, or report
                traffic, users, transactions, performance, availability,
                analytics, or operational outcomes. It does not claim that a
                load-balancing operation succeeded.
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
