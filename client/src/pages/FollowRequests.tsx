import { UserPlus } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authenticated request and relationship records",
    detail:
      "Server-side services for authenticated follow requests, private-account rules, relationship state, request ownership, pagination, expiration, cancellation, approval, rejection, and history are required before this area can display or modify requests.",
  },
  {
    title: "Authorization, privacy, and abuse controls",
    detail:
      "Visibility checks, consent, blocking, reporting, rate limits, anti-spam controls, moderation, deletion, notifications, and audit trails are required before request actions can be offered as secure or authorized.",
  },
  {
    title: "Verified real-time synchronization",
    detail:
      "A configured authenticated event transport, ordering, reconnect and replay behavior, consistency checks, and failure handling are required before request updates can be represented as current or successful.",
  },
  {
    title: "Evidence-based operational reporting",
    detail:
      "Traceable source data, defined metric semantics, monitoring, integration tests, incident handling, documentation, and support ownership are required before reporting users, transactions, success rates, latency, analytics, automation, or service availability.",
  },
];

export default function FollowRequests() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="Follow Requests"
          icon={UserPlus}
          summary="Authenticated follow requests, privacy controls, request actions, real-time synchronization, analytics, and operational services are not configured for this deployment. No user, request, relationship, transaction, success rate, latency, analytics result, or service status is represented as current, verified, available, or successful."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
