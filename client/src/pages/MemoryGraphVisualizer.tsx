import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function MemoryGraphVisualizer() {
  return (
    <FeatureUnavailable
      title="Memory graph visualization is not enabled yet"
      description="Personal memory nodes, relationships, knowledge clusters, insight scores, descriptions, and graph visualizations require explicit consent, verified user-owned data, privacy controls, explainable processing, and durable storage. The current release does not fabricate memories, connections, strengths, or personal-data insights."
      capability="Personal memory graph, clusters, and relationship insights"
      nextStep="Review the privacy and AI launch boundaries"
    />
  );
}
