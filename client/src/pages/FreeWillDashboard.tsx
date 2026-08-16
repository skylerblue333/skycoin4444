import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function FreeWillDashboard() {
  return (
    <FeatureUnavailable
      title="Autonomous Intelligence Controls are not enabled yet"
      description="Autonomous goals, decisions, self-optimization, behavioral archetypes, memory graphs, governance scores, and platform analytics require explicit consent, explainability, human override, privacy safeguards, audit logs, and verified telemetry. The current release does not profile users, make autonomous decisions, or claim that an AI outcome occurred."
      capability="Autonomous AI, behavioral profiling, memory, and decision intelligence"
      nextStep="Explore the launch hub"
    />
  );
}
