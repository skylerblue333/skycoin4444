import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function NotificationIntelligence() {
  return (
    <FeatureUnavailable
      title="Notification Intelligence is not enabled yet"
      description="Notification delivery, read state, AI prioritization, batching, summaries, and analytics require a verified event pipeline, durable storage, delivery providers, user preferences, privacy controls, and observability. The current release does not claim that notifications were delivered, read, summarized, or scored."
      capability="Notification delivery, prioritization, and engagement analytics"
      nextStep="Explore the launch hub"
    />
  );
}
