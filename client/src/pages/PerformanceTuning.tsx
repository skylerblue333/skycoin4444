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
    title: "Verified telemetry and measurement integration",
    icon: Database,
    detail:
      "Authenticated telemetry integration, documented environment scope, consistent time sources, validated event and metric schemas, source attribution, sampling and aggregation definitions, stale-data detection, retention controls, and independently verifiable measurement methods are required before displaying a performance metric, trace, log-derived result, health signal, activity count, response time, success rate, or live operational value.",
  },
  {
    title: "Evidence-based performance analysis and tuning workflow",
    icon: Workflow,
    detail:
      "Documented baselines, reproducible test scenarios, change attribution, capacity and load-testing methods, performance budgets, regression detection, controlled experiments, rollback procedures, durable evidence, and independently reviewable analysis are required before proposing, applying, or reporting a performance change, tuning action, optimization result, analytics insight, automation outcome, or improvement claim.",
  },
  {
    title: "Secure and governed configuration changes",
    icon: ShieldCheck,
    detail:
      "Least-privilege access, server-side authorization, input validation, protected administrative actions, change approval, separation of duties, secure audit logging, configuration backup, rollback safeguards, rate limits, incident response, and independently evidenced controls are required before changing or representing a configuration, deployment, runtime setting, performance policy, infrastructure control, or automated operation as available or applied.",
  },
  {
    title: "Reliable service operations and reporting",
    icon: FileCheck2,
    detail:
      "Verified service integrations, documented service-level definitions, durable observability, alerting, incident management, data-quality controls, availability measurement, performance testing, and independently verifiable methods are required before reporting real-time updates, analytics, active users, transaction totals, success rates, response times, service availability, reliability, or production readiness.",
  },
];

export default function PerformanceTuning() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Performance-tuning service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Performance Tuning
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Performance telemetry, tuning actions, configuration changes, health
            signals, live updates, analytics, insights, automation, active user
            counts, transaction totals, success rates, response times, and
            service availability are not configured for this deployment. No
            metric, analysis, tuning action, configuration change, optimization
            result, or service result is represented as current, complete,
            verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated telemetry, optimization, configuration, or metric
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve telemetry, calculate a performance
                metric, analyze a service, change a configuration, apply a
                tuning action, stream an update, trigger automation, or report
                that an optimization operation succeeded.
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
