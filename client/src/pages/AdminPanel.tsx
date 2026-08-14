import {
  AlertTriangle,
  Database,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Server-enforced administrator authorization",
    icon: UserCog,
    detail:
      "A server-side role model, least-privilege permissions, strong session validation, protected routes, re-authentication for sensitive actions, role-change review, and permission audit logs are required before displaying or granting administrative controls.",
  },
  {
    title: "Verified user-management and moderation workflows",
    icon: UsersRound,
    detail:
      "Authorized account lookup, clear policy criteria, notice and appeal processes, scoped enforcement, approval rules, durable moderation records, error handling, and accountable operators are required before moderating content, banning an account, or changing a user role.",
  },
  {
    title: "Operational metrics and audit records",
    icon: Database,
    detail:
      "Reliable source systems, metric definitions, data provenance, authorized aggregation, access controls, retention policies, and tamper-evident audit records are required before displaying user counts, system health, connections, activity, reports, or administrative statistics.",
  },
  {
    title: "Sensitive-action safety and incident response",
    icon: ShieldCheck,
    detail:
      "Confirmation steps, change tracking, rollback procedures, alerting, incident ownership, support escalation, and regular security review are required before an administrative action can affect another account or the platform.",
  },
];

export default function AdminPanel() {
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
            Administrative metrics, user search, moderation queues, account
            status, bans, role changes, security controls, system health, and
            audit data are not configured for this deployment. No account,
            report, metric, moderation decision, role, or administrative action
            is represented as available, current, or authorized.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated or client-only administrative actions
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not search users, expose account information,
                report platform activity, inspect a moderation queue, ban a
                user, change a role, label a system as healthy, or create an
                audit record.
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
