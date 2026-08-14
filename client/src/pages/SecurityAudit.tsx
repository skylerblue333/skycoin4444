import {
  AlertTriangle,
  ClipboardCheck,
  FileWarning,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized evidence and audit-scope records",
    icon: ClipboardCheck,
    detail:
      "Documented audit scope, accountable owners, asset inventory, authenticated access, tenant isolation, scoped authorization, durable evidence records, source attribution, tamper-evident audit trails, retention controls, and clear empty and error states are required before displaying any assessment, evidence item, control, asset, finding, remediation item, exception, or audit result.",
  },
  {
    title: "Verified scanning and finding-management integration",
    icon: ShieldQuestion,
    detail:
      "Authorized security tooling, validated scan configuration, defined cadence, coverage verification, result normalization, false-positive review, severity methodology, ownership assignment, remediation verification, re-test workflows, and evidence-based status handling are required before reporting any scan, vulnerability, control outcome, security finding, remediation state, or security action as complete or current.",
  },
  {
    title: "Compliance and disclosure governance",
    icon: ShieldCheck,
    detail:
      "Documented control criteria, reviewable evidence, qualified review processes, approval and exception workflows, legal and policy review where applicable, sensitive-data minimization, secure logging, access reviews, incident response, and independently evidenced safeguards are required before representing compliance, certification, attestation, policy adherence, remediation completion, or security posture.",
  },
  {
    title: "Evidence-based security and operational reporting",
    icon: FileWarning,
    detail:
      "Source-attributed telemetry, documented metric definitions, durable findings and remediation records, observability, performance testing, incident management, and independently verifiable methods are required before reporting active users, transaction totals, success rates, response times, live scan data, real-time updates, automation, advanced analytics, security scores, or production readiness.",
  },
];

export default function SecurityAudit() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Security-audit service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Security Audit
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Audit evidence, security scans, findings, remediation states,
            compliance assertions, certifications, active user counts,
            transaction totals, live updates, automation, success rates, and
            response times are not configured for this deployment. No security
            assessment, finding, control status, compliance result, metric, or
            service result is represented as current, complete, verified, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated audit, scan, finding, remediation, or certification
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not execute a scan, retrieve audit evidence,
                disclose a security finding, calculate a security metric, verify
                remediation, issue a compliance statement, stream an update, or
                report that a security action succeeded.
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
