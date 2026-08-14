import {
  AlertTriangle,
  Database,
  FileLock2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized workspace, membership, and task records",
    icon: Database,
    detail:
      "Authenticated organization ownership, tenant isolation, role-based membership, scoped authorization, durable workspace, channel, task, and activity records, safe pagination, deletion and correction workflows, audit logging, and clear empty and error states are required before displaying any workspace, member, message, task, project, role, activity, notification, or collaboration result.",
  },
  {
    title: "Secure collaboration and communication delivery",
    icon: UsersRound,
    detail:
      "Verified memberships, authorization checks for every action, durable message delivery, idempotent write operations, presence and notification controls, abuse prevention, delivery status handling, search permissions, moderation workflows, and evidence-based availability monitoring are required before creating or reporting messages, comments, channels, invitations, active users, read states, or real-time updates.",
  },
  {
    title: "Protected file and document management",
    icon: FileLock2,
    detail:
      "Authorized storage, content-type and size validation, malware scanning, safe download controls, access-expiry rules, secure metadata handling, versioning, deletion and retention controls, audit trails, and incident response are required before listing, sharing, uploading, downloading, or reporting files and documents.",
  },
  {
    title: "Privacy, governance, and evidence-based analytics",
    icon: ShieldCheck,
    detail:
      "Privacy controls, consent where applicable, sensitive-data minimization, secure logging, retention limits, compliance review, documented metric definitions, source-attributed telemetry, observability, capacity monitoring, incident management, and independently verifiable methods are required before reporting collaboration metrics, usage analytics, active users, task completion, activity totals, success rates, response times, or production readiness.",
  },
];

export default function TeamWorkspace() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Team-workspace service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Team Workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Workspaces, members, messages, tasks, files, notifications,
            collaboration analytics, active user counts, real-time updates,
            automation, success rates, and response times are not configured for
            this deployment. No workspace, member, message, task, file, metric,
            or service result is represented as current, complete, verified, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated workspace, member, task, file, or activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a workspace, disclose a member, send
                a message, create a task, invite a user, access a file,
                calculate an activity metric, stream an update, or report that a
                collaboration action succeeded.
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
