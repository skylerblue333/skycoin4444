import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function SituationRoom() {
  return (
    <FeatureUnavailable
      title="Situation Room is not enabled yet"
      description="Platform health scores, economy status, governance activity, threat levels, citizen counts, AI recommendations, and command actions require verified observability, access control, incident ownership, redacted telemetry, and tested operational runbooks. The current release does not present simulated or unverified intelligence as live production status."
      capability="Operational command center, observability, and incident intelligence"
      nextStep="Explore the launch hub"
    />
  );
}
