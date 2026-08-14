import {
  AlertTriangle,
  BadgeCheck,
  FileVideo,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Secure media upload and storage",
    icon: UploadCloud,
    detail:
      "Authenticated upload authorization, file-type and content validation, malware scanning, size and rate limits, encrypted storage, object ownership controls, retention policies, deletion workflows, access logging, and safe error handling are required before accepting or storing video, audio, thumbnails, or other media.",
  },
  {
    title: "Verified media processing and publishing",
    icon: FileVideo,
    detail:
      "A configured processing pipeline, verified transcoding, duration and format validation, reliable job states, thumbnail generation, content lifecycle controls, durable publishing records, retry handling, observability, and availability monitoring are required before representing a reel as uploaded, processed, or published.",
  },
  {
    title: "Content safety, rights, and distribution controls",
    icon: ShieldCheck,
    detail:
      "Moderation workflows, reporting and appeals, rights and licensing controls, music and audio permissions, community rules, privacy controls, audience restrictions, age-appropriate safeguards, abuse prevention, and human escalation are required before distributing creator media, effects, captions, hashtags, or audio tracks.",
  },
  {
    title: "Subscription and premium-content authorization",
    icon: BadgeCheck,
    detail:
      "A configured payment or entitlement provider, verified subscription states, access enforcement, refund and support processes, financial reconciliation, legal review, and auditability are required before offering, labeling, or restricting premium content.",
  },
];

export default function CreateReel() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Reel publishing
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Reel
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Video uploads, previews, captions, hashtags, durations, audio,
            effects, premium content, processing, publishing, distribution, and
            creator-media access controls are not configured for this
            deployment. No media file, reel, thumbnail, audience entitlement, or
            publishing outcome is represented as current, verified, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated uploads or publishing success
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not accept a file, produce a media preview,
                process video or audio, create an effect, publish a reel,
                distribute content, grant premium access, or represent an upload
                as stored, scanned, authorized, or successful.
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
