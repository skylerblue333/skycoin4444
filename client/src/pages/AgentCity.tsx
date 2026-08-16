import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AgentCity() {
  return (
    <FeatureUnavailable
      title="Agent City is not enabled yet"
      description="Autonomous agents, task completion, earnings, efficiency, economy health, digital-nation status, and deployment require verified runtimes, execution logs, authorization, budget controls, and auditable settlement. The current release does not fabricate an AI workforce or claim that agents are active, learning, earning, or completing work."
      capability="Autonomous agent workforce, metrics, and deployment"
      nextStep="Review the AI automation launch boundaries"
    />
  );
}
