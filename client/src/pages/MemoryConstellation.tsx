import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function MemoryConstellation() {
  return (
    <FeatureUnavailable
      title="Memory Constellation is not enabled yet"
      description="Personal memories, skills, goals, relationships, achievements, graph connections, and AI predictions require verified user-owned data, consent, privacy controls, durable storage, explainable inference, and deletion workflows. The current release does not generate or display fictional personal history, relationships, achievements, or predictions."
      capability="Personal memory graph, insights, and predictions"
      nextStep="Review privacy and account settings"
    />
  );
}
