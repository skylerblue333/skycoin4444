import FeatureUnavailable from "@/components/FeatureUnavailable";

export function TodaySection() {
  return (
    <FeatureUnavailable
      title="Daily Mission Control is not enabled yet"
      description="Goals, missions, learning activity, unread messages, communities, revenue, AI suggestions, opportunity matches, reputation scores, and network recommendations require verified user-owned persistence, consent, explainability, privacy controls, and authoritative analytics. The current release does not claim that a daily plan was assembled or that a recommendation is personalized and actionable."
      capability="Personalized daily planning, recommendations, reputation, and network intelligence"
      nextStep="Explore the launch hub"
    />
  );
}
