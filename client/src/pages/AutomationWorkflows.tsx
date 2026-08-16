import UnavailableFeature from "@/components/UnavailableFeature";

export default function AutomationWorkflows() {
  return (
    <UnavailableFeature
      name="Automation Workflows"
      reason="The former route presented static workflow counts, success rates, wallet top-up triggers, staking rewards, AI moderation, fraud freezes, and other automation actions without verified event orchestration, persistence, authorization, or execution evidence. It is gated until workflow execution is production-backed and auditable."
    />
  );
}
