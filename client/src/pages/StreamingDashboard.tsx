import {
  AlertTriangle,
  BarChart3,
  Database,
  RadioTower,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized stream, creator, and audience records",
    icon: Database,
    detail:
      "Authenticated creator ownership, tenant isolation, scoped authorization, durable stream and audience records, safe pagination, deletion and correction workflows, audit logging, clear empty and error states, and source-attributed event handling are required before displaying any stream, creator, viewer, audience, message, event, recording, channel, or media result.",
  },
  {
    title: "Verified media delivery and real-time integration",
    icon: RadioTower,
    detail:
      "Authorized media providers, validated ingest and playback configuration, stream-key protection, delivery-status handling, content and bandwidth controls, chat moderation, abuse prevention, retry and recovery workflows, and evidence-based availability monitoring are required before starting, stopping, delivering, embedding, or reporting a live stream, video, chat, clip, broadcast, or real-time update.",
  },
  {
    title: "Privacy, safety, and access controls",
    icon: ShieldCheck,
    detail:
      "Role-based access, audience and content visibility controls, sensitive-data minimization, secure logging, retention limits, incident response, content-reporting workflows, moderation review, age and jurisdictional controls where applicable, and independently evidenced protections are required before exposing streaming activity or audience information.",
  },
  {
    title: "Evidence-based streaming and operational reporting",
    icon: BarChart3,
    detail:
      "Source-attributed telemetry, documented metric definitions, durable event records, anti-abuse controls, observability, capacity monitoring, performance testing, incident management, and independently verifiable methods are required before reporting viewers, active users, transactions, engagement, uptime, success rates, response times, live data, automation, advanced analytics, or production readiness.",
  },
];

export default function StreamingDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Streaming-dashboard
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Streaming Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Streams, creators, audiences, chat, media controls, monetization,
            analytics, active user counts, transaction totals, live updates,
            automation, success rates, and response times are not configured for
            this deployment. No stream, audience, chat, media record, metric, or
            service result is represented as current, complete, verified, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated stream, viewer, chat, media operation, or real-time
                activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a stream, access media, disclose
                creator or viewer information, deliver a broadcast, send a chat
                message, report audience activity, stream an update, or claim
                that a streaming action succeeded.
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
