import { Target } from "lucide-react";

import { UnavailableService } from "./UnavailableService";

export function MissionsSection() {
  return (
    <UnavailableService
      title="Mission Planning"
      icon={Target}
      summary="Mission creation, assignment, completion tracking, reward calculation, and automated progress are not configured for this deployment. No mission, task, reward, streak, or completion outcome is represented as live platform data."
      requirements={[
        {
          title: "Mission data model",
          detail:
            "Authenticated mission creation, assignment rules, ownership, completion evidence, audit history, and lifecycle controls are required before presenting mission records or task states.",
        },
        {
          title: "Progress and reward integrity",
          detail:
            "Server-side progress rules, event validation, duplicate-submission protections, reward accounting, and reconciliation are required before reporting progress or issuing rewards.",
        },
        {
          title: "Authorization and moderation",
          detail:
            "Role-based permissions, content review, participant privacy, dispute handling, and administrative controls are required before allowing mission collaboration.",
        },
        {
          title: "Operational visibility",
          detail:
            "Defined notification rules, retry behavior, error reporting, and support workflows are required before users can rely on a mission workflow.",
        },
      ]}
    />
  );
}
