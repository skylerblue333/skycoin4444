import { Trophy } from "lucide-react";

import { UnavailableService } from "./UnavailableService";

export function ReputationSection() {
  return (
    <UnavailableService
      title="Reputation and Trust"
      icon={Trophy}
      summary="Reputation scores, trust signals, activity calculations, rankings, and leaderboards are not configured for this deployment. No user score, badge, rank, relationship, or comparative standing is represented as live platform data."
      requirements={[
        {
          title: "Documented scoring model",
          detail:
            "A published calculation model, complete event definitions, validation rules, appeal process, bias review, and ongoing evaluation are required before assigning a reputation score.",
        },
        {
          title: "Authorized data collection",
          detail:
            "Consent-aware activity data, data minimization, privacy settings, retention limits, and secure aggregation are required before using user behavior in a reputation system.",
        },
        {
          title: "Ranking fairness and integrity",
          detail:
            "Anti-gaming controls, duplicate detection, identity handling, fraud review, transparency, and governance are required before publishing a ranking or leaderboard.",
        },
        {
          title: "Correction and support workflow",
          detail:
            "User review rights, correction mechanisms, support handling, audit logs, and rollback procedures are required before users can rely on reputation outcomes.",
        },
      ]}
    />
  );
}
