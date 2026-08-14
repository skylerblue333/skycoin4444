import {
  AlertTriangle,
  Database,
  FileCheck2,
  List,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated playlist and media records",
    icon: List,
    detail:
      "Authenticated ownership, tenant isolation, validated playlist and media-item records, durable ordering, access controls, permission checks, input validation, duplicate prevention, conflict handling, audit history, defined empty states, and clear error recovery are required before creating, changing, sharing, deleting, or reporting a playlist, media item, or playlist-management result.",
  },
  {
    title: "Authorized media and content-provider integration",
    icon: Database,
    detail:
      "Authorized provider integration, documented media coverage, validated identifiers, availability and rights checks, source attribution, metadata validation, stale-data handling, error recovery, and independently verifiable provider status are required before displaying, searching, adding, playing, recommending, or reporting an external media or content result.",
  },
  {
    title: "Privacy, authorization, and content-safety controls",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, secure handling of account and preference data, consent-aware sharing, content policy controls, moderation and reporting workflows where applicable, access reviews, secure audit logging, retention limits, incident response, and independently evidenced safeguards are required before exposing user, playlist, media, preference, sharing, or activity information.",
  },
  {
    title: "Evidence-based operations and activity reporting",
    icon: FileCheck2,
    detail:
      "Verified service integrations, documented metric definitions, durable telemetry, source attribution, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting live data, real-time updates, analytics, insights, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function PlaylistManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Playlist-management
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Playlist Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Playlist records, media catalogs, content availability, user
            activity, live updates, analytics, insights, automation, active user
            counts, transaction totals, success rates, and response times are
            not configured for this deployment. No playlist, media item,
            activity, metric, or service result is represented as current,
            complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated playlist, media, activity, or automation result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or change a playlist, access a media
                catalog, add or remove media, play content, record activity,
                stream an update, create an insight, trigger automation, or
                report that a content-management operation succeeded.
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
