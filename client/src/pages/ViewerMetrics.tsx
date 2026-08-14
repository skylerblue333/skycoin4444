import {
  Activity,
  AlertTriangle,
  Database,
  Eye,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized analytics event collection",
    icon: Database,
    detail:
      "Documented event definitions, appropriate notice and consent, authenticated and scoped collection, privacy-preserving identifiers, data minimization, retention limits, bot and abuse controls, deduplication, source provenance, and correction or deletion workflows are required before collecting or displaying audience, viewer, play, session, engagement, or behavior data.",
  },
  {
    title: "Accurate measurement and reporting methodology",
    icon: Eye,
    detail:
      "Clear metric definitions, time-window rules, filtering methodology, source reconciliation, data-quality checks, freshness indicators, uncertainty handling, auditability, and independent verification are required before reporting viewers, reach, views, retention, conversions, engagement, active users, transactions, or any analytic result.",
  },
  {
    title: "Privacy, access, and operational safeguards",
    icon: ShieldCheck,
    detail:
      "Role-based access, tenant isolation, secure aggregation, sensitive-data controls, audit logging, secure error handling, incident response, support procedures, and policy enforcement are required before exposing audience analytics or individual behavioral information.",
  },
  {
    title: "Evidence-based live operations and performance claims",
    icon: Activity,
    detail:
      "Source-attributed telemetry, monitoring, observability, availability tracking, documented performance tests, capacity controls, and independent evidence are required before claiming real-time data, live updates, automation, success rates, response times, throughput, or production readiness.",
  },
];

export default function ViewerMetrics() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Viewer analytics service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Viewer Metrics
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Viewer counts, audience reach, engagement, retention, active users,
            real-time analytics, content performance, transactions, success
            rates, response times, automation, and other behavioral or
            operational metrics are not configured for this deployment. No
            viewer, audience member, event, metric, insight, or performance
            claim is represented as current, complete, verified, or available.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated audience, view, engagement, retention, live metric,
                or analytics result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not collect viewer data, identify an audience
                member, calculate engagement, report retention, access
                analytics, display a live metric, create a report, or state that
                an analysis succeeded.
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
