import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Role-based administrative authorization",
    icon: ShieldCheck,
    detail:
      "Authenticated administrator identity, least-privilege roles, tenant boundaries, authorization checks for every action, approval workflows, immutable audit trails, session protection, rate limits, incident response, and support escalation are required before listing, changing, suspending, restoring, or otherwise administering user accounts.",
  },
  {
    title: "Verified user records and account lifecycle controls",
    icon: Database,
    detail:
      "Durable account records, ownership verification, secure profile data, lifecycle-state validation, deletion and retention procedures, correction workflows, safe bulk-operation controls, integrity checks, transaction boundaries, and recovery processes are required before displaying or changing a user, account, role, permission, status, or membership.",
  },
  {
    title: "Privacy and sensitive-data safeguards",
    icon: Users,
    detail:
      "Data minimization, sensitive-data classification, privacy-aware display rules, secure logging, encryption where appropriate, access reviews, anti-abuse controls, policy enforcement, user notice, and appropriate human review are required before exposing account, identity, activity, relationship, or administrative information.",
  },
  {
    title: "Evidence-based operational reporting",
    icon: Activity,
    detail:
      "Source-attributed telemetry, documented metric definitions, data-quality monitoring, observability, capacity controls, secure error handling, performance testing, and independent evidence are required before claiming live data, advanced analytics, active users, transactions, success rates, response times, automation, or production readiness.",
  },
];

export default function UserManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> User administration
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            User Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Administrative user records, account actions, roles, permissions,
            memberships, status changes, user analytics, active user counts,
            transactions, live updates, automation, success rates, and response
            times are not configured for this deployment. No person, account,
            role, permission, administrative action, metric, or service result
            is represented as current, authorized, complete, verified, or
            successful.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated account, role, permission, administrative action,
                metric, or live update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not enumerate an account, change a role, modify a
                permission, suspend a user, expose administrative data,
                calculate an account metric, execute a bulk action, or report
                that an administrative action succeeded.
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
