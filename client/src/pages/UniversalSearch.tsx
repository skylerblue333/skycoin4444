import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function UniversalSearch() {
  return (
    <FeatureUnavailable
      title="Universal Search is not enabled yet"
      description="Cross-ecosystem search, creator and community identities, posts, tokens, games, marketplace items, tournament listings, charity records, trending topics, counts, and verification badges require indexed source data, privacy-aware access controls, freshness guarantees, and route-level contracts. The current release does not seed or fabricate search results."
      capability="Unified search, discovery, indexing, and trending records"
      nextStep="Review the social, financial, media, and commerce launch boundaries"
    />
  );
}
