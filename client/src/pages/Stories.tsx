import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Stories() {
  return (
    <FeatureUnavailable
      title="Stories are not enabled yet"
      description="Creator stories, live status, media uploads, view counts, reactions, replies, subscriptions, and age-gated content require verified media storage, moderation, consent, retention, age assurance, abuse prevention, and durable social persistence. The current release does not show demo accounts or claim that content was posted, viewed, reacted to, or delivered."
      capability="Stories, live media, creator engagement, and age-gated content"
      nextStep="Explore the launch hub"
    />
  );
}
