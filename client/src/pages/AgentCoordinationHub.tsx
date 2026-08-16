import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AgentCoordinationHub() {
  return (
    <FeatureUnavailable
      title="Agent Coordination Hub is not enabled yet"
      description="Autonomous agent teams, workflow execution, task delegation, sprint history, generated code, commits, market monitoring, security scans, and completion counts require verified agent runtimes, permissions, queues, sandboxing, observability, approvals, and rollback controls. The current release does not show fictional bots or claim that an agent, workflow, sprint, or delegated task ran successfully."
      capability="Autonomous agents, workflow orchestration, and delegated execution"
      nextStep="Explore the AI launch boundaries"
    />
  );
}
