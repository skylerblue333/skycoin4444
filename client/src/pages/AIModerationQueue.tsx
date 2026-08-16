import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AIModerationQueue() {
  return (
    <FeatureUnavailable
      title="AI Moderation Queue is not enabled yet"
      description="AI flags, moderation accuracy, automated removals, report resolution, content decisions, and queue status require validated models, human review, appeal handling, policy versioning, audit trails, redaction, and server-enforced authorization. The current release does not claim that content was flagged, approved, removed, or resolved."
      capability="AI moderation, trust and safety review, appeals, and enforcement"
      nextStep="Explore the launch hub"
    />
  );
}
