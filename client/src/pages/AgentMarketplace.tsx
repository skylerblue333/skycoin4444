import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AgentMarketplace() {
  return (
    <FeatureUnavailable
      title="Agent Marketplace is not enabled yet"
      description="Agent catalogs, capabilities, ratings, availability, chat sessions, deployment, and active state require verified agent runtimes, model and tool contracts, execution authorization, cost controls, audit logs, and durable deployment records. The current release does not fabricate agents or claim that one was deployed or ran."
      capability="AI agent catalog, chat, deployment, and orchestration"
      nextStep="Review the AI automation launch boundaries"
    />
  );
}
