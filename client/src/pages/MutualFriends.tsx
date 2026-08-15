import {
  AlertTriangle,
  Database,
  FileCheck2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated social-graph and relationship records",
    icon: Users,
    detail:
      "Authenticated account ownership, tenant isolation, durable user and relationship records, validated relationship states, privacy and block controls, account-status checks, authorization boundaries, duplicate prevention, defined empty states, and clear error recovery are required before displaying, creating, removing, recommending, or reporting a friendship, connection, mutual relationship, profile relationship, social graph, user relationship, or activity result.",
  },
  {
    title: "Privacy-preserving graph queries and account safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, privacy-aware query rules, consent and visibility controls, protected administrative actions, input validation, secure audit logging, sensitive-data minimization, abuse protections, retention limits, incident response, and independently evidenced controls are required before exposing or operating relationship, social-graph, account, activity, profile, identity, or other sensitive information.",
  },
  {
    title: "Authorized activity and notification integrations",
    icon: Database,
    detail:
      "Authorized activity, messaging, notification, search, or recommendation integration; documented data coverage; validated recipient and channel settings; durable event records; delivery and failure handling; source attribution; and independently verifiable provider status are required before generating, sending, retrieving, or reporting relationship activity, alerts, messages, recommendations, live updates, or related account outcomes.",
  },
  {
    title: "Evidence-based analytics and operational reporting",
    icon: FileCheck2,
    detail:
      "Verified service integrations, documented metric definitions, durable telemetry, source attribution, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, insights, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function MutualFriends() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Mutual-friends service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Mutual Friends
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Social-graph records, friendships, connections, mutual
            relationships, relationship activity, profile data, live updates,
            analytics, insights, automation, active user counts, transaction
            totals, success rates, and response times are not configured for
            this deployment. No relationship, social graph, account, activity,
            metric, or service result is represented as current, complete,
            verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated social graph, relationship, activity, or account
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or change a friendship or
                connection, query mutual relationships, access a profile or
                account record, record relationship activity, deliver an alert
                or message, trigger automation, or report that a social
                operation succeeded.
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
