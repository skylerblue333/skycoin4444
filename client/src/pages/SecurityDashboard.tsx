import {
  AlertTriangle,
  Database,
  LockKeyhole,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified security telemetry and monitoring",
    icon: Database,
    detail:
      "Authenticated and source-attributed telemetry, documented collection methodology, integrity checks, alert thresholds, incident correlation, data retention controls, monitoring coverage, uptime methodology, and correction procedures are required before showing a security score, health state, uptime, TLS status, firewall status, incident count, or other security metric.",
  },
  {
    title: "Controlled account-protection operations",
    icon: LockKeyhole,
    detail:
      "Server-enforced authentication, session management, multi-factor enrollment, device verification, access-revocation controls, secure recovery procedures, re-authentication, user notification, privacy safeguards, and audited administration are required before enabling or representing account security controls, sessions, connected applications, or access events.",
  },
  {
    title: "Governed scans, incident response, and remediation",
    icon: Workflow,
    detail:
      "Defined scan scope, authorized tooling, safe execution isolation, vulnerability-management processes, qualified security review, severity definitions, remediation tracking, escalation paths, incident response, change management, and testing are required before initiating a scan, reporting its result, or offering a security recommendation or automated fix.",
  },
  {
    title: "Responsible moderation and audit records",
    icon: ShieldCheck,
    detail:
      "Authorized policy enforcement, human review, model governance, appeal processes, content and account authorization, privacy review, immutable audit events, retention policies, and operational oversight are required before representing moderation actions, AI assistance, security events, account activity, or audit history.",
  },
];

export default function SecurityDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Security service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Security Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Security scores, scan results, TLS and firewall status, two-factor
            status, uptime, recommendations, connected-app access, moderation
            statistics, AI moderation activity, audit logs, security events,
            active sessions, and account activity are not configured for this
            deployment. No security posture, protective control, account event,
            incident, monitoring result, or remediation state is represented as
            current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated scans, security scores, or protection status
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not execute a security scan, calculate a score,
                inspect a transport or firewall configuration, manage a session
                or connected application, enforce two-factor authentication,
                evaluate moderation, query an audit log, report an incident, or
                declare an account or service secure.
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
