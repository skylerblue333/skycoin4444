import {
  AlertTriangle,
  Database,
  MessageSquareWarning,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized content, author, and audience records",
    icon: Database,
    detail:
      "Authenticated account ownership, tenant isolation, scoped authorization, durable post and author records, visibility controls, safe pagination, deletion and correction workflows, audit logging, source attribution, and clear empty and error states are required before displaying any post, author, profile, reply, reaction, follower, community, notification, feed, or audience result.",
  },
  {
    title: "Verified feed, interaction, and notification integration",
    icon: UsersRound,
    detail:
      "Authorized data providers, validated content and interaction inputs, documented ranking and filtering behavior, interaction idempotency, delivery-status handling, retry and recovery workflows, anti-spam controls, and evidence-based availability monitoring are required before publishing, retrieving, ranking, liking, replying to, sharing, notifying about, or reporting a social-feed result.",
  },
  {
    title: "Privacy, moderation, and safety controls",
    icon: ShieldCheck,
    detail:
      "Visibility and consent enforcement, content moderation, report and appeal workflows, abuse prevention, sensitive-data minimization, secure logging, retention limits, incident response, access reviews, and independently evidenced safeguards are required before exposing identity, content, social activity, audience, or notification information.",
  },
  {
    title: "Evidence-based engagement and operational reporting",
    icon: MessageSquareWarning,
    detail:
      "Source-attributed interaction events, documented metric definitions, durable activity records, anti-abuse controls, observability, capacity monitoring, performance testing, incident management, and independently verifiable methods are required before reporting engagement, active users, transactions, success rates, response times, live updates, automation, advanced analytics, popularity, or production readiness.",
  },
];

export default function SocialFeed() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Social-feed service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Social Feed
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Posts, profiles, comments, reactions, follower relationships,
            notifications, audience activity, analytics, active user counts,
            transaction totals, live updates, automation, success rates, and
            response times are not configured for this deployment. No social
            record, engagement result, audience metric, notification, or service
            result is represented as current, complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated post, identity, engagement, or real-time activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or publish a post, disclose profile
                information, create an interaction, send a notification,
                calculate an engagement metric, stream an update, or report that
                a social action succeeded.
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
