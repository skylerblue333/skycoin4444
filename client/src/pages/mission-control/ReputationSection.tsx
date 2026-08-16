import FeatureUnavailable from "@/components/FeatureUnavailable";

export function ReputationSection() {
  return (
    <FeatureUnavailable
      title="Reputation intelligence is not enabled yet"
      description="Reputation scores, category breakdowns, trust values, leaderboards, member rankings, and recomputation require verified activity provenance, anti-gaming controls, privacy policy, explainability, and durable persistence. The current release does not claim that a score was calculated or that a member ranking is authoritative."
      capability="Reputation scoring, rankings, and social trust intelligence"
      nextStep="Return to the launch hub"
    />
  );
}
