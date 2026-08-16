import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AmbientFeed() {
  return (
    <FeatureUnavailable
      title="Ambient Feed is not enabled yet"
      description="Social posts, authors, likes, comments, bookmarks, AI highlights, trending topics, live activity, view rates, and feed-ranking behavior require verified content storage, identity, moderation, analytics, and social interaction contracts. The current release does not show mock activity or claim that a post, insight, reaction, stream, or trend exists."
      capability="Social feed, AI ranking, and live activity"
      nextStep="Explore the social launch boundaries"
    />
  );
}
