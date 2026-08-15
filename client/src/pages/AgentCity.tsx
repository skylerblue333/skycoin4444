import { Bot } from "lucide-react";

import { UnavailableService } from "./mission-control/UnavailableService";

export default function AgentCity() {
  return (
    <UnavailableService
      title="Agent City"
      icon={Bot}
      summary="An autonomous agent workforce is not configured for this deployment. No agents, task counts, earnings, efficiency, activity, or free-will metrics are represented as available."
      requirements={[
        { title: "Real agent runtime", detail: "Agent identities, execution state, permissions, tool access, and lifecycle events require a backed runtime." },
        { title: "Task and earnings ledger", detail: "Task completion and earnings require auditable records and settlement controls; no local counters are used." },
        { title: "Safety and governance", detail: "Agent actions require authorization boundaries, human oversight, rate limits, and incident handling." },
      ]}
    />
  );
}
