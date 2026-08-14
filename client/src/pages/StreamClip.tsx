import {
  AlertTriangle,
  Database,
  FileVideo,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized media, creator, and viewer records",
    icon: Database,
    detail:
      "Authenticated creator ownership, tenant isolation, scoped authorization, durable media and viewer records, safe pagination, deletion and correction workflows, audit logging, clear empty and error states, and source-attributed event handling are required before displaying any clip, creator, title, thumbnail, viewer, reaction, share, download, stream, or audience result.",
  },
  {
    title: "Verified clip-processing and delivery integration",
    icon: FileVideo,
    detail:
      "Authorized media providers, ownership and source-permission validation, clip-boundary validation, secure processing, content-type controls, storage and playback authorization, transcoding status handling, download restrictions, retry and recovery workflows, and evidence-based availability monitoring are required before creating, processing, sharing, playing, downloading, or reporting a clip or video result.",
  },
  {
    title: "Privacy, safety, and media-governance controls",
    icon: ShieldCheck,
    detail:
      "Content visibility rules, rights-management controls, report and appeal workflows, moderation review, abuse prevention, sensitive-data minimization, secure logging, retention limits, incident response, and independently evidenced protections are required before exposing or distributing media and creator activity.",
  },
  {
    title: "Evidence-based audience and operational reporting",
    icon: UsersRound,
    detail:
      "Source-attributed events, documented metric definitions, durable interaction records, anti-abuse controls, observability, capacity monitoring, performance testing, incident management, and independently verifiable methods are required before reporting views, likes, shares, downloads, engagement, active users, transactions, success rates, response times, real-time updates, automation, or production readiness.",
  },
];

export default function StreamClip() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Stream-clips service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stream Clips
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Clips, creator records, source streams, media processing, playback,
            downloads, sharing, views, reactions, engagement, live updates,
            automation, success rates, and response times are not configured for
            this deployment. No clip, video, creator, audience metric, media
            result, or service result is represented as current, complete,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated clip, video, creator, view, or media action
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access source media, create or process a
                clip, play a video, share or download a file, disclose creator
                information, report a view or reaction, stream an update, or
                claim that a media action succeeded.
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
