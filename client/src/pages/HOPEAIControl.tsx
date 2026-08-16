import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function HOPEAIControl() {
  return (
    <FeatureUnavailable
      title="HOPE AI Control is not enabled yet"
      description="AI agents, task counts, load metrics, moderation or safety controls, deployment state, simulation telemetry, and restart actions require verified model runtimes, operator authorization, observability, policy enforcement, evaluation evidence, and incident controls. The current release does not claim that an agent ran, monitored, moderated, deployed, or completed work."
      capability="AI agent operations, safety controls, and deployment telemetry"
      nextStep="Review the AI and infrastructure launch boundaries"
    />
  );
}
