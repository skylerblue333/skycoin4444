import {
  Activity,
  AlertTriangle,
  Database,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated media catalog and creator records",
    icon: Database,
    detail:
      "Authorized creator accounts, durable media records, ownership verification, secure media storage, validated metadata, visibility controls, content lifecycle rules, deletion and correction workflows, audit logging, and tenant isolation are required before displaying a video, reel, creator, title, thumbnail, category, tag, search result, bookmark, follow state, or content library.",
  },
  {
    title: "Safe uploads, playback, and interaction controls",
    icon: ShieldCheck,
    detail:
      "Authenticated upload and playback authorization, file validation, malware scanning, storage and delivery protections, content moderation, copyright handling, privacy controls, rate limits, durable interaction records, abuse prevention, error recovery, and support escalation are required before accepting media, playing a video, following a creator, liking, commenting, sharing, or saving content.",
  },
  {
    title: "Verified live-stream and audience data",
    icon: Radio,
    detail:
      "Authorized streaming integrations, live-session records, source-attributed viewer measurement, timestamp and freshness controls, privacy safeguards, anti-bot protections, documented audience definitions, reconciliation, and independent verification are required before labeling content live, showing a stream, naming a broadcaster, reporting viewer counts, or presenting live status.",
  },
  {
    title: "Evidence-based discovery and analytics reporting",
    icon: Activity,
    detail:
      "Documented ranking methodology, source-attributed engagement events, data-quality monitoring, metric definitions, content-safety controls, secure error handling, observability, and independently evidenced measurements are required before reporting views, likes, comments, trends, popularity, search relevance, engagement, transactions, performance, or financial-content claims.",
  },
];

export default function VideoArea() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Video discovery service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            SKY VIDEO
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Video and reel feeds, creator profiles, titles, thumbnails, search
            results, uploads, playback, likes, comments, follows, bookmarks,
            live streams, viewer counts, trend rankings, engagement metrics, and
            financial or market content are not configured for this deployment.
            No media, creator, viewer, content interaction, stream, audience
            measurement, ranking, market statement, or service result is
            represented as current, verified, available, or successful.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated video, reel, creator, upload, live stream, audience
                metric, interaction, or trend
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or play media, display a verified
                creator, accept a file, create an interaction, join a live
                stream, report a viewer count, calculate engagement, rank
                content, or report that a media action succeeded.
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
