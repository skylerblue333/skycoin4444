import {
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated participants and scheduling workflow",
    icon: CalendarClock,
    detail:
      "Verified participant records, consent, availability controls, time-zone handling, secure scheduling, notification preferences, cancellation and rescheduling rules, access checks, moderation, reporting, and durable session records are required before displaying or creating a language partner, practice session, appointment, attendance state, calendar event, or session history.",
  },
  {
    title: "Responsible learning records and assessment",
    icon: BookOpenCheck,
    detail:
      "Documented learning methodology, authorized curriculum and resource rights, source-attributed progress data, assessment validity, learner privacy, accessibility review, correction mechanisms, instructor or reviewer governance where applicable, and clear limitations are required before showing proficiency, skill level, vocabulary, hours, streaks, ratings, notes, progress, or learning outcomes.",
  },
  {
    title: "Verified rewards and achievement mechanics",
    icon: BadgeCheck,
    detail:
      "Authenticated completion events, eligibility rules, anti-abuse safeguards, durable reward records, reconciliation, clear reward terms, privacy controls, auditability, and dispute handling are required before granting or reporting XP, achievements, completion credit, streaks, badges, or any other reward or performance result.",
  },
  {
    title: "Safety, privacy, and community protections",
    icon: ShieldCheck,
    detail:
      "Participant consent, age-appropriate safeguards where applicable, privacy-by-design controls, content moderation, harassment reporting, human escalation, secure communications, retention controls, incident response, and transparent platform policies are required before enabling or representing peer-learning interaction.",
  },
];

export default function PracticeSessions() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Practice-session service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Practice Sessions
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Language partners, practice topics, scheduling, session
            availability, participant profiles, resources, proficiency levels,
            vocabulary, hours, streaks, attendance, session completion, ratings,
            notes, histories, and XP rewards are not configured for this
            deployment. No practice opportunity, participant, session, learning
            record, progress metric, rating, or reward is represented as
            current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated partner, session, completion, or learning result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not match a learner, create or cancel a session,
                reserve a time, access a learning resource, record attendance,
                calculate proficiency, award XP, create a rating, or represent
                that any educational activity has been completed.
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
