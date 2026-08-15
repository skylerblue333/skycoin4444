import {
  AlertTriangle,
  FileCheck2,
  KeyRound,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated identity and authorization integration",
    icon: KeyRound,
    detail:
      "Verified identity integration, authenticated session context, tenant isolation, server-enforced authorization, validated subjects and resources, permission inheritance rules, least-privilege role definitions, revocation handling, durable authorization records, and defined error states are required before displaying, creating, changing, granting, revoking, or reporting a user, role, permission, entitlement, access decision, or authorization result.",
  },
  {
    title: "Secure access-control and policy safeguards",
    icon: ShieldCheck,
    detail:
      "Server-side policy enforcement, input validation, protected administrative actions, multi-factor or step-up controls where appropriate, rate limits, secure audit logging, session protection, account-recovery safeguards, access reviews, secret management, incident response, and independently evidenced controls are required before exposing or operating a permission, role, identity, account, policy, or access-management function.",
  },
  {
    title: "Governed administrative change management",
    icon: FileCheck2,
    detail:
      "Documented change authority, approval workflows, separation of duties, durable audit history, change review, rollback procedures, recertification policy, retention requirements, escalation procedures, and independently reviewable governance are required before applying or representing an administrative, identity, role, permission, entitlement, or access-policy change as complete, approved, effective, or compliant.",
  },
  {
    title: "Evidence-based operational reporting",
    icon: Workflow,
    detail:
      "Verified identity and authorization integrations, documented metric definitions, durable telemetry, source attribution, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, insights, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function PermissionManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Permission-management
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Permission Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Identity records, roles, permissions, access decisions, access
            changes, authorization controls, activity records, live updates,
            analytics, insights, automation, active user counts, transaction
            totals, success rates, and response times are not configured for
            this deployment. No user, role, permission, entitlement, access
            decision, metric, or service result is represented as current,
            complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated identity, permission, access, or policy result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve an identity, evaluate a permission,
                create or change a role, grant or revoke access, apply a policy,
                record activity, stream an update, trigger automation, or report
                that an access-management operation succeeded.
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
