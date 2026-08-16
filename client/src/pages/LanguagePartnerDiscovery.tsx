import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function LanguagePartnerDiscovery() {
  return (
    <FeatureUnavailable
      title="Language Partner Discovery is not enabled yet"
      description="Partner profiles, language proficiency, ratings, locations, session history, availability, favorites, messaging, video calls, and connection requests require verified user consent, identity safeguards, moderation, durable social persistence, and communication providers. The current release does not ship mock people or claim that a connection or session was created."
      capability="Language exchange matching, social profiles, messaging, and video sessions"
      nextStep="Explore the launch hub"
    />
  );
}
