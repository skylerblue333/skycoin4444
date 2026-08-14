import {
  AlertTriangle,
  Camera,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated story publishing and media storage",
    icon: Camera,
    detail:
      "Authenticated authorship, validated media uploads, content-size and type controls, secure storage, expiration jobs, deletion controls, and reliable error handling are required before publishing or displaying a story.",
  },
  {
    title: "Social engagement and audience records",
    icon: UsersRound,
    detail:
      "Persisted viewer, reaction, reply, sharing, following, and live-status records with authorization checks, rate limits, anti-spam controls, and consistent read/write contracts are required before presenting social activity or counts.",
  },
  {
    title: "Age assurance and content safety controls",
    icon: ShieldCheck,
    detail:
      "Appropriate age-assurance measures, content classification, access controls, consent, reporting, moderation, parental or regional safeguards where applicable, and documented enforcement are required before making mature content available.",
  },
  {
    title: "Feed ranking and lifecycle operations",
    icon: Database,
    detail:
      "Reliable feed queries, privacy-aware visibility rules, audience selection, delivery and retention policies, observability, abuse monitoring, and support processes are required before ranking, expiring, or distributing stories.",
  },
];

export default function Stories() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Stories service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stories
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Story publishing, media uploads, live status, viewer counts,
            reactions, replies, sharing, audience controls, following feeds,
            trending labels, mature-content access, and automatic expiry are not
            configured for this deployment. No story, social activity,
            engagement count, age status, or audience relationship is
            represented as published, current, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated stories, social metrics, or age-gated content
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not use demonstration accounts, placeholder view
                counts, fabricated reactions, simulated live activity,
                browser-only age assertions, fake mature-content access, or
                unverified social-media data.
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
