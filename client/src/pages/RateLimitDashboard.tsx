import {
  AlertTriangle,
  Database,
  Scale,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Implemented request-limit enforcement",
    icon: Workflow,
    detail:
      "Server-enforced route policies, identity and client classification, documented scopes, endpoint-specific limits, distributed-store configuration, failure-mode design, bypass controls, tests, change management, and ongoing verification are required before displaying a limit rule, marking a rule active, or asserting that request, upload, message, order, token, or other API actions are rate limited.",
  },
  {
    title: "Trusted security and traffic telemetry",
    icon: Database,
    detail:
      "Authenticated metric sources, privacy-protecting collection, documented aggregation methodology, timestamped and durable records, validation, deduplication, retention controls, access restrictions, data-quality monitoring, and correction procedures are required before displaying request totals, blocked requests, unique clients, block rates, offenders, endpoint activity, recent blocks, or security analytics.",
  },
  {
    title: "Authorized security operations and incident handling",
    icon: ShieldCheck,
    detail:
      "Role-based authorization, secure admin boundaries, audit logging, security monitoring, alert verification, incident classification, escalation, secrets management, privacy controls, responder runbooks, and independent review are required before exposing operational security data, client identifiers, block history, administrative controls, or monitoring outcomes.",
  },
  {
    title: "Governance and user-protection controls",
    icon: Scale,
    detail:
      "Documented security policies, transparent user communications, lawful data handling, abuse-reporting procedures, appeals and correction processes, change approval, service ownership, periodic review, and accountable oversight are required before making availability, abuse-prevention, protection, enforcement, compliance, or safety claims.",
  },
];

export default function RateLimitDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Rate-limit service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Rate Limit Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            API request limits, active rule configuration, traffic totals,
            blocked requests, unique clients, block rates, endpoint activity,
            top offenders, recent blocks, abuse prevention, security monitoring,
            administrative analytics, and enforcement results are not configured
            for this deployment. No security policy, rate-limit rule, metric,
            client record, request outcome, or protective control is represented
            as current, verified, or active.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated security telemetry, block, rule, or enforcement
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not inspect API traffic, expose client data, load
                a security dashboard, refresh a metric, verify an endpoint
                policy, block a request, or report that a security,
                abuse-prevention, or rate-limit control is operating.
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
