import {
  AlertTriangle,
  BarChart3,
  Database,
  ShieldCheck,
  Siren,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified telemetry and observability",
    icon: BarChart3,
    detail:
      "Authorized source systems, measured service-level indicators, collection integrity, timestamps, retention controls, dashboards, alert thresholds, and incident ownership are required before presenting an operational score, active-user count, health status, trend, or real-time signal.",
  },
  {
    title: "Security monitoring and incident response",
    icon: ShieldCheck,
    detail:
      "Security event ingestion, validated detection rules, severity review, access controls, a documented escalation process, audit records, and on-call ownership are required before displaying a risk score, threat level, security warning, or monitoring state.",
  },
  {
    title: "Governance, economy, and activity data contracts",
    icon: Database,
    detail:
      "Persisted, authorized, reconciled, and independently interpretable records with documented calculation methods are required before showing proposal counts, participation, economic health, token metrics, platform activity, or composite intelligence indexes.",
  },
  {
    title: "Controlled command and automation workflows",
    icon: Siren,
    detail:
      "Role-based authorization, approved command boundaries, confirmation steps, change records, rollback procedures, monitoring, and support coverage are required before exposing a command center, automated recommendation, opportunity, or production-control action.",
  },
];

export default function SituationRoom() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Situation monitoring
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Situation Room
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Real-time platform monitoring, operational scores, economic health,
            governance activity, threat levels, user activity, AI intelligence
            feeds, automated opportunities, alerts, and command actions are not
            configured for this deployment. No operational metric, security
            condition, financial signal, governance state, or alert is
            represented as real, current, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated command intelligence, risks, or alerts
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not calculate a platform score, monitor an
                economy or governance system, label an incident, assess a
                threat, identify an opportunity, generate an AI recommendation,
                or grant access to a production command action.
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
