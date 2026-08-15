import { CalendarDays } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authoritative event and organizer records",
    detail:
      "Server-side services for event creation, ownership, dates, time zones, capacity, hosts, descriptions, categories, tags, publication, cancellation, and moderation are required before events can be listed or planned.",
  },
  {
    title: "Authenticated RSVP and attendance controls",
    detail:
      "Authenticated RSVP persistence, authorization, duplicate prevention, capacity enforcement, waitlists, cancellation, notifications, privacy controls, and auditable attendance records are required before RSVP or attendance actions can be offered.",
  },
  {
    title: "Verified financial, prize, and partner disclosures",
    detail:
      "Documented sponsors and partners, prize funding, token or staking terms, payment and tax treatment, eligibility, legal disclosures, and settlement records are required before describing giveaways, prize pools, staking bonuses, monetization, or donation outcomes.",
  },
  {
    title: "Evidence-based event operations",
    detail:
      "Traceable attendee data, capacity semantics, time synchronization, streaming or venue integrations, monitoring, incident handling, accessibility, documentation, and support procedures are required before reporting featured status, attendance, capacity, fullness, or event availability.",
  },
];

export default function Events() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="Events"
          icon={CalendarDays}
          summary="Event listings, planning, RSVP, attendance, capacity, streaming, organizers, prizes, giveaways, staking bonuses, monetization, and partner services are not configured for this deployment. No event, date, attendee count, capacity, RSVP, prize, token, financial, partner, or operational status is represented as current, verified, available, eligible, or successful."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
