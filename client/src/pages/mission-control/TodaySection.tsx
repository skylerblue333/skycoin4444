import { CalendarDays } from "lucide-react";

import { UnavailableService } from "./UnavailableService";

export function TodaySection() {
  return (
    <UnavailableService
      title="Today"
      icon={CalendarDays}
      summary="Personal activity summaries, goals, missions, learning records, revenue, AI suggestions, opportunity matches, reputation scores, network suggestions, unread-message counts, and daily planning are not configured for this deployment. No user activity, social relationship, financial value, AI recommendation, reputation measure, or mission state is represented as current, verified, or available."
      requirements={[
        {
          title: "Authenticated persisted planning and activity records",
          detail:
            "Verified ownership, durable server-side goals and missions, activity definitions, time-zone controls, data quality checks, deletion handling, and audit records are required before displaying a daily summary or planning state.",
        },
        {
          title: "Validated AI assistance and safety controls",
          detail:
            "A configured provider, scoped inputs, consent and privacy review, prompt and output safeguards, rate limits, monitoring, human escalation, and clear failure handling are required before generating a personalized suggestion or next-best action.",
        },
        {
          title: "Reliable reputation, opportunity, and network data",
          detail:
            "Transparent methodology, verified inputs, authorization checks, fairness review, correction and appeal processes, anti-manipulation controls, and auditability are required before presenting a match score, reputation value, social connection, or recommendation.",
        },
        {
          title: "Verified financial and communication integrations",
          detail:
            "Authorized financial data sources, reconciled accounting records, secure message access, authorization boundaries, privacy controls, and documented retention policies are required before presenting revenue or unread-message information.",
        },
      ]}
    />
  );
}
