import {
  AlertTriangle,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Age assurance and account eligibility",
    icon: UserRoundCheck,
    detail:
      "Age-assurance controls, jurisdiction-aware eligibility rules, consent records, verified account state, privacy notices, reporting paths, secure enforcement, and appropriate safeguards are required before allowing dating discovery, matching, or communication features.",
  },
  {
    title: "Consent-based matching and profile controls",
    icon: HeartHandshake,
    detail:
      "Persisted profiles, affirmative user consent, compatibility methodology disclosures, authenticated matching actions, block and report controls, removal workflows, data minimization, audit logging, abuse prevention, and authorization checks are required before showing or creating matches, likes, preferences, or profile information.",
  },
  {
    title: "Private messaging and media safety",
    icon: MessageCircle,
    detail:
      "Authenticated messaging, recipient authorization, durable delivery records, secure content handling, rate limits, spam controls, media scanning, moderation workflows, user safety tooling, retention policies, and incident response are required before sending or displaying dating messages or media.",
  },
  {
    title: "Safety operations and support readiness",
    icon: ShieldCheck,
    detail:
      "Trust-and-safety staffing, clear community rules, timely reporting and response channels, escalation procedures, abuse monitoring, lawful data handling, account enforcement, and operational review are required before representing the service as available.",
  },
];

export default function DatingMatches() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Dating service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dating Matches
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Dating profiles, age information, matching, likes, compatibility,
            messaging, media messages, notifications, and relationship activity
            are not configured for this deployment. No person, profile, match,
            communication, or account eligibility state is represented as
            current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated matches or messages
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or publish a profile, infer age or
                eligibility, create a match or preference, send a message or
                notification, accept media, represent consent, or indicate that
                an individual is available for communication.
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
