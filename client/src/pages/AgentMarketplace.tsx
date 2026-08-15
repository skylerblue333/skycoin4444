import { Bot } from "lucide-react";

import { UnavailableService } from "./mission-control/UnavailableService";

export default function AgentMarketplace() {
  return (
    <UnavailableService
      title="Agent Marketplace"
      icon={Bot}
      summary="An AI-agent catalog and deployment service is not configured for this deployment. No agent inventory, ratings, deployments, conversations, or availability counts are represented as real."
      requirements={[
        { title: "Agent registry", detail: "Agent definitions, versions, ownership, capabilities, and lifecycle state require a persisted registry." },
        { title: "Deployment runtime", detail: "Deployment requires sandboxing, permission boundaries, observability, rollback, and resource controls." },
        { title: "Verified evaluation", detail: "Ratings and performance require real usage evidence and must not be generated from local formulas." },
      ]}
    />
  );
}
