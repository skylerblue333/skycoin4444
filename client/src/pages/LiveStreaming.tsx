import {
  AlertTriangle,
  Database,
  FileCheck2,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated media-ingest and delivery infrastructure",
    icon: Radio,
    detail:
      "A documented media-ingest, transcoding, storage, CDN or delivery, playback, and session architecture with authenticated ownership, stream-key protection, codec and format validation, capacity limits, content handling, retention policies, failure recovery, and tested end-to-end delivery is required before representing a live stream, broadcast, recording, playback session, media asset, viewer connection, or delivery result as active, available, or successful.",
  },
  {
    title: "Validated viewer, interaction, and media-data services",
    icon: Database,
    detail:
      "Authenticated and tenant-scoped viewer, chat, reaction, moderation, creator, media, transaction, and event services with documented schemas, source provenance, ordering and delivery semantics, anti-abuse controls, privacy handling, retention rules, and reconciliation are required before retrieving, sending, displaying, counting, or reporting a viewer, message, reaction, creator, event, media item, transaction, or interaction.",
  },
  {
    title: "Security, privacy, moderation, and broadcast controls",
    icon: ShieldCheck,
    detail:
      "Authorization boundaries, secure secret and stream-key handling, encrypted transport, rate limits, abuse prevention, content moderation, privacy controls, access and export auditing, incident response, takedown procedures, and evidence that controls operate as designed are required before representing a stream, broadcast, chat, interaction, user action, automation, integration, or media result as safe, protected, available, or successfully processed.",
  },
  {
    title: "Evidence-based streaming operations and reporting",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, monitoring, alerting, playback and ingest testing, capacity evidence, latency and error measurement, operational objectives, retry and degradation behavior, support procedures, and independently verifiable records are required before reporting active users, viewers, transactions, success rates, response times, stream health, engagement, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function LiveStreaming() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Live streaming service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Live Streaming
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Media ingest, transcoding, storage, delivery, playback, viewer
            connections, chat, reactions, moderation, analytics, automation,
            integrations, transactions, operational metrics, and support
            documentation are not configured for this deployment. No stream,
            broadcast, recording, viewer, interaction, media item, transaction,
            metric, or service status is represented as current, complete,
            verified, active, healthy, available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated stream, viewer, or media result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not ingest, transcode, store, deliver, play,
                broadcast, connect viewers, send chat, process reactions,
                moderate content, count activity, process transactions, apply
                automation, or report streaming, engagement, performance, or
                operational outcomes. It does not claim that a live-streaming
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
