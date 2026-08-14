import {
  AlertTriangle,
  Clapperboard,
  Database,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Secure media ingestion and delivery",
    icon: UploadCloud,
    detail:
      "Authorized upload endpoints, file-type and content validation, malware scanning, transcoding, storage isolation, signed delivery URLs, rights controls, retention policies, deletion workflows, bandwidth controls, and observability are required before receiving, processing, hosting, playing, or presenting a video or audio asset.",
  },
  {
    title: "Authenticated creator and content records",
    icon: Database,
    detail:
      "Persisted creator identities, ownership checks, content metadata, visibility rules, publication state, authorization, privacy safeguards, correction mechanisms, and auditable moderation records are required before showing a creator, reel, caption, audio track, thumbnail, duration, or other content record.",
  },
  {
    title: "Verified engagement and distribution controls",
    icon: Clapperboard,
    detail:
      "Authenticated interaction records, idempotency, rate limits, anti-abuse safeguards, durable save and share records, privacy controls, recommendation methodology, source-attributed analytics, and moderation are required before recording or displaying views, likes, comments, shares, bookmarks, trends, or personalized distribution.",
  },
  {
    title: "Safety, rights, and community governance",
    icon: ShieldCheck,
    detail:
      "Clear platform rules, age and consent controls where applicable, rights-management procedures, human review, reporting and appeals, content classification, privacy protection, enforcement documentation, legal review, and incident response are required before publishing or recommending user-generated media.",
  },
];

export default function Reels() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Short-form media service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Reels
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Short-form video feeds, playback, creator profiles, media uploads,
            thumbnails, captions, audio tracks, views, likes, comments, sharing,
            saves, trends, rankings, and recommendations are not configured for
            this deployment. No media asset, creator record, engagement result,
            social metric, feed position, or publication state is represented as
            current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated media, social engagement, or creator activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not upload, process, stream, publish, or
                recommend media; attribute content to a creator; record a view,
                like, comment, share, or save; or report a social or trending
                metric.
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
