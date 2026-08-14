import {
  AlertTriangle,
  Database,
  Globe2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized partner profiles and discovery records",
    icon: Users,
    detail:
      "Authenticated profile creation, verified ownership, consented profile fields, accurate language and availability data, server-side search, privacy settings, deletion controls, moderation, and durable audit records are required before listing or ranking language partners.",
  },
  {
    title: "Safe connection, session, and communication workflows",
    icon: Globe2,
    detail:
      "Mutual consent, age-appropriate safeguards, invitation and acceptance workflows, secure direct messaging, verified call-provider integration, session controls, reporting, blocking, moderation, and clear escalation procedures are required before enabling partner connections, messages, or video sessions.",
  },
  {
    title: "Reliable ratings, availability, and matching data",
    icon: Database,
    detail:
      "Transparent methodology, authoritative inputs, rate and review controls, anti-manipulation measures, fairness review, correction and appeal workflows, privacy protections, and authorization checks are required before presenting ratings, completed-session counts, responsiveness, availability, locations, or match results.",
  },
  {
    title: "Privacy and trust safeguards",
    icon: ShieldCheck,
    detail:
      "Data minimization, location and age protections, consent records, identity and access controls, secure media handling, retention policies, abuse prevention, incident response, and published safety policies are required before operating a people-discovery or learning-partner platform.",
  },
];

export default function LanguagePartnerDiscovery() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Language partner service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Language Partner Discovery
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Language partner profiles, searches, rankings, interests,
            proficiency levels, availability, location, age, response times,
            session counts, ratings, favorites, connection requests, messages,
            and video chats are not configured for this deployment. No person,
            profile, availability state, rating, location, match, session,
            message, or call is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated people, profile attributes, relationships, or
                communication availability
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not display an active partner, save a favorite,
                send a connection request, create a learning session, open a
                direct message, initiate a video chat, confirm an age or
                location, or calculate a rating or matching result.
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
