import {
  AlertTriangle,
  ClipboardCheck,
  ShieldCheck,
  Siren,
  TriangleAlert,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized risk, asset, and control records",
    icon: ClipboardCheck,
    detail:
      "Authenticated ownership, tenant isolation, scoped authorization, durable asset and risk records, documented control mappings, defined methodologies, source attribution, audit logging, review dates, retention controls, and clear empty and error states are required before displaying any risk, threat, asset, control, owner, policy, assessment, exception, or compliance result.",
  },
  {
    title: "Verified assessment, scoring, and mitigation workflows",
    icon: TriangleAlert,
    detail:
      "Authorized data providers, validated assessment inputs, documented scoring methodology, severity definitions, approval and exception workflows, evidence requirements, ownership assignment, mitigation verification, re-test procedures, recovery plans, and evidence-based status verification are required before calculating, changing, accepting, mitigating, closing, or reporting a risk, score, alert, control, finding, or remediation action.",
  },
  {
    title: "Governance, compliance, and escalation safeguards",
    icon: ShieldCheck,
    detail:
      "Accountable owners, segregation of duties, policy review, sensitive-data minimization, secure logging, retention limits, notification and escalation procedures, incident response, access reviews, legal review where applicable, and independently evidenced safeguards are required before representing compliance, governance, control effectiveness, risk acceptance, remediation completion, or security posture.",
  },
  {
    title: "Evidence-based risk and operational reporting",
    icon: Siren,
    detail:
      "Source-attributed risk events, documented metric definitions, durable assessment and mitigation records, observability, performance testing, incident management, and independently verifiable methods are required before reporting risk levels, security alerts, control coverage, active users, transaction totals, success rates, response times, live updates, automation, advanced analytics, or production readiness.",
  },
];

export default function RiskManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Risk-management service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Risk Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Risk records, assessment inputs, scores, controls, alerts,
            mitigation states, compliance assertions, active user counts,
            transaction totals, live updates, automation, success rates, and
            response times are not configured for this deployment. No risk,
            score, control, finding, alert, remediation result, metric, or
            service result is represented as current, complete, verified,
            active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated assessment, score, control, alert, or mitigation
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a risk record, calculate a score,
                assess a control, generate an alert, modify a mitigation, accept
                a risk, retrieve a compliance result, calculate a metric, stream
                an update, or report that a risk-management action succeeded.
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
