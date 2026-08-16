import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function HashtagExplorer() {
  return (
    <FeatureUnavailable
      title="Hashtag discovery is not enabled yet"
      description="Trending hashtags, mention counts, post feeds, authors, likes, views, and hashtag-filtered conversations require verified social content, indexing, moderation, analytics, and engagement contracts. The current release does not fabricate trend rankings or claim that a post or interaction exists."
      capability="Hashtag search, trends, feeds, and engagement analytics"
      nextStep="Explore the social launch boundaries"
    />
  );
}
