import {
  AlertTriangle,
  ClipboardCheck,
  KeyRound,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized role, member, and permission records",
    icon: UsersRound,
    detail:
      "Authenticated account ownership, tenant isolation, scoped authorization, durable member and role records, policy-backed permissions, identity verification where required, safe pagination, audit logging, revocation workflows, and clear empty and error states are required before displaying any user, group, role, permission, assignment, access level, or administrative result.",
  },
  {
    title: "Verified assignment and approval workflows",
    icon: KeyRound,
    detail:
      "Server-side authorization enforcement, validated assignment inputs, segregation-of-duties controls, approval workflows where required, idempotent changes, duplicate-submission prevention, conflict checks, recovery procedures, notifications, and evidence-based status verification are required before creating, modifying, approving, revoking, or reporting a role, permission, member, access grant, or administrative action.",
  },
  {
    title: "Privacy, governance, and security safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege controls, access reviews, sensitive-data minimization, secure logging, retention limits, account recovery and offboarding procedures, incident response, policy review, and independently evidenced safeguards are required before exposing identity, role, permission, organizational, account, or administrative information.",
  },
  {
    title: "Evidence-based administration and operational reporting",
    icon: ClipboardCheck,
    detail:
      "Source-attributed authorization events, documented metric definitions, durable assignment and review records, observability, performance testing, incident management, and independently verifiable methods are required before reporting active users, access changes, transaction totals, success rates, response times, live updates, automation, advanced analytics, administrative readiness, or production readiness.",
  },
];

export default function RoleManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Role-management service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Role Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Role definitions, permissions, member records, assignments, approval
            workflows, audit events, active user counts, transaction totals,
            live updates, automation, success rates, and response times are not
            configured for this deployment. No role, permission, member, access
            grant, administrative result, metric, or service result is
            represented as current, complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated role, permission, assignment, member, or approval
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve an identity or permission, create or
                change a role, grant or revoke access, approve an administrative
                action, retrieve an audit record, calculate a metric, stream an
                update, or report that an authorization action succeeded.
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
