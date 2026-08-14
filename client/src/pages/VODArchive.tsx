import {
  AlertTriangle,
  Database,
  PlaySquare,
  ShieldCheck,
  Video,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized recording and media-rights workflow",
    icon: Video,
    detail:
      "Creator authorization, ownership and license verification, consent, content classification, secure upload and processing, media retention rules, rights management, takedown processes, access restrictions, and audit records are required before listing, recording, archiving, sharing, downloading, or presenting a stream, video, replay, creator, category, or media asset.",
  },
  {
    title: "Secure playback and delivery infrastructure",
    icon: PlaySquare,
    detail:
      "Configured media storage, transcode and packaging workflows, authenticated playback controls, content-delivery integration, signed delivery URLs, availability monitoring, bandwidth and error handling, accessibility support, privacy controls, and user-safe failure states are required before representing that a recording, replay, VOD, download, or livestream can be played or delivered.",
  },
  {
    title: "Reliable archive and engagement records",
    icon: Database,
    detail:
      "Durable and authorized archive metadata, source-attributed event records, documented measurement methodology, data-quality validation, deduplication, privacy controls, retention and deletion support, and correction processes are required before showing titles, creators, dates, durations, categories, views, hours of content, archive totals, or other media statistics.",
  },
  {
    title: "Trust, safety, and user-protection controls",
    icon: ShieldCheck,
    detail:
      "Content moderation, reporting and appeal workflows, age-appropriate safeguards where applicable, anti-abuse controls, copyright response procedures, account authorization, security monitoring, incident response, and transparent policies are required before enabling or representing public media discovery, playback, sharing, downloading, or creator engagement.",
  },
];

export default function VODArchive() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Media archive service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            VOD Archive
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Stream recordings, replays, media archives, creators, categories,
            stream metadata, playback, duration, viewer counts, content totals,
            schedules, sharing, downloads, and archive statistics are not
            configured for this deployment. No recording, creator, media asset,
            viewing metric, playback state, download, or archive record is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated VOD, playback, creator, or engagement record
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or host media, record a stream,
                provide playback, count views, expose creator information,
                produce a downloadable file, generate a share link, or report an
                archive activity or delivery outcome.
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
