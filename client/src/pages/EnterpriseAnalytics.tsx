import {
  AlertTriangle,
  BarChart3,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized analytics data collection",
    icon: Database,
    detail:
      "Documented event definitions, consent-aware collection, data minimization, retention limits, quality checks, access controls, and reproducible aggregation are required before reporting user activity, retention, revenue, token activity, or platform performance.",
  },
  {
    title: "Verified financial and economic reporting",
    icon: BarChart3,
    detail:
      "Reconciled source systems, accounting controls, calculation methodology, time-period discipline, provenance, review procedures, and appropriate disclosures are required before presenting revenue, burn, treasury, supply, staking, token velocity, or inflation data.",
  },
  {
    title: "Security and operational telemetry",
    icon: ShieldCheck,
    detail:
      "Validated security-event sources, detection logic, severity review, operational ownership, auditability, incident processes, and permission controls are required before showing threat counts, anomalies, risk scores, or agent performance metrics.",
  },
  {
    title: "Privacy and governance safeguards",
    icon: UsersRound,
    detail:
      "Privacy review, role-based access, anonymization where appropriate, data-subject controls, export governance, monitoring, and support procedures are required before exposing enterprise analytics or cohort information.",
  },
];

export default function ScalableAnalytics() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Enterprise analytics
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Enterprise Analytics
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Real-time analytics, user activity, retention cohorts, revenue,
            burn, treasury, token supply, staking, market health, security
            counts, AI-agent performance, forecasts, dashboards, and charts are
            not configured for this deployment. No metric, financial value,
            performance measure, threat count, or trend is represented as
            collected, current, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated analytics, financial metrics, or security telemetry
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not generate sample charts, random time series,
                placeholder KPIs, fabricated revenue or token figures, mock
                security events, or claimed AI-agent performance measurements.
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
