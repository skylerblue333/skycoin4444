import FeatureUnavailable from "@/components/FeatureUnavailable";

export function TranslationEnabledSocialFeed() {
  return (
    <FeatureUnavailable
      title="Translated social feed is not enabled yet"
      description="Posts, user identities, language detection, translation output, likes, comments, shares, and real-time social activity require verified feed storage, translation services, moderation, privacy controls, and durable engagement records. The current release does not seed social posts or claim that content was translated, liked, or shared."
      capability="Multilingual social feed, translation, and engagement"
      nextStep="Review the social and AI launch boundaries"
    />
  );
}

export default TranslationEnabledSocialFeed;
