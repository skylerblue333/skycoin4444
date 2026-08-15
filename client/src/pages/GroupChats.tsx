import { MessageSquare } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authenticated group, membership, and message services",
    detail:
      "Server-side services for authenticated group creation, membership, roles, invitations, message persistence, pagination, unread state, delivery, edits, deletion, attachments, and synchronization are required before this area can display or modify group conversations.",
  },
  {
    title: "Authorization, moderation, and abuse controls",
    detail:
      "Ownership and membership checks, role-based permissions, blocking, reporting, moderation, rate limits, spam prevention, content handling, audit trails, and privacy controls are required before group actions can be offered as secure or authorized.",
  },
  {
    title: "Verifiable real-time delivery and recovery",
    detail:
      "A configured transport, connection authentication, delivery acknowledgements, ordering semantics, reconnect and replay behavior, failure handling, and monitoring are required before real-time updates or message delivery can be represented as available or successful.",
  },
  {
    title: "Operational evidence and support procedures",
    detail:
      "Traceable source data, defined service-level metrics, integration tests, incident handling, data export and deletion procedures, documentation, and support ownership are required before reporting users, messages, transactions, success rates, latency, uptime, analytics, or automation outcomes.",
  },
];

export default function GroupChats() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="Group Chats"
          icon={MessageSquare}
          summary="Authenticated group membership, messaging, real-time delivery, moderation, attachments, analytics, and operational services are not configured for this deployment. No conversation, user, message, transaction, success-rate, latency, or integration status is represented as current, complete, verified, available, or successful."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
