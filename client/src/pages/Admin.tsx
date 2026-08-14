import {
  AlertTriangle,
  Database,
  ShieldCheck,
  UserCog,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Server-enforced administrative authorization",
    icon: UserCog,
    detail:
      "Authenticated administrator identities, server-side role and permission enforcement, least-privilege access, multi-factor authentication where appropriate, session security, approval workflows, account lifecycle controls, and access reviews are required before exposing an administrative operation or privileged platform information.",
  },
  {
    title: "Audited administrative actions and operational safeguards",
    icon: Workflow,
    detail:
      "Immutable audit logs, change management, two-person controls for high-risk actions, rollback procedures, input validation, rate limits, incident response, environment separation, secrets management, and emergency access controls are required before allowing actions that affect users, content, configuration, data, or platform availability.",
  },
  {
    title: "Governed moderation and human review",
    icon: ShieldCheck,
    detail:
      "Clear policy definitions, authorized reviewers, reporting and appeals, content and account authorization, human escalation, privacy protections, model governance, bias and quality review, safety monitoring, retention rules, and documented enforcement processes are required before representing automated moderation, flags, removals, accuracy, or review activity.",
  },
  {
    title: "Verified platform telemetry and health reporting",
    icon: Database,
    detail:
      "Source-of-truth observability, authenticated metric collection, uptime methodology, incident correlation, integrity checks, monitoring thresholds, version provenance, retention policies, data-quality checks, and correction controls are required before displaying platform health, user counts, post counts, uptime, version, actions, or logs.",
  },
];

export default function Admin() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Administrative service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Administration
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Administrative access, user controls, platform health, uptime,
            version status, user and post statistics, moderation actions, AI
            moderation metrics, accuracy claims, and activity logs are not
            configured for this deployment. No privileged access, operational
            metric, moderation event, administrative action, or security state
            is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated administrator access, moderation, or health state
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not grant an administrative role, query a
                platform metric, alter a user or record, perform or confirm a
                moderation action, calculate AI accuracy, expose a security log,
                report uptime, or indicate that a service is healthy.
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
