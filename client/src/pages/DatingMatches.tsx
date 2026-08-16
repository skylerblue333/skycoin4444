import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function DatingMatches() {
  return (
    <FeatureUnavailable
      title="Dating Matches are not enabled yet"
      description="Dating profiles, age information, matching, mutual-interest status, notifications, conversations, and message delivery require verified age assurance, consent, abuse prevention, privacy controls, moderation, and durable communication infrastructure. The current release does not present synthetic matches or claim that a message was delivered."
      capability="Dating discovery, mutual matching, notifications, and messaging"
      nextStep="Explore the launch hub"
    />
  );
}
