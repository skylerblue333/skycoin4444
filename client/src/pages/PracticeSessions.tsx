import FeatureUnavailable from "@/components/FeatureUnavailable";

export function PracticeSessions() {
  return (
    <FeatureUnavailable
      title="Practice Sessions are not enabled yet"
      description="Live language partners, scheduling, session history, proficiency metrics, XP rewards, ratings, and completion records require verified identity, presence, moderation, scheduling, persistence, and learning-assessment services. The current release does not show mock partners or claim that a practice session, progress record, or reward exists."
      capability="Live language practice, scheduling, progress, and rewards"
      nextStep="Explore the education hub"
    />
  );
}

export default PracticeSessions;
