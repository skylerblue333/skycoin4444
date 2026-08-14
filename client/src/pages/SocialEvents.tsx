import {
  AlertTriangle,
  CalendarDays,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized event, host, and attendance records",
    icon: Database,
    detail:
      "Authenticated host ownership, tenant isolation, scoped authorization, durable event and attendance records, visibility controls, time-zone handling, safe pagination, deletion and correction workflows, audit logging, and clear empty and error states are required before displaying any event, host, venue, attendee, invitation, RSVP, waitlist, schedule, reminder, or attendance result.",
  },
  {
    title: "Verified event, ticketing, and notification integration",
    icon: CalendarDays,
    detail:
      "Authorized event and ticketing providers, server-side payment and webhook verification where applicable, validated capacity controls, idempotent registration handling, calendar and reminder delivery-status handling, cancellation workflows, refund controls where applicable, retry and recovery workflows, and evidence-based availability monitoring are required before creating, changing, registering for, canceling, ticketing, reminding about, or reporting an event result.",
  },
  {
    title: "Privacy, safety, and access controls",
    icon: ShieldCheck,
    detail:
      "Visibility and consent enforcement, venue and attendee privacy controls, secure logging, retention limits, incident response, abuse prevention, moderation review, access reviews, age and jurisdictional controls where applicable, and independently evidenced safeguards are required before exposing or managing event, host, attendee, payment, or communication information.",
  },
  {
    title: "Evidence-based event and operational reporting",
    icon: UsersRound,
    detail:
      "Source-attributed event and interaction records, documented metric definitions, capacity and attendance reconciliation, anti-abuse controls, observability, performance testing, incident management, and independently verifiable methods are required before reporting attendance, active users, transactions, success rates, response times, live updates, automation, advanced analytics, popularity, or production readiness.",
  },
];

export default function SocialEvents() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Social-events service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Social Events
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Events, hosts, venues, attendees, tickets, invitations, RSVP
            records, reminders, attendance metrics, active user counts,
            transaction totals, live updates, automation, success rates, and
            response times are not configured for this deployment. No event,
            host, attendee, ticket, attendance metric, or service result is
            represented as current, complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated event, attendance, ticket, or reminder
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or create an event, disclose host or
                attendee information, register an attendee, issue a ticket, send
                a reminder, calculate attendance, stream an update, or report
                that an event action succeeded.
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
